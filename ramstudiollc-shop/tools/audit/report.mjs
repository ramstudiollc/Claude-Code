// Turns report.json into a readable, section-by-section audit (report.md).

const kb = (b) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`);
const list = (arr, fmt = (x) => `${x.value} (${x.count})`, n = 12) => (arr?.length ? arr.slice(0, n).map(fmt).join(' · ') : '—');
const cell = (c) => String(c ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const table = (head, rows) => (rows.length ? [`| ${head.map(cell).join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n') : '_none found_');

export function writeMarkdown(r) {
  const out = [];
  const p = (s = '') => out.push(s);
  const home = r.pages[0]?.viewports.desktop;

  p(`# Site audit — ${r.site}`);
  p(`_Measured ${r.startedAt} → ${r.finishedAt}. ${r.inventory.length} URLs found, ${r.pages.length} audited in depth._`);
  p();
  p('> Measurements only. Use them to rebuild layout, type, spacing and motion with our own code, text and images.');
  p();

  if (home) {
    p('## 1. Stack and libraries');
    const st = home.stack;
    p(Object.entries(st).filter(([, v]) => v && v !== 'auto').map(([k, v]) => `**${k}**${v === true ? '' : `: ${v}`}`).join(' · ') || '—');
    p();
    p(`Third-party domains: ${home.network.thirdPartyDomains.join(', ') || '—'}`);
    p();

    p('## 2. Design tokens (home page, 1440 px)');
    p('### Fonts');
    p(`Loaded faces: ${[...new Set(home.typography.loadedFonts)].join(' · ') || '—'}`);
    p();
    p(`Most used family/weight: ${list(home.typography.families)}`);
    p();
    p(`Font files requested: ${home.network.fonts.length}`);
    p();
    p('### Type scale (all text, largest first)');
    p(table(['Size px', 'Uses', 'Area px²', 'Ratio to next'], home.typography.typeScale.slice(0, 18).map((t) => [t.size, t.count, t.area, t.ratioToNext])));
    p();
    p('### Text styles (most used)');
    p(table(['Style (family | size | weight | line-height | letter-spacing | case)', 'Uses', 'Tag', 'Colour'], home.typography.textStyles.slice(0, 22).map((s) => [s.value, s.count, s.sample?.tag, s.sample?.color])));
    p();
    p('### Colours');
    p(`Text: ${list(home.colors.text)}`);
    p();
    p(`Backgrounds: ${list(home.colors.background)}`);
    p();
    p(`Borders: ${list(home.colors.borders, undefined, 8)}`);
    p();
    p(`Gradients: ${list(home.colors.gradients, (x) => `\`${x.value}\` (${x.count})`, 6)}`);
    p();
    p('### Spacing and layout');
    p(`Content widths (centred blocks): ${list(home.spacing.centeredWidths)}`);
    p();
    p(`max-width values: ${list(home.spacing.maxWidths)}`);
    p();
    p(`Padding values: ${list(home.spacing.paddings, undefined, 20)}`);
    p();
    p(`Gap values: ${list(home.spacing.gaps, undefined, 16)}`);
    p();
    p(`Margin values: ${list(home.spacing.margins, undefined, 16)}`);
    p();
    p(`Grid column counts: ${list(home.spacing.gridColumns)}`);
    p();
    p('### Shape and effects');
    p(`Radii: ${list(home.shape.radii)}`);
    p();
    p(`Shadows: ${list(home.shape.shadows, (x) => `\`${x.value}\` (${x.count})`, 6)}`);
    p();
    p(`Filters: ${list(home.shape.filters)} · Blend modes: ${list(home.shape.blendModes)}`);
    p();
    p('Glass / backdrop-filter elements:');
    p(table(['Element', 'Backdrop', 'Background', 'Border', 'Radius', 'Size'], home.shape.glass.map((g) => [g.el, g.backdrop, g.bg, g.border, g.radius, `${g.w}×${g.h}`])));
    p();
    p('### Breakpoints (media queries)');
    const bps = [...(home.breakpoints || []), ...(home.crossOriginCss?.media || [])];
    p(list(bps, undefined, 25));
    p();
  }

  p('## 3. Motion and interaction');
  if (home) {
    p(`Custom cursor: ${home.customCursor ? 'yes' : 'no'} · Smooth scroll: ${home.stack.lenis ? 'Lenis' : home.stack.locomotive ? 'Locomotive' : home.stack.scrollBehavior}`);
    p();
    p('### Load animation');
    p(r.intro?.note || '');
    p(r.intro?.frames?.map((f) => `![](${f})`).join(' ') || '');
    p();
    p('### Scroll reveals (home)');
    const rv = home.motionRuntime;
    p(`${rv.revealCount} elements change when scrolled into view (of ${rv.revealCandidates} hidden/offset candidates). Scroll-linked (parallax-style) elements: ${rv.scrollLinkedElements}.`);
    p();
    p(table(['Element', 'Parent', 'From', 'To', 'Transition', 'Animation'], rv.reveals.slice(0, 30).map((x) => [x.el, x.parent, JSON.stringify(x.from), JSON.stringify(x.to), x.transition, x.animation])));
    p();
    p('### Animations seen while scrolling (Web Animations API)');
    p(table(['Animation', 'Samples'], rv.runtimeAnimations.slice(0, 25).map((a) => [a.value, a.count])));
    p();
    p('### CSS transitions in use');
    p(table(['property | duration | easing | delay', 'Elements'], home.motionStatic.transitions.slice(0, 20).map((t) => [t.value, t.count])));
    p();
    p('### CSS animations / keyframes');
    p(table(['name | duration | easing | iterations | delay', 'Elements'], home.motionStatic.cssAnimations.slice(0, 20).map((t) => [t.value, t.count])));
    p();
    p(`Keyframes defined: ${[...new Set([...home.motionStatic.keyframes.map((k) => k.name), ...(home.crossOriginCss?.keyframes || [])])].join(', ') || '—'}`);
    p();
    p('### Hover effects');
    p(table(['Element', 'Label', 'Transition', 'What changes'], home.hover.map((h) => [h.el, h.text, h.transition, h.changes.join('; ')])));
    p();
    p('### Fixed / sticky elements');
    p(table(['Element', 'Position', 'Top', 'Size', 'Background', 'Backdrop'], home.positioned.map((x) => [x.el, x.position, x.top, `${x.w}×${x.h}`, x.bg, x.backdrop])));
    p();
  }

  p('## 4. Pages, section by section');
  for (const pg of r.pages) {
    const d = pg.viewports.desktop;
    p(`### ${pg.url}`);
    p(`Template \`${pg.template}\` · height ${d.pageHeight}px · ${d.sections.length} sections · ${d.network.requests} requests, ${kb(d.network.bytes)} · H1: ${d.headings.filter((h) => h.tag === 'h1').map((h) => `"${h.text}"`).join(', ') || 'none'}`);
    p();
    p(`Screenshot: ![](${d.screenshot})`);
    p();
    p(table(
      ['#', 'Height (vh)', 'Background', 'Padding Y', 'Biggest text', 'Headings', 'Repeated items (cols × count, item size, gap)', 'Media', 'Notes'],
      d.sections.map((s) => [
        s.index,
        `${s.height} (${s.heightVH})`,
        s.bgImage ? `${s.bg} + image` : s.bg,
        s.paddingY,
        `${s.largestText.size}px`,
        s.headings.map((h) => `${h.tag} ${h.size}px "${h.text.slice(0, 40)}"`).join('; '),
        s.repeated ? `${s.repeated.columns} × ${s.repeated.count}, ${s.repeated.itemW}×${s.repeated.itemH}, gap ${s.repeated.gap}${s.repeated.scrollsX ? ', scrolls sideways' : ''}` : '',
        `img ${s.counts.img} · svg ${s.counts.svg} · video ${s.counts.video} · btn ${s.counts.buttons} · links ${s.counts.links}${s.counts.inputs ? ` · inputs ${s.counts.inputs}` : ''}`,
        [s.carouselHint && 'carousel/marquee markup', s.screenshot && `[crop](${s.screenshot})`].filter(Boolean).join(' · '),
      ]),
    ));
    p();
    const sizes = Object.entries(pg.viewports).filter(([k]) => k !== 'desktop');
    if (sizes.length) {
      p('**Responsive behaviour**');
      p(table(
        ['Screen', 'Width', 'Page height', 'Overflow', 'Nav', 'Largest text', 'Section columns'],
        [['desktop', d], ...sizes].map(([name, v]) => [
          name,
          v.viewport.width,
          v.pageHeight,
          v.horizontalOverflow ? '⚠ yes' : 'no',
          v.nav ? (v.nav.hamburger ? `menu button (${v.nav.visibleLinks.length} links visible)` : `${v.nav.visibleLinks.length} links`) : '—',
          `${(v.typeScale || v.typography?.typeScale)?.[0]?.size ?? '—'}px`,
          v.sections.map((s) => (s.repeated ? s.repeated.columns : '·')).join(' '),
        ]),
      ));
      p();
    }
  }

  p('## 5. SEO and links');
  if (home) {
    p(table(['Page', 'Title', 'Description', 'H1s', 'JSON-LD', 'OG image', 'Canonical'], r.pages.map((pg) => {
      const s = pg.viewports.desktop.seo;
      return [pg.name, `${s.title} (${s.title?.length ?? 0})`, s.description ? `${s.description.slice(0, 70)}… (${s.description.length})` : '—', s.h1Count, s.jsonLdTypes.join(', '), s.og.image ? 'yes' : 'no', s.canonical ? 'yes' : 'no'];
    })));
    p();
    p(`Outbound domains (home): ${list(home.links.externalDomains)}`);
    p();
    p(`Gumroad links (home): ${home.links.gumroad.length}${home.links.gumroad[0] ? ` — e.g. ${home.links.gumroad[0].href}` : ''}`);
    p();
    p(`Images (home): ${home.images.count}, missing alt ${home.images.missingAlt}, formats ${list(home.images.formats)}`);
    p();
    p('_Backlinks (other sites linking here) need an SEO index such as Ahrefs or Similarweb; a browser audit cannot see them._');
    p();
  }
  p('## 6. URL inventory');
  const byT = new Map();
  for (const u of r.inventory) byT.set(u.template, (byT.get(u.template) || 0) + 1);
  p(table(['Template', 'URLs'], [...byT.entries()].sort((a, b) => b[1] - a[1])));
  p();
  if (r.robots) {
    p('<details><summary>robots.txt</summary>');
    p();
    p('```');
    p(r.robots);
    p('```');
    p('</details>');
  }
  return out.join('\n');
}
