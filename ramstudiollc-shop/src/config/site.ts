// Store-wide settings. Empty strings mean "not set up yet":
// the matching button or section is hidden instead of linking nowhere.

export const site = {
  name: 'RAM Studio',
  legalName: 'RAM Studio LLC',
  shopName: 'ramstudiollc.shop',
  domain: 'https://ramstudiollc.shop',
  description:
    'Photoshop mockups for packaging, branding, apparel and devices by RAM Studio. Smart-object PSD files. Browse here, download on Gumroad.',

  logo: { light: '/brand/logo-white.png', dark: '/brand/logo-black.png', icon: '/brand/favicon-192.png' },

  // Your Gumroad store. Used for "All products on Gumroad" and the importer default.
  gumroadStore: 'https://shop.ramstudiollc.com',

  // "redirect": Buy opens the Gumroad product page. "overlay": Gumroad checkout opens on top of this site.
  checkout: 'redirect' as 'redirect' | 'overlay',

  // Thin bar at the very top. Leave text empty to hide it.
  announcement: {
    text: 'New free mockups every month — subscribe on Gumroad',
    href: 'https://shop.ramstudiollc.com/subscribe',
  },

  // All-Access Pass = a Gumroad membership. Leave url empty until it exists.
  allAccess: {
    url: '',
    yearlyPrice: '',
    lifetimePrice: '',
    lifetimeUrl: '',
  },

  // Gumroad's own subscribe page — buyers get new-release emails from Gumroad.
  newsletterUrl: 'https://shop.ramstudiollc.com/subscribe',

  agency: {
    name: 'RAM Studio LLC',
    url: 'https://ramstudiollc.com',
    email: 'hello@ramstudiollc.com',
  },

  social: [
    { label: 'Behance', url: 'https://www.behance.net/ramstudiollc' },
    { label: 'Dribbble', url: 'https://dribbble.com/Ram-Studio' },
    { label: 'Instagram', url: 'https://www.instagram.com/ramstudio3d/' },
    { label: 'Pinterest', url: 'https://www.pinterest.com/ramstudiollc/' },
    { label: 'Facebook', url: 'https://www.facebook.com/RamStudio3D/' },
  ],

  // Other stores that carry RAM Studio mockups (shown on About and in the footer).
  marketplaces: [
    { label: 'Creative Market', url: 'https://creativemarket.com/ram_studio' },
    { label: 'Creative Market — Shop 2', url: 'https://creativemarket.com/RamStudio2' },
    { label: 'Envato Elements', url: 'https://elements.envato.com/user/ram-studio/graphic-templates' },
  ],

  // Set to true once the licence text has been reviewed.
  licenseReviewed: false,
};

export const nav = [
  { label: 'Mockups', href: '/mockups/', menu: 'categories' as const },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Freebies', href: '/freebies/' },
  { label: 'All-Access', href: '/all-access/' },
];

export const isSet = (v: string | undefined | null): v is string => typeof v === 'string' && v.trim().length > 0;
