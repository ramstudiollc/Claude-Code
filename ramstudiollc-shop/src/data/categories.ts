// Shop categories (see docs/06-CATALOGUE-PLAN.md). A category is shown only when it has products.
// `icon` names an icon in src/components/Icon.astro.

export type ArtKind = 'box' | 'pouch' | 'bottle' | 'can' | 'tin' | 'cards' | 'flyer' | 'tshirt' | 'mug' | 'device' | 'billboard' | 'bag';

export type Category = {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  icon: string;
  art: ArtKind;
  niches: string[];
};

export const categories: Category[] = [
  { slug: 'packaging', name: 'Packaging', short: 'Packaging', blurb: 'Boxes, pouches, tubes and bags', icon: 'box', art: 'box', niches: ['Boxes', 'Pouches & bags', 'Tubes & tubs', 'Luxury & cosmetic'] },
  { slug: 'branding', name: 'Branding & Stationery', short: 'Branding', blurb: 'Folders, business cards and identity kits', icon: 'cards', art: 'cards', niches: ['Business cards', 'Folders & paper', 'Identity kits'] },
  { slug: 'apparel', name: 'Apparel & Workwear', short: 'Apparel', blurb: 'Caps, T-shirts and safety workwear', icon: 'shirt', art: 'tshirt', niches: ['T-shirts', 'Caps', 'Workwear & PPE'] },
  { slug: 'devices', name: 'Devices', short: 'Devices', blurb: 'Laptops, desktops and phones', icon: 'device', art: 'device', niches: ['Laptop & long-scroll', 'Desktop', 'iPhone'] },
  { slug: 'food-beverage', name: 'Food & Beverage', short: 'Food & Drink', blurb: 'Bakery, coffee and snack packaging', icon: 'cup', art: 'can', niches: ['Bakery', 'Coffee', 'Snacks'] },
  { slug: 'outdoor', name: 'Advertising & Events', short: 'Advertising', blurb: 'Banners, backdrops and booths', icon: 'flag', art: 'billboard', niches: ['Banners', 'Booths', 'Billboards'] },
  { slug: 'lifestyle', name: 'Fitness & Lifestyle', short: 'Lifestyle', blurb: 'Gym gear and everyday objects', icon: 'spark', art: 'mug', niches: ['Gym', 'Home', 'Gifts'] },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
