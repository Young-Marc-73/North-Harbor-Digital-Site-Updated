/* ============================================================
   North Harbor Digital — prototype interactions
============================================================ */
(() => {
  'use strict';

  /* ----------- Navbar: mobile drawer + dropdown ----------- */
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileDrawer = document.querySelector('[data-mobile-drawer]');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const open = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!open));
      mobileDrawer.setAttribute('data-open', String(!open));
    });
    mobileDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('data-open', 'false');
      });
    });
  }

  document.querySelectorAll('[data-dropdown]').forEach(dd => {
    const trigger = dd.querySelector('[data-dropdown-trigger]');
    if (!trigger) return;
    let openedByClick = false;
    const set = (open) => {
      dd.setAttribute('data-open', String(open));
      trigger.setAttribute('aria-expanded', String(open));
    };
    dd.addEventListener('mouseenter', () => { if (matchMedia('(min-width: 992px)').matches) set(true); });
    dd.addEventListener('mouseleave', () => { if (!openedByClick && matchMedia('(min-width: 992px)').matches) set(false); });
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const open = dd.getAttribute('data-open') === 'true';
      openedByClick = !open;
      set(!open);
    });
    document.addEventListener('click', e => {
      if (!dd.contains(e.target)) { set(false); openedByClick = false; }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { set(false); openedByClick = false; }
    });
  });

  /* ----------- Pricing tabs ----------- */
  const tabs = document.querySelectorAll('.pricing-tab');
  const panels = document.querySelectorAll('[data-panel]');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      const v = t.dataset.tab;
      tabs.forEach(x => x.setAttribute('aria-selected', String(x.dataset.tab === v)));
      panels.forEach(p => p.setAttribute('data-active', String(p.dataset.panel === v)));
    });
  });

  /* ----------- Feature tabs (underline style, scoped to section) ----------- */
  document.querySelectorAll('[data-feature-tabs]').forEach(group => {
    const section = group.closest('section') || group.parentElement;
    const fTabs = group.querySelectorAll('.feature-tab');
    const fPanels = section.querySelectorAll('.feature-tab-panel');
    fTabs.forEach(t => {
      t.addEventListener('click', () => {
        const v = t.dataset.tab;
        fTabs.forEach(x => x.setAttribute('aria-selected', String(x.dataset.tab === v)));
        fPanels.forEach(p => p.setAttribute('data-active', String(p.dataset.panel === v)));
      });
    });
  });

  /* ----------- Contact form ----------- */
  const form = document.querySelector('[data-contact-form]');
  const success = document.querySelector('[data-form-success]');
  const toast = document.querySelector('[data-toast]');

  const showError = (name, msg) => {
    const input = form.querySelector(`[name="${name}"]`);
    const slot = form.querySelector(`[data-error-for="${name}"]`);
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (slot) slot.textContent = msg || '';
  };

  const validate = () => {
    let ok = true;
    ['first','last','email','message'].forEach(n => showError(n, ''));
    const fields = {
      first: form.first.value.trim(),
      last: form.last.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };
    if (!fields.first) { showError('first', 'Required'); ok = false; }
    if (!fields.last) { showError('last', 'Required'); ok = false; }
    if (!fields.email) { showError('email', 'Required'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) { showError('email', 'Doesn\'t look like a real email'); ok = false; }
    if (!fields.message) { showError('message', 'Tell us a little more'); ok = false; }
    return ok;
  };

  if (form) {
    form.addEventListener('input', (e) => {
      if (e.target.name) showError(e.target.name, '');
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) {
        const firstError = form.querySelector('[aria-invalid="true"]');
        if (firstError) firstError.focus();
        return;
      }
      // Submit to Netlify Forms via AJAX
      const data = new URLSearchParams(new FormData(form)).toString();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
      }).then((res) => {
        if (!res.ok) throw new Error('Network error');
        form.style.display = 'none';
        success.setAttribute('data-show', 'true');
        if (toast) {
          toast.setAttribute('data-show', 'true');
          setTimeout(() => toast.setAttribute('data-show', 'false'), 2200);
        }
      }).catch(() => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send message'; }
        alert("Sorry — something went wrong sending your message. Please email marc@northharbordigital.net or call 516.907.7001 instead.");
      });
    });
  }

  /* ============================================================
     TWEAKS — protocol + state (only on pages with a panel)
  ============================================================ */
  const tweaksEl = document.querySelector('[data-tweaks]');
  if (!tweaksEl) return;

  const tweakState = { ...(window.TWEAK_DEFAULTS || {}) };
  const closeBtn = document.querySelector('[data-tweaks-close]');

  // Register listener BEFORE announcing availability
  window.addEventListener('message', (e) => {
    const t = e.data && e.data.type;
    if (t === '__activate_edit_mode') {
      tweaksEl.setAttribute('data-open', 'true');
    } else if (t === '__deactivate_edit_mode') {
      tweaksEl.setAttribute('data-open', 'false');
    }
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');

  if (closeBtn) closeBtn.addEventListener('click', () => {
    tweaksEl.setAttribute('data-open', 'false');
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  });

  const persist = (edits) => {
    Object.assign(tweakState, edits);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  };

  /* --- apply functions --- */
  function applyHeroScheme(v) {
    const hero = document.getElementById('top');
    if (!hero) return;
    hero.classList.remove('scheme-1','scheme-2','scheme-3','scheme-4','scheme-5','scheme-6','scheme-7','scheme-8');
    hero.classList.add('scheme-' + v);
  }

  function applyPalette(v) {
    const root = document.documentElement;
    const palettes = {
      default: {
        cello:        '#234e70',
        celloDark:    '#1a3a55',
        dodger:       '#3a86ff',
        dodgerDark:   '#122a3f',
      },
      warm: {
        cello:        '#3a2417',
        celloDark:    '#2a1810',
        dodger:       '#e07a3c',
        dodgerDark:   '#1a0e08',
      },
      forest: {
        cello:        '#1d3a2a',
        celloDark:    '#13261c',
        dodger:       '#3fa56f',
        dodgerDark:   '#0c1e14',
      },
      ink: {
        cello:        '#1a1a1c',
        celloDark:    '#101012',
        dodger:       '#545455',
        dodgerDark:   '#0c0c0d',
      },
    };
    const p = palettes[v] || palettes.default;
    root.style.setProperty('--color-cello', p.cello);
    root.style.setProperty('--color-cello-dark', p.celloDark);
    root.style.setProperty('--color-dodger-blue', p.dodger);
    root.style.setProperty('--color-dodger-blue-darkest', p.dodgerDark);
  }

  function applyDensity(v) {
    const root = document.documentElement;
    if (v === 'cozy')        root.style.setProperty('--section-y', '3rem');
    else if (v === 'spacious') root.style.setProperty('--section-y', matchMedia('(min-width:992px)').matches ? '9rem' : '5rem');
    else                       root.style.removeProperty('--section-y');
  }

  function applyTypePair(v) {
    const heads = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .nav-logo .wordmark, .price-card .name, .price-card .amount .num');
    if (v === 'modern') {
      heads.forEach(h => h.style.fontFamily = '"Poppins", system-ui, sans-serif');
    } else {
      heads.forEach(h => h.style.fontFamily = '');
    }
  }

  function applyPricingEmph(v) {
    const cards = document.querySelectorAll('.pricing-grid .price-card');
    cards.forEach(c => c.classList.remove('featured'));
    cards.forEach(c => { const tag = c.querySelector('.price-tag'); if (tag) tag.style.display = ''; });
    if (v === 'none') {
      cards.forEach(c => { const tag = c.querySelector('.price-tag'); if (tag && tag.textContent === 'Most popular') tag.style.display = 'none'; });
      return;
    }
    document.querySelectorAll('.pricing-grid').forEach(grid => {
      const list = grid.querySelectorAll('.price-card');
      const idx = v === 'top' ? 2 : 1;
      const target = list[idx];
      if (target) target.classList.add('featured');
    });
  }

  /* --- wire control buttons --- */
  function syncControl(key, value) {
    document.querySelectorAll(`[data-tweak="${key}"] button`).forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.value === value));
    });
  }

  document.querySelectorAll('[data-tweak]').forEach(group => {
    const key = group.dataset.tweak;
    group.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        const v = b.dataset.value;
        syncControl(key, v);
        applyTweak(key, v);
        persist({ [key]: v });
      });
    });
  });

  function applyTweak(key, value) {
    if (key === 'heroScheme') applyHeroScheme(value);
    else if (key === 'palette') applyPalette(value);
    else if (key === 'density') applyDensity(value);
    else if (key === 'typePair') applyTypePair(value);
    else if (key === 'pricingEmph') applyPricingEmph(value);
  }

  // initial sync from defaults
  Object.entries(tweakState).forEach(([k, v]) => {
    syncControl(k, v);
    applyTweak(k, v);
  });

})();
