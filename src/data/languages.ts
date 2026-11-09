// Shared language configuration, used by both the plugin code and the UI.
// Keep this file free of the word bank so the UI bundle stays small.

export interface FontSpec {
  family: string;
  style: string;
}

export interface LanguageConfig {
  /** Key in `wordSpace` and the value sent from the UI. */
  id: string;
  /** Button label and layer-name prefix. */
  label: string;
  /** Name in its own script (shown as a tooltip). */
  nativeName: string;
  /** Font to apply. `null` keeps the layer's existing font (e.g. Latin text). */
  font: FontSpec | null;
  /** Ends every sentence except the last one in a block. */
  fullStop: string;
  /** Ends the last sentence of a block. Defaults to `fullStop`. */
  finalStop?: string;
  /** Mid-sentence pause mark, or `null` if the script shouldn't get one. */
  comma: string | null;
  /** Capitalise the first letter of each sentence (Latin script only). */
  capitalize: boolean;
  /** Which button group the language sits in. */
  group: "desi" | "classic";
  /**
   * Famous first line for the first filled layer (classic generators).
   * A list means one line is picked at random each time, to avoid repetition.
   */
  opening?: string | string[];
}

// Famous single-sentence Shakespeare lines (public domain). One is picked at random per generation.
const SHAKESPEARE_OPENINGS = [
  "To be, or not to be, that is the question.",
  "All the world's a stage, and all the men and women merely players.",
  "Shall I compare thee to a summer's day?",
  "Now is the winter of our discontent made glorious summer by this sun of York.",
  "Friends, Romans, countrymen, lend me your ears.",
  "The course of true love never did run smooth.",
  "If music be the food of love, play on.",
  "Some are born great, some achieve greatness, and some have greatness thrust upon 'em.",
  "We are such stuff as dreams are made on, and our little life is rounded with a sleep.",
  "The quality of mercy is not strain'd.",
  "Brevity is the soul of wit.",
  "Once more unto the breach, dear friends, once more.",
  "Tomorrow, and tomorrow, and tomorrow, creeps in this petty pace from day to day.",
  "Love looks not with the eyes, but with the mind.",
  "The fault, dear Brutus, is not in our stars, but in ourselves.",
];

const regular = (family: string): FontSpec => ({ family, style: "Regular" });

export const LANGUAGES: LanguageConfig[] = [
  { id: "Bangla", label: "Bangla", nativeName: "বাংলা", font: regular("Hind Siliguri"), fullStop: "।", comma: ",", capitalize: false, group: "desi" },
  { id: "Gujarati", label: "Gujarati", nativeName: "ગુજરાતી", font: regular("Hind Vadodara"), fullStop: ".", comma: ",", capitalize: false, group: "desi" },
  { id: "Hindi", label: "Hindi", nativeName: "हिंदी", font: regular("Mukta"), fullStop: "।", comma: ",", capitalize: false, group: "desi" },
  { id: "Kannada", label: "Kannada", nativeName: "ಕನ್ನಡ", font: regular("Noto Sans Kannada"), fullStop: ".", comma: ",", capitalize: false, group: "desi" },
  { id: "Malayalam", label: "Malayalam", nativeName: "മലയാളം", font: regular("Noto Sans Malayalam"), fullStop: ".", comma: ",", capitalize: false, group: "desi" },
  { id: "Marathi", label: "Marathi", nativeName: "मराठी", font: regular("Mukta"), fullStop: ".", comma: ",", capitalize: false, group: "desi" },
  { id: "Odia", label: "Odia", nativeName: "ଓଡ଼ିଆ", font: regular("Baloo Bhaina 2"), fullStop: "।", comma: ",", capitalize: false, group: "desi" },
  { id: "Punjabi", label: "Punjabi", nativeName: "ਪੰਜਾਬੀ", font: regular("Mukta Mahee"), fullStop: "।", comma: ",", capitalize: false, group: "desi" },
  // Sanskrit: single danda between sentences, double danda (U+0965) to close a block.
  { id: "Sanskrit", label: "Sanskrit", nativeName: "संस्कृतम्", font: regular("Mukta"), fullStop: "।", finalStop: "॥", comma: null, capitalize: false, group: "desi" },
  { id: "Tamil", label: "Tamil", nativeName: "தமிழ்", font: regular("Hind Madurai"), fullStop: ".", comma: ",", capitalize: false, group: "desi" },
  { id: "Telugu", label: "Telugu", nativeName: "తెలుగు", font: regular("Hind Guntur"), fullStop: ".", comma: ",", capitalize: false, group: "desi" },
  { id: "Lorem", label: "Lorem ipsum", nativeName: "Classic Latin placeholder", font: null, fullStop: ".", comma: ",", capitalize: true, group: "classic", opening: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: "Shakespeare", label: "Shakespeare", nativeName: "English, from public-domain Shakespeare", font: null, fullStop: ".", comma: ",", capitalize: true, group: "classic", opening: SHAKESPEARE_OPENINGS },
];

export function getLanguage(id: string): LanguageConfig | undefined {
  return LANGUAGES.find((lang) => lang.id === id);
}

export type Unit = "words" | "sentences" | "paragraphs";

export const UNITS: Unit[] = ["words", "sentences", "paragraphs"];

/** Upper limits that keep a single click from freezing Figma. */
export const MAX_COUNT: Record<Unit, number> = {
  words: 2000,
  sentences: 300,
  paragraphs: 50,
};
