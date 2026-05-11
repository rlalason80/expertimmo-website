$files = @('fees.html', 'legal-notice.html', 'privacy-policy.html', 'terms-of-use.html')
foreach ($f in $files) {
    $p = Join-Path $PSScriptRoot "en\$f"
    $c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
    $c = $c -replace 'Bonjour,%20je%20souhaite%20une%20expertise%20immobili%C3%A8re', 'Hello,%20I%20would%20like%20a%20real%20estate%20appraisal'
    $c = $c -replace 'aria-label="Contacter via WhatsApp"', 'aria-label="Contact via WhatsApp"'
    
    if ($c -notmatch 'language-switcher\.js') {
        $c = $c -replace '<script src="\.\./js/i18n\.js"></script>', "<script src=`"../js/i18n.js`"></script>`n  <script src=`"../js/language-switcher.js`"></script>"
    }
    
    [System.IO.File]::WriteAllText($p, $c, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed: $f"
}
