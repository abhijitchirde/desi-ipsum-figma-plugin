// Fill-to-fit: find the longest generated text that still fits a box.
// Pure: the caller provides `fits`, which sets the text on the layer and measures it.

import type { LanguageConfig } from "./data/languages";

export interface FitOptions {
  /** Generates text; a bigger `size` gives (roughly) twice as much text as half that size. */
  generate: (size: number) => string;
  /** Puts the text on the layer and reports whether it fits. */
  fits: (text: string) => boolean;
  lang: LanguageConfig;
  /** Safety cap for very large boxes. */
  maxWords?: number;
}

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** First `k` space-separated tokens, ending cleanly on a full stop (no trailing comma or half paragraph break). */
export function cutText(tokens: string[], k: number, lang: LanguageConfig): string {
  const kept = tokens.slice(0, Math.max(1, k));
  const last = kept[kept.length - 1];
  // A token can span a paragraph break ("end.\n\nNext"); never end on the start of a new paragraph.
  if (kept.length > 1 && last.indexOf("\n") !== -1) kept[kept.length - 1] = last.slice(0, last.indexOf("\n"));

  let text = kept.join(" ").replace(/\s+$/, "");
  if (lang.comma && text.endsWith(lang.comma)) text = text.slice(0, -lang.comma.length);

  const endings = [lang.fullStop, lang.finalStop, ".", "?", "!"].filter((s): s is string => !!s);
  if (!endings.some((end) => text.endsWith(end))) text += lang.finalStop ?? lang.fullStop;
  return text;
}

export function fitText({ generate, fits, lang, maxWords = 3000 }: FitOptions): string {
  // 1. Grow the text (doubling) until it overflows the box or hits the cap.
  let size = 1;
  let text = generate(size);
  while (fits(text) && countWords(text) < maxWords) {
    size *= 2;
    text = generate(size);
  }

  const tokens = text.split(" ");
  const limit = Math.min(tokens.length, maxWords);
  const cut = (k: number) => cutText(tokens, k, lang);

  if (fits(cut(limit))) return cut(limit); // huge box: capped
  if (!fits(cut(1))) return cut(1); // tiny box: one word anyway

  // 2. Binary search the longest prefix that fits: cut(lo) fits, cut(hi) doesn't.
  let lo = 1;
  let hi = limit;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (fits(cut(mid))) lo = mid;
    else hi = mid;
  }
  return cut(lo);
}
