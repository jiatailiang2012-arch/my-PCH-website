# Justin Liang · Phoenix Children’s fundraiser

A personal, responsive single-page fundraising site built with Next.js App Router, React, TypeScript, and Tailwind CSS 4. Designed for Vercel. No payment forms, payment processing, backend, analytics collection, or donor data storage.

## Run locally

Requires Node.js 20.9+ (Node 22 or 24 LTS recommended).

```sh
npm ci
npm run dev
```

Open the local URL shown in the terminal. Production checks:

```sh
npm test
npm run typecheck
npm run build
```

## Edit the content

**`src/config/site.ts` is the single content configuration.** It contains public text, member name, images and alt text, the official donation destination, fundraising data, video URL, sharing copy, metadata, and the optional canonical URL/QR image.

- **Story:** the initial 123-word story and quote are draft copy for Justin to approve. Replace them and clear `why.draftLabel` when ready. No medical history or personal volunteer experiences are invented.
- **Photos and video:** the separate portrait placeholder has been removed. Justin's personal message uses a frame from his video as its cover. Original source media remains unchanged; the website uses derived copies under `public/`.
- **Fundraising goal:** `fundraising.goal` controls the goal section. Current totals are available through the official fundraising progress link; the site does not display a duplicate total or imply live synchronization.
- **Handmade thank-you:** `thankYouGift` describes a planned optional 3D-printed keychain and thank-you card. The section is explicitly marked “In planning,” with no claim button, donation threshold, quantity, shipping promise, or annual reward. Add actual product photos and confirmed availability/fulfillment terms before offering gifts.
- **Video:** set `video.url` to a local `/videos/message.mp4`, an HTTPS MP4/WebM URL, YouTube link, or Vimeo link. Until then, clicking the thumbnail opens a clearly labeled coming-soon message. The native dialog supports Escape, focus containment, backdrop dismissal, and stops playback when closed. Supply captions in the hosted video player; a local video should include a caption track before publication.
- **QR code:** set `share.qrImage` to a real QR image after establishing the public landing-page URL. The current slot is explicitly labeled and is not a fake scannable code.
- **Donation URL:** all donation buttons and the footer fundraiser link use the single `donationUrl` setting and open the official fundraising page externally.

## Source tags and sharing

Incoming `?source=school`, `?source=family`, `?source=instagram`, and `?source=healthcare` are allowlisted by `share.allowedSources`. On hydration, the tag is added to donation links and landing-page sharing links. Unsupported tags are ignored; unrelated query parameters and page anchors are excluded from shared URLs. No cookies or tracking requests are made. Whether the official platform reports these tags depends on its capabilities.

Set `canonicalUrl` to the public landing-page URL before publishing. Otherwise share controls use the current browser URL (including localhost during development). Copy Link has a selectable-text fallback if clipboard permission is denied. Email and Text open the visitor’s chosen app; LinkedIn opens its share screen. None sends a message automatically.

## Section structure

- `src/app/page.tsx`: page composition; reorder sections here.
- `src/components/sections.tsx`: Header, Hero (campaign video, combined fundraising ask/goal and planned keepsake), VideoSection, concise MyWhy with the official Teen Council link, Share, and Footer.
- `src/components/actions.tsx`: client-only donation attribution, share controls, video dialog, and motion enhancement.
- `src/lib/links.ts`: tested URL, video, and progress helpers.
- `src/app/globals.css`: design tokens, responsive layout, component styles, and reduced-motion support. Tailwind is available throughout.

The initial HTML includes the story and donation links without JavaScript. Scroll animations progressively enhance below-the-fold content and honor reduced-motion preferences. System fonts avoid font downloads; no animation library or video iframe is loaded initially.

## Deploy to Vercel

1. Push the project to a Git repository; the `.gitignore` excludes local build files and the unrelated root media.
2. Import that repository in Vercel. Select the **Next.js** framework preset and the repository root.
3. Use `npm run build`; keep Vercel’s default output-directory setting. No environment variables are required.
4. Set `canonicalUrl` to the assigned domain, replace/approve the draft content and placeholders, and redeploy.

The project is deploy-ready; this first version does not create a Vercel deployment or publish the draft on another host.

## Sources and placeholder image

Teen Council information: https://phoenixchildrensfoundation.org/giving-groups/pch-teen-council/

Official fundraising destination supplied by the user: https://ignitehope.phoenixchildrensfoundation.org/justin-liang

Placeholder community photo by Sierra Koder, “Unity,” published November 15, 2021, under the Unsplash License:
https://unsplash.com/photos/a-group-of-people-putting-their-hands-together-g1-Kch8GznA

License: https://unsplash.com/license

This photo illustrates community and is not presented as Justin, Phoenix Children’s patients, or a hospital event.

## Local preview and hero video

The active checkout is now `C:/Users/wendy/Documents/Codex/PCH fund raising`. Run `./Start-Preview.ps1` in PowerShell from this directory to start a hidden local server at http://127.0.0.1:3000/. It can be restarted after a reboot using the same command. Logs are saved under `.preview/`. This is a local preview, not a public deployment.

The hero uses the captioned desktop/mobile MP4 files configured by `hero.video` in `src/config/site.ts`. It plays inline once, starts muted, and keeps the last frame visible when finished. Native controls provide play/pause, sound, seeking, replay, and fullscreen. Autoplay is skipped for reduced-motion or data-saving preferences. The separate personal-message video section remains independently configurable.

Four messages are burned into the video in large bold white text with a soft black shadow and outline, with direct cuts and no animation. Longer messages use two lines; only one message appears at a time. The subtitles sit in the lower part of the frame, below the girl's mouth. The first starts at 9.2 seconds as the girl's hair blows away; the next messages start at 13.2, 16.8, and 20 seconds. The original final frame is extended to make a 24-second video, leaving time to read each message. Edit `scripts/hero-subtitles.ass` and run `scripts/render-hero-subtitles.ps1 -Ffmpeg <path-to-ffmpeg.exe>` to regenerate both sizes from the untouched original `public/videos/dreamina-2026-09-20-9111.mp4`.

### Hero-first layout and mobile media

The hero video is the first main content below the compact site header. It starts muted where autoplay is allowed and retains the existing native sound controls. Reduced-motion and data-saving preferences skip autoplay. The 16:9 frame is preserved without cropping on phones. `hero.video` config contains the desktop and mobile video URLs and poster. The mobile source is selected for viewports up to 767px; desktop is the fallback. Both files use H.264 video, AAC audio, and fast-start MP4 metadata. The original source file remains unchanged.
