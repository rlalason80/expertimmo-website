const fs = require('fs');
const path = require('path');

const rootDir = 'E:\\EIMG\\EIMG Web\\EIMG Website';

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(dir + '/' + file);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
        getFiles(dir + '/' + file, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(dir + '/' + file);
    }
  }
  return fileList;
}

const htmlFiles = getFiles(rootDir);
let results = [];

let enFilesRequiringTranslation = [];

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  let dataI18nCount = (content.match(/\s+data-i18n="[^"]*"/g) || []).length;
  content = content.replace(/\s+data-i18n="[^"]*"/g, '');
  
  let scriptCount = (content.match(/<script\s+src="[^"]*i18n\.js"><\/script>\s*/g) || []).length;
  content = content.replace(/<script\s+src="[^"]*i18n\.js"><\/script>\s*/g, '');
  
  let sessionStorageScriptCount = (content.match(/<script>\s*\(\s*function\(\)\s*\{\s*sessionStorage\.setItem\('expertImmoLang','en'\);.*?\}\)\(\);\s*<\/script>\s*/g) || []).length;
  content = content.replace(/<script>\s*\(\s*function\(\)\s*\{\s*sessionStorage\.setItem\('expertImmoLang','en'\);.*?\}\)\(\);\s*<\/script>\s*/g, '');

  let langBtnCount = (content.match(/class="lang-btn/g) || []).length;
  
  // Replace the .lang-switcher styles
  content = content.replace(/\.lang-switcher\s*\{[^}]*\}\s*\.lang-switcher\s+a\s*\{[^}]*\}\s*\.lang-switcher\s+a\.active\s*\{[^}]*\}\s*/g, '');

  // For the switcher placeholders
  const isEn = file.replace(/\\/g, '/').includes('/en/');
  const langCurrent = isEn ? 'en' : 'fr';
  const mobileMount = `<div class="lang-switcher-mount-mobile" data-lang-current="${langCurrent}"></div>`;
  const desktopMount = `<div class="lang-switcher-mount" data-lang-current="${langCurrent}"></div>`;

  let switcherMatchCount = 0;
  content = content.replace(/<div class="lang-switcher"[^>]*>[\s\S]*?<\/div>/g, (match) => {
    switcherMatchCount++;
    if (switcherMatchCount === 1) return mobileMount;
    if (switcherMatchCount === 2) return desktopMount;
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }

  if (isEn) {
    enFilesRequiringTranslation.push(file.replace(/\\/g, '/').replace(rootDir.replace(/\\/g, '/') + '/', ''));
  }

  results.push({
    file: file.replace(/\\/g, '/').replace(rootDir.replace(/\\/g, '/') + '/', ''),
    dataI18n: dataI18nCount,
    scripts: scriptCount,
    langBtns: langBtnCount,
    switchersReplaced: switcherMatchCount
  });
}

const i18nPath = path.join(rootDir, 'js', 'i18n.js');
let i18nDeleted = false;
if (fs.existsSync(i18nPath)) {
  fs.unlinkSync(i18nPath);
  i18nDeleted = true;
}

console.log(JSON.stringify({ results, enFilesRequiringTranslation, i18nDeleted }, null, 2));
