// Open-Graph-Bild (1200×630), wird beim Build einmal als /og.png erzeugt.
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { headline, name } from '../data/profile';

const W = 1200;
const H = 630;
const PHOTO = 340;

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const GET: APIRoute = async () => {
  const mask = Buffer.from(`<svg width="${PHOTO}" height="${PHOTO}"><rect width="${PHOTO}" height="${PHOTO}" rx="18" /></svg>`);
  const photo = await sharp('src/assets/portrait.jpg')
    .resize(PHOTO, PHOTO)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const [role, focus = ''] = headline.split(' | ');
  const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#fafaf9" />
    <rect x="0" y="0" width="12" height="${H}" fill="#0f6e6e" />
    <text x="96" y="250" font-family="${font}" font-size="76" font-weight="700" fill="#16181a" letter-spacing="-1.5">${escape(name)}</text>
    <text x="96" y="318" font-family="${font}" font-size="34" fill="#565b60">${escape(role)}</text>
    <text x="96" y="364" font-family="${font}" font-size="34" fill="#565b60">${escape(focus)}</text>
    <text x="96" y="520" font-family="${font}" font-size="26" font-weight="600" fill="#0f6e6e">${escape(new URL(import.meta.env.SITE).host)}</text>
  </svg>`;

  const png = await sharp(Buffer.from(svg))
    .composite([{ input: photo, left: W - PHOTO - 110, top: (H - PHOTO) / 2 }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
