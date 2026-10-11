// Shop categories. A product joins a category through its `category` field,
// or — when synced from Gumroad — through a tag such as "cat:packaging".
// `art` picks the illustration used on cards that have no image yet.

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  art: ArtKind;
};

export type ArtKind =
  | 'box'
  | 'pouch'
  | 'bottle'
  | 'can'
  | 'tin'
  | 'cards'
  | 'flyer'
  | 'tshirt'
  | 'mug'
  | 'device'
  | 'billboard'
  | 'bag';

export const categories: Category[] = [
  { slug: 'packaging', name: 'Packaging', blurb: 'Boxes, pouches, sachets and tins', art: 'box' },
  { slug: 'bottles-jars', name: 'Bottles & Jars', blurb: 'Cosmetic, beverage and pharma containers', art: 'bottle' },
  { slug: 'cans-drinks', name: 'Cans & Drinks', blurb: 'Aluminium cans, cups and cartons', art: 'can' },
  { slug: 'branding', name: 'Branding & Stationery', blurb: 'Business cards, letterheads, logo scenes', art: 'cards' },
  { slug: 'print', name: 'Print & Publishing', blurb: 'Flyers, posters, books and magazines', art: 'flyer' },
  { slug: 'apparel', name: 'Apparel', blurb: 'T-shirts, hoodies, caps and tote bags', art: 'tshirt' },
  { slug: 'lifestyle', name: 'Mugs & Lifestyle', blurb: 'Mugs, tumblers and everyday objects', art: 'mug' },
  { slug: 'devices', name: 'Devices & Tech', blurb: 'Phones, USB drives, software boxes', art: 'device' },
  { slug: 'outdoor', name: 'Signage & Outdoor', blurb: 'Billboards, shop signs and banners', art: 'billboard' },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
