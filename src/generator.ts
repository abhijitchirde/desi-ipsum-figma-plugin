// Pure text generator: no Figma API calls, so it can be tested on its own.

import type { LanguageConfig, Unit } from "./data/languages";

export interface GenerateOptions {
  words: string[];
  lang: LanguageConfig;
  unit: Unit;
  count: number;
  /** Start with the language's famous opening line (`lang.opening`), if it has one. */
  classicOpening?: boolean;
  /** Injectable for tests. Defaults to Math.random. */
  random?: () => number;
}

const SENTENCE_WORDS = { min: 4, max: 9 };
const PARAGRAPH_SENTENCES = { min: 4, max: 8 };
const COMMA_CHANCE = 0.35;
const MIN_WORDS_FOR_COMMA = 6;
const TRAILING_PUNCTUATION = /[,.;:!?।॥]+$/;

export function generateText(options: GenerateOptions): string {
  const ctx = new Context(options);
  switch (options.unit) {
    case "words":
      return ctx.wordsBlock(options.count);
    case "sentences":
      return ctx.sentencesBlock(options.count, true);
    case "paragraphs":
      return ctx.paragraphsBlock(options.count);
  }
}

class Context {
  private lastWord = "";
  private openingPending: boolean;

  /** The opening line for this generation, e.g. "Lorem ipsum dolor sit amet, consectetur adipiscing elit." */
  private readonly opening: string;

  constructor(private readonly opts: GenerateOptions) {
    const { opening } = opts.lang;
    // A list of openings: pick one at random so generations don't all start the same way.
    this.opening = Array.isArray(opening) ? opening[Math.floor(this.rand() * opening.length)] ?? "" : opening ?? "";
    this.openingPending = !!opts.classicOpening && this.opening !== "";
  }

  private rand() {
    return (this.opts.random ?? Math.random)();
  }

  private randInt(min: number, max: number) {
    return min + Math.floor(this.rand() * (max - min + 1));
  }

  /** Random word, re-rolling a few times to avoid the same word twice in a row. */
  private word(): string {
    const { words } = this.opts;
    let pick = words[Math.floor(this.rand() * words.length)];
    for (let tries = 0; tries < 3 && pick === this.lastWord && words.length > 1; tries++) {
      pick = words[Math.floor(this.rand() * words.length)];
    }
    this.lastWord = pick;
    // Word banks may contain words with punctuation attached; punctuation is added by the generator.
    return pick.replace(TRAILING_PUNCTUATION, "") || pick;
  }

  private capitalize(text: string) {
    return this.opts.lang.capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  }

  wordsBlock(count: number): string {
    const out: string[] = [];
    if (this.openingPending) {
      this.openingPending = false;
      const openingWords = this.opening.replace(/[.,;:!?]/g, "").split(/\s+/);
      out.push(...openingWords.slice(0, count));
    }
    while (out.length < count) out.push(this.word());
    return this.capitalize(out.join(" "));
  }

  private sentence(stop: string): string {
    if (this.openingPending) {
      this.openingPending = false;
      // The opening line already has its own commas and ending (".", or "?" for a question).
      return /[.!?]$/.test(this.opening) ? this.opening : this.opening + stop;
    }
    const length = this.randInt(SENTENCE_WORDS.min, SENTENCE_WORDS.max);
    const parts: string[] = [];
    for (let i = 0; i < length; i++) parts.push(this.word());

    const { comma } = this.opts.lang;
    if (comma && length >= MIN_WORDS_FOR_COMMA && this.rand() < COMMA_CHANCE) {
      // Keep at least two words on each side of the comma.
      const at = this.randInt(1, length - 3);
      parts[at] += comma;
    }
    return this.capitalize(parts.join(" ")) + stop;
  }

  sentencesBlock(count: number, isBlockEnd: boolean): string {
    const { fullStop, finalStop } = this.opts.lang;
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      const isLast = i === count - 1;
      out.push(this.sentence(isLast && isBlockEnd ? finalStop ?? fullStop : fullStop));
    }
    return out.join(" ");
  }

  paragraphsBlock(count: number): string {
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      const sentences = this.randInt(PARAGRAPH_SENTENCES.min, PARAGRAPH_SENTENCES.max);
      // Each paragraph closes with the final stop (e.g. ॥ for Sanskrit), as before.
      out.push(this.sentencesBlock(sentences, true));
    }
    return out.join("\n\n");
  }
}
