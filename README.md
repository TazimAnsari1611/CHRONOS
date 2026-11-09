# CHRONOS

A cinematic, responsive journey through 21 historical periods from year 000 to
2026, built with the Next.js App Router, TypeScript, Tailwind CSS, GSAP,
ScrollTrigger, Lenis, and Zustand.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. Use the
chapter selector, previous/next controls, or ordinary scrolling to travel.
Reduced-motion preferences disable smooth scrolling and pinned scene effects.

## Historical imagery and credits

Each century hero uses a locally optimized WebP photograph or digitized
historical object sourced from Wikimedia Commons. Its author, license, and
source page are recorded in `src/data/eraImageCredits.json`; the image credit
link is shown in the scene. The gallery pairs these sources with the original
SVG artistic reconstructions in `public/images/centuries/`.
The historical images are resized and converted to WebP for local delivery.

The Wikimedia Commons source pages contain the full license terms and
attribution details. Images are bundled locally to avoid runtime dependence on
third-party image hosts.

## Deployment

Run `npm run lint` and `npm run build`, then deploy the project to Vercel using
the default Next.js settings.
