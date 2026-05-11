/**
 * ═══════════════════════════════════════════════════════
 * Cabinet ExpertImmo — Premium Language Switcher
 * v2.0 - 2026-05-10 - réécriture suite à conflit i18n
 * Self-contained component: injects CSS, creates UI, handles navigation
 * ═══════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  /* ─── CONFIG ─── */
  const STORAGE_KEY = 'expertimmo_lang_pref';
  const BANNER_DISMISSED_KEY = 'expertimmo_lang_banner_dismissed';

  /* ─── SLUG MAP (embedded for zero-latency) ─── */
  const SLUG_MAP = {
    'index.html': 'en/index.html',
    'honoraires.html': 'en/fees.html',
    'mentions-legales.html': 'en/legal-notice.html',
    'confidentialite.html': 'en/privacy-policy.html',
    'cgu.html': 'en/terms-of-use.html',
    'articles/evaluation-venale-madagascar.html': 'en/articles/market-value-appraisal-madagascar.html',
    'articles/expert-carea-transactions-immobilieres.html': 'en/articles/carea-expert-real-estate-transactions.html',
    'articles/investir-immobilier-madagascar-expertise.html': 'en/articles/invest-real-estate-madagascar-expertise.html',
    /* reverse */
    'en/index.html': 'index.html',
    'en/fees.html': 'honoraires.html',
    'en/legal-notice.html': 'mentions-legales.html',
    'en/privacy-policy.html': 'confidentialite.html',
    'en/terms-of-use.html': 'cgu.html',
    'en/articles/market-value-appraisal-madagascar.html': 'articles/evaluation-venale-madagascar.html',
    'en/articles/carea-expert-real-estate-transactions.html': 'articles/expert-carea-transactions-immobilieres.html',
    'en/articles/invest-real-estate-madagascar-expertise.html': 'articles/investir-immobilier-madagascar-expertise.html'
  };

  /* ─── SVG ASSETS ─── */
  const SVG_GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" class="ls__globe" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
  const SVG_CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="12" height="12" class="ls__chevron" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
  const SVG_FLAG_FR = '<svg viewBox="0 0 30 20" width="20" height="14" class="ls__flag" aria-hidden="true" role="img"><title>Français</title><rect width="10" height="20" fill="#0055A4"/><rect x="10" width="10" height="20" fill="#FFF"/><rect x="20" width="10" height="20" fill="#EF4135"/></svg>';
  const SVG_FLAG_EN = '<svg viewBox="0 0 60 30" width="20" height="14" class="ls__flag" aria-hidden="true" role="img"><title>English</title><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFF" stroke-width="6"/><path d="M0,0 L60,30" stroke="#C8102E" stroke-width="4"/><path d="M60,0 L0,30" stroke="#C8102E" stroke-width="4"/><path d="M30,0 V30 M0,15 H60" stroke="#FFF" stroke-width="10"/><path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/></svg>';

  /* ─── GET CURRENT SLUG ─── */
  function getCurrentSlug() {
    let path = window.location.pathname.replace(/^\/+/, '');
    if (!path || path.endsWith('/')) path += 'index.html';
    return path;
  }

  /* ─── GET ALTERNATE URL ─── */
  function getAlternateUrl() {
    const slug = getCurrentSlug();
    const mapped = SLUG_MAP[slug];
    if (mapped) return '/' + mapped;
    
    console.warn("Slug not mapped: " + slug);
    return null;
  }

  /* ─── INJECT CSS ─── */
  function injectStyles() {
    if (document.getElementById('ls-styles')) return;
    const style = document.createElement('style');
    style.id = 'ls-styles';
    style.textContent = `
      .ls{position:relative;display:inline-flex;align-items:center;z-index:1001}
      .ls__trigger{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:transparent;border:1px solid var(--accent,#D4AF37);border-radius:8px;cursor:pointer;transition:all 220ms ease;color:var(--accent,#D4AF37);font-family:inherit;font-size:0;line-height:1;outline:none}
      .ls__trigger:hover,.ls__trigger:focus-visible{background:rgba(212,175,55,.08);box-shadow:0 0 12px rgba(212,175,55,.3)}
      .ls__trigger:focus-visible{outline:2px solid var(--accent,#D4AF37);outline-offset:2px}
      .ls__trigger[aria-expanded="true"] .ls__chevron{transform:rotate(180deg)}
      .ls__globe{color:var(--accent,#D4AF37);flex-shrink:0}
      .ls__chevron{color:var(--accent,#D4AF37);flex-shrink:0;transition:transform 220ms ease}
      .ls__flag{border-radius:2px;border:1px solid rgba(212,175,55,.25);flex-shrink:0;display:block}
      .ls__menu{position:absolute;top:calc(100% + 8px);right:0;min-width:64px;padding:6px;background:var(--primary,#0A192F);border:1px solid var(--accent,#D4AF37);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.5),0 0 16px rgba(212,175,55,.12);opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity 200ms ease,transform 200ms ease;list-style:none;margin:0}
      .ls__menu[data-open="true"]{opacity:1;transform:translateY(0);pointer-events:auto}
      .ls__option{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:6px;cursor:pointer;transition:all 180ms ease;color:var(--accent,#D4AF37);font-family:var(--font-body,'DM Sans',sans-serif);font-size:14px;font-weight:500;text-decoration:none;outline:none;border:none;background:none;width:100%}
      .ls__option:hover,.ls__option:focus-visible{background:rgba(212,175,55,.12);transform:translateX(2px)}
      .ls__option:focus-visible{outline:2px solid var(--accent,#D4AF37);outline-offset:-2px}
      .ls__sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      .ls__live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
      /* Banner */
      .ls-banner{position:fixed;bottom:80px;right:24px;z-index:998;background:var(--primary,#0A192F);border:1px solid var(--accent,#D4AF37);border-radius:10px;padding:14px 18px;box-shadow:0 8px 32px rgba(0,0,0,.4),0 0 20px rgba(212,175,55,.1);display:flex;align-items:center;gap:12px;animation:ls-slide-in .4s ease;max-width:340px}
      .ls-banner__text{color:rgba(255,255,255,.85);font-size:.88rem;font-family:var(--font-body,'DM Sans',sans-serif);line-height:1.4}
      .ls-banner__btn{background:var(--accent,#D4AF37);color:var(--primary,#0A192F);border:none;padding:6px 14px;border-radius:6px;font-weight:600;font-size:.82rem;cursor:pointer;white-space:nowrap;transition:all 200ms ease;font-family:inherit}
      .ls-banner__btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(212,175,55,.3)}
      .ls-banner__close{background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:1.1rem;padding:4px;line-height:1;transition:color 200ms}
      .ls-banner__close:hover{color:rgba(255,255,255,.8)}
      @keyframes ls-slide-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @media(max-width:768px){
        .ls__globe{width:15px;height:15px}
        .ls__flag{width:18px;height:12px}
        .ls__chevron{width:10px;height:10px}
        .ls__trigger{padding:5px 10px;gap:5px;min-height:36px;min-width:36px}
        .ls__option{min-height:44px;min-width:44px}
        .ls-banner{left:16px;right:16px;bottom:90px;max-width:none}
      }
    `;
    document.head.appendChild(style);
  }

  /* ─── BUILD COMPONENT HTML ─── */
  function buildSwitcher(currentLang, altUrl) {
    const isFr = currentLang === 'fr';
    const currentFlag = isFr ? SVG_FLAG_FR : SVG_FLAG_EN;
    const altFlag = isFr ? SVG_FLAG_EN : SVG_FLAG_FR;
    const altLang = isFr ? 'en' : 'fr';
    const altLabel = isFr ? 'EN' : 'FR';
    const ariaLabel = isFr
      ? 'Sélecteur de langue, langue actuelle : Français'
      : 'Language selector, current language: English';
    const menuLabel = isFr ? 'Choisir une langue' : 'Choose a language';

    const wrapper = document.createElement('div');
    wrapper.className = 'ls';
    wrapper.innerHTML = `
      <button class="ls__trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="ls-menu" aria-label="${ariaLabel}">
        ${SVG_GLOBE}${currentFlag}${SVG_CHEVRON}
      </button>
      <ul class="ls__menu" id="ls-menu" role="listbox" aria-label="${menuLabel}" data-open="false">
        <li role="option" aria-selected="false" tabindex="-1">
          <a href="${altUrl}" class="ls__option" data-lang="${altLang}" role="option">
            ${altFlag}<span>${altLabel}</span>
          </a>
        </li>
      </ul>
      <div class="ls__live" aria-live="polite" aria-atomic="true"></div>
    `;
    return wrapper;
  }

  /* ─── ATTACH EVENTS ─── */
  function attachEvents(wrapper) {
    const trigger = wrapper.querySelector('.ls__trigger');
    const menu = wrapper.querySelector('.ls__menu');
    const option = wrapper.querySelector('.ls__option');
    const live = wrapper.querySelector('.ls__live');

    function openMenu() {
      trigger.setAttribute('aria-expanded', 'true');
      menu.setAttribute('data-open', 'true');
      option.focus();
    }

    function closeMenu(refocusTrigger) {
      trigger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('data-open', 'false');
      if (refocusTrigger) trigger.focus();
    }

    function isOpen() {
      return trigger.getAttribute('aria-expanded') === 'true';
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen() ? closeMenu(true) : openMenu();
    });

    option.addEventListener('click', (e) => {
      /* Let the <a> navigate naturally, but persist choice first */
      const lang = option.getAttribute('data-lang');
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
      const msg = lang === 'en' ? 'Language changed to English' : 'Langue passée au français';
      live.textContent = msg;
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (isOpen() && !wrapper.contains(e.target)) closeMenu(false);
    });

    /* Keyboard */
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        e.preventDefault();
        closeMenu(true);
      }
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && isOpen()) {
        e.preventDefault();
        option.focus();
      }
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === option) {
        /* Let default <a> behavior handle navigation */
        const lang = option.getAttribute('data-lang');
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
      }
    });
  }

  /* ─── LANGUAGE DETECTION BANNER ─── */
  function showDetectionBanner() {
    const mounts = document.querySelectorAll('.lang-switcher-mount, .lang-switcher-mount-mobile');
    if (mounts.length === 0) return;
    
    // Check if we are on a French page by looking at the first mount's data-lang-current
    const lang = mounts[0].getAttribute('data-lang-current') || 'fr';
    if (lang === 'en') return; /* Only show on FR pages */
    
    try {
      if (localStorage.getItem(BANNER_DISMISSED_KEY)) return;
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch (_) { return; }

    const userLangs = (navigator.languages || [navigator.language || '']).map(l => l.toLowerCase());
    const prefersEn = userLangs.some(l => l.startsWith('en'));
    if (!prefersEn) return;

    const altUrl = getAlternateUrl();
    if (!altUrl) return; // Don't show banner if there is no alternate page

    const banner = document.createElement('div');
    banner.className = 'ls-banner';
    banner.setAttribute('role', 'alert');
    banner.innerHTML = `
      <span class="ls-banner__text">🌍 View this site in <strong>English</strong>?</span>
      <a href="${altUrl}" class="ls-banner__btn" id="ls-banner-accept">Switch to EN</a>
      <button class="ls-banner__close" id="ls-banner-dismiss" aria-label="Dismiss">&times;</button>
    `;
    document.body.appendChild(banner);

    banner.querySelector('#ls-banner-accept').addEventListener('click', () => {
      try {
        localStorage.setItem(STORAGE_KEY, 'en');
        localStorage.setItem(BANNER_DISMISSED_KEY, '1');
      } catch (_) {}
    });

    banner.querySelector('#ls-banner-dismiss').addEventListener('click', () => {
      try {
        localStorage.setItem(BANNER_DISMISSED_KEY, '1');
        localStorage.setItem(STORAGE_KEY, 'fr');
      } catch (_) {}
      banner.remove();
    });
  }

  /* ─── MOUNT SWITCHERS ─── */
  function mountSwitchers() {
    const mounts = document.querySelectorAll('.lang-switcher-mount, .lang-switcher-mount-mobile');
    mounts.forEach(mount => {
      const currentLang = mount.getAttribute('data-lang-current') || 'fr';
      const altUrl = getAlternateUrl();
      
      if (!altUrl) return; // No mapping exists, do not show switcher

      const wrapper = buildSwitcher(currentLang, altUrl);
      attachEvents(wrapper);
      mount.appendChild(wrapper);
    });
  }

  /* ─── INIT ─── */
  function init() {
    injectStyles();
    mountSwitchers();
    showDetectionBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
