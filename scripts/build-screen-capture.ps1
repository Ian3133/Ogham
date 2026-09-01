param(
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\tools\OghamScreenCapture\bin')
)

$compiler = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe'
$windowsMetadata = 'C:\Program Files (x86)\Windows Kits\10\UnionMetadata\10.0.22621.0\Windows.winmd'
$windowsRuntime = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\System.Runtime.WindowsRuntime.dll'
$systemRuntime = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\System.Runtime.dll'
$source = Join-Path $PSScriptRoot '..\tools\OghamScreenCapture\OghamScreenCapture.cs'

foreach ($requiredPath in @($compiler, $windowsMetadata, $windowsRuntime, $systemRuntime, $source)) {
  if (-not (Test-Path -LiteralPath $requiredPath)) {
    throw "Required build file was not found: $requiredPath"
  }
}

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$output = Join-Path $OutputDirectory 'OghamScreenCapture.exe'

& $compiler /nologo /target:winexe /platform:x64 /optimize+ `
  /reference:System.dll `
  /reference:System.Core.dll `
  /reference:System.Drawing.dll `
  /reference:System.Windows.Forms.dll `
  /reference:$systemRuntime `
  /reference:$windowsRuntime `
  /reference:$windowsMetadata `
  /out:$output `
  $source

if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $output)) {
  throw 'Ogham Screen Capture compilation failed.'
}

Write-Output $output
