/**
 * ═══════════════════════════════════════════════════════
 * Cabinet ExpertImmo — Premium Language Switcher
 * v2.0 - 2026-05-10 - réécriture suite à conflit i18n
 * Self-contained component: injects CSS, creates UI, handles navigation
 * ═══════════════════════════════════════════════════════
 */
/* SWITCHER TEMPORAIREMENT DÉSACTIVÉ pour phase de stabilisation FR.
   Sera réactivé au Prompt R6 pour la mise en place du bilinguisme. */
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

})();
