# 03 — Reference spec: asylab.com

**Status: EMPTY — fill from `audit/www.asylab.com/report.md`, its screenshots and scroll videos.**
Every value below must come from the audit. Write "not observed" rather than guessing.

---

## 0. Method
- Audit run: date, command, pages rendered, screen sizes
- What the tool could not see (and how it was checked by eye)

## 1. Site map and page templates
| Template | Example URL | Count | Purpose |
|---|---|---|---|

## 2. Stack and libraries
Builder/framework, animation libraries, smooth scroll, carousel, analytics, Gumroad embed.

## 3. Grid and layout
- Content width(s), side gutters per screen size
- Column counts per section per screen size
- Breakpoints
- Alignment rules (left/centre, baseline, optical alignment of images)

## 4. Typography
- Families and weights (and the files they load)
- Type scale — desktop / tablet / mobile:

| Role | Desktop px | Tablet px | Mobile px | Weight | Line-height | Letter-spacing | Case |
|---|---|---|---|---|---|---|---|

- Scale ratio between steps
- How sizes change between screens (fixed steps, `clamp()`, viewport units)

## 5. Colour, surfaces and depth
- Palette (text, backgrounds, borders, accents)
- Section rhythm (light/dark order)
- Glass / blur, gradients, shadows, radii
- Perspective and depth (3D tilt, layered images, overlaps)

## 6. Spacing system
Section padding, card padding, gaps, vertical rhythm between heading → text → button.

## 7. Components
For each: anatomy, sizes, spacing, states (default / hover / active / focus), responsive change.
- Announcement bar
- Header / navigation / mobile menu
- Buttons (primary, secondary, text link)
- Search
- Product card
- Category tiles / filters / sort
- Product page: gallery, title block, price + Buy, specs, includes, licence, related
- Membership / pricing cards
- Freebie card
- Testimonials / social proof (if any)
- FAQ
- Newsletter
- Footer
- Badges, tags, pills

## 8. Motion
| Effect | Where | Trigger | From → to | Duration | Easing | Delay / stagger |
|---|---|---|---|---|---|---|

Include: page-load intro, scroll reveals, text effects, image zoom/parallax, hover states, marquees/loops, carousels, page transitions, smooth scroll, cursor.

## 9. Pages, section by section
### Home
| # | Section | Height | Layout | Content type | Motion | Notes |
|---|---|---|---|---|---|---|

### Library / listing
### Category
### Product
### Freebies
### Membership
### Blog post
### Other (about, licence, FAQ, contact)

## 10. UX flows
- Browse → product → Gumroad checkout (redirect or overlay? new tab?)
- Search and filtering
- Membership upsell points
- Newsletter / discount capture
- Empty, loading and error states

## 11. SEO and links
Titles, descriptions, headings, structured data, internal linking pattern, outbound domains, Gumroad URL format.

## 12. Performance
Requests, page weight, image formats and sizes, lazy-loading, font loading.

## 13. What we replace with RAM Studio's own
| Reference element | RAM Studio replacement |
|---|---|
| Logo, brand colours, fonts | From RAM brand guideline |
| Product images | RAM's own mockups (Magnific/Freepik) |
| All text | Written for RAM Studio |
| Graphics / 3D / glass elements | Built by us or from RAM's own/licensed files |
