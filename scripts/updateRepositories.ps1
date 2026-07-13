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

$configFile = Resolve-InWorkspacePath $ConfigPath
$config = Get-Content -LiteralPath $configFile -Raw | ConvertFrom-Json
$repositoriesRoot = Resolve-InWorkspacePath $config.repositoriesRoot

foreach ($repo in (Get-EnabledRepositories $config)) {
    $target = Join-Path $repositoriesRoot $repo.name

    if (-not (Test-Path -LiteralPath $target)) {
        Write-Host "Repositorio ausente, clonando: $($repo.name)"
        git clone $repo.url $target | Out-Null
    }

    if ($repo.branch) {
        git -C $target checkout $repo.branch | Out-Null
    }

    Write-Host "Atualizando $($repo.name)..."
    git -C $target fetch --all --prune | Out-Null
    git -C $target pull --ff-only | Out-Null
}

