//Made by Abhijit Chirde
//abhijitchirde.com

import { wordSpace } from "./data/wordSpace";
import { LANGUAGES, LanguageConfig, MAX_COUNT, Unit, UNITS, getLanguage } from "./data/languages";
import { generateText } from "./generator";

const words = wordSpace as Record<string, string[]>;

// 272px wide fits three language buttons per row (longest label "Malayalam" in Inter, with slack).
// Height grows with the number of language rows: 4 rows = 410px, each extra row ≈ 34px (button + row gap).
const languageRows = Math.ceil(LANGUAGES.filter((lang) => lang.group === "desi").length / 3);
const uiHeight = 410 + (languageRows - 4) * 34;
figma.showUI(__html__, { width: 272, height: uiHeight, themeColors: true });

// ---------- Fonts ----------

// One load attempt per font; resolves to false instead of throwing if the font isn't available.
const fontLoads = new Map<string, Promise<boolean>>();

function tryLoadFont(font: FontName): Promise<boolean> {
  const key = `${font.family}::${font.style}`;
  let load = fontLoads.get(key);
  if (!load) {
    load = figma.loadFontAsync(font).then(
      () => true,
      () => false
    );
    fontLoads.set(key, load);
  }
  return load;
}

// Warm up the Regular weights so the first click is fast.
LANGUAGES.forEach((lang) => {
  if (lang.font) tryLoadFont(lang.font);
});

/** Loads every font currently used in the node, which is needed before changing its characters. */
async function loadNodeFonts(node: TextNode) {
  const fonts =
    node.characters.length > 0
      ? node.getRangeAllFontNames(0, node.characters.length)
      : [node.fontName as FontName];
  await Promise.all(fonts.map((font) => figma.loadFontAsync(font)));
}

function currentStyle(node: TextNode): string {
  const font = node.characters.length > 0 ? node.getRangeFontName(0, 1) : node.fontName;
  return font === figma.mixed ? "Regular" : font.style;
}

/**
 * Applies the language font, keeping the layer's style (e.g. Bold) when the family has it.
 * Tries the main family, then any fallback families. Returns false if none could be loaded,
 * in which case the layer keeps its current font (which may not have the script's letters).
 */
async function applyFont(node: TextNode, lang: LanguageConfig): Promise<boolean> {
  if (!lang.font) {
    await loadNodeFonts(node);
    return true;
  }
  const style = currentStyle(node);
  const families = [lang.font.family, ...(lang.fallbackFamilies ?? [])];
  for (const family of families) {
    const candidates: FontName[] = [{ family, style }];
    if (style !== lang.font.style) candidates.push({ family, style: lang.font.style });
    for (const font of candidates) {
      if (await tryLoadFont(font)) {
        node.fontName = font;
        return true;
      }
    }
  }
  await loadNodeFonts(node);
  return false;
}

// ---------- Layer naming ----------

const LAYER_SUFFIX = " text";
const pluginLayerNames = new Set(LANGUAGES.map((lang) => lang.label + LAYER_SUFFIX));

/** Rename only layers that are auto-named or were named by this plugin. */
function maybeRename(node: TextNode, lang: LanguageConfig, wasAutoNamed: boolean) {
  if (wasAutoNamed || pluginLayerNames.has(node.name)) {
    node.name = lang.label + LAYER_SUFFIX;
  }
}

// ---------- Generate ----------

interface GenerateRequest {
  num: unknown;
  block: unknown;
  lang: unknown;
}

function notify(message: string) {
  figma.notify(message, { timeout: 1500 });
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

async function handleGenerate(data: GenerateRequest) {
  const lang = getLanguage(String(data.lang));
  if (!lang || !words[lang.id]) return notify("Unknown language");

  const unit = String(data.block) as Unit;
  if (UNITS.indexOf(unit) === -1) return notify("Please choose words, sentences or paragraphs");

  const count = parseInt(String(data.num), 10);
  if (isNaN(count)) return notify("Please enter a number");
  if (count <= 0) return notify("Please enter a number greater than 0");
  if (count > MAX_COUNT[unit]) return notify(`Please enter at most ${MAX_COUNT[unit]} ${unit}`);

  const selection = figma.currentPage.selection;
  const textNodes = selection.filter((node): node is TextNode => node.type === "TEXT");
  if (textNodes.length === 0) return notify("Please select a text layer");

  let filled = 0;
  let failed = 0;
  let fontMissing = false;
  let openingUsed = false;

  for (const node of textNodes) {
    try {
      if (node.hasMissingFont) {
        failed++;
        continue;
      }
      const wasAutoNamed = node.autoRename;
      if (!(await applyFont(node, lang))) fontMissing = true;
      node.characters = generateText({
        words: words[lang.id],
        lang,
        unit,
        count,
        // Only the first filled layer gets the famous opening line (Lorem ipsum, Shakespeare).
        classicOpening: !openingUsed,
      });
      openingUsed = true;
      maybeRename(node, lang, wasAutoNamed);
      filled++;
    } catch (error) {
      console.error("Desi Ipsum: could not fill layer", node.name, error);
      failed++;
    }
  }

  if (fontMissing && lang.font) {
    const tried = [lang.font.family, ...(lang.fallbackFamilies ?? [])].join(", ");
    figma.notify(`Couldn't load a ${lang.label} font (tried ${tried}). The text may not display.`, { timeout: 5000 });
    return;
  }

  const skipped = selection.length - textNodes.length;
  if (skipped > 0 || failed > 0) {
    const parts = [`Filled ${plural(filled, "text layer")}`];
    if (skipped > 0) parts.push(`skipped ${plural(skipped, "non-text layer")}`);
    if (failed > 0) parts.push(`${failed} couldn't be edited (missing font?)`);
    notify(parts.join(" · "));
  }
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "get-desi-ipsum") {
    await handleGenerate(msg.data ?? {});
  }

  if (msg.type === "disclaimer") {
    figma.notify("This plugin generates random text without any literal meaning.", { timeout: 2000 });
  }

  // Theme override (Auto / Light / Dark), saved per user.
  if (msg.type === "get-theme-pref") {
    const value = await figma.clientStorage.getAsync(THEME_KEY).catch(() => undefined);
    figma.ui.postMessage({ type: "theme-pref", value: isThemeValue(value) ? value : "auto" });
  }

  if (msg.type === "set-theme-pref" && isThemeValue(msg.value)) {
    await figma.clientStorage.setAsync(THEME_KEY, msg.value).catch(() => undefined);
  }
};

const THEME_KEY = "themePreference";

function isThemeValue(value: unknown): value is "auto" | "light" | "dark" {
  return value === "auto" || value === "light" || value === "dark";
}
