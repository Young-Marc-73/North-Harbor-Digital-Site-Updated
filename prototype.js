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


/* ============================================================
   NORTH HARBOR DIGITAL — Site-wide FAQ Chatbot
   Self-contained: injects its own CSS + HTML, then runs.
   DEPLOY: paste this whole block at the END of prototype.js
   (loads on every page automatically). No other edits needed.
   Branded navy #11284C / accent blue #3A86FF.
   ============================================================ */
(function(){
  if (document.getElementById('chatLauncher')) return; // avoid double-inject

  // ---- 1. Inject styles ----
  var css = `
  :root{--chat-primary:#11284C;--chat-primary-dark:#0B1C38;--chat-accent:#3A86FF;--chat-dark:#1e293b;--chat-light:#f5f7fb;--chat-radius:16px;--chat-shadow:0 12px 48px rgba(0,0,0,.18);}
  .nhd-chat-launcher{position:fixed;bottom:24px;right:24px;z-index:99998;width:60px;height:60px;border-radius:50%;background:var(--chat-primary);color:#fff;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;transition:transform .2s;font-family:inherit}
  .nhd-chat-launcher:hover{transform:scale(1.08)}
  .nhd-chat-launcher svg{width:28px;height:28px;fill:currentColor}
  .nhd-chat-launcher .nhd-chat-launcher__close{display:none}
  .nhd-chat-launcher.open .nhd-chat-launcher__open{display:none}
  .nhd-chat-launcher.open .nhd-chat-launcher__close{display:block}
  .nhd-chat-launcher__badge{position:absolute;top:-2px;right:-2px;width:20px;height:20px;border-radius:50%;background:#3A86FF;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #fff}
  .nhd-chat-launcher.open .nhd-chat-launcher__badge{display:none}
  .nhd-chat-window{position:fixed;bottom:96px;right:24px;z-index:99999;width:380px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:var(--chat-radius);box-shadow:var(--chat-shadow);display:none;flex-direction:column;overflow:hidden;font-family:inherit}
  .nhd-chat-window.open{display:flex}
  .nhd-chat__header{background:var(--chat-primary);color:#fff;padding:16px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0}
  .nhd-chat__header-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.3);flex-shrink:0}
  .nhd-chat__header-info{flex:1}
  .nhd-chat__header-name{font-weight:700;font-size:15px}
  .nhd-chat__header-status{font-size:12px;opacity:.85;display:flex;align-items:center;gap:4px}
  .nhd-chat__header-status::before{content:'';width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block}
  .nhd-chat__messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;background:var(--chat-light)}
  .nhd-chat__messages::-webkit-scrollbar{width:4px}
  .nhd-chat__messages::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
  .nhd-chat__bubble{max-width:85%;padding:10px 14px;font-size:14px;line-height:1.5;word-wrap:break-word;animation:chatFadeIn .25s ease}
  @keyframes chatFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .nhd-chat__bubble--bot{background:#fff;color:var(--chat-dark);border-radius:4px 16px 16px 16px;align-self:flex-start;box-shadow:0 1px 4px rgba(0,0,0,.06)}
  .nhd-chat__bubble--user{background:var(--chat-primary);color:#fff;border-radius:16px 4px 16px 16px;align-self:flex-end}
  .nhd-chat__bubble--bot a{color:var(--chat-accent);font-weight:600;text-decoration:none}
  .nhd-chat__bubble--bot a:hover{text-decoration:underline}
  .nhd-chat__options{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-end;animation:chatFadeIn .3s ease;max-width:90%;justify-content:flex-end}
  .nhd-chat__option-btn{padding:8px 14px;border-radius:20px;border:1.5px solid var(--chat-primary);background:#fff;color:var(--chat-primary);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;font-family:inherit;white-space:nowrap}
  .nhd-chat__option-btn:hover{background:var(--chat-primary);color:#fff}
  .nhd-chat__typing{display:flex;gap:4px;align-self:flex-start;padding:12px 16px;background:#fff;border-radius:4px 16px 16px 16px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
  .nhd-chat__typing span{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:typingDot 1.2s infinite}
  .nhd-chat__typing span:nth-child(2){animation-delay:.2s}
  .nhd-chat__typing span:nth-child(3){animation-delay:.4s}
  @keyframes typingDot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}
  .nhd-chat__input-bar{display:flex;align-items:center;gap:8px;padding:12px 16px;border-top:1px solid #e2e8f0;background:#fff;flex-shrink:0}
  .nhd-chat__input{flex:1;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:24px;font-size:14px;font-family:inherit;outline:none;transition:border-color .2s;color:var(--chat-dark)}
  .nhd-chat__input:focus{border-color:var(--chat-primary)}
  .nhd-chat__input::placeholder{color:#94a3b8}
  .nhd-chat__send{width:38px;height:38px;border-radius:50%;background:var(--chat-primary);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0}
  .nhd-chat__send:hover{background:var(--chat-primary-dark)}
  .nhd-chat__send svg{width:18px;height:18px;fill:#fff}
  @media(max-width:440px){.nhd-chat-window{bottom:0;right:0;width:100%;height:100%;max-height:100vh;border-radius:0}.nhd-chat-launcher{bottom:16px;right:16px}}
  `;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---- 2. Inject HTML ----
  var html = `
  <button class="nhd-chat-launcher" id="chatLauncher" aria-label="Chat with us">
    <span class="nhd-chat-launcher__badge">1</span>
    <svg class="nhd-chat-launcher__open" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
    <svg class="nhd-chat-launcher__close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
  </button>
  <div class="nhd-chat-window" id="chatWindow">
    <div class="nhd-chat__header">
      <img class="nhd-chat__header-avatar" src="https://ui-avatars.com/api/?name=North+Harbor&background=11284C&color=fff&size=80" alt="">
      <div class="nhd-chat__header-info">
        <div class="nhd-chat__header-name">North Harbor Digital</div>
        <div class="nhd-chat__header-status">Usually replies instantly</div>
      </div>
    </div>
    <div class="nhd-chat__messages" id="chatMessages"></div>
    <div class="nhd-chat__input-bar">
      <input class="nhd-chat__input" id="chatInput" type="text" placeholder="Type a message…" autocomplete="off">
      <button class="nhd-chat__send" id="chatSend" aria-label="Send">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  </div>`;
  var wrap = document.createElement('div'); wrap.innerHTML = html;
  while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

  // ---- 3. NHD knowledge base ----
  var BIZ = {
    name:"North Harbor Digital",
    phone:"(516) 907-7001", phoneTel:"5169077001",
    email:"marc@northharbordigital.net",
    hours:"Mon–Fri, 9 AM – 6 PM ET",
    area:"Long Island & the NY metro — and remote for clients nationwide"
  };
  var QA = [
    {keys:["price","cost","how much","rate","pricing","fee","expensive","cheap","afford"],
     answer:"Simple, flat pricing — no surprises:<br>🌐 <strong>Website — $799</strong> one-time<br>🔧 <strong>Hosting & maintenance — $249/mo</strong><br>📣 <strong>Social media — $149/mo</strong> (4 posts)<br>📍 <strong>Google Launch — $299</strong> (get found on Maps)<br>📈 <strong>Google Management — $129/mo</strong>",
     followUp:["Start a project","What's included?","Call us"]},
    {keys:["what do you do","services","offer","help with","build","website","web design","do you"],
     answer:"We build fast, simple websites for local service businesses — handymen, plumbers, contractors, restaurants — and get you found on Google. No website or just a Facebook page? That's exactly who we help. 🚀",
     followUp:["Pricing","How long does it take?","Start a project"]},
    {keys:["how long","timeline","fast","turnaround","when","quick","ready"],
     answer:"Most sites go from kickoff to launch in a matter of days, not months. We keep it simple so your phone starts ringing fast.",
     followUp:["Pricing","Start a project"]},
    {keys:["google","maps","seo","found","search","ranking","listing"],
     answer:"Getting you on Google Maps and local search is one of our specialties. We set up and optimize your Google Business Profile so customers searching '[your service] near me' actually find you. 📍",
     followUp:["Pricing","Start a project","Call us"]},
    {keys:["host","hosting","maintenance","update","secure","speed"],
     answer:"Our $249/mo hosting keeps your site fast, secure, and updated — so you never have to think about it. It's optional; the website stands on its own.",
     followUp:["Pricing","Start a project"]},
    {keys:["social","facebook","instagram","posts","marketing"],
     answer:"For $149/mo we handle your social media — four professional posts a month, done for you, so you stay visible without lifting a finger.",
     followUp:["Pricing","Start a project"]},
    {keys:["area","location","where","serve","cover","near","local"],
     answer:"We're based on Long Island and serve the NY metro in person, plus clients <strong>nationwide</strong> remotely. Wherever you are, we can help.",
     followUp:["Pricing","Start a project"]},
    {keys:["call","phone","talk","speak","reach","contact","email","text"],
     answer:"Let's talk!<br>📞 Call: <a href='tel:"+BIZ.phoneTel+"'>"+BIZ.phone+"</a><br>💬 Text: <a href='sms:"+BIZ.phoneTel+"'>"+BIZ.phone+"</a><br>📧 Email: <a href='mailto:"+BIZ.email+"'>"+BIZ.email+"</a>",
     followUp:["Start a project","Pricing"]},
    {keys:["start","quote","sign up","get going","begin","interested","hire","project"],
     answer:"Awesome! 🎉 The fastest way to start is a quick call — we'll learn about your business and map out your site.<br><br>📞 <a href='tel:"+BIZ.phoneTel+"'>"+BIZ.phone+"</a> or reply here and we'll reach out.",
     followUp:["Pricing","Call us"]},
    {keys:["included","what's included","comes with","get for"],
     answer:"Your $799 site includes a complete, mobile-first website — built, written, and launched. Hosting, social, and Google services are optional monthly add-ons. You own your site.",
     followUp:["Pricing","Start a project"]},
    {keys:["thank","thanks","thx","great","perfect","awesome"],
     answer:"You're welcome! 😊 Anything else I can help with?",
     followUp:["Pricing","Start a project","No, I'm good!"]},
    {keys:["bye","goodbye","that's all","i'm good","all set","no thanks","nope"],
     answer:"Thanks for stopping by! We're a call away at <a href='tel:"+BIZ.phoneTel+"'>"+BIZ.phone+"</a>. 👋",
     followUp:[]}
  ];
  var QUICK = {
    "Start a project":"I'd like to start a project","Pricing":"What's your pricing?",
    "What's included?":"What's included?","How long does it take?":"How long does it take?",
    "Call us":"__call","No, I'm good!":"I'm all set, thanks!"
  };

  // ---- 4. Engine ----
  var msgArea=document.getElementById('chatMessages'),input=document.getElementById('chatInput'),
      sendBtn=document.getElementById('chatSend'),launcher=document.getElementById('chatLauncher'),
      chatWin=document.getElementById('chatWindow'),isOpen=false,greeted=false;
  function addBubble(t,w){var d=document.createElement('div');d.className='nhd-chat__bubble nhd-chat__bubble--'+w;d.innerHTML=t;msgArea.appendChild(d);msgArea.scrollTop=msgArea.scrollHeight;}
  function addOptions(o){if(!o||!o.length)return;var wr=document.createElement('div');wr.className='nhd-chat__options';o.forEach(function(l){var b=document.createElement('button');b.className='nhd-chat__option-btn';b.textContent=l;b.addEventListener('click',function(){msgArea.querySelectorAll('.nhd-chat__options').forEach(function(x){x.remove()});handleQuick(l);});wr.appendChild(b);});msgArea.appendChild(wr);msgArea.scrollTop=msgArea.scrollHeight;}
  function showTyping(){var t=document.createElement('div');t.className='nhd-chat__typing';t.id='typingIndicator';t.innerHTML='<span></span><span></span><span></span>';msgArea.appendChild(t);msgArea.scrollTop=msgArea.scrollHeight;}
  function hideTyping(){var t=document.getElementById('typingIndicator');if(t)t.remove();}
  function botReply(t,o){showTyping();var d=Math.min(400+t.length*8,1800);setTimeout(function(){hideTyping();addBubble(t,'bot');if(o&&o.length)addOptions(o);},d);}
  function findAnswer(x){var l=x.toLowerCase();for(var i=0;i<QA.length;i++)for(var k=0;k<QA[i].keys.length;k++)if(l.indexOf(QA[i].keys[k])!==-1)return QA[i];return null;}
  function handleUser(t){addBubble(t,'user');var m=findAnswer(t);if(m){botReply(m.answer,m.followUp);}else{botReply("Great question! For anything specific it's best to reach Marc directly:<br><br>📞 <a href='tel:"+BIZ.phoneTel+"'>"+BIZ.phone+"</a><br>📧 <a href='mailto:"+BIZ.email+"'>"+BIZ.email+"</a><br><br>Or I can help with these:",["Pricing","Services","How long does it take?","Start a project"]);}}
  function handleQuick(l){var a=QUICK[l]||l;if(a==='__call'){window.open('tel:'+BIZ.phoneTel,'_self');return;}handleUser(a);}
  function greet(){if(greeted)return;greeted=true;setTimeout(function(){addBubble("Hi there! 👋 I'm the North Harbor Digital assistant. Looking to get your business online or found on Google? I can help.",'bot');addOptions(["Pricing","Services","How long does it take?","Start a project"]);},400);}
  launcher.addEventListener('click',function(){isOpen=!isOpen;chatWin.classList.toggle('open',isOpen);launcher.classList.toggle('open',isOpen);if(isOpen){greet();setTimeout(function(){input.focus()},300);}});
  sendBtn.addEventListener('click',function(){var t=input.value.trim();if(!t)return;input.value='';msgArea.querySelectorAll('.nhd-chat__options').forEach(function(x){x.remove()});handleUser(t);});
  input.addEventListener('keydown',function(e){if(e.key==='Enter')sendBtn.click();});
})();


/* ============================================================
   NORTH HARBOR DIGITAL — Meta (Facebook) Pixel + Cookie Consent
   Dataset / Pixel ID: 1044885861222091
   Self-contained: injects cookie banner + styles, and only loads
   the Meta Pixel AFTER the visitor accepts (GDPR/CCPA-friendly).
   DEPLOY: paste this whole block at the END of prototype.js
   (right after the chatbot block is fine). Loads on every page.
   ============================================================ */
(function(){
  var PIXEL_ID = "1044885861222091";
  var KEY = "nhd_cookie_consent"; // "granted" | "denied"

  // ---- Load the Meta Pixel (only called on consent) ----
  function loadPixel(){
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  // If the visitor already accepted earlier, load immediately and skip the banner.
  try { if (localStorage.getItem(KEY) === "granted") { loadPixel(); return; }
        if (localStorage.getItem(KEY) === "denied") { return; } } catch(e){}

  // ---- Inject banner styles ----
  var css = `
  .nhd-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:99997;max-width:760px;margin:0 auto;
    background:#11284C;color:#e7eef7;border:1px solid #1c3d70;border-radius:12px;
    box-shadow:0 12px 40px rgba(0,0,0,.28);padding:16px 20px;display:flex;gap:16px;align-items:center;
    flex-wrap:wrap;font-family:inherit;font-size:14px;line-height:1.5}
  .nhd-cookie__text{flex:1;min-width:240px}
  .nhd-cookie__text a{color:#9fc0ff;text-decoration:underline}
  .nhd-cookie__buttons{display:flex;gap:8px;flex-shrink:0}
  .nhd-cookie__btn{padding:9px 18px;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer;
    border:none;font-family:inherit;transition:opacity .15s}
  .nhd-cookie__btn:hover{opacity:.9}
  .nhd-cookie__btn--accept{background:#3A86FF;color:#fff}
  .nhd-cookie__btn--decline{background:transparent;color:#cdd9ee;border:1px solid #3a567f}
  @media(max-width:520px){.nhd-cookie{flex-direction:column;align-items:stretch}.nhd-cookie__buttons{justify-content:flex-end}}
  `;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---- Inject banner HTML ----
  var bar = document.createElement('div');
  bar.className = 'nhd-cookie';
  bar.id = 'cookieBanner';
  bar.innerHTML = ''
    + '<div class="nhd-cookie__text">We use cookies to improve your experience and measure our marketing. '
    + 'See our <a href="/privacy">Privacy Policy</a>.</div>'
    + '<div class="nhd-cookie__buttons">'
    + '<button class="nhd-cookie__btn nhd-cookie__btn--decline" id="cookieDecline">Decline</button>'
    + '<button class="nhd-cookie__btn nhd-cookie__btn--accept" id="cookieAccept">Accept</button>'
    + '</div>';
  document.body.appendChild(bar);

  function close(){ bar.style.display = 'none'; }
  document.getElementById('cookieAccept').addEventListener('click', function(){
    try{ localStorage.setItem(KEY,'granted'); }catch(e){}
    loadPixel(); close();
  });
  document.getElementById('cookieDecline').addEventListener('click', function(){
    try{ localStorage.setItem(KEY,'denied'); }catch(e){}
    close();
  });
})();

/* ============================================================
   ENHANCEMENTS — motion, blueprint self-draw, count-ups,
   condensing navbar, sticky contact bar, toast.
   Progressive + reduced-motion aware. (North Harbor Digital)
============================================================ */
(() => {
  'use strict';
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!REDUCE) document.documentElement.classList.add('js-enhanced');

  /* ---- Condensing navbar ---- */
  (function navCondense(){
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const on = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
    on(); addEventListener('scroll', on, { passive: true });
  })();

  /* ---- Blueprint art self-draw (on scroll into view) ---- */
  (function artDraw(){
    if (REDUCE || !('IntersectionObserver' in window)) return;
    const arts = document.querySelectorAll('.bp-art');
    if (!arts.length) return;
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('art-drawn'); io.unobserve(e.target); } });
    }, { threshold: 0.25 });
    arts.forEach(a => io.observe(a));
  })();

  /* ---- Scroll reveal (staggered) ---- */
  (function reveal(){
    if (REDUCE || !('IntersectionObserver' in window)) return;
    const sels = ['.section-head', '.card', '.pricing-card', '.benefits-text',
      '.benefit-item', '.work-card', '.stat', '.cta .container > *', '.contact-grid > *'];
    const set = new Set();
    sels.forEach(s => document.querySelectorAll(s).forEach(el => {
      if (el.closest('.hero')) return;            // hero has its own entrance
      set.add(el);
    }));
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('reveal--in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    set.forEach(el => {
      el.classList.add('reveal');
      const i = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(i, 5) * 70 + 'ms';
      io.observe(el);
    });
  })();

  /* ---- Count-ups (HTML [data-countup] + the SVG chart stats) ---- */
  function countTo(el, to, dec, suffix, prefix) {
    if (REDUCE) { el.textContent = prefix + to.toFixed(dec) + suffix; return; }
    let start = null; const dur = 1500;
    function tick(ts){
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const v = to * (1 - Math.pow(1 - p, 3));
      el.textContent = prefix + v.toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = prefix + to.toFixed(dec) + suffix;
    }
    requestAnimationFrame(tick);
  }
  (function countUps(){
    const targets = [];
    // Generic HTML opt-in
    document.querySelectorAll('[data-countup]').forEach(el => targets.push({
      el, to: parseFloat(el.dataset.to || '0'), dec: parseInt(el.dataset.decimals || '0', 10),
      suffix: el.dataset.suffix || '', prefix: el.dataset.prefix || ''
    }));
    // The blueprint dashboard stats live as SVG <text> — animate them too.
    // art.js injects the SVG on load; wait a tick, then match by content.
    setTimeout(() => {
      document.querySelectorAll('[data-art="chart"] text').forEach(t => {
        const s = (t.textContent || '').trim();
        let m;
        if ((m = s.match(/^([\d.]+)%$/)))        targets.push({ el: t, to: +m[1], dec: 1, suffix: '%', prefix: '' });
        else if ((m = s.match(/^([\d.]+)ms$/)))  targets.push({ el: t, to: +m[1], dec: 0, suffix: 'ms', prefix: '' });
        else if ((m = s.match(/^([\d.]+)k$/)))   targets.push({ el: t, to: +m[1], dec: 1, suffix: 'k', prefix: '' });
      });
      if (!('IntersectionObserver' in window)) { targets.forEach(t => countTo(t.el, t.to, t.dec, t.suffix, t.prefix)); return; }
      const io = new IntersectionObserver((ents) => {
        ents.forEach(e => {
          if (!e.isIntersecting) return;
          const t = targets.find(x => x.el === e.target);
          if (t) countTo(t.el, t.to, t.dec, t.suffix, t.prefix);
          io.unobserve(e.target);
        });
      }, { threshold: 0.6 });
      targets.forEach(t => io.observe(t.el));
    }, 60);
  })();

  /* ---- Sticky mobile contact action bar ---- */
  (function actionBar(){
    if (document.querySelector('.nhd-actionbar')) return;
    document.body.classList.add('has-actionbar');
    const bar = document.createElement('div');
    bar.className = 'nhd-actionbar';
    bar.setAttribute('aria-label', 'Quick contact');
    bar.innerHTML =
      '<a class="btn" href="#contact">Start a project</a>' +
      '<a class="btn secondary" href="tel:+15165551234" style="border-color:rgba(255,255,255,.5);color:#fff;">Call</a>';
    // Point "Call" at the site's real tel: link if one exists on the page.
    const tel = document.querySelector('a[href^="tel:"]');
    if (tel) bar.querySelector('a.secondary').setAttribute('href', tel.getAttribute('href'));
    else bar.querySelector('a.secondary').remove();
    document.body.appendChild(bar);
    const show = () => bar.classList.toggle('show', window.scrollY > 320);
    show(); addEventListener('scroll', show, { passive: true });
  })();

  /* ---- Toast on contact form submit (non-blocking) ---- */
  (function formToast(){
    function stack(){ let s = document.querySelector('.nhd-toasts'); if (!s){ s = document.createElement('div'); s.className='nhd-toasts'; s.setAttribute('aria-live','polite'); document.body.appendChild(s);} return s; }
    function toast(msg){
      const t = document.createElement('div'); t.className='nhd-toast'; t.setAttribute('role','status');
      t.innerHTML = '<span class="nhd-toast__i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></span><span>'+msg+'</span>';
      stack().appendChild(t); requestAnimationFrame(()=>t.classList.add('show'));
      setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(), 350); }, 3400);
    }
    document.querySelectorAll('form[data-netlify], form[data-contact-form], form[name]').forEach(f => {
      f.addEventListener('submit', () => toast("Thanks — your message is on its way. We'll be in touch shortly."));
    });
  })();
})();
