// Einmalig: erzeugt PNG-Fallbacks aus public/favicon.svg. Aufruf: node scripts/make-icons.mjs
import sharp from 'sharp';

const svg = 'public/favicon.svg';
await sharp(svg, { density: 384 }).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(svg, { density: 768 }).resize(180, 180).flatten({ background: '#0f6e6e' }).png().toFile('public/apple-touch-icon.png');
console.log('icons ok');
