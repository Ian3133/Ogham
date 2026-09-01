$builtExecutable = & (Join-Path $PSScriptRoot 'build-screen-capture.ps1') | Select-Object -Last 1
if (-not $builtExecutable -or -not (Test-Path -LiteralPath $builtExecutable)) {
  throw 'The Ogham Screen Capture executable was not built.'
}

Get-Process -Name 'OghamScreenCapture' -ErrorAction SilentlyContinue | Stop-Process -Force
$listener = $null

try {
  $listener = Start-Process -FilePath $builtExecutable -ArgumentList '--listener' -WindowStyle Hidden -PassThru
  Start-Sleep -Milliseconds 500

  $signal = Start-Process -FilePath $builtExecutable -ArgumentList '--signal-listener' -WindowStyle Hidden -Wait -PassThru
  if ($signal.ExitCode -ne 0) {
    throw "The listener signal failed with exit code $($signal.ExitCode)."
  }

  $deadline = [DateTime]::UtcNow.AddSeconds(3)
  $captureProcess = $null
  while (-not $captureProcess -and [DateTime]::UtcNow -lt $deadline) {
    $captureProcess = Get-CimInstance Win32_Process -Filter "Name = 'OghamScreenCapture.exe'" |
      Where-Object { $_.ProcessId -ne $listener.Id -and $_.CommandLine -notmatch '--signal-listener' } |
      Select-Object -First 1
    if (-not $captureProcess) {
      Start-Sleep -Milliseconds 100
    }
  }

  if (-not $captureProcess) {
    throw 'The listener received its signal but did not launch the capture selector.'
  }

  Write-Output "Windows hotkey listener test passed: selector process $($captureProcess.ProcessId) launched."
} finally {
  Get-Process -Name 'OghamScreenCapture' -ErrorAction SilentlyContinue | Stop-Process -Force
}
