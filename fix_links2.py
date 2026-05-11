import os
import glob
import re

base_path = 'e:/EIMG/EIMG Web/EIMG Website'

replacements_root = {
    'href="../index.html"': 'href="index.html"',
    'href="../index.html#accueil"': 'href="index.html#home"',
    'href="../index.html#a-propos"': 'href="index.html#a-propos"',
    'href="../index.html#services"': 'href="index.html#services"',
    'href="../index.html#contact"': 'href="index.html#contact"',
    'href="../index.html#faq"': 'href="index.html#faq"',
    'href="../honoraires.html"': 'href="fees.html"',
    'href="../mentions-legales.html"': 'href="legal-notice.html"',
    'href="../cgu.html"': 'href="terms-of-use.html"',
    'href="../confidentialite.html"': 'href="privacy-policy.html"',
    'href="../articles/evaluation-venale-madagascar.html"': 'href="articles/market-value-appraisal-madagascar.html"',
    'href="../articles/expert-carea-transactions-immobilieres.html"': 'href="articles/carea-expert-real-estate-transactions.html"',
    'href="../articles/investir-immobilier-madagascar-expertise.html"': 'href="articles/invest-real-estate-madagascar-expertise.html"'
}

replacements_articles = {
    'href="../index.html#accueil"': 'href="../index.html#home"',
    'href="../articles/evaluation-venale-madagascar.html"': 'href="market-value-appraisal-madagascar.html"',
    'href="../articles/expert-carea-transactions-immobilieres.html"': 'href="carea-expert-real-estate-transactions.html"',
    'href="../articles/investir-immobilier-madagascar-expertise.html"': 'href="invest-real-estate-madagascar-expertise.html"',
    'href="../mentions-legales.html"': 'href="../legal-notice.html"',
    'href="../cgu.html"': 'href="../terms-of-use.html"',
    'href="../confidentialite.html"': 'href="../privacy-policy.html"',
    'href="../honoraires.html"': 'href="../fees.html"'
}

def process_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    changes = []
    
    for old, new in replacements.items():
        if old in content and old != new:
            count = content.count(old)
            content = content.replace(old, new)
            changes.append(f"  - Replaced {count}x '{old}' with '{new}'")
            
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}:")
        for change in changes:
            print(change)

print("Processing /en/*.html files...")
for file in glob.glob(os.path.join(base_path, 'en', '*.html')):
    process_file(file, replacements_root)

print("\nProcessing /en/articles/*.html files...")
for file in glob.glob(os.path.join(base_path, 'en', 'articles', '*.html')):
    process_file(file, replacements_articles)

