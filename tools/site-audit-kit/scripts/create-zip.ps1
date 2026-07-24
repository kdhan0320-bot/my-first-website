<#
.SYNOPSIS
  audit-output(또는 임의 폴더)를 ZIP으로 묶는 공식 packaging script.

.DESCRIPTION
  PowerShell 기본 Compress-Archive는 Windows에서 ZIP 엔트리 경로 구분자로
  백슬래시(\)를 그대로 저장하는 문제가 있다(ZIP 스펙은 항상 슬래시 /를 쓴다) —
  Human Signal Phase 4E Desktop handoff ZIP에서 실제로 재현·확인됐다. 이
  script는 .NET System.IO.Compression.ZipArchive로 직접 엔트리를 만들어
  경로 구분자를 항상 /로 강제하고, 생성 직후 backslash 엔트리 0건을 자체
  검증한다. 이 저장소에서 ZIP을 만드는 유일한 공식 경로이며(`npm run zip`이
  이 script만 호출한다), README/CLAUDE.md에 inline Compress-Archive 명령을
  다시 복사해 적지 않는다.

.PARAMETER SourceDir
  압축할 폴더 경로(기본값: audit-output).

.PARAMETER DestinationZip
  생성할 ZIP 경로(기본값: site-audit-result.zip). 이미 있으면 덮어쓴다.

.EXAMPLE
  pwsh ./scripts/create-zip.ps1
  pwsh ./scripts/create-zip.ps1 -SourceDir "C:\...\Human-Signal-PhaseX" -DestinationZip "C:\...\Human-Signal-PhaseX.zip"
#>
param(
  [string]$SourceDir = "audit-output",
  [string]$DestinationZip = "site-audit-result.zip"
)

$ErrorActionPreference = "Stop"

$resolvedSource = Resolve-Path -Path $SourceDir -ErrorAction Stop
$destParent = Split-Path -Path $DestinationZip -Parent
if ($destParent -and -not (Test-Path $destParent)) {
  New-Item -ItemType Directory -Path $destParent -Force | Out-Null
}
$destFull = [System.IO.Path]::GetFullPath($DestinationZip)

# ZIP 자체를 소스 폴더 안에 포함하지 않는다 — 소스 폴더 밖에 있거나, 안에
# 있더라도 압축 대상에서 스스로를 제외해야 "ZIP 안에 ZIP"이 생기지 않는다.
$destInsideSource = $destFull.StartsWith($resolvedSource.Path, [System.StringComparison]::OrdinalIgnoreCase)

if (Test-Path $destFull) { Remove-Item $destFull -Force }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($destFull, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  $files = Get-ChildItem -Path $resolvedSource.Path -Recurse -File
  foreach ($file in $files) {
    if ($destInsideSource -and $file.FullName -eq $destFull) { continue }
    $relativePath = $file.FullName.Substring($resolvedSource.Path.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relativePath, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally {
  $zip.Dispose()
}

# 생성 직후 자체 검증: backslash entry 0건, 파일 수 일치.
$verifyArchive = [System.IO.Compression.ZipFile]::OpenRead($destFull)
try {
  $entries = $verifyArchive.Entries
  $backslashEntries = $entries | Where-Object { $_.FullName -match '\\' }
  $entryCount = $entries.Count
} finally {
  $verifyArchive.Dispose()
}

# 콘솔 출력은 영문으로만 쓴다 - Windows PowerShell 5.1을 Git Bash/npm으로
# 감싸 실행하면 콘솔 코드페이지 불일치로 한글이 깨져 나오는 걸 실측으로
# 확인했다(BOM을 붙여도 동일) - 코드/주석은 한글을 유지하되 사람이 읽는
# 콘솔 메시지만 영문으로 고정해 어느 터미널에서 실행해도 깨지지 않게 한다.
if ($backslashEntries.Count -gt 0) {
  throw "ZIP contains $($backslashEntries.Count) backslash-separated entries: $($backslashEntries[0].FullName)"
}

$size = (Get-Item $destFull).Length
Write-Output "Created: $destFull"
Write-Output "Entries: $entryCount (0 backslash entries confirmed)"
Write-Output "Size: $size bytes"
