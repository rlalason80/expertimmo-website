import os
import glob
import re

base_path = 'e:/EIMG/EIMG Web/EIMG Website'

# Check for French links
fr_pages = [
    'mentions-legales.html',
    'cgu.html',
    'confidentialite.html',
    'honoraires.html',
    'evaluation-venale-madagascar.html',
    'expert-carea-transactions-immobilieres.html',
    'investir-immobilier-madagascar-expertise.html'
]

def search_fr_links(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Exclude hreflang links
                # A naive way: remove hreflang lines
                content_no_hreflang = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">', '', content)
                content_no_hreflang = re.sub(r'<meta property="og:url" content="[^"]*">', '', content_no_hreflang)
                content_no_hreflang = re.sub(r'"item":\s*"[^"]*"', '', content_no_hreflang) # remove schema.org links
                
                for fr_page in fr_pages:
                    if fr_page in content_no_hreflang:
                        print(f"Found '{fr_page}' in {filepath}")

print("Searching for French links in /en/")
search_fr_links(os.path.join(base_path, 'en'))
