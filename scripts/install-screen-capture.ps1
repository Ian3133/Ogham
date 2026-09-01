$buildScript = Join-Path $PSScriptRoot 'build-screen-capture.ps1'
$builtExecutable = & $buildScript | Select-Object -Last 1
if (-not $builtExecutable -or -not (Test-Path -LiteralPath $builtExecutable)) {
  throw 'The Ogham Screen Capture executable was not built.'
}

$installDirectory = Join-Path $env:LOCALAPPDATA 'Ogham'
New-Item -ItemType Directory -Force -Path $installDirectory | Out-Null
$installedExecutable = Join-Path $installDirectory 'OghamScreenCapture.exe'
Get-Process -Name 'OghamScreenCapture' -ErrorAction SilentlyContinue | Stop-Process -Force
Copy-Item -LiteralPath $builtExecutable -Destination $installedExecutable -Force

$desktopPath = [Environment]::GetFolderPath('Desktop')
$shell = New-Object -ComObject WScript.Shell
$directCaptureShortcut = Join-Path $desktopPath 'Ogham Capture.lnk'
if (Test-Path -LiteralPath $directCaptureShortcut) {
  $directShortcut = $shell.CreateShortcut($directCaptureShortcut)
  $directShortcut.Hotkey = ''
  $directShortcut.Save()
}

$screenCaptureShortcut = Join-Path $desktopPath 'Ogham Screen Capture.lnk'
$shortcut = $shell.CreateShortcut($screenCaptureShortcut)
$shortcut.TargetPath = $installedExecutable
$shortcut.WorkingDirectory = $installDirectory
$shortcut.Description = 'Select French text on screen and open it in Ogham Capture'
$shortcut.Hotkey = ''

$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (Test-Path -LiteralPath $chromePath) {
  $shortcut.IconLocation = "$chromePath,0"
}
$shortcut.Save()

$startupPath = [Environment]::GetFolderPath('Startup')
$listenerShortcut = Join-Path $startupPath 'Ogham Screen Capture Listener.lnk'
$listener = $shell.CreateShortcut($listenerShortcut)
$listener.TargetPath = $installedExecutable
$listener.Arguments = '--listener'
$listener.WorkingDirectory = $installDirectory
$listener.Description = 'Keep the Ogham Ctrl+Alt+C capture hotkey available'
$listener.WindowStyle = 7
$listener.Save()

Start-Process -FilePath $installedExecutable -ArgumentList '--listener' -WindowStyle Hidden

Write-Output "Installed $installedExecutable"
Write-Output "Created $screenCaptureShortcut"
Write-Output "Started the Ctrl+Alt+C listener and added it to Windows startup"
