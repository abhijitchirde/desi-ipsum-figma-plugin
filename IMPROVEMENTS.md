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
- [x] UI: "Shakespeare" button next to "Lorem ipsum" in one row; label "or western classics" (renamed from "or the classics": Sanskrit and Tamil are officially classical languages too, so plain "classics" was ambiguous)
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
- [x] Committed and pushed as `ba876cb`

## Phase 10: New languages (Nepali, Assamese, Santali, Manipuri)

Decision: I collect the word banks from each language's Wikipedia (ne, as, sat, mni; CC BY-SA, credited in the README) and wire everything else.

How the word banks were built (scratch scripts, not in the repo):

- 100 random main-namespace articles per language, fetched as wikitext (2 API calls per language; a first parallel attempt got rate-limited, so the fetch was redone sequentially)
- Stripped templates, refs, tables, section headings ("References"…) and category/file links
- Kept only tokens in the language's own script (no digits, Latin or punctuation), 2–18 characters
- Kept words that appear in **2+ different articles** (drops one-off names and junk); up to 800 unique per language
- Common words repeated up to 4× for natural frequency, then shuffled

| Language | Bank size | Unique |
|---|---|---|
| Nepali | 1765 | 800 |
| Assamese | 1889 | 800 |
| Santali | 1849 | 800 |
| Manipuri | 1300 | 778 |

| Language | Script | Font | Full stop | Comma |
|---|---|---|---|---|
| Nepali (नेपाली) | Devanagari | Mukta | । | , |
| Assamese (অসমীয়া) | Bengali-Assamese | Noto Sans Bengali (covers ৰ, ৱ) | । | , |
| Santali (ᱥᱟᱱᱛᱟᱲᱤ) | Ol Chiki | Noto Sans Ol Chiki | ᱾ | none |
| Manipuri (ꯃꯤꯇꯩꯂꯣꯟ) | Meitei Mayek | Noto Sans Meetei Mayek | ꯫ | none |

- [x] Config entries for the 4 languages (alphabetical in the grid)
- [x] Word banks collected from Wikipedia and added at the end of `src/data/wordSpace.ts`, with a source comment on each
- [-] Auto-hide languages without words (dropped: not needed since all 4 banks are filled)
- [x] Plugin height adapts to the number of language rows (4 rows = 410px, +34px per extra row; now 5 rows = 444px)
- [x] Generator tests pass for all 17 generators; sample output has no Latin/digits, right full stops (। ᱾ ꯫)
- [x] Headless check with all 15 languages: 5 full rows, no clipped labels, content needs 437px of 444px
- [x] README: 15 languages, list updated, Credits section (Wikipedia CC BY-SA, Shakespeare public domain)
- [x] Issue: Santali and Manipuri text not rendering in Figma (reported by you). Both Noto fonts are on Figma's font list, so the likely cause is a failed font load that kept the old font silently
  - [x] Fallback fonts: Noto first, then Windows' Nirmala UI / Nirmala Text (checked locally: both contain Ol Chiki and Meetei Mayek)
  - [x] If no font loads, show a toast naming the fonts tried, instead of failing silently
  - [x] Retested in Figma (by you): working
- [x] Manual check in Figma (by you): the 3 Noto fonts load (Noto Sans Bengali, Noto Sans Ol Chiki, Noto Sans Meetei Mayek); if one doesn't, the layer keeps its current font
- [-] Native-speaker check (dropped: none available. Low risk: every word appears in 2+ real Wikipedia articles, ᱾ and ꯫ are the standard Unicode full stops, and the plugin's disclaimer says the text has no literal meaning)

## Phase 11: Fill to fit

Decision: a "Fill text box" option in the type dropdown (the number box is disabled). Each layer is filled according to its text resizing setting:

| Layer resizing | Fills to |
|---|---|
| Fixed size / Truncate | the box (width and height stay the same) |
| Auto height | its current height |
| Auto width | its current width, on one line |

- [x] `Mode` = words / sentences / paragraphs / fill (shared by UI and plugin)
- [x] Fill algorithm: generate enough paragraphs to overflow (doubling), then binary-search the longest word prefix that fits; end on a clean full stop (no trailing comma); at least 1 word; capped at 3000 words
- [x] Measure with the box temporarily set to auto height (or auto width), then restore the original resizing and size
- [x] Apply the language font before measuring (the font changes the size)
- [x] Classic opening line still goes on the first layer
- [x] UI: "Fill text box" option; number input disabled while it's selected

## Phase 12: Quick actions + Regenerate

Decision: Figma quick actions (manifest `parameters`, `parameterOnly: false`), so a normal run still opens the window, plus a "Regenerate text" relaunch button on filled layers.

- [x] Restructure startup around `figma.on("run")`: no parameters → open the UI; parameters → generate and close with a message; `regenerate` command → regenerate the selection
- [x] Parameter `Language`: suggestions filtered by English or native name
- [x] Parameter `Amount` (optional, default 5 sentences): suggestions like "Fill text box", "5 words", "3 sentences", "1 paragraph"; typing a number suggests that number of each; free text like "10 words" / "fill" is parsed
- [x] Every filled layer stores its settings (`setPluginData`) and gets `setRelaunchData` → "Regenerate text" button in Figma's right panel; regenerating reuses each layer's own language and amount
- [x] Manifest: `parameters`, `parameterOnly: false`, `relaunchButtons`
- [x] Build passes, no type errors in `src/`
- [x] Pure tests (fake box = character limit): fill for every language and box size from 3 to 9000 chars fits, ends on a full stop with no trailing comma, never ends on the start of a new paragraph, one-line fill has no line breaks, Lorem opening kept, under 40 measurements; uses ~99% of a 300-char box; cap ~500 words (approximate: a paragraph break joins two words into one chunk)
- [x] Amount parsing/suggestion tests ("10 words", "3s", "2 para", "7", "fi", "3sen" → "3 sentences")
- [x] Manual check in Figma (by you): Regenerate button shows in the right panel and works
- [x] Manual check in Figma (by you): fill in all three resizing modes (fixed, auto height, auto width); quick actions flow (language → amount, typed amounts, default); normal run still opens the window

## Phase 13: Community page assets (`community-09112026/`)

- [x] 4 icon options (Cursor, Scripts, Placeholder, Shirorekha) at 128 px (upload size) and 512 px, plus a comparison sheet at 64/32/16 px on light and dark
- [x] New cover (1920×960) with the real plugin UI in light and dark, the 15 native language names, and the new features
- [x] 4 carousel slides (1920×1080): languages with real generated text, fill text box (actually fitted in the browser), quick actions + regenerate, western classics + themes
- [x] New page description + tagline options (`community-09112026/description.md`)
- [x] `npm run community` re-renders everything (`-- --icon N` picks the icon used on the cover/slides)
- [x] Icon chosen: option 1 (Cursor). Cover and slides already use it
- [x] Folder renamed to `community-09112026` (dated, so later redesigns can sit alongside it)
- [ ] Upload icon, cover, slides and text to the Community page once Phases 11–12 are checked in Figma

---

## Backlog (later, not in this pass)

- [x] Fill to fit (moved to Phase 11)
- [x] Quick actions + Regenerate button (moved to Phase 12)
- [ ] Remember last settings with `figma.clientStorage`
- [ ] Select a frame to fill all text layers inside it
- [ ] Character-count mode for buttons and labels
- [ ] Native numerals (०-९, ০-৯ …) option
- [ ] No selection: create a new text node in the viewport
- [ ] Show native script names on the buttons (tooltip done; visible label still open)
- [ ] More Indian languages: Konkani, Maithili next (Urdu, Kashmiri, Sindhi skipped: right-to-left)
- [ ] Unit test setup (e.g. vitest) for `generator.ts`
- [ ] `tsconfig`: `strict: true`, and fix the `@types/node` vs Figma typings clash (27 errors with plain `tsc`, all in node_modules; webpack build unaffected)
- [-] Clean stray entries in the word bank (dropped: word bank stays as-is)
