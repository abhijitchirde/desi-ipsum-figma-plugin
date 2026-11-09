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
- [ ] More languages: Assamese, Nepali, Konkani, Maithili, Urdu (RTL)
- [ ] Unit test setup (e.g. vitest) for `generator.ts`
- [ ] `tsconfig`: `strict: true`, and fix the `@types/node` vs Figma typings clash (27 errors with plain `tsc`, all in node_modules; webpack build unaffected)
- [-] Clean stray entries in the word bank (dropped: word bank stays as-is)
