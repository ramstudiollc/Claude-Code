import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { categories } from '../data/categories';
import { products } from '../lib/catalog';

// Hand-rolled sitemap so the project needs no extra dependency.
export const GET: APIRoute = () => {
  const paths = [
    '/',
    '/mockups/',
    '/bundles/',
    '/freebies/',
    '/all-access/',
    '/license/',
    '/faq/',
    '/about/',
    ...categories.map((c) => `/category/${c.slug}/`),
    ...products.filter((p) => !p.sample).map((p) => `/mockups/${p.slug}/`),
  ];
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paths.map((p) => `  <url><loc>${new URL(p, site.domain).href}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
