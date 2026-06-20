# Auto Haven — daily local inventory refresh.
# Runs the crawler, then commits & pushes any changes (which triggers the Vercel
# redeploy). Runs locally because sgcarmart blocks cloud/datacenter IPs, so this
# must run from an allowed (residential) connection.
#
# Scheduled via Windows Task Scheduler — see scripts\register-task.ps1 / README.

$ErrorActionPreference = "Stop"
$repo = Split-Path $PSScriptRoot -Parent
Set-Location $repo

Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm')] Crawling inventory..."
node scripts/crawl.mjs
if ($LASTEXITCODE -ne 0) {
    Write-Host "Crawl failed (exit $LASTEXITCODE) — leaving existing data untouched."
    exit 1
}

git add src/data public/cars
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    $date = Get-Date -Format "yyyy-MM-dd"
    git commit -m "chore: daily inventory refresh ($date)"
    git push origin master
    Write-Host "Pushed inventory refresh."
} else {
    Write-Host "No changes to commit."
}
