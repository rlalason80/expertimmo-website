import os
import re
import json

root_dir = r"E:\EIMG\EIMG Web\EIMG Website"
html_files = []

for dirpath, dirnames, filenames in os.walk(root_dir):
    # Exclude directories
    dirnames[:] = [d for d in dirnames if d not in ['.git', 'node_modules', 'scratch']]
    for f in filenames:
        if f.endswith('.html'):
            html_files.append(os.path.join(dirpath, f))

results = []
en_files_requiring_translation = []

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original_content = content
    
    # data-i18n
    data_i18n_pattern = r'\s*data-i18n="[^"]*"'
    data_i18n_matches = len(re.findall(data_i18n_pattern, content))
    content = re.sub(data_i18n_pattern, '', content)
    
    # script i18n
    script_pattern = r'<script\s+src="[^"]*i18n\.js"></script>\s*'
    script_matches = len(re.findall(script_pattern, content))
    content = re.sub(script_pattern, '', content)
    
    # session storage script in /en/ pages
    session_script_pattern = r'<script>\s*\(\s*function\(\)\s*\{\s*sessionStorage\.setItem\(\'expertImmoLang\',\'en\'\);.*?\}\)\(\);\s*</script>\s*'
    session_script_matches = len(re.findall(session_script_pattern, content))
    content = re.sub(session_script_pattern, '', content)
    
    # lang-btn counts
    lang_btn_pattern = r'class="lang-btn'
    lang_btn_matches = len(re.findall(lang_btn_pattern, content))
    
    # style block for lang-switcher
    style_pattern = r'\.lang-switcher\s*\{[^}]*\}\s*\.lang-switcher\s+a\s*\{[^}]*\}\s*\.lang-switcher\s+a\.active\s*\{[^}]*\}\s*'
    content = re.sub(style_pattern, '', content)
    
    # replace switchers
    rel_path = os.path.relpath(filepath, root_dir).replace('\\', '/')
    is_en = '/en/' in rel_path or rel_path.startswith('en/')
    lang_current = 'en' if is_en else 'fr'
    
    mobile_mount = f'<div class="lang-switcher-mount-mobile" data-lang-current="{lang_current}"></div>'
    desktop_mount = f'<div class="lang-switcher-mount" data-lang-current="{lang_current}"></div>'
    
    switcher_pattern = r'<div class="lang-switcher"[^>]*>[\s\S]*?</div>'
    
    def replacer(match):
        replacer.count += 1
        if replacer.count == 1:
            return mobile_mount
        elif replacer.count == 2:
            return desktop_mount
        return match.group(0)
    
    replacer.count = 0
    content = re.sub(switcher_pattern, replacer, content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(content)
            
    if is_en:
        en_files_requiring_translation.append(rel_path)
        
    results.append({
        'file': rel_path,
        'dataI18n': data_i18n_matches,
        'scripts': script_matches,
        'langBtns': lang_btn_matches,
        'switchersReplaced': replacer.count
    })

i18n_path = os.path.join(root_dir, 'js', 'i18n.js')
i18n_deleted = False
if os.path.exists(i18n_path):
    os.remove(i18n_path)
    i18n_deleted = True

print(json.dumps({
    'results': results,
    'enFilesRequiringTranslation': en_files_requiring_translation,
    'i18nDeleted': i18n_deleted
}, indent=2))
