// Pure helpers for "how much text": validation, parsing typed text, and quick-action suggestions.

import { Amount, MAX_COUNT, Mode, MODES, Unit, describeAmount } from "./data/languages";

/** Returns an error message, or null if the amount is valid. */
export function validateAmount(amount: { mode: unknown; count: unknown }): string | null {
  const mode = amount.mode as Mode;
  if (MODES.indexOf(mode) === -1) return "Please choose words, sentences, paragraphs or fill";
  if (mode === "fill") return null;
  const count = Number(amount.count);
  if (!Number.isInteger(count)) return "Please enter a number";
  if (count <= 0) return "Please enter a number greater than 0";
  if (count > MAX_COUNT[mode]) return `Please enter at most ${MAX_COUNT[mode]} ${mode}`;
  return null;
}

const UNIT_BY_LETTER: Record<string, Unit> = { w: "words", s: "sentences", p: "paragraphs" };

/** Parses typed text like "10 words", "3s", "2 para", "fill". Returns null if it can't. */
export function parseAmount(text: string): Amount | null {
  const q = text.trim().toLowerCase();
  if (q === "") return null;
  if ("fill".startsWith(q) || q.startsWith("fill")) return { mode: "fill", count: 0 };
  const match = /^(\d+)\s*([a-z]*)$/.exec(q);
  if (!match) return null;
  const count = parseInt(match[1], 10);
  const unit = match[2] ? UNIT_BY_LETTER[match[2][0]] : "sentences";
  return unit ? { mode: unit, count } : null;
}

export interface AmountSuggestion {
  name: string;
  data: Amount;
}

const DEFAULT_SUGGESTIONS: Amount[] = [
  { mode: "fill", count: 0 },
  { mode: "words", count: 5 },
  { mode: "sentences", count: 3 },
  { mode: "sentences", count: 5 },
  { mode: "paragraphs", count: 1 },
  { mode: "paragraphs", count: 3 },
];

/** Suggestions for the quick-actions "Amount" field, based on what the user has typed so far. */
export function amountSuggestions(query: string): AmountSuggestion[] {
  const q = query.trim().toLowerCase();
  const typedNumber = /^(\d+)/.exec(q);

  let amounts: Amount[];
  if (typedNumber) {
    const count = parseInt(typedNumber[1], 10);
    amounts = (["words", "sentences", "paragraphs"] as Unit[])
      .map((mode) => ({ mode, count }))
      .filter((a) => count > 0 && count <= MAX_COUNT[a.mode]);
  } else {
    amounts = DEFAULT_SUGGESTIONS;
  }

  // Compare without spaces so "3sen" matches "3 sentences".
  const compact = (s: string) => s.toLowerCase().replace(/\s+/g, "");
  return amounts
    .map((data) => ({ name: describeAmount(data), data }))
    .filter((s) => compact(s.name).indexOf(compact(q)) !== -1);
}
