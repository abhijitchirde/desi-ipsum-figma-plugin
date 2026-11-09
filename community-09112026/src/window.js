// A plugin window (title bar + the REAL plugin UI from dist/ui.html in an iframe).
// Run `npm run build` at the repo root first so dist/ui.html is current.
//
// The plugin UI asks its parent for the saved theme ("get-theme-pref"); we answer with the
// theme this window should show, so the same real UI renders in light or dark.

(function () {
  const UI_URL = "../../dist/ui.html";
  const UI_WIDTH = 272;
  const UI_HEIGHT = 444;
  const themeFor = new Map(); // iframe window -> "light" | "dark"

  window.addEventListener("message", (event) => {
    const msg = event.data && event.data.pluginMessage;
    if (msg && msg.type === "get-theme-pref" && themeFor.has(event.source)) {
      event.source.postMessage({ pluginMessage: { type: "theme-pref", value: themeFor.get(event.source) } }, "*");
    }
  });

  /**
   * @param {{ theme?: "light"|"dark", icon?: number, scale?: number }} opts
   */
  window.pluginWindow = function (opts) {
    const theme = (opts && opts.theme) || "light";
    const scale = (opts && opts.scale) || 1;
    const icon = (opts && opts.icon) || 1;

    const win = document.createElement("div");
    win.className = "pw pw-" + theme;
    win.style.width = UI_WIDTH * scale + "px";

    const bar = document.createElement("div");
    bar.className = "pw-bar";
    bar.style.height = 40 * scale + "px";
    bar.style.fontSize = 13 * scale + "px";
    bar.style.padding = "0 " + 12 * scale + "px";
    bar.appendChild(window.renderIcon(icon, 18 * scale, { rounded: true }));
    const title = document.createElement("span");
    title.textContent = "Desi Ipsum";
    bar.appendChild(title);
    const close = document.createElement("span");
    close.className = "pw-close";
    close.textContent = "✕";
    bar.appendChild(close);
    win.appendChild(bar);

    const body = document.createElement("div");
    body.className = "pw-body";
    body.style.width = UI_WIDTH * scale + "px";
    body.style.height = UI_HEIGHT * scale + "px";
    const frame = document.createElement("iframe");
    frame.src = UI_URL;
    frame.width = UI_WIDTH;
    frame.height = UI_HEIGHT;
    frame.style.transform = "scale(" + scale + ")";
    frame.addEventListener("load", () => {
      themeFor.set(frame.contentWindow, theme);
      // Also push it, in case the UI asked before we knew this window.
      frame.contentWindow.postMessage({ pluginMessage: { type: "theme-pref", value: theme } }, "*");
    });
    // Register early too, in case the UI asks before "load" fires.
    setTimeout(() => frame.contentWindow && themeFor.set(frame.contentWindow, theme), 0);
    body.appendChild(frame);
    win.appendChild(body);
    return win;
  };
})();
