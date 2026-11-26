# Craft & Code Labs

A single-page creative technology studio site built with React, Vite, TypeScript, GSAP, Lenis and React Three Fiber. It includes four procedural sculpture states, six interactive service studies, four product concepts and a WhatsApp enquiry flow.

## Local development

Use Node.js 22.12 or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Vite prints the local URL, normally http://127.0.0.1:5173. Restart Vite after changing environment values.

| Build variable | Value |
| --- | --- |
| `VITE_WHATSAPP_NUMBER` | The WhatsApp Business number in international format, digits only. This enables direct and form-based enquiries. |
| `VITE_INSTAGRAM_URL` | Optional HTTPS profile URL. |
| `VITE_LINKEDIN_URL` | Optional HTTPS profile URL. |
| `VITE_SITE_URL` | Production origin including `https://`. This sets canonical and social URLs and populates the sitemap. |

The enquiry form opens a prefilled WhatsApp conversation for the visitor to review and send. Blank or invalid phone configuration displays an unavailable message. The temporary CL monogram can be replaced in `public/assets/monogram.svg`. Update the companion wordmark and social image if the mark changes.

## Checks

```sh
npx playwright install chromium
npm run lint
npm run typecheck
npm test
node tests/configured-enquiries.mjs
npm run build
```

Playwright uses port 5173 by default. Set `PLAYWRIGHT_PORT` to use a different local port. The isolated configured-enquiry test intercepts every WhatsApp navigation. It uses a reserved test number and sends no messages.

## Deploy

Set the production variables in your static hosting build settings. Run `npm ci` and `npm run build`, and publish `dist/` at the configured HTTPS origin. Vite generates `robots.txt`, `sitemap.xml` and the configured metadata during the build. To inspect the output locally, use `npm run preview`. Verify the live WhatsApp destination after entering the real number.

The production build separates the heavier Three.js and React Three Fiber scene from the initial bundle. The hero displays local WebP artwork while the scene loads and on mobile, reduced-motion devices and WebGL failure.

See the [delivery record](PHASE-STATUS.md), [design system](DESIGN-SYSTEM.md) and [animation system](ANIMATION-SYSTEM.md).

## Final verification

Lint, typecheck, production build and all 15 Playwright tests passed. The separate WhatsApp check verified all seven intercepted destinations. The latest local production Lighthouse scores were 95 mobile and 100 desktop for performance and 100 for accessibility and SEO on both. See [Lighthouse results](reports/lighthouse/summary.json).
