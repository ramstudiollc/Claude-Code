import type { ArtKind } from '../data/categories';
import { categories, categoryBySlug } from '../data/categories';
import sample from '../data/products.sample.json';
import overridesFile from '../data/overrides.json';

export type Spec = { label: string; value: string };

export type Product = {
  slug: string;
  title: string;
  /** One line shown on cards. */
  summary?: string;
  /** Long description. HTML when synced from Gumroad (already sanitised). */
  description?: string;
  category: string;
  tags: string[];
  /** Whole currency units. 0 = free. */
  price: number;
  currency: string;
  /** Pay-what-you-want on Gumroad: price is the minimum. */
  payWhatYouWant?: boolean;
  formats: string[];
  specs?: Spec[];
  features?: string[];
  /** "Perfect for" list from the Gumroad description. */
  useCases?: string[];
  /** Gumroad star rating shown on the store card. */
  rating?: { value: number; count: number } | null;
  /** Gumroad product id / sku. */
  gumroadId?: string | null;
  /** Image URLs. The first one is the cover. */
  images: string[];
  /** Illustration shown when there is no image yet. */
  art?: ArtKind;
  gumroadUrl?: string;
  type: 'single' | 'bundle' | 'membership';
  /** Bundles only: slugs of the products inside. */
  includes?: string[];
  /** Unlocked by the All-Access Pass. */
  allAccess: boolean;
  featured?: boolean;
  /** ISO date, used for "New" sorting. */
  releasedAt?: string;
  /** Demo entry — never real stock. */
  sample?: boolean;
};

// products.json is written by `npm run sync:gumroad`. Until it exists, the
// shop runs on the clearly-labelled sample catalogue so the layout can be reviewed.
const synced = import.meta.glob<{ default: Product[] }>('../data/products.json', { eager: true });
const syncedList = Object.values(synced)[0]?.default;

export const usingSampleCatalog = !syncedList || syncedList.length === 0;

const overrides = overridesFile as Record<string, Partial<Product>>;

function normalise(p: Product): Product {
  const o = overrides[p.slug] ?? {};
  const merged: Product = { ...p, ...o };
  if (!categoryBySlug(merged.category)) merged.category = 'packaging';
  merged.art ??= categoryBySlug(merged.category)?.art ?? 'box';
  merged.tags ??= [];
  merged.formats ??= [];
  merged.images ??= [];
  return merged;
}

const all: Product[] = ((usingSampleCatalog ? sample : syncedList) as Product[])
  .filter((p) => p.type !== 'membership')
  .map(normalise);

const byNewest = (a: Product, b: Product) => (b.releasedAt ?? '').localeCompare(a.releasedAt ?? '');

export const products = [...all].sort(byNewest);
export const singles = products.filter((p) => p.type === 'single');
export const bundles = products.filter((p) => p.type === 'bundle');
export const isFree = (p: Pick<Product, 'price'>) => p.price === 0;
export const freebies = products.filter(isFree);
export const featured = products.filter((p) => p.featured);

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const inCategory = (slug: string) => products.filter((p) => p.category === slug);

export const categoriesWithCounts = categories.map((c) => ({ ...c, count: inCategory(c.slug).length }));

export const allFormats = [...new Set(products.flatMap((p) => p.formats))].sort();

export function related(p: Product, n = 4): Product[] {
  const same = products.filter((x) => x.slug !== p.slug && x.category === p.category);
  const rest = products.filter((x) => x.slug !== p.slug && x.category !== p.category);
  return [...same, ...rest].slice(0, n);
}

export function bundleItems(p: Product): Product[] {
  return (p.includes ?? []).map(productBySlug).filter((x): x is Product => Boolean(x));
}

export function priceLabel(p: Pick<Product, 'price' | 'currency' | 'payWhatYouWant'>): string {
  if (p.price === 0) return 'Free';
  const amount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: p.currency || 'USD',
    minimumFractionDigits: Number.isInteger(p.price) ? 0 : 2,
  }).format(p.price);
  return p.payWhatYouWant ? `${amount}+` : amount;
}

export function isNew(p: Product, days = 30): boolean {
  if (!p.releasedAt) return false;
  return Date.now() - new Date(p.releasedAt).getTime() < days * 86_400_000;
}
