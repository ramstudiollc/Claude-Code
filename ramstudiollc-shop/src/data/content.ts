// Every piece of page text lives here so it can be edited without touching layouts.
// Numbers such as product counts are filled in automatically from the catalogue: use {products}, {free},
// {images}, {reviews}, {rating}, {categories} inside a string.

export const home = {
  seo: {
    title: 'PSD Mockups for Packaging, Branding & Devices · RAM Studio',
    description:
      'Smart-object Photoshop mockups by RAM Studio: packaging, branding, apparel and device scenes at 300 DPI. Free samples and full sets on Gumroad.',
  },
  hero: {
    eyebrow: 'Mockup shop by RAM Studio',
    lines: ['Packaging', 'mockups', 'that sell'],
    pillAfterLine: 0, // a round product image sits after this line of the headline
    sub: 'Smart-object PSD scenes made by a packaging design studio. Drop in your artwork, export, and show a finished product.',
    primary: { label: 'Browse {products} mockups', href: '/mockups/' },
    secondary: { label: 'Get free mockups', href: '/freebies/' },
    chips: ['300 DPI', 'Smart objects', 'Commercial use'],
  },
  categories: {
    eyebrow: 'Shop by category',
    title: 'Find the right object fast',
    sub: 'Every mockup sits in one category. Pick one and filter the rest.',
  },
  values: {
    eyebrow: 'Why our files',
    title: 'Made by people who design real packaging',
    items: [
      { icon: 'layers', title: 'Smart objects', text: 'Double-click the layer, paste your design, save. Labels, lids and sides update in place.' },
      { icon: 'size', title: 'Print-size files', text: 'Scenes up to 6000 × 4000 px at 300 DPI — sharp on screen, in decks and in print.' },
      { icon: 'license', title: 'Commercial use', text: 'Use the renders in client work, shop listings and ads. One licence, no extra fees.' },
    ],
  },
  latest: {
    eyebrow: 'New in',
    title: 'Latest releases',
    sub: 'Fresh scenes from the studio. Free samples come with a full paid set.',
    cta: { label: 'See all mockups', href: '/mockups/' },
  },
  freebies: {
    eyebrow: 'Free downloads',
    title: 'Start with a free mockup',
    sub: '{free} free PSD samples. Enter $0 on Gumroad and the download starts.',
    cta: { label: 'All free mockups', href: '/freebies/' },
  },
  wall: {
    eyebrow: 'Preview scenes',
    count: '{images}',
    label: 'preview scenes and growing',
    cta: { label: 'Open the gallery', href: '/gallery/' },
  },
  flow: {
    eyebrow: 'How buying works',
    title: 'Browse here. Download from Gumroad.',
    steps: [
      { icon: 'search', title: 'Pick a mockup', text: 'Filter by category, check the previews and the file details, then press the button.' },
      { icon: 'card', title: 'Pay on Gumroad', text: 'Checkout opens on Gumroad. Pay by card or PayPal — or enter $0 for free files.' },
      { icon: 'download', title: 'Download now', text: 'The files arrive by email and stay in your Gumroad Library for later.' },
    ],
  },
  proof: {
    eyebrow: 'Verified reviews',
    title: 'Rated {rating} out of 5',
    sub: 'Average of {reviews} verified buyer reviews on Gumroad.',
  },
  pass: {
    eyebrow: 'All-Access Pass',
    title: 'Every mockup, one membership',
    sub: 'One Gumroad membership will unlock the full library and every new release.',
    soon: 'Launching when the library passes 40 paid sets.',
    cta: { label: 'See what is included', href: '/all-access/' },
  },
  agency: {
    eyebrow: 'Need something custom?',
    title: 'Packaging and 3D made for your brand',
    sub: 'The studio behind this shop designs packaging, labels and 3D product renders for clients. Every project includes 100% commercial rights.',
    offers: [
      { name: 'Custom e-commerce mockup', price: 'from $100' },
      { name: 'Packaging & label design', price: 'from $250' },
      { name: '3D product visualisation', price: 'from $400' },
    ],
    cta: { label: 'Start a custom project', href: 'https://ramstudiollc.com' },
  },
};

export const faq = {
  eyebrow: 'Help',
  title: 'Questions and answers',
  sub: 'Short answers about downloads, licences and Gumroad.',
  items: [
    { icon: 'cart', q: 'Why does checkout open on Gumroad?', a: 'Gumroad is our payment and delivery partner. It takes the card or PayPal payment, sends the receipt and hosts the download. This site shows the catalogue.' },
    { icon: 'download', q: 'Where are my files after I pay?', a: 'Gumroad emails a download link right away. The files also stay in your Gumroad Library, so you can download them again on any device.' },
    { icon: 'gift', q: 'Are the free mockups really free?', a: 'Yes. Enter $0 on Gumroad. A tip is welcome but never needed. Free files use the same licence as paid ones.' },
    { icon: 'file', q: 'Which software do I need?', a: 'Adobe Photoshop. Each mockup uses smart objects: double-click the layer, place your design, save, and the scene updates.' },
    { icon: 'license', q: 'Can I use the mockups for client work?', a: 'Yes. Personal and commercial client work is allowed. You may not resell or share the PSD files themselves.' },
    { icon: 'layers', q: 'What is the difference between a free sample and the full set?', a: 'A free sample has 2–4 scenes. The full set has more angles and scenes of the same product, sold on Gumroad.' },
    { icon: 'spark', q: 'How often do you add mockups?', a: 'New sets arrive every month. Subscribe on Gumroad to get an email when they do.' },
  ],
  contact: { title: 'Your question is not here?', text: 'Write to us and we will answer within one working day.', label: 'Email the studio' },
};

export const library = {
  seo: {
    title: 'All PSD Mockups — Packaging, Branding, Devices · RAM Studio',
    description: 'Browse every RAM Studio mockup. Filter by category, search by object, and download free or paid PSD files on Gumroad.',
  },
  eyebrow: '{products} mockups and counting',
  title: 'Mockups for packaging, brands and devices',
  sub: 'Search by object, filter by category, then download on Gumroad.',
  searchPlaceholder: 'Search box, cap, laptop…',
  empty: 'No mockups match. Clear the search or pick another category.',
};

export const product = {
  sections: { gallery: 'Preview scenes', get: 'What you get', specs: 'Specifications', perfect: 'Perfect for', about: 'About this mockup', related: 'More like this' },
  freeNote: 'Free sample — the full set with more scenes is on Gumroad.',
  secure: 'Secure checkout and instant download on Gumroad.',
  license: 'Use in personal and client work, including commercial projects. Do not resell or share the PSD.',
};

export const pages = {
  freebies: { seo: { title: 'Free PSD Mockups — Packaging & Branding · RAM Studio', description: 'Free Photoshop mockups by RAM Studio: packaging, branding, apparel and devices. Download for $0 on Gumroad and use them in commercial work.' }, eyebrow: 'Free downloads', title: 'Free mockups', sub: 'Full-quality PSD samples. Enter $0 on Gumroad and the download starts.' },
  bundles: { seo: { title: 'Mockup Bundles — Save on PSD Sets · RAM Studio', description: 'RAM Studio mockup bundles: related PSD sets in one download for less than buying each file.' }, eyebrow: 'Bundles', title: 'Mockup bundles', sub: 'Related sets in one download, priced below the single files.' },
  gallery: { seo: { title: 'Mockup Gallery — Every Preview Scene · RAM Studio', description: 'A wall of every RAM Studio preview scene. Click any image to open its mockup.' }, eyebrow: 'Gallery', title: 'Every preview scene', sub: '{images} scenes from {products} mockups. Click a picture to open its product.' },
  allAccess: { seo: { title: 'All-Access Pass — Every RAM Studio Mockup', description: 'One Gumroad membership will unlock every RAM Studio PSD mockup and every new release.' }, eyebrow: 'All-Access Pass', title: 'Every mockup, one membership', sub: 'One Gumroad membership will unlock the full library and every new release.' },
  contact: { seo: { title: 'Contact RAM Studio — Mockups & Custom Work', description: 'Contact RAM Studio about mockup downloads, licences or custom packaging and 3D work.' }, eyebrow: 'Contact', title: 'Talk to the studio', sub: 'Questions about a download, a licence or a custom project. We answer within one working day.' },
};
