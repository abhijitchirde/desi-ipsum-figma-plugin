// Icon options for Desi Ipsum. Each icon is drawn with HTML/CSS inside a square whose
// font-size is 1% of its width, so every measurement below is in "em" = 1% of the icon.
// renderIcon(option, sizePx, { rounded }) returns an element.

window.ICON_OPTIONS = [
  {
    id: 1,
    name: "Cursor",
    note: "A modern refresh of the current icon: text cursor + अ on a richer blue gradient.",
    html: `
      <div class="ic ic1">
        <div class="ic1-glow"></div>
        <div class="ic1-cursor"><i></i><b></b><i></i></div>
        <div class="ic1-letter">अ</div>
      </div>`,
  },
  {
    id: 2,
    name: "Scripts",
    note: "Four scripts, one tile: Devanagari, Bangla, Tamil and Kannada, each in its own colour.",
    html: `
      <div class="ic ic2">
        <span class="ic2-l a">अ</span><span class="ic2-l b">অ</span>
        <span class="ic2-l c">அ</span><span class="ic2-l d">ಅ</span>
      </div>`,
  },
  {
    id: 3,
    name: "Placeholder",
    note: "A text card with skeleton lines: reads as 'placeholder text' at a glance.",
    html: `
      <div class="ic ic3">
        <div class="ic3-card">
          <div class="ic3-head"><span>अ</span><em></em></div>
          <div class="ic3-line w1"></div>
          <div class="ic3-line w2"></div>
          <div class="ic3-line w3"></div>
        </div>
      </div>`,
  },
  {
    id: 4,
    name: "Shirorekha",
    note: "देसी with its headline bar (shirorekha) running edge to edge: typographic and distinctive.",
    html: `
      <div class="ic ic4">
        <div class="ic4-bar"></div>
        <div class="ic4-word">देसी</div>
        <div class="ic4-caret"></div>
      </div>`,
  },

  // ---- Fresh directions (not based on the original icon) ----
  {
    id: 5,
    set: "fresh",
    name: "Di chandrabindu",
    note: "Desi Ipsum's initials, the i dotted with a chandrabindu (ँ): Latin type, made desi, in one mark.",
    html: `
      <div class="ic ic5">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="ic5-saffron" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ffb347" /><stop offset="1" stop-color="#ff7a1f" />
            </linearGradient>
          </defs>
          <g transform="translate(-2 -4)">
            <!-- D -->
            <path d="M25 30 H37 A24 24 0 0 1 37 78 H25 Z" fill="none" stroke="#fff" stroke-width="10" stroke-linejoin="round" />
            <!-- dotless i -->
            <rect x="71" y="47" width="11" height="36" rx="5.5" fill="#fff" />
            <!-- chandrabindu ँ as the i's dot -->
            <path d="M68 31 Q76.5 47 85 31 Q76.5 38.5 68 31 Z" fill="url(#ic5-saffron)" />
            <circle cx="76.5" cy="30.5" r="3.6" fill="url(#ic5-saffron)" />
          </g>
        </svg>
      </div>`,
  },
  {
    id: 6,
    set: "fresh",
    name: "अa specimen",
    note: "A type-specimen tile like the classic 'Aa': Devanagari अ beside a Latin italic a. Editorial and calm.",
    html: `
      <div class="ic ic6">
        <div class="ic6-pair"><span class="d">अ</span><span class="l">a</span></div>
      </div>`,
  },
  {
    id: 7,
    set: "fresh",
    name: "Paisley bubble",
    note: "A paisley (buta) shaped like a text bubble, with placeholder lines inside: marigold on peacock teal.",
    html: `
      <div class="ic ic7">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="ic7-marigold" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stop-color="#ff5f6d" /><stop offset="1" stop-color="#ffc145" />
            </linearGradient>
          </defs>
          <path id="ic7-buta" d="M44 88 C22 88 11 73 11 56 C11 35 28 21 49 20 C60 19.5 68 15 70 9 C71.5 4.5 76 3 79 6.5 C90 18 92 37 86 53 C80 73 64 88 44 88 Z" fill="url(#ic7-marigold)" />
          <path d="M44 88 C22 88 11 73 11 56 C11 35 28 21 49 20 C60 19.5 68 15 70 9 C71.5 4.5 76 3 79 6.5 C90 18 92 37 86 53 C80 73 64 88 44 88 Z"
            transform="translate(48 55) scale(0.82) translate(-48 -55)" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="1.6" />
          <rect x="28" y="46" width="42" height="6" rx="3" fill="#fff" />
          <rect x="28" y="57" width="34" height="6" rx="3" fill="#fff" opacity="0.9" />
          <rect x="28" y="68" width="20" height="6" rx="3" fill="#fff" opacity="0.8" />
        </svg>
      </div>`,
  },
];

window.renderIcon = function (option, size, opts) {
  const def = window.ICON_OPTIONS.find((o) => o.id === Number(option)) || window.ICON_OPTIONS[0];
  const wrap = document.createElement("div");
  wrap.className = "icon-wrap" + (opts && opts.rounded ? " rounded" : "");
  wrap.style.width = size + "px";
  wrap.style.height = size + "px";
  wrap.style.fontSize = size / 100 + "px";
  wrap.innerHTML = def.html;
  return wrap;
};
