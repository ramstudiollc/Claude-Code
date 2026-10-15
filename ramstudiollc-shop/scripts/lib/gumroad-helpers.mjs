// Shared helpers for turning Gumroad product data into shop products.
// Used by sync-gumroad.mjs (API, needs a token) and import-gumroad-store.mjs (public store page).

export const CATEGORY_SLUGS = [
  'packaging',
  'bottles-jars',
  'cans-drinks',
  'branding',
  'print',
  'apparel',
  'lifestyle',
  'devices',
  'outdoor',
];

// Words in a product name that place it in a category when no cat: tag is set.
export const CATEGORY_HINTS = [
  ['bottles-jars', /\b(bottle|jar|dropper|serum|cosmetic|pump|spray|vial|tube)\b/i],
  ['cans-drinks', /\b(can|soda|beer|cup|carton|juice|coffee cup|tumbler)\b/i],
  ['apparel', /\b(t-?shirt|hoodie|cap|hat|tote|apparel|sweatshirt|jersey|sock)\b/i],
  ['lifestyle', /\b(mug|pillow|cushion|towel|candle|notebook)\b/i],
  ['devices', /\b(iphone|phone|laptop|macbook|ipad|tablet|usb|flash drive|software box|screen)\b/i],
  ['outdoor', /\b(billboard|signage|sign|banner|storefront|bus stop|poster wall)\b/i],
  ['print', /\b(flyer|poster|book|magazine|brochure|leaflet|menu|catalog)\b/i],
  ['branding', /\b(business card|stationery|letterhead|logo|branding|envelope|identity)\b/i],
  ['packaging', /\b(box|pouch|sachet|tin|bag|packaging|label|wrapper|carton)\b/i],
];

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

// Keep only simple formatting from the Gumroad description editor.
const ALLOWED = new Set(['p', 'br', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'h2', 'h3', 'h4', 'a', 'blockquote']);
export function sanitise(html) {
  if (!html) return '';
  return String(html)
    .replace(/<(script|style|iframe|object|embed|noscript|template)[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (tag, name, attrs) => {
      const n = name.toLowerCase();
      if (!ALLOWED.has(n)) return '';
      if (tag.startsWith('</')) return `</${n}>`;
      if (n === 'a') {
        const href = attrs.match(/href\s*=\s*"(https?:\/\/[^"]*)"/i) ?? attrs.match(/href\s*=\s*'(https?:\/\/[^']*)'/i);
        return href ? `<a href="${href[1].replace(/"/g, '&quot;')}" rel="noopener nofollow">` : '<a>';
      }
      return `<${n}>`;
    })
    .trim();
}

export const plain = (html) =>
  String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

export function firstSentence(text, max = 140) {
  const s = text.split(/(?<=[.!?])\s/)[0] ?? '';
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

export function guessCategory(name, tags) {
  const tagged = tags.find((t) => t.startsWith('cat:'))?.slice(4);
  if (tagged && CATEGORY_SLUGS.includes(tagged)) return tagged;
  for (const [slug, re] of CATEGORY_HINTS) if (re.test(name)) return slug;
  return 'packaging';
}

export function formatsFrom(tags, name, description) {
  const tagged = tags.filter((t) => t.startsWith('format:')).map((t) => t.slice(7).toUpperCase());
  if (tagged.length) return [...new Set(tagged)];
  const text = `${name} ${plain(description)}`;
  const found = ['PSD', 'PSB', 'AI', 'EPS', 'FIG', 'PNG', 'BLEND', 'OBJ'].filter((f) => new RegExp(`\\b${f}\\b`, 'i').test(text));
  return found.length ? found : ['PSD'];
}
