# NYAYA.AI — Website

Public marketing site for NYAYA.AI, an AI case intelligence platform for
Indian legal practice.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

The build output is written to `dist/`, ready to deploy to any static host
(Vercel, Netlify, S3 + CloudFront, etc).

## Before going live

- Update `CONTACT` in `src/js/main.js` with your real WhatsApp numbers and
  email addresses.
- Replace the placeholder video at `public/assets/video/nyaya-demo.mp4` with
  the real product demo once it's ready.
- Swap the illustration SVGs in `public/assets/images/` for licensed
  photography if you'd like real photos instead of illustrations.

## Structure

```
index.html            Home page
privacy.html           Privacy policy
terms.html             Terms of use
src/styles/style.css   All styling
src/js/main.js         Nav, reveal animations, product showcase, contact links
public/assets/         Images, product screenshots, video
```
