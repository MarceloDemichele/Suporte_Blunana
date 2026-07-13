param(
    [string]$ConfigPath = "config/repositories.json"
)

$ErrorActionPreference = "Stop"

function Resolve-InWorkspacePath {
    param([string]$Path)

    $workspace = (Resolve-Path ".").Path
    $fullPath = [System.IO.Path]::GetFullPath((Join-Path $workspace $Path))
    if (-not $fullPath.StartsWith($workspace)) {
        throw "Path outside workspace: $fullPath"
    }
    return $fullPath
}

function Get-EnabledRepositories {
    param([object]$Config)

    return @($Config.repositories | Where-Object { $_.enabled -ne $false })
}

function Get-SourceInventory {
    param(
        [string]$RepoPath,
        [string[]]$ExcludedDirectories
    )

    Get-ChildItem -LiteralPath $RepoPath -Recurse -File -Force | Where-Object {
        $relative = [System.IO.Path]::GetRelativePath($RepoPath, $_.FullName)
        $parts = $relative -split '[\\/]'
        -not ($parts | Where-Object { $ExcludedDirectories -contains $_ })
    } | ForEach-Object {
        $relative = [System.IO.Path]::GetRelativePath($RepoPath, $_.FullName)
        [PSCustomObject]@{
            Path = $relative.Replace('\', '/')
            Extension = $_.Extension.ToLowerInvariant()
            Size = $_.Length
        }
    } | Sort-Object Path
}

function Find-Evidence {
    param(
        [string]$RepoPath,
        [object[]]$Inventory
    )

    $textExtensions = @(
        ".cs", ".js", ".jsx", ".ts", ".tsx", ".vue", ".html", ".css", ".scss",
        ".json", ".yaml", ".yml", ".xml", ".md", ".sql", ".ps1", ".sh",
        ".csproj", ".sln", ".config", ".env", ".properties"
    )

    $patterns = @{
        Routes = "(router|route|path:|MapControllerRoute|MapGet|MapPost|Controller|@page|href=)"
        Api = "(fetch\(|axios|HttpClient|RestClient|MapGet|MapPost|MapPut|MapDelete|api/|/api|endpoint|webhook)"
        Database = "(DbContext|Dapper|SqlConnection|MySql|Postgre|Mongo|CREATE TABLE|INSERT INTO|UPDATE |DELETE FROM|SELECT )"
        BusinessRules = "(if\s*\(|switch\s*\(|case |required|required:|validate|validation|Rule|Status|Permission|Role|Can[A-Z])"
        Forms = "(form|input|select|textarea|v-text-field|TextField|FormGroup|FormControl|required|maxlength|minlength)"
        Auth = "(login|logout|auth|token|jwt|password|permission|role|claims|authorize|authentication)"
        Tests = "(describe\(|it\(|test\(|Fact\]|Theory\]|Playwright|Cypress|Selenium|Assert)"
    }

    $result = @{}
    foreach ($key in $patterns.Keys) {
        $result[$key] = New-Object System.Collections.Generic.List[object]
    }

    foreach ($item in $Inventory) {
        if ($textExtensions -notcontains $item.Extension) {
            continue
        }

        $filePath = Join-Path $RepoPath $item.Path
        $content = Get-Content -LiteralPath $filePath -Raw -ErrorAction SilentlyContinue
        if (-not $content) {
            continue
        }

        foreach ($key in $patterns.Keys) {
            if ($content -match $patterns[$key]) {
                $result[$key].Add($item.Path) | Out-Null
            }
        }
    }

    return $result
}

function Write-Markdown {
    param(
        [string]$OutputDir,
        [string]$FileName,
        [string[]]$Lines
    )

    Set-Content -LiteralPath (Join-Path $OutputDir $FileName) -Value ($Lines -join [Environment]::NewLine) -Encoding UTF8
}

function Format-FileList {
    param([object[]]$Items, [int]$Limit = 80)

    if (-not $Items -or $Items.Count -eq 0) {
        return @("- Nao encontrado.")
    }

    return $Items | Select-Object -First $Limit | ForEach-Object { '- `{0}`' -f $_ }
}

function New-TopicComparison {
    param(
        [hashtable]$CodeEvidence,
        [hashtable]$MarkdownEvidence
    )

    $topics = @(
        [PSCustomObject]@{ Key = "Routes"; Label = "Rotas/telas" },
        [PSCustomObject]@{ Key = "Api"; Label = "APIs/integracoes" },
        [PSCustomObject]@{ Key = "Database"; Label = "Banco de dados" },
        [PSCustomObject]@{ Key = "BusinessRules"; Label = "Regras de negocio" },
        [PSCustomObject]@{ Key = "Forms"; Label = "Formularios/validacoes" },
        [PSCustomObject]@{ Key = "Auth"; Label = "Autenticacao/permissoes" },
        [PSCustomObject]@{ Key = "Tests"; Label = "Testes/QA" }
    )

    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("| Tema | Evidencias no codigo | Evidencias em .md | Status |") | Out-Null
    $lines.Add("|---|---:|---:|---|") | Out-Null

    foreach ($topic in $topics) {
        $codeCount = @($CodeEvidence[$topic.Key]).Count
        $docCount = @($MarkdownEvidence[$topic.Key]).Count
        $status = "Nao encontrado"

        if ($codeCount -gt 0 -and $docCount -gt 0) {
            $status = "Coberto por documentacao existente"
        }
        elseif ($codeCount -gt 0 -and $docCount -eq 0) {
            $status = "Pendente documentar"
        }
        elseif ($codeCount -eq 0 -and $docCount -gt 0) {
            $status = "Documentado sem evidencia atual no codigo"
        }

        $lines.Add("| $($topic.Label) | $codeCount | $docCount | $status |") | Out-Null
    }

    return $lines
}

function Ensure-Repository {
    param([object]$Repo, [string]$RepositoriesRoot)

    $target = Join-Path $RepositoriesRoot $Repo.name

    if (-not (Test-Path -LiteralPath $target)) {
        git clone $Repo.url $target | Out-Null
    }

    if ($Repo.branch) {
        git -C $target checkout $Repo.branch | Out-Null
    }

    git -C $target fetch --all --prune | Out-Null
    git -C $target pull --ff-only | Out-Null

    return $target
}

function New-Docs {
    param(
        [object]$Repo,
        [string]$RepoPath,
        [string]$DocsRoot,
        [string[]]$ExcludedDirectories
    )

    $outputDir = $DocsRoot
    New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
    $prefix = $Repo.name

    $commit = (git -C $RepoPath rev-parse HEAD).Trim()
    $remote = (git -C $RepoPath remote get-url origin 2>$null)
    $inventory = @(Get-SourceInventory -RepoPath $RepoPath -ExcludedDirectories $ExcludedDirectories)
    $codeInventory = @($inventory | Where-Object { $_.Extension -ne ".md" })
    $markdownInventory = @($inventory | Where-Object { $_.Extension -eq ".md" })
    $evidence = Find-Evidence -RepoPath $RepoPath -Inventory $codeInventory
    $markdownEvidence = Find-Evidence -RepoPath $RepoPath -Inventory $markdownInventory
    $comparison = New-TopicComparison -CodeEvidence $evidence -MarkdownEvidence $markdownEvidence
    $now = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
    $extensions = $inventory | Group-Object Extension | Sort-Object Count -Descending | ForEach-Object {
        '| `{0}` | {1} |' -f $_.Name, $_.Count
    }
    $topDirs = Get-ChildItem -LiteralPath $RepoPath -Directory -Force | Where-Object { $_.Name -ne ".git" } | ForEach-Object {
        '- `{0}`' -f $_.Name
    }

    Write-Markdown $outputDir "$prefix-README.md" @(
        "# Engenharia Reversa - $($Repo.name)",
        "",
        "Documentacao gerada automaticamente a partir de repositorio externo.",
        "",
        "## Origem",
        "",
        "| Item | Valor |",
        "|---|---|",
        "| Repositorio | `$($Repo.url)` |",
        "| Remote efetivo | `$remote` |",
        "| Branch/ref | `$($Repo.branch)` |",
        "| Commit analisado | `$commit` |",
        "| Data da analise | `$now` |",
        "",
        "## Indice",
        "",
        "- [Engenharia reversa]($prefix-engenharia-reversa.md)",
        "- [Regras de negocio]($prefix-regras-negocio.md)",
        "- [Telas]($prefix-telas.md)",
        "- [API]($prefix-api.md)",
        "- [Banco]($prefix-banco.md)",
        "- [QA]($prefix-qa.md)",
        "- [Arquitetura]($prefix-arquitetura.md)",
        "- [Riscos]($prefix-riscos.md)",
        "- [Pontos a validar]($prefix-pontos-a-validar.md)",
        "- [Inventario]($prefix-inventario-codigo-fonte.md)",
        "- [Fluxo operacional]($prefix-fluxo-operacional.md)",
        "- [Matriz de rastreabilidade]($prefix-matriz-rastreabilidade.md)",
        "- [Documentacao existente]($prefix-documentacao-existente.md)",
        "- [Comparacao docs x codigo]($prefix-comparacao-docs-codigo.md)",
        "- [Consolidado]($prefix-consolidado.md)",
        "- [Changelog]($prefix-changelog.md)"
    )

    Write-Markdown $outputDir "$prefix-engenharia-reversa.md" (@(
        "# 01 - Visao Geral",
        "",
        "| Item | Valor |",
        "|---|---|",
        "| Total de arquivos analisados | $($inventory.Count) |",
        "| Commit | `$commit` |",
        "| Branch/ref | `$($Repo.branch)` |",
        "",
        "## Distribuicao por extensao",
        "",
        "| Extensao | Quantidade |",
        "|---|---:|"
    ) + $extensions)

    Write-Markdown $outputDir "$prefix-telas.md" (@("# Telas", "", "Arquivos com evidencias possiveis de rotas:", "") + (Format-FileList $evidence.Routes))
    Write-Markdown $outputDir "$prefix-modulos-funcionais.md" (@("# Modulos Funcionais", "", "| Caminho | Tamanho |", "|---|---:|") + ($inventory | Select-Object -First 120 | ForEach-Object { '| `{0}` | {1} |' -f $_.Path, $_.Size }))
    Write-Markdown $outputDir "$prefix-api.md" (@("# API", "", "Arquivos com evidencias de APIs e integracoes:", "") + (Format-FileList $evidence.Api))
    Write-Markdown $outputDir "$prefix-banco.md" (@("# Banco", "", "## Formularios/campos", "") + (Format-FileList $evidence.Forms) + @("", "## Banco de dados", "") + (Format-FileList $evidence.Database))
    Write-Markdown $outputDir "$prefix-regras-negocio.md" (@("# Regras de Negocio", "", "Arquivos com condicionais, validacoes, permissoes ou status:", "") + (Format-FileList $evidence.BusinessRules))
    Write-Markdown $outputDir "$prefix-qa.md" (@("# QA", "", "| ID | Modulo | Cenario | Pre-condicao | Passos | Resultado esperado | Prioridade |", "|---|---|---|---|---|---|---|", "| QA-001 | Build | Compilar projeto externo | Dependencias disponiveis | Executar build do repositorio | Build finaliza sem erro | Alta |", "| QA-002 | Rotas/APIs | Validar endpoints mapeados | Aplicacao executavel | Exercitar endpoints | Contratos respondem conforme esperado | Alta |", "", "## Arquivos de teste encontrados", "") + (Format-FileList $evidence.Tests))
    Write-Markdown $outputDir "$prefix-arquitetura.md" (@("# Arquitetura", "", "Arquitetura inicial baseada na estrutura de arquivos.", "", "## Pastas de primeiro nivel", "") + $topDirs)
    Write-Markdown $outputDir "$prefix-riscos.md" @("# Riscos", "", "| ID | Risco | Evidencia | Impacto |", "|---|---|---|---|", "| RSK-001 | Documentacao gerada por analise estatica inicial | Manifest e inventario | Pode exigir refinamento manual |", "| RSK-002 | Execucao da aplicacao externa nao realizada | Script gera docs por leitura de arquivos | Fluxos runtime dependem de validacao posterior |")
    Write-Markdown $outputDir "$prefix-pontos-a-validar.md" @("# Pontos a Validar", "", "| ID | Ponto | Motivo |", "|---|---|---|", "| PV-001 | Comando correto de build/test/run | Depende da stack do repositorio |", "| PV-002 | Regras de negocio completas | Exigem leitura detalhada dos arquivos listados |", "| PV-003 | Rotas reais em runtime | Podem depender de configuracao/autenticacao |", "| PV-004 | Banco de dados real | Schema pode estar fora do repositorio |")
    Write-Markdown $outputDir "$prefix-inventario-codigo-fonte.md" (@("# Inventario do Codigo-Fonte", "", "| Arquivo | Extensao | Tamanho |", "|---|---|---:|") + ($inventory | ForEach-Object { '| `{0}` | `{1}` | {2} |' -f $_.Path, $_.Extension, $_.Size }))
    Write-Markdown $outputDir "$prefix-fluxo-operacional.md" @("# Fluxo Operacional", "", "1. Ler `config/repositories.json`.", "2. Clonar ou atualizar `repositories/$($Repo.name)`.", "3. Obter commit atual.", "4. Inventariar arquivos.", "5. Buscar evidencias.", "6. Atualizar arquivos Markdown em `docs/`.", "7. Gravar `$prefix-manifest.json`.")
    Write-Markdown $outputDir "$prefix-matriz-rastreabilidade.md" @("# Matriz de Rastreabilidade", "", "| Tema | Status | Evidencia | Observacao |", "|---|---|---|---|", "| Repositorio externo | Mapeado | `$($Repo.url)` | Commit `$commit` |", "| Inventario | Mapeado | `$prefix-inventario-codigo-fonte.md` | $($inventory.Count) arquivos |", "| Rotas | Parcial | `$prefix-telas.md` | Analise estatica |", "| APIs/integracoes | Parcial | `$prefix-api.md` | Analise estatica |", "| Banco/formularios | Parcial | `$prefix-banco.md` | Analise estatica |", "| Regras | Parcial | `$prefix-regras-negocio.md` | Requer leitura detalhada |")
    Write-Markdown $outputDir "$prefix-documentacao-existente.md" (@("# Documentacao Existente Encontrada", "", "Arquivos `.md` encontrados no repositorio externo:", "") + (Format-FileList ($markdownInventory | ForEach-Object { $_.Path }) 200))
    Write-Markdown $outputDir "$prefix-comparacao-docs-codigo.md" (@("# Comparacao Documentacao x Codigo", "", "Comparacao estatica entre evidencias encontradas no codigo-fonte e evidencias encontradas nos arquivos `.md` do repositorio externo.", "") + $comparison + @("", "## Pontos que exigem revisao", "", "- Temas com codigo evidenciado e zero evidencia em `.md` devem ser documentados.", "- Temas documentados em `.md` sem evidencia atual no codigo devem ser revisados antes de manter como regra."))
    Write-Markdown $outputDir "$prefix-consolidado.md" @(
        "# Documentacao Consolidada",
        "",
        "## Origem",
        "",
        "| Item | Valor |",
        "|---|---|",
        "| Repositorio | `$($Repo.url)` |",
        "| Branch/ref | `$($Repo.branch)` |",
        "| Commit | `$commit` |",
        "| Arquivos de codigo/config analisados | $($codeInventory.Count) |",
        "| Arquivos Markdown lidos | $($markdownInventory.Count) |",
        "",
        "## Leitura consolidada",
        "",
        "Esta documentacao consolida evidencias do codigo e dos arquivos `.md` existentes no repositorio externo.",
        "",
        "## Arquivos principais",
        "",
        "- Regras: $prefix-regras-negocio.md",
        "- Telas: $prefix-telas.md",
        "- API: $prefix-api.md",
        "- Banco: $prefix-banco.md",
        "- Comparacao docs x codigo: $prefix-comparacao-docs-codigo.md",
        "- Pontos a validar: $prefix-pontos-a-validar.md"
    )
    Write-Markdown $outputDir "$prefix-changelog.md" @("# Changelog", "", "| Data | Commit | Observacao |", "|---|---|---|", "| $now | `$commit` | Documentacao gerada/atualizada automaticamente |")

    [PSCustomObject]@{
        repositoryUrl = $Repo.url
        remote = $remote
        branch = $Repo.branch
        commit = $commit
        generatedAt = $now
        outputName = $Repo.name
        fileCount = $inventory.Count
        codeFileCount = $codeInventory.Count
        markdownFileCount = $markdownInventory.Count
    } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $outputDir "$prefix-manifest.json") -Encoding UTF8

    Write-Host "Documentacao atualizada em: $outputDir"
}

$configFile = Resolve-InWorkspacePath $ConfigPath
$config = Get-Content -LiteralPath $configFile -Raw | ConvertFrom-Json
$repositoriesRoot = Resolve-InWorkspacePath $config.repositoriesRoot
$docsRootValue = if ($config.docsRoot) { $config.docsRoot } else { "docs" }
$docsRoot = Resolve-InWorkspacePath $docsRootValue
$excludedDirectories = @($config.excludeDirectories)

New-Item -ItemType Directory -Force -Path $repositoriesRoot | Out-Null
New-Item -ItemType Directory -Force -Path $docsRoot | Out-Null

foreach ($repo in (Get-EnabledRepositories $config)) {
    $repoPath = Ensure-Repository -Repo $repo -RepositoriesRoot $repositoriesRoot
    New-Docs -Repo $repo -RepoPath $repoPath -DocsRoot $docsRoot -ExcludedDirectories $excludedDirectories
}
