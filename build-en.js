/**
 * Build script: generates /en/index.html from /index.html
 * Run: node build-en.js
 */
const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'index.html');
const destDir = path.join(__dirname, 'en');
const destFile = path.join(destDir, 'index.html');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

let html = fs.readFileSync(srcFile, 'utf-8');

// ─── 1. HTML lang ───
html = html.replace('<html lang="fr-MG">', '<html lang="en-MG">');
html = html.replace('<html lang="fr">', '<html lang="en-MG">');

// ─── 2. Title ───
html = html.replace(
  /<title>.*?<\/title>/,
  '<title>Real Estate Expert Madagascar | Cabinet ExpertImmo — CAREA since 1990</title>'
);

// ─── 3. Meta description ───
html = html.replace(
  /<meta name="description"[\s\S]*?>/,
  '<meta name="description" content="Court-appointed real estate expert in Madagascar since 1990. Market value appraisal, judicial expertise, mortgage guarantee. CAREA member. Contact us in Antananarivo.">'
);

// ─── 4. Meta keywords ───
html = html.replace(
  /<meta name="keywords"[\s\S]*?>/,
  '<meta name="keywords" content="real estate expert Madagascar, property valuation Antananarivo, real estate appraisal CAREA, sworn property expert Madagascar, RABENIMANANA Normand, market value appraisal Madagascar, court-appointed real estate expert Madagascar, investment property valuation Madagascar">'
);

// ─── 5. Canonical ───
html = html.replace(
  /<link rel="canonical" href="https:\/\/www\.expertimmo\.mg\/">/,
  '<link rel="canonical" href="https://www.expertimmo.mg/en/index.html">'
);

// ─── 6. Hreflang ───
html = html.replace(
  /<!-- ═══ HREFLANG ═══ -->[\s\S]*?<link rel="alternate" hreflang="x-default"[^>]*>/,
  `<!-- ═══ HREFLANG ═══ -->
  <link rel="alternate" hreflang="fr-MG" href="https://www.expertimmo.mg/">
  <link rel="alternate" hreflang="fr" href="https://www.expertimmo.mg/">
  <link rel="alternate" hreflang="en-MG" href="https://www.expertimmo.mg/en/index.html">
  <link rel="alternate" hreflang="en" href="https://www.expertimmo.mg/en/index.html">
  <link rel="alternate" hreflang="x-default" href="https://www.expertimmo.mg/">`
);

// ─── 7. Open Graph ───
html = html.replace(
  /<meta property="og:title" content="[^"]*">/,
  '<meta property="og:title" content="Real Estate Expert Madagascar | Cabinet ExpertImmo — CAREA since 1990">'
);
html = html.replace(
  /<meta property="og:description" content="[^"]*">/,
  '<meta property="og:description" content="Court-appointed real estate expert in Madagascar since 1990. Market value appraisal, judicial expertise, mortgage guarantee. CAREA member.">'
);
html = html.replace(
  /<meta property="og:url" content="[^"]*">/,
  '<meta property="og:url" content="https://www.expertimmo.mg/en/index.html">'
);
html = html.replace(
  '<meta property="og:locale" content="fr_MG">',
  '<meta property="og:locale" content="en_MG">'
);
html = html.replace(
  '<meta property="og:locale:alternate" content="en_MG">',
  '<meta property="og:locale:alternate" content="fr_MG">'
);

// ─── 8. Twitter Card ───
html = html.replace(
  /<meta name="twitter:title" content="[^"]*">/,
  '<meta name="twitter:title" content="Real Estate Expert Madagascar | Cabinet ExpertImmo">'
);
html = html.replace(
  /<meta name="twitter:description" content="[^"]*">/,
  '<meta name="twitter:description" content="Court-appointed real estate expert in Madagascar since 1990. Market value appraisal, judicial expertise, CAREA member.">'
);

// ─── 9. Schema.org inLanguage ───
html = html.replace(/"inLanguage"\s*:\s*"fr(-MG)?"/g, '"inLanguage": "en-MG"');

// ─── 10. Fix relative paths (assets, images, JS, CSS) ───
html = html.replace(/src="EIMG%20Logo\.avif"/g, 'src="../EIMG%20Logo.avif"');
html = html.replace(/src="CAREA%20Logo\.avif"/g, 'src="../CAREA%20Logo.avif"');
html = html.replace(/src="Papinou Profil\.avif"/g, 'src="../Papinou Profil.avif"');
html = html.replace(/src="Papinou%20Profil\.avif"/g, 'src="../Papinou%20Profil.avif"');
html = html.replace(/src="commercial-real-estate-\.jpg"/g, 'src="../commercial-real-estate-.jpg"');
html = html.replace(/href="index\.css"/g, 'href="../index.css"');
html = html.replace(/href="EIMG Logo Favicon\.avif"/g, 'href="../EIMG Logo Favicon.avif"');
html = html.replace(/href="EIMG%20Logo%20Favicon\.avif"/g, 'href="../EIMG%20Logo%20Favicon.avif"');
html = html.replace(/href="assets\//g, 'href="../assets/');
html = html.replace(/href="manifest\.json"/g, 'href="../manifest.json"');
html = html.replace(/src="js\//g, 'src="../js/');
html = html.replace(/href="index\.html"/g, 'href="../index.html"');
html = html.replace(/href="mentions-legales\.html"/g, 'href="../mentions-legales.html"');
html = html.replace(/href="cgu\.html"/g, 'href="../cgu.html"');
html = html.replace(/href="confidentialite\.html"/g, 'href="../confidentialite.html"');
html = html.replace(/href="honoraires\.html"/g, 'href="../honoraires.html"');
html = html.replace(/href="articles\//g, 'href="../articles/');

// ─── 11. AEO direct-answer paragraphs (About section) ───
html = html.replace(
  /Le <strong>Cabinet ExpertImmo<\/strong> est un cabinet d'expertise immobilière fondé en <strong>1990<\/strong>[\s\S]*?territoire malgache\.\s*<\/p>/,
  `<strong>Cabinet ExpertImmo</strong> is a real estate appraisal firm founded in <strong>1990</strong> in <strong>Antananarivo, Madagascar</strong>, by <strong>Mr. RABENIMANANA Normand</strong>. Registered with <strong>CAREA</strong> (Madagascar's official body of court-accredited experts) since <strong>1990</strong>, the firm has over <strong>35 years</strong> of expertise and more than <strong>3,000 appraisals</strong> completed across Madagascar.
    </p>`
);

// ─── 12. AEO direct-answer paragraphs (Services section) ───
html = html.replace(
  /Le Cabinet ExpertImmo propose <strong>5 types d'expertise immobilière<\/strong>[\s\S]*?juridictions malgaches\.\s*<\/p>/,
  `Cabinet ExpertImmo offers <strong>5 types of real estate appraisal</strong> in Madagascar: judicial expertise, market value appraisal, bank appraisal (mortgage guarantee for <strong>BFV-SG, BOA, BNI, BMOI, AccèsBanque</strong>), wealth appraisal, and rental valuation. Each report is certified, signed, and legally binding before Malagasy courts.
    </p>`
);

// ─── 13. Footer article links ───
html = html.replace('Évaluation vénale à Madagascar', 'Market Value Appraisal in Madagascar');
html = html.replace("L'expert CAREA et les transactions", 'CAREA Expert & Transactions');
html = html.replace('Investir à Madagascar', 'Investing in Madagascar');
html = html.replace(/>Articles</, '>Articles<');

// ─── 14. Set default language to English in i18n.js initialization ───
// Add a script that forces English language on load
const langScript = `
  <script>
    // Force English on /en/ pages
    (function() {
      sessionStorage.setItem('expertImmoLang', 'en');
      try { localStorage.setItem('expertimmo_lang_pref', 'en'); } catch(e) {}
    })();
  </script>`;
html = html.replace('<script src="../js/i18n.js"></script>', langScript + '\n  <script src="../js/i18n.js"></script>');

// ─── 15. WhatsApp button English text ───
html = html.replace(
  'Bonjour,%20je%20souhaite%20une%20expertise%20immobili%C3%A8re',
  'Hello,%20I%20would%20like%20a%20real%20estate%20appraisal'
);
html = html.replace(
  'aria-label="Contacter via WhatsApp"',
  'aria-label="Contact via WhatsApp"'
);

// ─── 16. Person schema image path fix ───
html = html.replace(
  '"image": "https://www.expertimmo.mg/Papinou%20Profil.avif"',
  '"image": "https://www.expertimmo.mg/Papinou%20Profil.avif"'
);

// ─── Write output ───
fs.writeFileSync(destFile, html, 'utf-8');
console.log(`✅ Generated: ${destFile} (${html.length} bytes)`);
