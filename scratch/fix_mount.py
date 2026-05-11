import os

root_dir = r"E:\EIMG\EIMG Web\EIMG Website"
html_files = []

for dirpath, dirnames, filenames in os.walk(root_dir):
    dirnames[:] = [d for d in dirnames if d not in ['.git', 'node_modules', 'scratch']]
    for f in filenames:
        if f.endswith('.html'):
            rel_path = os.path.relpath(os.path.join(dirpath, f), root_dir).replace('\\', '/')
            if rel_path not in ['index.html', 'en/index.html']:
                html_files.append(os.path.join(dirpath, f))

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # In these files, there is no mobile menu, only the desktop navbar.
    # The previous script mistakenly named it mobile. Let's fix it.
    new_content = content.replace('lang-switcher-mount-mobile', 'lang-switcher-mount')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Fixed {filepath}")
