// Runs INSIDE the audited page via page.evaluate(extractPage, opts).
// It must stay self-contained: no imports, no references to outer variables.
// It only measures — it never downloads or copies the site's files.

export function extractPage(opts = {}) {
  const minSection = opts.sectionMinHeight ?? 80;
  const VW = window.innerWidth;
  const VH = window.innerHeight;

  const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
  const px = (v) => parseFloat(v) || 0;
  const tally = (m, k, n = 1) => {
    if (k === undefined || k === null || k === '') return;
    m.set(k, (m.get(k) || 0) + n);
  };
  const top = (m, n = 40) =>
    [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([value, count]) => ({ value, count }));
  const short = (s, n = 90) => (s || '').replace(/\s+/g, ' ').trim().slice(0, n);
  const rect = (el) => el.getBoundingClientRect();
  const isVisible = (el) => {
    const r = rect(el);
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  };
  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += `#${el.id}`;
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 3) : [];
    if (cls.length) s += `.${cls.join('.')}`;
    return s.slice(0, 120);
  };
  const channels = (c) => {
    const s = String(c);
    let m = s.match(/rgba?\(([^)]+)\)/);
    if (m) return m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    m = s.match(/color\(srgb ([^)]+)\)/);
    if (m) {
      const [r, g, b, a = 1] = m[1].split(/[ /]+/).filter(Boolean).map(Number);
      return [r * 255, g * 255, b * 255, a];
    }
    return null;
  };
  const toHex = (c) => {
    const ch = channels(c);
    if (!ch) return c;
    const [r, g, b, a = 1] = ch;
    const h = (x) => Math.round(+x).toString(16).padStart(2, '0');
    const alpha = +a;
    if (alpha === 0) return 'transparent';
    return `#${h(r)}${h(g)}${h(b)}${alpha < 1 ? h(alpha * 255) : ''}`;
  };
  const lightness = (c) => {
    const ch = channels(c);
    if (!ch) return null;
    const [r, g, b, a = 1] = ch;
    if (a === 0) return null;
    return round((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255, 3);
  };
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'META', 'LINK', 'BR', 'HEAD', 'TITLE']);
  const all = [...document.querySelectorAll('body *')].filter((el) => !SKIP.has(el.tagName));
  const visible = all.filter(isVisible);

  // ---------- typography ----------
  const textStyles = new Map();
  const styleSample = new Map();
  const sizeCount = new Map();
  const sizeArea = new Map();
  const families = new Map();
  const weights = new Map();
  for (const el of visible) {
    const ownText = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent)
      .join(' ')
      .trim();
    if (ownText.length < 2) continue;
    const cs = getComputedStyle(el);
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const size = round(px(cs.fontSize), 1);
    const lh = cs.lineHeight === 'normal' ? 'normal' : round(px(cs.lineHeight) / size, 2);
    const ls = cs.letterSpacing === 'normal' ? 0 : round(px(cs.letterSpacing) / size, 3);
    const key = `${fam} | ${size}px | ${cs.fontWeight} | lh ${lh} | ls ${ls}em | ${cs.textTransform}`;
    tally(textStyles, key);
    if (!styleSample.has(key)) styleSample.set(key, { tag: el.tagName.toLowerCase(), text: short(ownText, 60), color: toHex(cs.color) });
    tally(sizeCount, size);
    tally(sizeArea, size, Math.round(rect(el).width * rect(el).height));
    tally(families, `${fam} ${cs.fontWeight} ${cs.fontStyle}`);
    tally(weights, cs.fontWeight);
  }
  const sizesDesc = [...sizeCount.keys()].sort((a, b) => b - a);
  const typeScale = sizesDesc.map((s, i) => ({
    size: s,
    count: sizeCount.get(s),
    area: sizeArea.get(s),
    ratioToNext: sizesDesc[i + 1] ? round(s / sizesDesc[i + 1], 3) : null,
  }));
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(isVisible).map((h) => {
    const cs = getComputedStyle(h);
    return { tag: h.tagName.toLowerCase(), text: short(h.innerText, 100), size: round(px(cs.fontSize), 1), weight: cs.fontWeight, family: cs.fontFamily.split(',')[0].replace(/["']/g, '') };
  });

  // ---------- colours, spacing, effects ----------
  const textColors = new Map();
  const bgColors = new Map();
  const borderColors = new Map();
  const gradients = new Map();
  const paddings = new Map();
  const gaps = new Map();
  const margins = new Map();
  const maxWidths = new Map();
  const centeredWidths = new Map();
  const radii = new Map();
  const shadows = new Map();
  const glass = [];
  const filters = new Map();
  const blends = new Map();
  const gridCols = new Map();
  const transitions = new Map();
  const cssAnimations = new Map();
  const willChange = new Map();
  const positioned = [];
  const cursors = new Map();

  for (const el of visible) {
    const cs = getComputedStyle(el);
    const r = rect(el);
    if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) tally(textColors, toHex(cs.color));
    if (cs.backgroundColor && toHex(cs.backgroundColor) !== 'transparent') tally(bgColors, toHex(cs.backgroundColor));
    if (px(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none') tally(borderColors, `${cs.borderTopWidth} ${cs.borderTopStyle} ${toHex(cs.borderTopColor)}`);
    if (cs.backgroundImage && cs.backgroundImage.includes('gradient')) tally(gradients, cs.backgroundImage.slice(0, 160));
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      const p = px(cs[`padding${side}`]);
      if (p > 0) tally(paddings, round(p, 0));
    }
    const mt = px(cs.marginTop), mb = px(cs.marginBottom);
    if (mt > 0) tally(margins, round(mt, 0));
    if (mb > 0) tally(margins, round(mb, 0));
    if (cs.display.includes('flex') || cs.display.includes('grid')) {
      const rg = px(cs.rowGap), cg = px(cs.columnGap);
      if (rg > 0) tally(gaps, round(rg, 0));
      if (cg > 0 && cg !== rg) tally(gaps, round(cg, 0));
    }
    if (cs.display.includes('grid') && cs.gridTemplateColumns !== 'none') tally(gridCols, cs.gridTemplateColumns.split(' ').length);
    if (cs.maxWidth !== 'none' && px(cs.maxWidth) > 200) tally(maxWidths, cs.maxWidth);
    const left = r.left, right = VW - r.right;
    if (r.width > 300 && r.width < VW - 20 && Math.abs(left - right) < 2) tally(centeredWidths, round(r.width, 0));
    const rad = cs.borderTopLeftRadius;
    if (rad && rad !== '0px') tally(radii, rad);
    if (cs.boxShadow && cs.boxShadow !== 'none') tally(shadows, cs.boxShadow.slice(0, 140));
    if (cs.backdropFilter && cs.backdropFilter !== 'none') glass.push({ el: describe(el), backdrop: cs.backdropFilter, bg: toHex(cs.backgroundColor), border: `${cs.borderTopWidth} ${toHex(cs.borderTopColor)}`, radius: rad, w: round(r.width, 0), h: round(r.height, 0) });
    if (cs.filter && cs.filter !== 'none') tally(filters, cs.filter.slice(0, 80));
    if (cs.mixBlendMode && cs.mixBlendMode !== 'normal') tally(blends, cs.mixBlendMode);
    if (cs.transitionDuration && cs.transitionDuration !== '0s') tally(transitions, `${cs.transitionProperty.slice(0, 60)} | ${cs.transitionDuration} | ${cs.transitionTimingFunction} | delay ${cs.transitionDelay}`);
    if (cs.animationName && cs.animationName !== 'none') tally(cssAnimations, `${cs.animationName} | ${cs.animationDuration} | ${cs.animationTimingFunction} | x${cs.animationIterationCount} | delay ${cs.animationDelay}`);
    if (cs.willChange && cs.willChange !== 'auto') tally(willChange, cs.willChange);
    if (cs.position === 'fixed' || cs.position === 'sticky') positioned.push({ el: describe(el), position: cs.position, top: cs.top, z: cs.zIndex, w: round(r.width, 0), h: round(r.height, 0), bg: toHex(cs.backgroundColor), backdrop: cs.backdropFilter });
    if (cs.cursor && cs.cursor !== 'auto' && cs.cursor !== 'pointer' && cs.cursor !== 'text' && cs.cursor !== 'default') tally(cursors, cs.cursor.slice(0, 60));
  }

  // ---------- sections ----------
  const height = (el) => rect(el).height;
  function unwrap(root) {
    let node = root;
    for (let d = 0; d < 30; d++) {
      const kids = [...node.children].filter((k) => !SKIP.has(k.tagName) && isVisible(k));
      const big = kids.filter((k) => height(k) >= minSection);
      if (big.length === 1 && height(big[0]) >= height(node) * 0.6) {
        node = big[0];
        continue;
      }
      return kids.filter((k) => height(k) >= 20);
    }
    return [node];
  }
  let sectionEls = [];
  for (const el of unwrap(document.body)) {
    const inner = unwrap(el);
    if ((el.tagName === 'MAIN' || height(el) > VH * 3) && inner.length >= 2) sectionEls.push(...inner);
    else sectionEls.push(el);
  }

  function repeated(container) {
    // Find the densest group of sibling elements that share a tag+class signature (cards, list items, logos).
    let best = null;
    const nodes = [container, ...container.querySelectorAll('*')].slice(0, 4000);
    for (const n of nodes) {
      if (n.closest('[aria-hidden="true"]')) continue; // decorative layer, not page layout
      const kids = [...n.children].filter(isVisible);
      if (kids.length < 3) continue;
      const sig = new Map();
      for (const k of kids) tally(sig, `${k.tagName}.${typeof k.className === 'string' ? k.className.trim().split(/\s+/)[0] : ''}`);
      const [, count] = [...sig.entries()].sort((a, b) => b[1] - a[1])[0];
      if (count >= 3 && (!best || count > best.count)) {
        const rs = kids.map(rect);
        const firstTop = Math.min(...rs.map((r) => r.top));
        const firstRow = rs.filter((r) => Math.abs(r.top - firstTop) < 8);
        const cs = getComputedStyle(n);
        const overflowX = cs.overflowX;
        const totalW = rs.reduce((s, r) => s + r.width, 0);
        best = {
          container: describe(n),
          count,
          columns: new Set(firstRow.map((r) => Math.round(r.left))).size,
          itemW: Math.round(rs[0].width),
          itemH: Math.round(rs[0].height),
          gap: cs.columnGap !== 'normal' ? cs.columnGap : null,
          scrollsX: overflowX === 'auto' || overflowX === 'scroll' || (overflowX === 'hidden' && totalW > rect(n).width * 1.3),
        };
      }
    }
    return best;
  }

  const sections = sectionEls.map((el, i) => {
    const r = rect(el);
    const cs = getComputedStyle(el);
    let bgEl = el;
    let bg = cs.backgroundColor;
    for (let d = 0; d < 4 && toHex(bg) === 'transparent' && bgEl.firstElementChild; d++) {
      bgEl = bgEl.firstElementChild;
      bg = getComputedStyle(bgEl).backgroundColor;
    }
    const hs = [...el.querySelectorAll('h1,h2,h3,h4')].filter(isVisible).slice(0, 4).map((h) => ({ tag: h.tagName.toLowerCase(), text: short(h.innerText, 80), size: round(px(getComputedStyle(h).fontSize), 1) }));
    let maxText = 0;
    let maxTextSample = '';
    for (const t of el.querySelectorAll('*')) {
      if (!isVisible(t) || ![...t.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
      const s = px(getComputedStyle(t).fontSize);
      if (s > maxText) {
        maxText = s;
        maxTextSample = short(t.innerText, 80);
      }
    }
    const marker = `${describe(el)} ${el.innerHTML.slice(0, 2000)}`.toLowerCase();
    return {
      index: i,
      el: describe(el),
      tag: el.tagName.toLowerCase(),
      top: round(r.top + scrollY, 0),
      height: round(r.height, 0),
      width: round(r.width, 0),
      heightVH: round(r.height / VH, 2),
      bg: toHex(bg),
      bgLightness: lightness(bg),
      bgImage: cs.backgroundImage !== 'none' ? cs.backgroundImage.slice(0, 120) : null,
      paddingY: `${cs.paddingTop} / ${cs.paddingBottom}`,
      headings: hs,
      largestText: { size: round(maxText, 1), text: maxTextSample },
      counts: {
        img: el.querySelectorAll('img, picture').length,
        video: el.querySelectorAll('video').length,
        svg: el.querySelectorAll('svg').length,
        canvas: el.querySelectorAll('canvas').length,
        links: el.querySelectorAll('a[href]').length,
        buttons: el.querySelectorAll('button, [role=button]').length,
        inputs: el.querySelectorAll('input, textarea, select').length,
        iframes: el.querySelectorAll('iframe').length,
      },
      repeated: repeated(el),
      carouselHint: /swiper|slider|carousel|marquee|splide|embla|glide|slick|ticker/.test(marker),
      text: short(el.innerText, 160),
    };
  });

  // ---------- header / nav ----------
  const header = document.querySelector('header') || sections[0] && sectionEls[0];
  let nav = null;
  if (header) {
    const links = [...header.querySelectorAll('a[href]')].filter(isVisible);
    const burger = [...header.querySelectorAll('button, [role=button], label, a, div')]
      .filter(isVisible)
      .filter((b) => rect(b).width <= 90 && rect(b).height <= 90)
      .find((b) => {
        const label = `${b.getAttribute('aria-label') || ''} ${typeof b.className === 'string' ? b.className : ''} ${b.innerText || ''}`;
        const iconOnly = !(b.innerText || '').trim() && (b.querySelector('svg') || b.querySelectorAll('span, div, i').length >= 2);
        return /menu|burger|hamburger|toggle/i.test(label) || (iconOnly && getComputedStyle(b).cursor === 'pointer');
      });
    const hcs = getComputedStyle(header);
    nav = {
      el: describe(header),
      height: round(rect(header).height, 0),
      position: hcs.position,
      bg: toHex(hcs.backgroundColor),
      backdrop: hcs.backdropFilter,
      visibleLinks: links.map((a) => short(a.innerText, 30)).filter(Boolean).slice(0, 20),
      hamburger: Boolean(burger),
    };
  }

  // ---------- stylesheets: keyframes, media queries, font-face ----------
  const keyframes = [];
  const media = new Map();
  const fontFaces = [];
  const crossOriginSheets = [];
  const walk = (rules) => {
    for (const rule of rules) {
      if (rule.type === CSSRule.KEYFRAMES_RULE) keyframes.push({ name: rule.name, css: rule.cssText.slice(0, 600) });
      else if (rule.type === CSSRule.MEDIA_RULE) {
        tally(media, rule.conditionText || rule.media.mediaText);
        walk(rule.cssRules);
      } else if (rule.type === CSSRule.FONT_FACE_RULE) {
        fontFaces.push({ family: rule.style.getPropertyValue('font-family').replace(/["']/g, ''), weight: rule.style.getPropertyValue('font-weight'), style: rule.style.getPropertyValue('font-style'), src: (rule.style.getPropertyValue('src').match(/url\(([^)]+)\)/) || [])[1]?.slice(0, 200) });
      } else if (rule.cssRules) walk(rule.cssRules);
    }
  };
  for (const sheet of document.styleSheets) {
    try {
      walk(sheet.cssRules);
    } catch {
      if (sheet.href) crossOriginSheets.push(sheet.href);
    }
  }

  // ---------- libraries / stack ----------
  const html = document.documentElement;
  const has = (s) => Boolean(document.querySelector(s));
  const w = window;
  const stack = {
    generator: document.querySelector('meta[name=generator]')?.content || null,
    framer: has('[data-framer-name], [data-framer-component-type]') || Boolean(w.__framer_importFromPackage),
    webflow: html.hasAttribute('data-wf-page') || has('[data-wf-page]'),
    wix: has('#SITE_CONTAINER') || Boolean(w.wixBiSession),
    next: Boolean(w.__NEXT_DATA__) || has('#__next'),
    nuxt: Boolean(w.__NUXT__),
    shopify: Boolean(w.Shopify),
    wordpress: has('link[href*="wp-content"], script[src*="wp-includes"]'),
    react: has('[data-reactroot], #root') || Boolean(w.React),
    gsap: Boolean(w.gsap),
    scrollTrigger: Boolean(w.ScrollTrigger),
    lenis: html.classList.contains('lenis') || Boolean(w.lenis || w.Lenis),
    locomotive: has('[data-scroll-container]'),
    framerMotionAppear: has('[data-framer-appear-id]'),
    swiper: has('.swiper, swiper-container'),
    splide: has('.splide'),
    embla: has('.embla'),
    lottie: has('lottie-player, dotlottie-player') || Boolean(w.lottie || w.bodymovin),
    three: Boolean(w.THREE),
    spline: has('spline-viewer'),
    rive: has('canvas[class*=rive]') || Boolean(w.rive),
    jquery: w.jQuery ? w.jQuery.fn?.jquery || true : false,
    gumroadOverlay: has('script[src*="gumroad.com/js"]'),
    scrollBehavior: getComputedStyle(html).scrollBehavior,
  };

  // ---------- links, SEO, images ----------
  const meta = (n) => document.querySelector(`meta[name="${n}"], meta[property="${n}"]`)?.content || null;
  const linksInternal = new Map();
  const linksExternal = new Map();
  const extDomains = new Map();
  const gumroad = [];
  for (const a of document.querySelectorAll('a[href]')) {
    let u;
    try {
      u = new URL(a.getAttribute('href'), location.href);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(u.protocol)) continue;
    if (u.hostname === location.hostname) tally(linksInternal, u.pathname);
    else {
      tally(linksExternal, u.href.slice(0, 200));
      tally(extDomains, u.hostname);
      if (/gumroad\.com|gum\.co/.test(u.hostname) || /^\/l\/[\w-]+/.test(u.pathname) || a.hasAttribute('data-buy')) gumroad.push({ href: u.href, text: short(a.innerText, 60), classes: typeof a.className === 'string' ? a.className.slice(0, 80) : '' });
    }
  }
  const images = [...document.querySelectorAll('img')].map((img) => ({
    src: (img.currentSrc || img.src || '').slice(0, 200),
    alt: img.getAttribute('alt'),
    natural: `${img.naturalWidth}x${img.naturalHeight}`,
    rendered: `${Math.round(rect(img).width)}x${Math.round(rect(img).height)}`,
    loading: img.getAttribute('loading'),
    format: ((img.currentSrc || img.src || '').split('?')[0].match(/\.(\w{3,4})$/) || [])[1] || 'unknown',
  }));
  const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
    try {
      const j = JSON.parse(s.textContent);
      return [].concat(j['@graph'] || j).map((x) => x['@type']).flat();
    } catch {
      return ['(invalid JSON-LD)'];
    }
  });

  return {
    url: location.href,
    viewport: { width: VW, height: VH },
    pageHeight: document.documentElement.scrollHeight,
    horizontalOverflow: document.documentElement.scrollWidth > VW + 1,
    seo: {
      title: document.title,
      description: meta('description'),
      canonical: document.querySelector('link[rel=canonical]')?.href || null,
      robots: meta('robots'),
      lang: html.lang,
      og: { title: meta('og:title'), description: meta('og:description'), image: meta('og:image'), type: meta('og:type') },
      twitter: meta('twitter:card'),
      jsonLdTypes: jsonLd.flat(),
      h1Count: document.querySelectorAll('h1').length,
    },
    headings,
    typography: {
      families: top(families, 20),
      weights: top(weights, 12),
      typeScale,
      textStyles: top(textStyles, 40).map((s) => ({ ...s, sample: styleSample.get(s.value) })),
      fontFaces,
      loadedFonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family.replace(/["']/g, '')} ${f.weight} ${f.style}`),
    },
    colors: { text: top(textColors, 20), background: top(bgColors, 20), borders: top(borderColors, 12), gradients: top(gradients, 12) },
    spacing: { paddings: top(paddings, 25), gaps: top(gaps, 20), margins: top(margins, 20), maxWidths: top(maxWidths, 12), centeredWidths: top(centeredWidths, 12), gridColumns: top(gridCols, 10) },
    shape: { radii: top(radii, 15), shadows: top(shadows, 12), glass: glass.slice(0, 30), filters: top(filters, 10), blendModes: top(blends, 8) },
    motionStatic: { transitions: top(transitions, 30), cssAnimations: top(cssAnimations, 30), willChange: top(willChange, 10), keyframes: keyframes.slice(0, 60), cursors: top(cursors, 6) },
    positioned: positioned.slice(0, 20),
    nav,
    sections,
    breakpoints: top(media, 40),
    crossOriginSheets,
    stack,
    links: {
      internal: top(linksInternal, 200),
      external: top(linksExternal, 100),
      externalDomains: top(extDomains, 40),
      gumroad,
    },
    images: { count: images.length, missingAlt: images.filter((i) => i.alt === null || i.alt === '').length, formats: top(images.reduce((m, i) => tally(m, i.format) || m, new Map()), 10), list: images.slice(0, 150) },
  };
}
