# Build script: generates /en/index.html from /index.html
# Run: powershell -ExecutionPolicy Bypass -File build-en.ps1

$srcFile = Join-Path $PSScriptRoot "index.html"
$destDir = Join-Path $PSScriptRoot "en"
$destFile = Join-Path $destDir "index.html"

if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }

$html = [System.IO.File]::ReadAllText($srcFile, [System.Text.Encoding]::UTF8)

# 1. HTML lang
$html = $html -replace '<html lang="fr-MG">', '<html lang="en-MG">'
$html = $html -replace '<html lang="fr">', '<html lang="en-MG">'

# 2. Title
$html = $html -replace '<title>.*?</title>', '<title>Real Estate Expert Madagascar | Cabinet ExpertImmo — CAREA since 1990</title>'

# 3. Meta description
$html = $html -replace '(?s)<meta name="description"\s+content="[^"]*">', '<meta name="description" content="Court-appointed real estate expert in Madagascar since 1990. Market value appraisal, judicial expertise, mortgage guarantee. CAREA member. Contact us in Antananarivo.">'

# 4. Meta keywords
$html = $html -replace '(?s)<meta name="keywords"\s+content="[^"]*">', '<meta name="keywords" content="real estate expert Madagascar, property valuation Antananarivo, real estate appraisal CAREA, sworn property expert Madagascar, RABENIMANANA Normand, market value appraisal Madagascar, court-appointed real estate expert Madagascar">'

# 5. Canonical
$html = $html -replace 'href="https://www\.expertimmo\.mg/">\s*\r?\n\s*$', 'href="https://www.expertimmo.mg/en/index.html">'
$html = $html -replace '<link rel="canonical" href="https://www\.expertimmo\.mg/">', '<link rel="canonical" href="https://www.expertimmo.mg/en/index.html">'

# 6. OG locale
$html = $html -replace '<meta property="og:locale" content="fr_MG">', '<meta property="og:locale" content="en_MG">'
$html = $html -replace '<meta property="og:locale:alternate" content="en_MG">', '<meta property="og:locale:alternate" content="fr_MG">'

# 7. OG title/desc/url
$html = $html -replace '<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="Real Estate Expert Madagascar | Cabinet ExpertImmo">'
$html = $html -replace '<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="Court-appointed real estate expert in Madagascar since 1990. Market value appraisal, judicial expertise, CAREA member.">'
$html = $html -replace '<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="https://www.expertimmo.mg/en/index.html">'

# 8. Twitter
$html = $html -replace '<meta name="twitter:title" content="[^"]*">', '<meta name="twitter:title" content="Real Estate Expert Madagascar | Cabinet ExpertImmo">'
$html = $html -replace '<meta name="twitter:description" content="[^"]*">', '<meta name="twitter:description" content="Court-appointed real estate expert in Madagascar since 1990. CAREA member.">'

# 9. Fix asset paths for /en/ subfolder
$html = $html -replace 'src="EIMG%20Logo\.avif"', 'src="../EIMG%20Logo.avif"'
$html = $html -replace 'src="CAREA%20Logo\.avif"', 'src="../CAREA%20Logo.avif"'
$html = $html -replace 'src="Papinou Profil\.avif"', 'src="../Papinou Profil.avif"'
$html = $html -replace 'src="Papinou%20Profil\.avif"', 'src="../Papinou%20Profil.avif"'
$html = $html -replace 'src="commercial-real-estate-\.jpg"', 'src="../commercial-real-estate-.jpg"'
$html = $html -replace 'href="index\.css"', 'href="../index.css"'
$html = $html -replace 'href="EIMG Logo Favicon\.avif"', 'href="../EIMG Logo Favicon.avif"'
$html = $html -replace 'href="EIMG%20Logo%20Favicon\.avif"', 'href="../EIMG%20Logo%20Favicon.avif"'
$html = $html -replace 'href="assets/', 'href="../assets/'
$html = $html -replace 'href="manifest\.json"', 'href="../manifest.json"'
$html = $html -replace 'src="js/', 'src="../js/'
$html = $html -replace 'href="index\.html"', 'href="../index.html"'
$html = $html -replace 'href="mentions-legales\.html"', 'href="../mentions-legales.html"'
$html = $html -replace 'href="cgu\.html"', 'href="../cgu.html"'
$html = $html -replace 'href="confidentialite\.html"', 'href="../confidentialite.html"'
$html = $html -replace 'href="honoraires\.html"', 'href="../honoraires.html"'
$html = $html -replace 'href="articles/', 'href="../articles/'

# 10. WhatsApp English
$html = $html -replace 'Bonjour,%20je%20souhaite%20une%20expertise%20immobili%C3%A8re', 'Hello,%20I%20would%20like%20a%20real%20estate%20appraisal'
$html = $html -replace 'aria-label="Contacter via WhatsApp"', 'aria-label="Contact via WhatsApp"'

# 11. Force English language on load - inject before i18n.js
$langScript = @'
  <script>
    (function(){ sessionStorage.setItem('expertImmoLang','en'); try{localStorage.setItem('expertimmo_lang_pref','en')}catch(e){} })();
  </script>
'@
$html = $html -replace '<script src="../js/i18n\.js"></script>', "$langScript`n  <script src=`"../js/i18n.js`"></script>"

# 12. Schema inLanguage
$html = $html -replace '"inLanguage"\s*:\s*"fr(-MG)?"', '"inLanguage": "en-MG"'

# Write output
[System.IO.File]::WriteAllText($destFile, $html, [System.Text.Encoding]::UTF8)
Write-Host "Generated: $destFile ($($html.Length) bytes)"
