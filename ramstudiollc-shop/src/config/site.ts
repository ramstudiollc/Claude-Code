// Single place to edit store-wide settings.
// Anything left as an empty string is treated as "not set up yet":
// the matching button or section is hidden instead of linking nowhere.

export const site = {
  name: 'RAM Studio',
  shopName: 'ramstudiollc.shop',
  domain: 'https://ramstudiollc.shop',
  tagline: "Let's Get to the Solution",
  description:
    'Photoshop mockups for packaging, branding, print and products, made by RAM Studio. Browse here, buy securely on Gumroad.',

  // Your Gumroad profile, e.g. "https://ramstudio.gumroad.com".
  // Used for the "All products on Gumroad" link and as the fallback store link.
  gumroadStore: '',

  // "redirect": Buy opens the Gumroad product page (simplest, works everywhere).
  // "overlay":  Buy opens Gumroad's checkout pop-up on top of this site (loads gumroad.js).
  checkout: 'redirect' as 'redirect' | 'overlay',

  // All-Access Pass = a Gumroad *membership* product that unlocks every file.
  // Leave url empty until the membership exists on Gumroad.
  allAccess: {
    url: '',
    yearlyPrice: '', // e.g. "$79 / year"
    lifetimePrice: '', // e.g. "$249 once" — optional second tier
    lifetimeUrl: '',
  },

  // Newsletter. Leave empty to hide the sign-up block.
  // Simplest option: your Gumroad profile URL — buyers press "Subscribe" there.
  newsletterUrl: '',

  // The agency site, for custom work.
  agency: {
    name: 'RAM Studio LLC',
    url: 'https://ramstudiollc.com',
    email: 'hello@ramstudiollc.com',
  },

  // Add only accounts you control. Empty entries are skipped.
  social: [
    { label: 'Behance', url: '' },
    { label: 'Dribbble', url: '' },
    { label: 'Instagram', url: '' },
    { label: 'Pinterest', url: '' },
  ],

  // Set to true once the licence text has been reviewed (see docs/02-PLAN.md).
  licenseReviewed: false,
};

export const nav = [
  { label: 'Mockups', href: '/mockups/' },
  { label: 'Bundles', href: '/bundles/' },
  { label: 'Freebies', href: '/freebies/' },
  { label: 'All-Access', href: '/all-access/' },
  { label: 'License', href: '/license/' },
];

export const isSet = (v: string | undefined | null): v is string =>
  typeof v === 'string' && v.trim().length > 0;
