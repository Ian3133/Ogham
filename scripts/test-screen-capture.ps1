$builtExecutable = & (Join-Path $PSScriptRoot 'build-screen-capture.ps1') | Select-Object -Last 1
if (-not $builtExecutable -or -not (Test-Path -LiteralPath $builtExecutable)) {
  throw 'The Ogham Screen Capture executable was not built.'
}

Add-Type -AssemblyName System.Drawing
$testId = [guid]::NewGuid().ToString('N')
$testImage = Join-Path $env:TEMP "ogham-ocr-$testId.png"
$testOutput = Join-Path $env:TEMP "ogham-ocr-$testId.txt"
$expected = 'Bonjour, comment allez-vous ?'

$bitmap = [System.Drawing.Bitmap]::new(1400, 220)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$font = [System.Drawing.Font]::new('Arial', [single]52, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

try {
  $graphics.Clear([System.Drawing.Color]::White)
  $graphics.DrawString($expected, $font, [System.Drawing.Brushes]::Black, [single]30, [single]55)
  $bitmap.Save($testImage, [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
  $graphics.Dispose()
  $font.Dispose()
  $bitmap.Dispose()
}

$testProcess = Start-Process -FilePath $builtExecutable `
  -ArgumentList '--image',("`"$testImage`""),'--output',("`"$testOutput`"") `
  -WindowStyle Hidden -Wait -PassThru

if ($testProcess.ExitCode -ne 0) {
  throw "OCR helper exited with code $($testProcess.ExitCode)."
}

$actual = Get-Content -Raw -LiteralPath $testOutput
if ($actual -ne $expected) {
  throw "OCR mismatch. Expected '$expected' but received '$actual'."
}

Write-Output "Windows French OCR test passed: $actual"
