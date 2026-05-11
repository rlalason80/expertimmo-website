# Build script for secondary pages (Legal & Fees)
$pages = @(
    @{ src = "honoraires.html"; dest = "fees.html"; title = "Fees Policy | Cabinet ExpertImmo" },
    @{ src = "mentions-legales.html"; dest = "legal-notice.html"; title = "Legal Notice | Cabinet ExpertImmo" },
    @{ src = "confidentialite.html"; dest = "privacy-policy.html"; title = "Privacy Policy | Cabinet ExpertImmo" },
    @{ src = "cgu.html"; dest = "terms-of-use.html"; title = "Terms of Use | Cabinet ExpertImmo" }
)

$destDir = Join-Path $PSScriptRoot "en"

foreach ($page in $pages) {
    $srcFile = Join-Path $PSScriptRoot $page.src
    $destFile = Join-Path $destDir $page.dest

    if (-not (Test-Path $srcFile)) { continue }

    $html = [System.IO.File]::ReadAllText($srcFile, [System.Text.Encoding]::UTF8)

    # 1. HTML lang
    $html = $html -replace '<html lang="fr-MG">', '<html lang="en-MG">'
    $html = $html -replace '<html lang="fr">', '<html lang="en-MG">'

    # 2. Title
    $html = $html -replace '<title>.*?</title>', ("<title>" + $page.title + "</title>")

    # 3. Canonical
    $html = $html -replace 'href="https://www\.expertimmo\.mg/.*?\.html">', ("href=`"https://www.expertimmo.mg/en/" + $page.dest + "`">")
    $html = $html -replace '<link rel="canonical" href="https://www\.expertimmo\.mg/.*?">', ("<link rel=`"canonical`" href=`"https://www.expertimmo.mg/en/" + $page.dest + "`">")

    # 4. Hreflang Tags (Basic replacement for legal pages)
    $html = $html -replace 'hreflang="fr-MG" href="https://www\.expertimmo\.mg/.*?\.html"', ("hreflang=`"fr-MG`" href=`"https://www.expertimmo.mg/" + $page.src + "`"")
    $html = $html -replace 'hreflang="en-MG" href="https://www\.expertimmo\.mg/en/.*?\.html"', ("hreflang=`"en-MG`" href=`"https://www.expertimmo.mg/en/" + $page.dest + "`"")

    # 5. Fix asset paths
    $html = $html -replace 'src="EIMG%20Logo\.avif"', 'src="../EIMG%20Logo.avif"'
    $html = $html -replace 'src="CAREA%20Logo\.avif"', 'src="../CAREA%20Logo.avif"'
    $html = $html -replace 'src="Papinou Profil\.avif"', 'src="../Papinou Profil.avif"'
    $html = $html -replace 'src="Papinou%20Profil\.avif"', 'src="../Papinou%20Profil.avif"'
    $html = $html -replace 'href="index\.css"', 'href="../index.css"'
    $html = $html -replace 'href="EIMG Logo Favicon\.avif"', 'href="../EIMG Logo Favicon.avif"'
    $html = $html -replace 'href="EIMG%20Logo%20Favicon\.avif"', 'href="../EIMG%20Logo%20Favicon.avif"'
    $html = $html -replace 'href="assets/', 'href="../assets/'
    $html = $html -replace 'href="manifest\.json"', 'href="../manifest.json"'
    $html = $html -replace 'src="js/', 'src="../js/'
    
    # Update navigation links
    $html = $html -replace 'href="index\.html', 'href="../index.html'
    $html = $html -replace 'href="../index\.html#', 'href="../index.html#'
    $html = $html -replace 'href="mentions-legales\.html"', 'href="legal-notice.html"'
    $html = $html -replace 'href="cgu\.html"', 'href="terms-of-use.html"'
    $html = $html -replace 'href="confidentialite\.html"', 'href="privacy-policy.html"'
    $html = $html -replace 'href="honoraires\.html"', 'href="fees.html"'

    # 6. Extract ONLY the English content for SEO
    # Remove everything between <div class="lang-fr"> and </div>
    # Remove the <div class="lang-en" style="display:none;"> and its closing tag, keeping the contents
    $html = $html -replace '(?s)<div class="lang-fr">.*?</div>\s*<!-- English section simplified -->', '<!-- English section simplified -->'
    $html = $html -replace '(?s)<div class="lang-fr">.*?</div>\s*<div class="lang-en"', '<div class="lang-en"'
    $html = $html -replace '<div class="lang-en" style="display:none;">', '<div class="lang-en">'
    $html = $html -replace '<div class="lang-en" style="display: none;">', '<div class="lang-en">'

    # 7. Force English language on load
    $langScript = @'
  <script>
    (function(){ sessionStorage.setItem('expertImmoLang','en'); try{localStorage.setItem('expertimmo_lang_pref','en')}catch(e){} })();
  </script>
'@
    $html = $html -replace '<script src="../js/i18n\.js"></script>', "$langScript`n  <script src=`"../js/i18n.js`"></script>"
    $html = $html -replace '<script src="js/i18n\.js"></script>', "$langScript`n  <script src=`"../js/i18n.js`"></script>"
    $html = $html -replace '<script src="js/language-switcher\.js"></script>', "<script src=`"../js/language-switcher.js`"></script>"

    # 8. Schema inLanguage
    $html = $html -replace '"inLanguage"\s*:\s*"fr(-MG)?"', '"inLanguage": "en-MG"'

    [System.IO.File]::WriteAllText($destFile, $html, [System.Text.Encoding]::UTF8)
    Write-Host "Generated: $destFile ($($html.Length) bytes)"
}
