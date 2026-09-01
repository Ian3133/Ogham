param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^https?://')]
  [string]$AppUrl,

  [string]$Hotkey = 'CTRL+ALT+C'
)

$chromeCandidates = @(
  (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
  (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
)
$chromePath = $chromeCandidates | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -First 1

if (-not $chromePath) {
  throw 'Google Chrome was not found in a standard installation folder.'
}

$captureUrl = "{0}#capture" -f $AppUrl.TrimEnd('/')
$desktopPath = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktopPath 'Ogham Capture.lnk'
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $chromePath
$shortcut.Arguments = "--app=`"$captureUrl`""
$shortcut.WorkingDirectory = Split-Path -Parent $chromePath
$shortcut.Description = 'Open the Ogham Capture Inbox'
$shortcut.Hotkey = $Hotkey
$shortcut.IconLocation = "$chromePath,0"
$shortcut.Save()

Write-Output "Created $shortcutPath with hotkey $Hotkey"
