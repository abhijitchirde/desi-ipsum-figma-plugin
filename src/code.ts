//Made by Abhijit Chirde
//abhijitchirde.com

import { wordSpace } from "./data/wordSpace";
import { Amount, DEFAULT_AMOUNT, LANGUAGES, LanguageConfig, MODES, Mode, describeAmount, getLanguage } from "./data/languages";
import { generateText } from "./generator";
import { fitText } from "./fill";
import { amountSuggestions, parseAmount, validateAmount } from "./amount";

const words = wordSpace as Record<string, string[]>;

// ---------- UI ----------

function openUI() {
  // 272px wide fits three language buttons per row (longest label "Malayalam" in Inter, with slack).
  // Height grows with the number of language rows: 4 rows = 410px, each extra row ≈ 34px (button + row gap).
  const languageRows = Math.ceil(LANGUAGES.filter((lang) => lang.group === "desi").length / 3);
  const uiHeight = 410 + (languageRows - 4) * 34;
  figma.showUI(__html__, { width: 272, height: uiHeight, themeColors: true });
}

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

// ---------- Layer naming & remembered settings ----------

const LAYER_SUFFIX = " text";
const pluginLayerNames = new Set(LANGUAGES.map((lang) => lang.label + LAYER_SUFFIX));

/** Rename only layers that are auto-named or were named by this plugin. */
function maybeRename(node: TextNode, lang: LanguageConfig, wasAutoNamed: boolean) {
  if (wasAutoNamed || pluginLayerNames.has(node.name)) {
    node.name = lang.label + LAYER_SUFFIX;
  }
}

const SETTINGS_KEY = "settings";

interface StoredSettings {
  lang: string;
  mode: Amount["mode"];
  count: number;
}

/** Saves the layer's settings and adds the "Regenerate text" button in Figma's right panel. */
function remember(node: TextNode, lang: LanguageConfig, amount: Amount) {
  const settings: StoredSettings = { lang: lang.id, mode: amount.mode, count: amount.count };
  node.setPluginData(SETTINGS_KEY, JSON.stringify(settings));
  try {
    node.setRelaunchData({ regenerate: `${lang.label} · ${describeAmount(amount)}` });
  } catch (error) {
    // Some editors don't show relaunch buttons; the text is still filled.
  }
}

function recall(node: TextNode): { lang: LanguageConfig; amount: Amount } | null {
  try {
    const raw = node.getPluginData(SETTINGS_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as StoredSettings;
    const lang = getLanguage(saved.lang);
    const amount = { mode: saved.mode, count: saved.count };
    if (!lang || validateAmount(amount)) return null;
    return { lang, amount };
  } catch (error) {
    return null;
  }
}

// ---------- Filling ----------

/** Fills the layer to its size; how depends on its text resizing setting. */
function fillToFit(node: TextNode, lang: LanguageConfig, classicOpening: boolean): string {
  const resize = node.textAutoResize;
  const width = node.width;
  const height = node.height;
  const oneLine = resize === "WIDTH_AND_HEIGHT";

  // Measure with the box growing in one direction: auto height (width fixed), or auto width for one-line layers.
  if (!oneLine) node.textAutoResize = "HEIGHT";

  const text = fitText({
    lang,
    generate: (size) =>
      generateText({
        words: words[lang.id],
        lang,
        unit: oneLine ? "sentences" : "paragraphs",
        count: oneLine ? size * 2 : size,
        classicOpening,
      }),
    fits: (candidate) => {
      node.characters = candidate;
      return oneLine ? node.width <= width + 0.5 : node.height <= height + 0.5;
    },
  });

  node.characters = text;
  if (resize === "NONE" || resize === "TRUNCATE") {
    node.textAutoResize = resize;
    node.resize(width, height);
  }
  return text;
}

interface FillJob {
  node: TextNode;
  lang: LanguageConfig;
  amount: Amount;
}

interface FillResult {
  filled: number;
  failed: number;
  /** Languages whose font (and fallbacks) couldn't be loaded. */
  fontMissing: LanguageConfig[];
}

async function fillLayers(jobs: FillJob[]): Promise<FillResult> {
  const result: FillResult = { filled: 0, failed: 0, fontMissing: [] };
  let openingUsed = false;

  for (const { node, lang, amount } of jobs) {
    try {
      if (node.hasMissingFont) {
        result.failed++;
        continue;
      }
      const wasAutoNamed = node.autoRename;
      if (!(await applyFont(node, lang)) && result.fontMissing.indexOf(lang) === -1) {
        result.fontMissing.push(lang);
      }
      // Only the first filled layer gets the famous opening line (Lorem ipsum, Shakespeare).
      const classicOpening = !openingUsed;
      if (amount.mode === "fill") {
        fillToFit(node, lang, classicOpening);
      } else {
        node.characters = generateText({ words: words[lang.id], lang, unit: amount.mode, count: amount.count, classicOpening });
      }
      openingUsed = true;
      maybeRename(node, lang, wasAutoNamed);
      remember(node, lang, amount);
      result.filled++;
    } catch (error) {
      console.error("Desi Ipsum: could not fill layer", node.name, error);
      result.failed++;
    }
  }
  return result;
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** A message for anything that went wrong or was skipped, or null if all went fine. */
function problems(result: FillResult, skipped: number, skippedWhat: string): string | null {
  if (result.fontMissing.length > 0) {
    return result.fontMissing
      .map((lang) => {
        const tried = [lang.font?.family, ...(lang.fallbackFamilies ?? [])].filter(Boolean).join(", ");
        return `Couldn't load a ${lang.label} font (tried ${tried}). The text may not display.`;
      })
      .join(" ");
  }
  if (skipped === 0 && result.failed === 0) return null;
  const parts = [`Filled ${plural(result.filled, "text layer")}`];
  if (skipped > 0) parts.push(`skipped ${plural(skipped, skippedWhat)}`);
  if (result.failed > 0) parts.push(`${result.failed} couldn't be edited (missing font?)`);
  return parts.join(" · ");
}

/**
 * Text layers in the selection: selected text layers, plus every visible text layer inside
 * selected frames, groups, sections, components and instances (in layer order, no duplicates).
 * `skipped` counts selected layers that had no text at all.
 */
function selectedTextLayers() {
  const seen = new Set<string>();
  const textNodes: TextNode[] = [];
  let skipped = 0;
  for (const node of figma.currentPage.selection) {
    let found: TextNode[] = [];
    if (node.type === "TEXT") found = [node];
    else if ("findAllWithCriteria" in node) {
      found = node.findAllWithCriteria({ types: ["TEXT"] }).filter((text) => text.visible);
    }
    if (found.length === 0) skipped++;
    for (const text of found) {
      if (!seen.has(text.id)) {
        seen.add(text.id);
        textNodes.push(text);
      }
    }
  }
  return { textNodes, skipped };
}

const NEW_LAYER_WIDTH = 320;

/** The topmost visible solid paint (paints are listed bottom to top), or null. */
function solidColor(paints: ReadonlyArray<Paint> | PluginAPI["mixed"] | undefined): RGB | null {
  if (!paints || paints === figma.mixed) return null;
  for (let i = paints.length - 1; i >= 0; i--) {
    const paint = paints[i];
    if (paint.visible !== false && paint.type === "SOLID" && (paint.opacity ?? 1) >= 0.5) return paint.color;
  }
  return null;
}

const BACKDROP_TYPES = ["FRAME", "SECTION", "COMPONENT", "COMPONENT_SET", "INSTANCE", "RECTANGLE"];

/**
 * The colour behind a point on the canvas: the topmost top-level frame/section/rectangle there
 * with a solid fill, otherwise the page background.
 */
function backdropAt(x: number, y: number): RGB | null {
  const children = figma.currentPage.children;
  for (let i = children.length - 1; i >= 0; i--) {
    const node = children[i];
    if (!node.visible || BACKDROP_TYPES.indexOf(node.type) === -1 || !("fills" in node)) continue;
    const box = node.absoluteBoundingBox;
    if (!box || x < box.x || x > box.x + box.width || y < box.y || y > box.y + box.height) continue;
    const color = solidColor(node.fills);
    if (color) return color;
  }
  return solidColor(figma.currentPage.backgrounds);
}

/** True if white text has more contrast than black on this colour (WCAG relative luminance). */
function prefersWhiteText({ r, g, b }: RGB): boolean {
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  // Contrast with white (1.05 / (L + 0.05)) beats contrast with black ((L + 0.05) / 0.05) below L ≈ 0.179.
  return 1.05 / (luminance + 0.05) > (luminance + 0.05) / 0.05;
}

/**
 * With nothing selected: a new text layer at the centre of the view, sized for the amount.
 * Only in Figma Design and FigJam (Slides and Buzz need a slide/frame to put it in).
 */
async function createTextLayer(amount: Amount): Promise<TextNode | null> {
  if (figma.editorType !== "figma" && figma.editorType !== "figjam") return null;
  const node = figma.createText();
  await figma.loadFontAsync(node.fontName as FontName);
  node.fontSize = 16;

  // Readable on whatever is behind it: white text on dark backgrounds, black (default) on light ones.
  const { x, y } = figma.viewport.center;
  const backdrop = backdropAt(x, y);
  if (backdrop && prefersWhiteText(backdrop)) {
    node.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  }
  if (amount.mode === "words") {
    node.textAutoResize = "WIDTH_AND_HEIGHT";
  } else if (amount.mode === "fill") {
    node.textAutoResize = "NONE";
    node.resize(NEW_LAYER_WIDTH, 200);
  } else {
    node.textAutoResize = "HEIGHT";
    node.resize(NEW_LAYER_WIDTH, node.height);
  }
  return node;
}

/** Fills the selected text layers. Returns an error/summary message, or null if all went fine. */
async function generateIntoSelection(lang: LanguageConfig, amount: Amount): Promise<string | null> {
  if (figma.currentPage.selection.length === 0) {
    const node = await createTextLayer(amount);
    if (!node) return "Please select a text layer";
    const result = await fillLayers([{ node, lang, amount }]);
    // Centre it in the view now that its final size is known, and select it.
    const { x, y } = figma.viewport.center;
    node.x = Math.round(x - node.width / 2);
    node.y = Math.round(y - node.height / 2);
    figma.currentPage.selection = [node];
    return problems(result, 0, "");
  }

  const { textNodes, skipped } = selectedTextLayers();
  if (textNodes.length === 0) return "No text layers in the selection";
  const result = await fillLayers(textNodes.map((node) => ({ node, lang, amount })));
  return problems(result, skipped, "layer without text");
}

/** Regenerates selected layers (and text inside selected frames) with the settings each one was filled with. */
async function regenerateSelection(): Promise<string> {
  const { textNodes, skipped } = selectedTextLayers();
  const jobs: FillJob[] = [];
  for (const node of textNodes) {
    const saved = recall(node);
    if (saved) jobs.push({ node, ...saved });
  }
  if (jobs.length === 0) return "Select text layers filled by Desi Ipsum to regenerate them";
  const notOurs = skipped + (textNodes.length - jobs.length);
  const result = await fillLayers(jobs);
  return problems(result, notOurs, "layer not filled by Desi Ipsum") ?? `Regenerated ${plural(result.filled, "text layer")}`;
}

// ---------- Quick actions (parameters) ----------

figma.parameters.on("input", ({ key, query, result }: ParameterInputEvent) => {
  if (key === "lang") {
    const q = query.trim().toLowerCase();
    result.setSuggestions(
      LANGUAGES.filter(
        (lang) => lang.label.toLowerCase().indexOf(q) !== -1 || lang.nativeName.indexOf(query.trim()) !== -1
      ).map((lang) => ({
        name: lang.group === "desi" ? `${lang.label} (${lang.nativeName})` : lang.label,
        data: lang.id,
      }))
    );
  } else if (key === "amount") {
    const suggestions = amountSuggestions(query);
    const typed = parseAmount(query);
    if (suggestions.length === 0 && typed && !validateAmount(typed)) {
      suggestions.push({ name: describeAmount(typed), data: typed });
    }
    result.setSuggestions(suggestions);
  }
});

function amountFromParameter(value: unknown): Amount | string {
  if (value === undefined || value === null || value === "") return DEFAULT_AMOUNT;
  const amount = typeof value === "string" ? parseAmount(value) : (value as Amount);
  if (!amount) return `Couldn't understand "${value}". Try "3 sentences", "10 words" or "fill".`;
  return validateAmount(amount) ?? amount;
}

// ---------- Entry point ----------

figma.on("run", async ({ command, parameters }: RunEvent) => {
  if (command === "regenerate") {
    figma.closePlugin(await regenerateSelection());
    return;
  }

  if (parameters) {
    const lang = getLanguage(String(parameters.lang));
    if (!lang) {
      figma.closePlugin("Unknown language");
      return;
    }
    const amount = amountFromParameter(parameters.amount);
    if (typeof amount === "string") {
      figma.closePlugin(amount);
      return;
    }
    const message = await generateIntoSelection(lang, amount);
    figma.closePlugin(message ?? `Desi Ipsum: ${describeAmount(amount)} of ${lang.label}`);
    return;
  }

  openUI();
});

// ---------- Messages from the UI ----------

const THEME_KEY = "themePreference";
const SETTINGS_STORAGE_KEY = "lastSettings";

/** The UI's inputs as saved: { num: "5", block: "sentences" }. */
function isSavedInput(value: unknown): value is { num: string; block: string } {
  if (!value || typeof value !== "object") return false;
  const { num, block } = value as { num: unknown; block: unknown };
  return typeof num === "string" && /^\d{0,4}$/.test(num) && typeof block === "string" && MODES.indexOf(block as Mode) !== -1;
}

function isThemeValue(value: unknown): value is "auto" | "light" | "dark" {
  return value === "auto" || value === "light" || value === "dark";
}

function notify(message: string) {
  figma.notify(message, { timeout: message.startsWith("Couldn't load") ? 5000 : 1500 });
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "get-desi-ipsum") {
    const data = msg.data ?? {};
    const lang = getLanguage(String(data.lang));
    if (!lang || !words[lang.id]) return notify("Unknown language");

    const amount = { mode: data.block, count: data.block === "fill" ? 0 : parseInt(String(data.num), 10) };
    const invalid = validateAmount(amount);
    if (invalid) return notify(invalid);

    const message = await generateIntoSelection(lang, amount as Amount);
    if (message) notify(message);
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

  // Last used amount and type (e.g. 3 paragraphs), saved per user and restored on open.
  if (msg.type === "get-settings") {
    const saved = await figma.clientStorage.getAsync(SETTINGS_STORAGE_KEY).catch(() => undefined);
    if (isSavedInput(saved)) figma.ui.postMessage({ type: "settings", value: saved });
  }

  if (msg.type === "save-settings" && isSavedInput(msg.value)) {
    await figma.clientStorage.setAsync(SETTINGS_STORAGE_KEY, msg.value).catch(() => undefined);
  }
};
