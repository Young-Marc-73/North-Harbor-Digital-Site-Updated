/* ============================================================
   North Harbor Digital — Blueprint art library
   Each art is a self-contained SVG using only basic primitives
   (rect, circle, line, polyline, text). Strokes use currentColor
   so each piece inherits its surrounding scheme's foreground.
   Accent: #3A86FF (Harbor dodger blue).
============================================================ */
(() => {
  'use strict';

  const ART = {
    /* ----- browser / website mockup ----- */
    browser: () => `
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
  <rect x="40" y="40" width="320" height="220" rx="4" stroke-width="1.5"/>
  <line x1="40" y1="68" x2="360" y2="68"/>
  <circle cx="55" cy="54" r="3.5"/>
  <circle cx="68" cy="54" r="3.5"/>
  <circle cx="81" cy="54" r="3.5"/>
  <rect x="105" y="48" width="180" height="14" rx="3"/>
  <line x1="115" y1="55" x2="225" y2="55" opacity=".4"/>
  <text x="295" y="58" font-family="ui-monospace, monospace" font-size="7" fill="currentColor" opacity=".55">https://</text>
  <!-- left: hero block -->
  <rect x="60" y="90" width="130" height="78"/>
  <line x1="68" y1="105" x2="120" y2="105" opacity=".5"/>
  <line x1="68" y1="115" x2="140" y2="115" opacity=".5"/>
  <line x1="68" y1="125" x2="100" y2="125" opacity=".5"/>
  <rect x="68" y="140" width="55" height="14" rx="2" fill="#3A86FF" stroke="none"/>
  <line x1="60" y1="185" x2="190" y2="185" stroke-width="2"/>
  <line x1="60" y1="200" x2="170" y2="200"/>
  <line x1="60" y1="213" x2="180" y2="213"/>
  <line x1="60" y1="226" x2="155" y2="226"/>
  <!-- right: image block -->
  <rect x="210" y="90" width="130" height="100" fill="#3A86FF" fill-opacity=".18" stroke="none"/>
  <g stroke="#3A86FF" stroke-width=".5" opacity=".55">
    <line x1="220" y1="90" x2="220" y2="190"/>
    <line x1="240" y1="90" x2="240" y2="190"/>
    <line x1="260" y1="90" x2="260" y2="190"/>
    <line x1="280" y1="90" x2="280" y2="190"/>
    <line x1="300" y1="90" x2="300" y2="190"/>
    <line x1="320" y1="90" x2="320" y2="190"/>
  </g>
  <rect x="210" y="90" width="130" height="100" stroke="currentColor"/>
  <line x1="210" y1="205" x2="340" y2="205"/>
  <line x1="210" y1="218" x2="320" y2="218"/>
  <line x1="210" y1="231" x2="330" y2="231" opacity=".5"/>
  <!-- coordinate ticks -->
  <text x="46" y="36" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" opacity=".55">A1</text>
  <text x="354" y="36" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" opacity=".55" text-anchor="end">H1</text>
  <text x="46" y="270" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" opacity=".55">A4</text>
  <text x="354" y="270" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" opacity=".55" text-anchor="end">H4</text>
</svg>`,

    /* ----- rack / server stack ----- */
    rack: () => {
      const units = [];
      for (let i = 0; i < 8; i++) {
        const y = 70 + i * 22;
        const active = i === 2 || i === 5;
        const ledA = active ? '#3A86FF' : 'currentColor';
        units.push(`
          <rect x="128" y="${y}" width="144" height="16" opacity=".85"/>
          <circle cx="138" cy="${y + 8}" r="2.2" fill="${ledA}" stroke="none"/>
          <circle cx="148" cy="${y + 8}" r="2.2"/>
          <line x1="160" y1="${y + 5}" x2="220" y2="${y + 5}" opacity=".5"/>
          <line x1="160" y1="${y + 11}" x2="200" y2="${y + 11}" opacity=".4"/>
          <text x="262" y="${y + 11}" font-family="ui-monospace, monospace" font-size="6" fill="currentColor" opacity=".55" text-anchor="end">U${(8 - i).toString().padStart(2, '0')}</text>
        `);
      }
      return `
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
  <rect x="120" y="30" width="160" height="240" rx="3" stroke-width="1.5"/>
  <line x1="120" y1="58" x2="280" y2="58"/>
  <circle cx="134" cy="44" r="2.2" fill="#3A86FF" stroke="none"/>
  <line x1="148" y1="44" x2="240" y2="44" opacity=".5"/>
  <text x="270" y="47" font-family="ui-monospace, monospace" font-size="7" fill="currentColor" opacity=".55" text-anchor="end">RACK·01</text>
  ${units.join('')}
  <line x1="120" y1="255" x2="280" y2="255"/>
  <circle cx="200" cy="263" r="2.5" fill="#3A86FF" stroke="none"/>
  <text x="216" y="266" font-family="ui-monospace, monospace" font-size="6" fill="currentColor" opacity=".55">PWR</text>
  <!-- legs -->
  <line x1="135" y1="270" x2="135" y2="280"/>
  <line x1="265" y1="270" x2="265" y2="280"/>
</svg>`;
    },

    /* ----- phone with feed ----- */
    phone: () => `
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
  <rect x="150" y="20" width="100" height="270" rx="14" stroke-width="1.5"/>
  <rect x="158" y="38" width="84" height="232" opacity=".25"/>
  <line x1="186" y1="29" x2="214" y2="29" stroke-width="2"/>
  <text x="166" y="53" font-family="ui-monospace, monospace" font-size="6" fill="currentColor" opacity=".7">09:41</text>
  <line x1="220" y1="49" x2="232" y2="49"/>
  <line x1="220" y1="52" x2="232" y2="52"/>
  <!-- profile row -->
  <circle cx="168" cy="72" r="6"/>
  <line x1="180" y1="69" x2="222" y2="69"/>
  <line x1="180" y1="75" x2="210" y2="75" opacity=".5"/>
  <!-- post image -->
  <rect x="158" y="86" width="84" height="62" fill="#3A86FF" fill-opacity=".22" stroke="none"/>
  <g stroke="#3A86FF" stroke-width=".5" opacity=".6">
    <line x1="168" y1="86" x2="168" y2="148"/>
    <line x1="184" y1="86" x2="184" y2="148"/>
    <line x1="200" y1="86" x2="200" y2="148"/>
    <line x1="216" y1="86" x2="216" y2="148"/>
    <line x1="232" y1="86" x2="232" y2="148"/>
  </g>
  <rect x="158" y="86" width="84" height="62"/>
  <!-- action icons -->
  <path d="M 165 162 c -3 -3 -3 -7 0 -7 c 1.5 0 2.5 1 3 2 c 0.5 -1 1.5 -2 3 -2 c 3 0 3 4 0 7 z" fill="#3A86FF" stroke="none"/>
  <circle cx="180" cy="161" r="3"/>
  <path d="M 192 158 l 5 3 l -5 3 z" fill="currentColor" stroke="none"/>
  <text x="220" y="163" font-family="ui-monospace, monospace" font-size="6" fill="currentColor" opacity=".7">421</text>
  <!-- text lines -->
  <line x1="158" y1="178" x2="240" y2="178"/>
  <line x1="158" y1="186" x2="225" y2="186"/>
  <line x1="158" y1="194" x2="232" y2="194" opacity=".5"/>
  <!-- next post header -->
  <line x1="158" y1="206" x2="240" y2="206" opacity=".25"/>
  <circle cx="168" cy="218" r="5"/>
  <line x1="180" y1="215" x2="218" y2="215"/>
  <line x1="180" y1="221" x2="205" y2="221" opacity=".5"/>
  <rect x="158" y="230" width="84" height="30" fill="#3A86FF" fill-opacity=".15" stroke="none"/>
  <rect x="158" y="230" width="84" height="30" opacity=".5"/>
  <rect x="178" y="278" width="44" height="3" rx="1.5" fill="currentColor" opacity=".5" stroke="none"/>
  <!-- side label -->
  <text x="60" y="155" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" opacity=".55">FEED·01</text>
  <line x1="84" y1="153" x2="148" y2="153" opacity=".3"/>
</svg>`,

    /* ----- network / constellation ----- */
    network: () => `
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
  <!-- connecting lines under nodes -->
  <g opacity=".45">
    <line x1="200" y1="150" x2="100" y2="80"/>
    <line x1="200" y1="150" x2="100" y2="220"/>
    <line x1="200" y1="150" x2="300" y2="80"/>
    <line x1="200" y1="150" x2="300" y2="220"/>
    <line x1="200" y1="150" x2="60"  y2="150"/>
    <line x1="200" y1="150" x2="340" y2="150"/>
    <line x1="100" y1="80"  x2="300" y2="80"  opacity=".5" stroke-dasharray="2 3"/>
    <line x1="100" y1="220" x2="300" y2="220" opacity=".5" stroke-dasharray="2 3"/>
  </g>
  <!-- outer nodes -->
  <g stroke-width="1.5">
    <circle cx="100" cy="80"  r="13" fill="#234E70" fill-opacity=".15"/>
    <circle cx="100" cy="220" r="13" fill="#234E70" fill-opacity=".15"/>
    <circle cx="300" cy="80"  r="13" fill="#234E70" fill-opacity=".15"/>
    <circle cx="300" cy="220" r="13" fill="#234E70" fill-opacity=".15"/>
    <circle cx="60"  cy="150" r="10" fill="#234E70" fill-opacity=".15"/>
    <circle cx="340" cy="150" r="10" fill="#234E70" fill-opacity=".15"/>
  </g>
  <g fill="currentColor" stroke="none">
    <circle cx="100" cy="80"  r="2.5"/>
    <circle cx="100" cy="220" r="2.5"/>
    <circle cx="300" cy="80"  r="2.5"/>
    <circle cx="300" cy="220" r="2.5"/>
    <circle cx="60"  cy="150" r="2"/>
    <circle cx="340" cy="150" r="2"/>
  </g>
  <!-- central hub -->
  <circle cx="200" cy="150" r="26" stroke-width="1.5" fill="#3A86FF" fill-opacity=".28"/>
  <circle cx="200" cy="150" r="14" stroke-width="1"/>
  <circle cx="200" cy="150" r="6" fill="#3A86FF" stroke="none"/>
  <!-- coordinate labels -->
  <text x="42" y="155" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" opacity=".55">N01</text>
  <text x="358" y="155" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" opacity=".55" text-anchor="end">N06</text>
  <text x="190" y="195" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" opacity=".7">HUB</text>
</svg>`,

    /* ----- chart / dashboard ----- */
    chart: () => `
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
  <rect x="40" y="40" width="320" height="220" rx="3" stroke-width="1.5"/>
  <line x1="40" y1="68" x2="360" y2="68"/>
  <line x1="55" y1="54" x2="120" y2="54"/>
  <text x="345" y="58" font-family="ui-monospace, monospace" font-size="7" fill="#3A86FF" text-anchor="end" stroke="none">● LIVE</text>
  <!-- stat tiles -->
  <g>
    <rect x="55"  y="84" width="92" height="46"/>
    <rect x="153" y="84" width="92" height="46"/>
    <rect x="251" y="84" width="92" height="46"/>
  </g>
  <line x1="62"  y1="95"  x2="105" y2="95"  opacity=".5"/>
  <line x1="160" y1="95"  x2="200" y2="95"  opacity=".5"/>
  <line x1="258" y1="95"  x2="305" y2="95"  opacity=".5"/>
  <text x="62"  y="120" font-family="Georgia, serif" font-size="16" fill="currentColor" stroke="none">99.9%</text>
  <text x="160" y="120" font-family="Georgia, serif" font-size="16" fill="currentColor" stroke="none">142ms</text>
  <text x="258" y="120" font-family="Georgia, serif" font-size="16" fill="#3A86FF" stroke="none">8.2k</text>
  <!-- chart area -->
  <line x1="55" y1="240" x2="345" y2="240"/>
  <line x1="55" y1="148" x2="55" y2="240"/>
  <g opacity=".25">
    <line x1="55" y1="165" x2="345" y2="165"/>
    <line x1="55" y1="190" x2="345" y2="190"/>
    <line x1="55" y1="215" x2="345" y2="215"/>
  </g>
  <!-- bars -->
  <g fill="#3A86FF" fill-opacity=".28" stroke="none">
    <rect x="65"  y="205" width="20" height="35"/>
    <rect x="93"  y="190" width="20" height="50"/>
    <rect x="121" y="180" width="20" height="60"/>
    <rect x="149" y="170" width="20" height="70"/>
    <rect x="177" y="178" width="20" height="62"/>
    <rect x="205" y="165" width="20" height="75"/>
  </g>
  <g fill="#3A86FF" stroke="none">
    <rect x="233" y="155" width="20" height="85"/>
    <rect x="261" y="160" width="20" height="80"/>
    <rect x="289" y="170" width="20" height="70"/>
    <rect x="317" y="155" width="20" height="85"/>
  </g>
  <!-- trend overlay -->
  <polyline points="75,215 103,200 131,190 159,180 187,188 215,175 243,165 271,170 299,180 327,165"
    stroke-width="1.5" opacity=".7"/>
  <g fill="currentColor" stroke="none">
    <circle cx="75"  cy="215" r="2"/>
    <circle cx="159" cy="180" r="2"/>
    <circle cx="243" cy="165" r="2"/>
    <circle cx="327" cy="165" r="2"/>
  </g>
  <!-- y-axis tick labels -->
  <text x="48" y="170" font-family="ui-monospace, monospace" font-size="6" fill="currentColor" opacity=".55" text-anchor="end" stroke="none">100</text>
  <text x="48" y="220" font-family="ui-monospace, monospace" font-size="6" fill="currentColor" opacity=".55" text-anchor="end" stroke="none">50</text>
</svg>`,

    /* ----- shop / storefront ----- */
    shop: () => `
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
  <!-- ground -->
  <line x1="20" y1="244" x2="380" y2="244" stroke-width="1.5"/>
  <line x1="20" y1="252" x2="380" y2="252" opacity=".3"/>
  <!-- main building -->
  <rect x="100" y="104" width="200" height="140" stroke-width="1.5"/>
  <!-- roof -->
  <polygon points="88,104 200,42 312,104" stroke-width="1.5"/>
  <line x1="200" y1="42" x2="200" y2="104" opacity=".4"/>
  <!-- awning -->
  <line x1="155" y1="156" x2="245" y2="156" stroke="#3A86FF" stroke-width="2"/>
  <line x1="155" y1="156" x2="165" y2="166" stroke="#3A86FF" opacity=".7"/>
  <line x1="245" y1="156" x2="235" y2="166" stroke="#3A86FF" opacity=".7"/>
  <line x1="160" y1="156" x2="160" y2="166" stroke="#3A86FF" opacity=".5"/>
  <line x1="170" y1="156" x2="170" y2="166" stroke="#3A86FF" opacity=".5"/>
  <line x1="180" y1="156" x2="180" y2="166" stroke="#3A86FF" opacity=".5"/>
  <line x1="190" y1="156" x2="190" y2="166" stroke="#3A86FF" opacity=".5"/>
  <line x1="200" y1="156" x2="200" y2="166" stroke="#3A86FF" opacity=".5"/>
  <line x1="210" y1="156" x2="210" y2="166" stroke="#3A86FF" opacity=".5"/>
  <line x1="220" y1="156" x2="220" y2="166" stroke="#3A86FF" opacity=".5"/>
  <line x1="230" y1="156" x2="230" y2="166" stroke="#3A86FF" opacity=".5"/>
  <line x1="240" y1="156" x2="240" y2="166" stroke="#3A86FF" opacity=".5"/>
  <!-- door -->
  <rect x="178" y="176" width="44" height="68"/>
  <line x1="200" y1="176" x2="200" y2="244" opacity=".4"/>
  <circle cx="214" cy="212" r="1.5" fill="currentColor" stroke="none"/>
  <circle cx="186" cy="212" r="1.5" fill="currentColor" stroke="none"/>
  <!-- left window -->
  <rect x="120" y="128" width="42" height="40"/>
  <line x1="141" y1="128" x2="141" y2="168" opacity=".4"/>
  <line x1="120" y1="148" x2="162" y2="148" opacity=".4"/>
  <!-- right window -->
  <rect x="238" y="128" width="42" height="40"/>
  <line x1="259" y1="128" x2="259" y2="168" opacity=".4"/>
  <line x1="238" y1="148" x2="280" y2="148" opacity=".4"/>
  <!-- sign on roof -->
  <rect x="155" y="60" width="90" height="22"/>
  <text x="200" y="76" font-family="Georgia, serif" font-weight="700" font-size="11" fill="currentColor" text-anchor="middle" stroke="none">OPEN</text>
  <!-- dim line -->
  <line x1="100" y1="262" x2="180" y2="262" stroke-width=".5" opacity=".5"/>
  <line x1="220" y1="262" x2="300" y2="262" stroke-width=".5" opacity=".5"/>
  <line x1="100" y1="259" x2="100" y2="265" opacity=".5"/>
  <line x1="300" y1="259" x2="300" y2="265" opacity=".5"/>
  <text x="200" y="266" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" opacity=".6" text-anchor="middle" stroke="none">200·0"</text>
  <!-- coordinate tick -->
  <text x="46" y="36" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" opacity=".55" stroke="none">A1</text>
</svg>`,

    /* ----- timeline / backups ----- */
    timeline: () => {
      const days = [];
      for (let i = 0; i < 14; i++) {
        const x = 50 + i * 22;
        days.push(`<line x1="${x}" y1="146" x2="${x}" y2="154" opacity=".5"/>`);
        days.push(`<text x="${x}" y="166" font-family="ui-monospace, monospace" font-size="5.5" fill="currentColor" opacity=".55" text-anchor="middle" stroke="none">${i + 1}</text>`);
      }
      // snapshot dots
      const snaps = [0, 1, 2, 3, 5, 7, 9, 11, 13];
      const dots = snaps.map(i => {
        const x = 50 + i * 22;
        const recent = i >= 11;
        return `<circle cx="${x}" cy="150" r="${recent ? 4 : 3}" fill="${recent ? '#3A86FF' : '#234E70'}" stroke="none"/>`;
      }).join('');
      // stacked snapshot rectangles at top
      const stacks = [];
      for (let i = 0; i < 6; i++) {
        const y = 50 + i * 11;
        const w = 90 + i * 10;
        stacks.push(`<rect x="${250 - i * 5}" y="${y}" width="${w}" height="9" stroke-width="${i === 0 ? '1.5' : '1'}" opacity="${1 - i * 0.12}"/>`);
        stacks.push(`<text x="${260 - i * 5}" y="${y + 7}" font-family="ui-monospace, monospace" font-size="6" fill="currentColor" opacity=".55" stroke="none">snap-${(2026 - i).toString()}</text>`);
      }
      return `
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
  <!-- header -->
  <line x1="50" y1="36" x2="350" y2="36" stroke-width="1.5"/>
  <text x="50" y="30" font-family="ui-monospace, monospace" font-size="7" fill="currentColor" opacity=".7" stroke="none">BACKUP·TIMELINE</text>
  <text x="350" y="30" font-family="ui-monospace, monospace" font-size="7" fill="#3A86FF" text-anchor="end" stroke="none">14 DAYS</text>
  <!-- stack of snapshots -->
  ${stacks.join('')}
  <!-- timeline axis -->
  <line x1="40" y1="150" x2="360" y2="150" stroke-width="1.5"/>
  ${days.join('')}
  ${dots}
  <!-- 'now' marker -->
  <line x1="336" y1="138" x2="336" y2="180" stroke="#3A86FF" stroke-dasharray="2 2"/>
  <text x="336" y="195" font-family="ui-monospace, monospace" font-size="7" fill="#3A86FF" text-anchor="middle" stroke="none">NOW</text>
  <!-- legend -->
  <circle cx="50" cy="220" r="3" fill="#234E70" stroke="none"/>
  <text x="58" y="223" font-family="ui-monospace, monospace" font-size="7" fill="currentColor" opacity=".7" stroke="none">archived</text>
  <circle cx="130" cy="220" r="3" fill="#3A86FF" stroke="none"/>
  <text x="138" y="223" font-family="ui-monospace, monospace" font-size="7" fill="currentColor" opacity=".7" stroke="none">recent</text>
  <text x="50" y="248" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" opacity=".55" stroke="none">retention · 30d · point-in-time restore</text>
</svg>`;
    },

    /* ----- security shield ----- */
    shield: () => `
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
  <!-- log lines on left -->
  <g opacity=".5" font-family="ui-monospace, monospace" font-size="6.5" fill="currentColor" stroke="none">
    <text x="30" y="60">23:14:02  ✓  patch applied</text>
    <text x="30" y="76">23:14:55  ✓  cert renewed</text>
    <text x="30" y="92">23:15:18  ✓  scan clean</text>
    <text x="30" y="108">23:16:01  ✓  ssl handshake</text>
    <text x="30" y="124">23:17:33  ✓  rate limit ok</text>
    <text x="30" y="140">23:18:09  ✓  patch applied</text>
    <text x="30" y="156">23:19:44  ✓  scan clean</text>
    <text x="30" y="172">23:20:21  ✓  cert renewed</text>
    <text x="30" y="188">23:21:08  ✓  patch applied</text>
    <text x="30" y="204">23:22:55  ✓  ssl handshake</text>
    <text x="30" y="220">23:23:31  ✓  scan clean</text>
    <text x="30" y="236">23:24:17  ✓  patch applied</text>
  </g>
  <!-- shield -->
  <path d="M 290 60 L 350 90 V 160 C 350 200 330 230 290 245 C 250 230 230 200 230 160 V 90 Z"
    stroke-width="1.5" fill="#3A86FF" fill-opacity=".18"/>
  <path d="M 290 80 L 333 102 V 158 C 333 188 320 210 290 222 C 260 210 247 188 247 158 V 102 Z"
    opacity=".6"/>
  <!-- checkmark -->
  <polyline points="265,150 285,170 315,135" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke="#3A86FF"/>
  <!-- label -->
  <text x="290" y="275" font-family="ui-monospace, monospace" font-size="7" fill="currentColor" opacity=".7" text-anchor="middle" stroke="none">CVE·MONITORED</text>
  <!-- coordinate tick -->
  <text x="30" y="36" font-family="ui-monospace, monospace" font-size="7" fill="currentColor" opacity=".7" stroke="none">SECURITY·LOG</text>
  <line x1="30" y1="42" x2="200" y2="42" opacity=".4"/>
</svg>`,
  };

  // ----------------------------------------------------------
  // Renderer: replace any element with [data-art] with the SVG
  // ----------------------------------------------------------
  function render() {
    document.querySelectorAll('[data-art]').forEach(el => {
      if (el.dataset.artRendered === 'true') return;
      const name = el.dataset.art;
      const fn = ART[name];
      if (!fn) {
        console.warn('Unknown art:', name);
        return;
      }
      el.innerHTML = fn();
      el.dataset.artRendered = 'true';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
