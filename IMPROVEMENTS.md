# v4 improvements: plan & checklist

Branch: `v4-react-improvement` (created from `main` with `v3-react` merged in; long-lived, not to be deleted).

Legend: `[x]` done · `[ ]` planned · `[-]` dropped

---

## Phase 0: Branch setup

- [x] Compare `v3-react` and `main`. They had diverged: main had 13 dependabot/merge commits (package-lock only), v3 had 1 README commit
- [x] Create `v4-react-improvement` from `main` and merge `v3-react`, so the branch has both

## Phase 1: Foundation refactor

Goal: one config map instead of if/else chains, and a pure generator that's easy to test.

- [x] `src/data/languages.ts`: shared config per language (label, native name, font, full stop, final stop, comma, capitalise, UI group) plus unit limits
- [x] `src/generator.ts`: pure text generator (words / sentences / paragraphs) driven by the config, with no Figma API calls
- [x] `src/code.ts`: rewrite to use the config + generator

## Phase 2: Bug fixes & correctness

- [x] Await font loading before editing text (fixes the possible "unloaded font" error on first click); cache loaded fonts
- [x] Validate count/type/language **once** per click, not once per selected node (no repeated toasts)
- [x] Mixed selection: fill the text layers, skip the others, show one summary toast
- [x] try/catch per node so one bad layer doesn't stop the rest; skip layers with missing fonts
- [x] Sanskrit: use the real double danda `॥` (U+0965) instead of two `।`
- [x] Script-correct fonts: Hind Siliguri (Bangla), Hind Vadodara (Gujarati), Hind Madurai (Tamil), Hind Guntur (Telugu), Noto Sans Kannada, Noto Sans Malayalam; keep Mukta / Mukta Mahee / Baloo Bhaina 2
- [x] Keep the layer's font style (e.g. Bold stays Bold) when the target family has it; otherwise use Regular; if the family can't load, keep the existing font
- [x] Rename a layer only if it's auto-named or was named by this plugin (don't overwrite names users gave their layers)
- [x] Cap counts (words 2000, sentences 300, paragraphs 50) so a huge number can't freeze Figma
- [x] Remove dead code: unused `checkBox` close-plugin path, unused `error` postMessage, fake `get-theme` handler, unused `PageHeading`
- [x] UI state: replace the mutable `var inputCopy` with React state; make `Inputs` a controlled component

## Phase 3: Theming

- [x] `figma.showUI(..., { themeColors: true })` so the UI follows Figma's real light/dark theme
- [x] Turn CSS colour variables into low-priority fallbacks (`:where(:root)`) so Figma's injected values win
- [x] Remove the manual `ThemeToggle` + `useFigmaTheme` hook (no longer needed)
- [x] Update `FIGMA_DESIGN_SYSTEM.md` theme sections to match

## Phase 4: Lorem ipsum generator

Decision: the standard opening is "Lorem ipsum dolor sit amet, consectetur adipiscing elit." (scrambled Cicero, *De finibus*). The major generators start with it by default, so we do too, but **only the first selected layer** gets it. Other layers in the same click are fully random, so a set of cards doesn't all look the same.

- [x] Add a `Lorem` word array at the end of `src/data/wordSpace.ts`
- [x] Generator: Latin capitalisation, `.` and `,` punctuation, classic opening for the first layer
  - Words mode: starts "Lorem ipsum dolor sit amet…" (cut short if fewer words are requested)
  - Sentences / paragraphs: first sentence is the full classic opening line
- [x] Keep the user's existing font for Lorem ipsum (Latin works in any font)
- [x] UI: new button group below the Indian languages with a "Lorem ipsum" button; increase plugin height to fit
- [x] README: mention Lorem ipsum

## Phase 5: Text realism (small)

- [x] Occasional comma inside longer sentences (not Sanskrit)
- [x] Avoid the same word twice in a row

## Extra fixes found along the way

- [x] Upgrade `@figma/plugin-typings` from `*` (installed 1.39.1, from 2021) to `^1.142.0`; the old typings had no `themeColors`
- [x] Remove `src/types/global.d.ts` (its incorrect `window.parent` override caused the only type errors in `src/`)
- [x] Language buttons show the native script name as a tooltip

## Phase 6: Verify

- [x] `npm run build` passes with no type errors in `src/`
- [x] Scratch test of the generator: punctuation per language, counts, Lorem opening, no empty output, no repeated adjacent words
- [x] Manual check in Figma (by you): each language, mixed selection, Bold layer, dark theme, Lorem on several layers, plugin height (505px) fits without clipping
- [x] Committed and pushed as `235a8fb`

## Phase 7: Shakespeare generator

Decision: one English option in the classic group, using a word bank built from well-known public-domain Shakespeare passages (Hamlet, Macbeth, As You Like It, Julius Caesar, Richard III, The Merchant of Venice, Sonnet 18). Common words are kept with their natural repeats, so the output reads like English. Only the first layer starts with a famous line, picked **at random from 15 single-sentence lines**, so generations don't all open with the overused "To be, or not to be". Lorem ipsum keeps its single standard opening, because that one is the convention.

- [x] Move the classic opening line from hard-coded Lorem text into the language config (`opening`), so each classic generator has its own
- [x] Add a `Shakespeare` word array at the end of `src/data/wordSpace.ts`
- [x] Config entry: keeps the layer's font, capitalised sentences, `.` and `,`
- [x] UI: "Shakespeare" button next to "Lorem ipsum" in one row; label "or the classics"
- [x] README: mention Shakespeare
- [x] Generator test: Shakespeare opening, and Lorem still works
- [x] `opening` accepts a list; Shakespeare picks one of 15 famous lines at random (question lines keep their "?")
- [x] Test: every opening gets used, single-sentence openings keep the sentence count right
- [x] Generator strips punctuation stuck to word-bank entries (a Sanskrit entry had a trailing comma, so commas could appear despite Sanskrit having none)

## Phase 8: Manual theme override

Decision: one footer button that cycles **Auto → Light → Dark**. Auto follows Figma (`themeColors`). Light/Dark force our own palette. The choice is saved per user in `figma.clientStorage`.

- [x] CSS: `html[data-theme="light"]` / `html[data-theme="dark"]` palettes (higher specificity than Figma's injected `:root` values); no attribute = Auto
- [x] Plugin: `get-theme-pref` / `set-theme-pref` messages backed by `figma.clientStorage`
- [x] UI: `useThemePreference` hook + `ThemeToggle` button (🌗 Auto, ☀️ Light, 🌙 Dark) in the footer next to the disclaimer
- [x] Update `FIGMA_DESIGN_SYSTEM.md` theme section
- [x] Build passes, no type errors in `src/`
- [x] Manual check in Figma (by you): cycle all three theme modes in both Figma themes; the choice survives reopening the plugin; Shakespeare + Lorem ipsum fit on one row

## Phase 9: Three-column language buttons

- [x] Indian language buttons in 3 columns (11 buttons: 6 rows → 4); incomplete last row centred
- [x] Fix: older `.buttons-div` gap overrode the grid gap, and padding/border made buttons too wide (`box-sizing: border-box`)
- [x] Plugin size 240×505 → **272×410**: at 240px "Malayalam" was clipped (needs ~59px in Arial, more in Inter; got 57px). At 272px each button has 68px for text
- [x] Classic buttons use the same text size as the grid
- [x] Measured and screenshotted in headless Edge at 272×410: nothing clipped, classic buttons on one row, content fits (403px needed)
- [x] Manual check in Figma (by you), especially with Inter installed

---

## Backlog (later, not in this pass)

- [ ] Fill to fit: fill a fixed-size text box until it overflows
- [ ] Quick actions: manifest `parameters` / `menu` so it runs from the command palette; `setRelaunchData` "Regenerate" button
- [ ] Remember last settings with `figma.clientStorage`
- [ ] Select a frame to fill all text layers inside it
- [ ] Character-count mode for buttons and labels
- [ ] Native numerals (०-९, ০-৯ …) option
- [ ] No selection: create a new text node in the viewport
- [ ] Show native script names on the buttons (tooltip done; visible label still open)
- [ ] More Indian languages: shortlist under discussion (Urdu skipped)
- [ ] Unit test setup (e.g. vitest) for `generator.ts`
- [ ] `tsconfig`: `strict: true`, and fix the `@types/node` vs Figma typings clash (27 errors with plain `tsc`, all in node_modules; webpack build unaffected)
- [-] Clean stray entries in the word bank (dropped: word bank stays as-is)
