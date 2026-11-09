# Community page assets

Everything for the plugin's Figma Community page: icon options, cover, carousel slides and page text.

## What's here

| Path | What it is | Size |
|---|---|---|
| `exports/icons/icon-N-*-128.png` | Plugin icon, 4 options (upload the 128 px one) | 128×128 |
| `exports/icons/icon-N-*-512.png` | Same icons, large preview | 512×512 |
| `exports/icons/icon-options-overview.png` | All 4 options side by side, at 64/32/16 px on light and dark | 1920×1080 |
| `exports/cover-1920x960.png` | Community cover | 1920×960 |
| `exports/slide-1…4-1920x1080.png` | Carousel: languages, fill text box, quick actions + regenerate, classics + themes | 1920×1080 |
| `description.md` | Tagline options and the full page description | — |
| `src/` | HTML/CSS sources for all images | — |
| `render.mjs` | Re-renders every PNG with headless Edge/Chrome | — |

## Icon options

1. **Cursor**: a modern refresh of the current icon (text cursor + अ, blue)
2. **Scripts**: अ অ அ ಅ in four colours on a dark tile
3. **Placeholder**: a text card with skeleton lines, saffron→rose
4. **Shirorekha**: देसी with its headline bar running edge to edge, saffron

Options 1 and 2 stay readable at 16 px (Figma's smallest menu size). Option 4 becomes hard to read there.

**Chosen: option 1 (Cursor).** The cover and slides use it.

Fresh directions (designed from scratch, not from the original icon), compared in `exports/icons/icon-options-fresh-overview.png`:

5. **Di chandrabindu**: a "Di" monogram (Desi Ipsum) whose i is dotted with a chandrabindu (ँ), on deep indigo
6. **अa specimen**: a type-specimen tile, Devanagari अ beside a Latin italic *a*, on warm cream
7. **Paisley bubble**: a paisley (buta) shaped as a text bubble with placeholder lines, marigold on peacock teal

To re-render only the icons (cover and slides untouched): `node community-09112026/render.mjs --icons-only`.

## Re-rendering

```sh
npm run build                          # the cover/slides embed the real plugin UI from dist/
npm run community                      # cover + slides with icon option 1
npm run community -- --icon 2          # …or with another icon option
```

- Needs Edge or Chrome (set `EDGE_PATH` or `CHROME_PATH` if it isn't found) and an internet connection (fonts come from Google Fonts).
- The plugin windows on the cover and slide 4 are the **real plugin UI** (`dist/ui.html`) in an iframe, not mock-ups; the page answers the UI's theme request to show it light or dark.
- `src/samples.js` holds text made by the plugin's own generator. Regenerate it rather than typing text by hand, so the images always show real output.
