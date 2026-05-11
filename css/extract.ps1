$lines = Get-Content '..\index.html'
$css1 = $lines[264..1405] -join "`n"
$css2 = $lines[1456..1494] -join "`n"
$all = $css1 + "`n" + $css2
Set-Content -Path 'main.css' -Value $all -Encoding UTF8
Write-Host "CSS extracted: $($all.Length) chars"
