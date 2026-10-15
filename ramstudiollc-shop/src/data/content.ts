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
    eyebrow: 'Mockups from a packaging studio',
    title: ['Mockups that make', 'your design look real.'],
    sub: 'Smart-object PSD scenes for boxes, bags, apparel and screens. Drop in your artwork, export, and show a finished product.',
    primary: { label: 'Get free mockups', href: '/freebies/' },
    secondary: { label: 'Browse library', href: '/mockups/' },
  },
  why: {
    eyebrow: 'Why our files',
    title: ['Designed by people', 'who ship real packaging.'],
    sub: 'Every scene is built by the RAM Studio team that designs packaging for brands — real materials, real light, real folds.',
    items: [
      { icon: 'layers', tone: 'orange', title: 'Built for real products', text: 'Correct proportions, true-to-life materials and lighting that matches a photo shoot.' },
      { icon: 'size', tone: 'blue', title: 'Edit in seconds', text: 'Smart objects, separate shadows and editable backgrounds. Paste, save, export.' },
    ],
  },
  features: {
    eyebrow: 'Inside every file',
    title: ['Small details,', 'big difference.'],
    sub: 'What you get in each PSD, free or paid.',
    layers: ['Your design · Smart Object', 'Highlights', 'Shadows', 'Background colour'],
    smart: { title: 'Smart-object layers', text: 'Double-click, paste your artwork, save. Every side and label updates.' },
    print: { title: 'Print-size files', text: 'Scenes up to 6000 × 4000 px at 300 DPI.' },
    license: { title: 'Commercial licence', text: 'Use the renders in client work, listings and ads.' },
    free: { title: '{free} free samples', text: 'Full-quality PSDs for $0. Try before you buy.' },
    gumroad: { title: 'Instant delivery', text: 'Gumroad emails the files and keeps them in your library.' },
    monthly: { title: 'New sets every month', text: 'Subscribe on Gumroad and hear about new releases first.' },
  },
  wall: {
    count: '{images}',
    title: ['preview scenes', 'and growing.'],
    cta: { label: 'Open the gallery', href: '/gallery/' },
  },
  latest: {
    eyebrow: 'New in',
    title: ['Fresh from', 'the studio.'],
    sub: 'The newest mockups. Every free sample comes from a larger paid set.',
    cta: { label: 'View all mockups', href: '/mockups/' },
  },
  reviews: {
    eyebrow: 'Verified on Gumroad',
    title: ['Rated {rating} out of 5', 'by real buyers.'],
    sub: 'Average of {reviews} verified ratings on our Gumroad store.',
  },
  pricing: {
    eyebrow: 'Plans & pricing',
    title: ['Start free,', 'pay only for what you need.'],
    sub: 'Download free samples, buy full sets one by one, or wait for the All-Access Pass.',
    payNote: 'Payments are handled securely by Gumroad · card · PayPal',
    soon: 'Launching when the library passes 40 paid sets.',
  },
  agency: {
    eyebrow: 'Need something custom?',
    title: ['Your product,', 'mocked up by our studio.'],
    sub: 'The team behind this shop designs packaging, labels and 3D product renders for brands. Every project includes 100% commercial rights.',
    offers: [
      { name: 'Custom e-commerce mockup', price: 'from $100' },
      { name: 'Packaging & label design', price: 'from $250' },
      { name: '3D product visualisation', price: 'from $400' },
    ],
    cta: { label: 'Start a custom project', href: 'https://ramstudiollc.com' },
  },
};

export const faq = {
  eyebrow: 'We are here to help',
  title: ['Questions', 'and answers.'],
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
