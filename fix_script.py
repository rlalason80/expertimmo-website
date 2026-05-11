import os
import glob
import re

# 1. Update js/language-switcher.js
js_file = 'js/language-switcher.js'
with open(js_file, 'r', encoding='utf-8') as f:
    js_content = f.read()

new_slug_logic = """  /* ─── GET CURRENT SLUG ─── */
  function getCurrentSlug() {
    let path = window.location.pathname;
    let slug = '';
    
    if (window.location.protocol === 'file:') {
      path = decodeURIComponent(path);
      const rootFolder = 'EIMG Website/';
      const rootFolder2 = 'EIMG%20Website/';
      let parts = path.split(rootFolder);
      if (parts.length === 1) parts = path.split(rootFolder2);
      
      if (parts.length > 1) {
        slug = parts.pop().replace(/^\\/+/, '');
      } else {
        slug = window.location.href.split('/').pop();
      }
    } else {
      slug = path.replace(/^\\/+/, '');
    }
    
    if (!slug || slug.endsWith('/')) slug += 'index.html';
    
    console.log('[language-switcher] slug détecté:', slug, '| protocole:', window.location.protocol);
    return slug;
  }"""

# Replace the existing function
js_content = re.sub(r'  /\* ─── GET CURRENT SLUG ─── \*/\s*function getCurrentSlug\(\) \{.*?\n  \}', new_slug_logic, js_content, flags=re.DOTALL)

with open(js_file, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Updated language-switcher.js")

# 2. Update all HTML files
html_files = glob.glob('**/*.html', recursive=True)
count = 0

for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract existing script tag
    script_match = re.search(r'\s*<script\s+src="[^"]*language-switcher\.js"[^>]*></script>', content)
    
    # Remove all existing occurrences
    content = re.sub(r'\s*<script\s+src="[^"]*language-switcher\.js"[^>]*></script>', '', content)
    
    # Determine the correct relative path
    depth = hf.count(os.sep)
    if depth == 0:
        script_src = 'js/language-switcher.js'
    elif depth == 1:
        script_src = '../js/language-switcher.js'
    else:
        script_src = '../../js/language-switcher.js'
        
    script_tag = f'\n  <script src="{script_src}"></script>\n'
    
    # Insert right before </body>
    if '</body>' in content:
        content = content.replace('</body>', f'{script_tag}</body>')
        with open(hf, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        
print(f"Modified {count} HTML files.")
