$articles = @(
    @{ fr = "evaluation-venale-madagascar.html"; en = "market-value-appraisal-madagascar.html" },
    @{ fr = "expert-carea-transactions-immobilieres.html"; en = "carea-expert-real-estate-transactions.html" },
    @{ fr = "investir-immobilier-madagascar-expertise.html"; en = "invest-real-estate-madagascar-expertise.html" }
)

foreach ($article in $articles) {
    $p = Join-Path $PSScriptRoot "articles\$($article.fr)"
    if (-not (Test-Path $p)) { continue }
    
    $c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
    
    # 1. Add hreflang
    if ($c -notmatch 'hreflang="en-MG"') {
        $c = $c -replace '<meta property="og:type" content="article">', ("<link rel=`"alternate`" hreflang=`"en-MG`" href=`"https://www.expertimmo.mg/en/articles/" + $article.en + "`">`n  <meta property=`"og:type`" content=`"article`">")
    }

    # 2. Add language switcher UI in navbar if not present
    if ($c -notmatch 'class="lang-switcher"') {
        $switcherHtml = @'
    <div style="display:flex; align-items:center; gap: 1rem;">
      <div class="lang-switcher">
        <a href="#" class="lang-btn active" data-lang="fr">FR</a> | 
        <a href="#" class="lang-btn" data-lang="en">EN</a>
      </div>
    </div>
  </nav>
'@
        $c = $c -replace '</nav>', $switcherHtml
    }

    # 3. Add language-switcher CSS
    if ($c -notmatch '\.lang-switcher') {
        $css = @'
    .lang-switcher { font-size: 0.85rem; font-weight: 600; font-family: var(--font-body); color: var(--primary-light); }
    .lang-switcher a { color: var(--text-muted); padding: 0 4px; }
    .lang-switcher a.active { color: var(--accent); pointer-events: none; }
'@
        $c = $c -replace '</style>', "$css`n  </style>"
    }

    # 4. Add script at the end
    if ($c -notmatch 'language-switcher\.js') {
        $c = $c -replace '</body>', ("<script src=`"../js/i18n.js`"></script>`n  <script src=`"../js/language-switcher.js`"></script>`n</body>")
    }

    [System.IO.File]::WriteAllText($p, $c, [System.Text.Encoding]::UTF8)
    Write-Host "Updated FR article: $($article.fr)"
}
