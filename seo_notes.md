# Notes

## PageSpeed

### Goal

Improve PageSpeed without changing routes, URLs, visual design, or the Pages Router architecture. Treat performance work as small measured batches: change one area, build, visually compare, then run PageSpeed/Lighthouse again.

### Baseline First

Before editing, record the current state:

- Run `npm run build`.
- Record `_next/static/chunks` size and largest JS/CSS chunks.
- Record `_next/static/media` fonts and image sizes.
- Record `_next/data` or exported data payload sizes.
- Run PageSpeed for mobile and desktop on key pages.
- Capture LCP breakdown, TBT, Best Practices, CLS, and Speed Index.
- Screenshot key viewports before changes.

Use this baseline to catch regressions. A PageSpeed score improvement is not enough if Best Practices, TBT, or visuals regress.

### Multilingual And Translation Bundles

Do not import full translation memory into client-side code.

Good pattern:

- Keep `.cache/translation-memory.json` server/build-time only.
- Use it from `getStaticProps`, scripts, and server-only utilities.![alt text](image.png)
- Pass only the exact runtime strings needed by the page through page props.
- Make the client translation helper read from a small `clientTranslations` map.
- Keep static page generation using the translation memory at build time.

Bad pattern:

- Importing translation memory in shared client utilities.
- Passing full translation maps to every page.
- Bundling large JSON into browser chunks.

Expected result:

- Large translation chunks disappear from browser JS.
- Static translated pages still generate normally.
- Client JS contains only page/runtime strings.

### Data Payloads

Keep page data narrow.

Good pattern:

- For archive/list pages, pass summary objects only.
- For detail pages, pass full content only for the active item.
- Create helpers like `toArchiveItem()` to strip unused fields.
- Check `_next/data` or exported HTML data payloads after each change.

Bad pattern:

- Passing every blog post body to archive pages.
- Passing full datasets to components that only need title, excerpt, image, slug, and tags.

### Images

Optimize the biggest images first.

Good pattern:

- Convert or resize oversized JPG/PNG assets while preserving crop and dimensions.
- Prefer WebP/AVIF for large photos.
- Keep only true hero/LCP images eager or high priority.
- Add `width`, `height`, `loading`, `decoding`, and `fetchpriority` where appropriate.
- Use `loading="lazy"` and `fetchpriority="low"` for below-fold images.

Bad pattern:

- Preloading multiple non-LCP images.
- Marking below-fold images as eager/high priority.
- Changing crops or layout while optimizing.

JPC LCP image pattern:

- Create a mobile-sized version of the actual LCP image when the desktop asset is much larger than the rendered mobile size.
- Preload the mobile LCP image with `media="(max-width: 780px)"`.
- Preload the desktop LCP image separately with `media="(min-width: 781px)"`.
- Point the LCP `<img src>` directly at the mobile WebP when mobile is the problem; keep desktop WebP as a `<source>` fallback for larger screens.
- Use correct intrinsic dimensions for the selected mobile asset.
- For the one real LCP image only, use `loading="eager"`, `fetchPriority="high"`, and `decoding="sync"`.

### Fonts

Fonts can affect mobile LCP, but font changes can also break multilingual rendering.

Safe approach:

- Keep existing visual font families unless the user approves a change.
- Avoid loading unused weights where clearly safe.
- Test translated pages before removing locale-specific fonts.
- Be careful with `next/font` imports: importing several fonts in shared `_app` can cause preloads on pages that do not need them.

Warning from JPC:

- Removing or changing locale font loading can affect Hindi/Arabic/Russian pages.
- Do not optimize fonts globally unless multilingual pages are visually checked.

### CSS

CSS trimming must preserve the visual baseline.

Good pattern:

- Keep Tailwind or reset CSS if the design depends on it.
- Move page-specific CSS only when visual QA is possible.
- Trim unused CSS in small batches.
- Compare mobile, tablet, and desktop after each CSS change.

Bad pattern:

- Removing Tailwind/reset CSS because it looks unused in class searches.
- Moving broad CSS imports without checking all templates.
- Adding `content-visibility` broadly without checking layout, TBT, and Best Practices.

Warning from JPC:

- Removing `@import "tailwindcss";` broke visual layout.
- Broad `content-visibility` is risky and should not be used as a first-line fix.
- Targeted mobile-only `content-visibility: auto` on sections below the hero can help reduce render delay after the LCP candidate is already correct.
- Keep the hero and header outside `content-visibility`; only defer sections below the first viewport.

### JavaScript And Third Parties

TBT regressions usually come from JS execution, often third-party scripts.

Good pattern:

- Keep critical page UI usable with minimal JS.
- Load page-specific scripts only on pages that need them.
- Split global legacy JS into smaller page/template scripts.
- Keep GTM/tracking delayed until after initial rendering.
- Use PageSpeed diagnostics to confirm whether long tasks are first-party or third-party.

Bad pattern:

- Loading homepage JS globally.
- Loading legacy scripts on unrelated pages.
- Adding new third-party work during the first few seconds.
- Fixing LCP in a way that increases TBT.

Warning from JPC:

- Mobile TBT jumped when Lighthouse executed YouTube/GTM work.
- Do not change YouTube embeds or GTM behavior in the same batch as hero LCP changes unless you measure TBT and Best Practices immediately.

### Analytics

Add analytics globally in the shared app/layout layer so static pages, generated CMS pages, and future dynamic routes all inherit it.

Good pattern:

- In Next Pages Router, put Google Analytics in `_app.tsx` with `next/script`.
- Use `strategy="afterInteractive"` for the gtag loader and inline config to avoid blocking first paint.
- Track client-side route changes with `router.events.on("routeChangeComplete")`.
- Keep the measurement ID in one constant so it is easy to update.
- Confirm the built app chunk contains the analytics ID and route-change tracking.

Important:

- With `next/script` and `afterInteractive`, the literal script may not appear in raw exported HTML source. It still loads on every hydrated page in the browser.
- If a client specifically needs the script visible in raw HTML source, use `_document.tsx` or `beforeInteractive`, then re-check PageSpeed because that can increase early third-party work.

Bad pattern:

- Copying the same gtag snippet into individual pages.
- Forgetting route-change tracking in a client-routed app.
- Loading GTM/analytics before interactive unless there is a hard business requirement.

### Hero And LCP Render Delay

Read the LCP breakdown before changing code.

If LCP has high resource load delay/duration:

- Preload the real LCP image.
- Compress/resize the LCP image.
- Add dimensions and priority hints.

If LCP has high element render delay:

- Remove reveal/animation classes from the hero/LCP element.
- Ensure hero content is present in server-rendered HTML.
- Avoid waiting for client JS to reveal the hero.
- Avoid opacity/transform/transition on the LCP element.
- Keep hero CSS simple and available in the initial stylesheet.
- Check whether Lighthouse is selecting a section/background as LCP or the actual image/text element.

JPC RCA and final safe fix:

- Initial issue: full translation memory was bundled into client JS, creating very large browser chunks.
- Second issue: the homepage hero lived inside a large legacy `dangerouslySetInnerHTML` payload and the hero markup was duplicated in serialized page props.
- Third issue: Lighthouse selected `<section class="hero-section">` as the LCP candidate because a decorative hero background image participated in mobile paint.
- After moving the decorative background out of the mobile path, Lighthouse selected the actual doctor image as LCP.
- Final issue: the image loaded early, but still had high render delay because mobile used async decode, desktop intrinsic dimensions, and below-fold layout work competed with first paint.

Final JPC homepage LCP pattern:

- Keep Pages Router.
- Keep legacy header/footer/lower sections where needed.
- Extract only the homepage hero into direct SSR JSX.
- Remove the legacy hero section from the `homepageMarkup` prop so the hero is not duplicated in `__NEXT_DATA__`.
- Keep class names and CSS structure the same for visual parity.
- Translate hero strings at build time with server-only translation utilities.
- Remove `reveal`, opacity, transform, transition, or JS dependency from the hero and LCP image.
- Do not use an external decorative background image on mobile hero; use a CSS gradient or simple color.
- Keep the desktop decorative background behind `@media (min-width: 781px)` if the desktop design needs it.
- Create a small mobile WebP for the LCP image.
- Preload mobile and desktop LCP images with matching media queries.
- Use correct mobile `width` and `height` on the LCP image.
- Use `decoding="sync"` only for the LCP image.
- Add targeted mobile-only `content-visibility: auto` to below-hero sections after confirming hero is the LCP candidate.
- Rebuild and inspect exported HTML to confirm the exact LCP attributes are present.

Bad pattern:

- Rewriting the hero into JSX plus changing fonts, GTM, CSS visibility, and YouTube in the same batch.
- Removing render delay at the cost of TBT or Best Practices.
- Leaving an external background image on the mobile hero when Lighthouse is choosing the whole section as LCP.
- Leaving the LCP image as `decoding="async"` when the image bytes load early but paint is delayed.
- Keeping desktop intrinsic dimensions on a mobile-specific LCP image.

Expected LCP progression:

- If LCP is the whole hero section, remove mobile decorative background images and make hero markup direct SSR.
- If LCP becomes the actual hero image, optimize image decode, dimensions, source, preload, and below-fold render work.
- If render delay remains high after that, investigate remaining render-blocking CSS requests before making more JS or image changes.

### Accessibility And Agentic Browsing

PageSpeed accessibility and Agentic Browsing issues can reduce the overall quality target even when Performance improves. Fix them before final deployment.

Good pattern:

- Give every `role="progressbar"` an accessible name with `aria-label` or `aria-labelledby`.
- Give icon-only or visually-empty links a discernible name with `aria-label`.
- For image-only blog cards or thumbnail links, label the link with the destination, for example `Read article: {title}`.
- Decorative images inside named links should usually have empty `alt=""` so the link name stays clean.
- Check global muted text colors against white and pale backgrounds. Aim for at least 4.5:1 contrast for normal text.
- Keep `llms.txt` as Markdown with a clear H1 and actual Markdown links, not just plain pasted URLs.

Bad pattern:

- Relying on an SVG icon or empty image alt as the only content inside a link.
- Adding ARIA roles without accessible names.
- Treating `llms.txt` as plain prose with no links. Some PageSpeed agent checks expect crawlable Markdown links.
- Changing contrast one component at a time when a safer global token change fixes the repeated issue without visual redesign.

Quick checks:

- Search for `role="progressbar"` and verify each one has a name.
- Search for anchor tags that contain only icons/images.
- Run PageSpeed Accessibility and Agentic Browsing after these fixes, not just Lighthouse Performance.

### Visual QA

Always check these viewports:

- Mobile: `360 x 740`, `390 x 844`, `430 x 932`
- Tablet portrait: `768 x 1024`, `820 x 1180`
- Tablet landscape/small laptop: `1024 x 768`, `1180 x 820`
- Desktop: `1366 x 768`, `1440 x 900`

Always check these pages:

- Homepage
- Blog archive
- One blog post
- One treatment page
- One procedure page
- Contact page
- At least one translated page if multilingual changes were made

Check:

- Header/menu visibility and no overlap.
- Hero text/image/cards are not cropped badly.
- Forms, calculators, quizzes, and menus still work.
- Footer columns do not overlap.
- Language switcher still works.

### Deployment Rule

Only deploy when:

- `npm run build` passes.
- Lint has no new errors.
- Best Practices is not reduced.
- TBT is not worse than baseline.
- Mobile and desktop visual checks pass.
- The change is scoped and explainable.

## PageSpeed Checklist

- [ ] Run `npm run build` before changes.
- [ ] Record baseline JS, CSS, data, media sizes.
- [ ] Record PageSpeed mobile and desktop metrics.
- [ ] Identify whether LCP problem is resource delay, load duration, or render delay.
- [ ] Remove full translation memory from client bundles.
- [ ] Pass only exact page/runtime translations to the browser.
- [ ] Trim archive/list page data to summary fields.
- [ ] Optimize largest images without changing crop or design.
- [ ] Mark only true LCP images eager/high priority.
- [ ] For mobile LCP images, create and preload a mobile-sized WebP.
- [ ] Use `decoding="sync"` only on the true LCP image.
- [ ] Use correct intrinsic dimensions for the selected LCP source.
- [ ] Lazy-load below-fold images with dimensions.
- [ ] Split global legacy JS into page-specific scripts.
- [ ] Keep GTM/tracking delayed after initial render.
- [ ] Add analytics once in the shared app/layout layer.
- [ ] Track client-side route changes for analytics.
- [ ] Do not remove Tailwind/reset CSS unless visual QA proves it is safe.
- [ ] Remove hero reveal/opacity/transform animation from LCP elements.
- [ ] Keep hero server-rendered and visible without client JS.
- [ ] If Lighthouse selects a hero section as LCP, remove mobile external background images from that section.
- [ ] If the hero is legacy injected HTML, extract only the hero into SSR JSX and leave lower sections alone.
- [ ] Do not duplicate the hero in serialized page props or exported data.
- [ ] Add mobile-only `content-visibility: auto` only to sections below the hero after visual QA.
- [ ] Add accessible names to progressbars and icon-only/image-only links.
- [ ] Verify muted text colors have at least 4.5:1 contrast.
- [ ] Format `llms.txt` as Markdown with H1 and Markdown links.
- [ ] Do not combine hero, font, GTM, YouTube, and CSS changes in one batch.
- [ ] After each batch, run `npm run build`.
- [ ] After each batch, compare output sizes.
- [ ] After each batch, check mobile and desktop visuals.
- [ ] After each batch, run PageSpeed on affected pages.
- [ ] Revert any change that improves LCP but worsens Best Practices, TBT, CLS, or visuals.

## Reusable Agent Prompt

Use this prompt when asking an agent to apply these learnings to another website:

```text
Use Notes.md as the PageSpeed playbook and improve this project’s PageSpeed.

Follow the checklist in the PageSpeed section exactly. First do RCA from the current build/PageSpeed data, then apply the safest high-impact fixes. Preserve routes, URLs, Pages Router/App Router architecture, visual design, Tailwind/reset CSS, tracking, and multilingual behavior.

Focus especially on:
- keeping translation memory/server-only data out of client JS
- reducing page props/data payloads
- identifying the real LCP candidate
- fixing hero/LCP render delay using the Notes.md pattern
- optimizing only true LCP images as eager/high priority
- lazy-loading below-fold images
- avoiding Best Practices, TBT, CLS, and visual regressions

After each batch:
- run build/lint
- inspect generated HTML/assets
- compare before/after sizes
- visually check mobile, tablet, and desktop key pages
- report exactly what changed and what should be tested in PageSpeed

Do not remove Tailwind or global reset CSS. Do not make broad redesigns. Do not combine risky GTM/YouTube/font/CSS changes unless clearly measured.
```
