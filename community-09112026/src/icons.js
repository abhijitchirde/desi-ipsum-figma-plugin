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
