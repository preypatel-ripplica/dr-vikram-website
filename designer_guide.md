# Designer Guide For Claude-Based Website Design

This guide explains how the designer should work with Claude to design the website faster without needing to become a Next.js developer.

Claude will help you create and preview UI components, pages, responsive layouts, and animations. The development team will later connect the final design to CMS, forms, multilingual content, SEO, and production systems.

## Big Picture

You focus on:

- Visual design.
- Components.
- Sections.
- Page layouts.
- Responsive behavior.
- Animations.
- User experience polish.

Developers focus on:

- CMS connection.
- Blog generation.
- Treatment page data.
- Multilingual setup.
- Form submission.
- SEO.
- Performance.
- Accessibility.
- Deployment.

Your final output is a polished static frontend design handoff. It does not need to be the final production website.

## Step 1: Ask Claude To Initialize The Project

Start by telling Claude:

```txt
Initialize the design workflow for this project.
```

Claude should:

- Inspect the existing project.
- Create or prepare the design handoff workspace.
- Create or prepare a design lab preview page.
- Tell you how to run the website locally.

## Step 2: Verify The Project Works

Run the local website:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```
  
You should see the existing prebuilt website. This confirms the project is running correctly.

Then open:

```txt
http://localhost:3000/design-lab
```

This is your design workspace in the browser. At first it may be empty or show placeholders. As Claude creates components, they will appear here.

## Step 3: Give Claude The Shared Component List

Before designing pages, create shared components first.

Tell Claude something like:

```txt
Create the shared component list:
- Header
- Footer
- Home hero
- Inner page hero
- Appointment form
- CTA section
- FAQ section
- Testimonial section
- Treatment card grid
- Blog card grid
- Location section
```

Claude will initialize these components in the design workspace and make them visible in the design lab.

## Step 4: Work On One Component At A Time

After Claude creates the components, work component-by-component.

You do not need to run a separate command for each component. Keep `npm run dev` running, then open the component URL Claude gives you.

Claude should give you a focused preview URL like:

```txt
http://localhost:3000/design-lab?component=HeroSection
```

Open that URL in the browser. You should see only that component inside a simple preview area, with enough surrounding space to judge the design.

Ask Claude for visual changes:

```txt
Make the hero more premium, increase image presence, reduce text width, and add a soft entrance animation.
```

or:

```txt
On mobile, stack the cards and make the CTA full width.
```

Keep iterating until the component feels final.

## Step 5: Finalize Each Component

When one component is done, tell Claude:

```txt
Component HeroSection finalized. Move to AppointmentForm.
```

Claude should mark that component as finalized and give you the next focused preview URL.

Repeat this process until all shared components are finalized.

Recommended order:

1. Header.
2. Footer.
3. Hero sections.
4. Appointment/contact form.
5. CTA section.
6. Treatment/blog cards.
7. FAQ section.
8. Testimonials.
9. Location/contact section.

## Step 6: Give Claude The Website Structure

After shared components are finalized, tell Claude the website structure.

Example:

```txt
Website structure:
- Home
- Contact us
- Treatments
  - Kidney stones
  - Prostate problems
  - Urological cancer
  - Male infertility
- Blogs
- Blog detail template
- Treatment journey
- Testimonials
- Video gallery
- International patient support
```

Claude will save this structure for the developer handoff.

## Step 7: Tell Claude Which Components Each Page Uses

Next, map components to pages.

Example:

```txt
Home page should use:
- Header
- Home hero
- Treatment card grid
- Doctor intro section
- Testimonials
- FAQ
- Appointment CTA
- Footer

Contact page should use:
- Header
- Inner page hero
- Location section
- Appointment form
- FAQ
- Footer
```

Claude will use this to generate initial static page previews.

## Step 8: Review Generated Pages

Claude should give you focused page preview URLs:

```txt
http://localhost:3000/design-lab?page=home
http://localhost:3000/design-lab?page=contact-us
```

Open one page at a time. Review:

- Section order.
- Visual rhythm.
- Spacing.
- Mobile layout.
- Animations.
- Images.
- CTA placement.
- Overall page feel.

Tell Claude what to change. Example:

```txt
On the home page, add a stronger doctor intro section after the hero and make the treatment cards more visual.
```

or:

```txt
The contact page feels too long. Make the form and locations visible earlier.
```

## Step 9: Add Page-Specific Sections

Some sections will not be shared. They may exist only on one page.

Examples:

- Home doctor intro.
- Treatment recovery timeline.
- Blog author block.
- International patient travel support timeline.
- Video gallery featured video.

Ask Claude to add these when needed:

```txt
Add a page-specific recovery timeline section to the treatment detail page.
```

Claude should add it only to that page preview unless you say it should become shared.

## Step 10: Work On Animations

Animations are part of your design work.

You can ask Claude for:

- Hero entrance animation.
- Scroll reveal.
- Card stagger animation.
- Hover effects.
- Accordion animation.
- Sticky section behavior.
- Subtle CTA motion.

Example:

```txt
Add scroll reveal to each treatment card, with a soft upward motion and staggered delay.
```

Keep animations tasteful and useful. Developers may later optimize or adjust them for production.

## Step 11: Finalize Pages

When a page is done, tell Claude:

```txt
Page Home finalized.
```

Claude should update the handoff notes.

Continue page-by-page until all important pages and templates are finalized.

## What You Should Not Worry About

You do not need to solve:

- CMS fields.
- Blog backend.
- Multilingual routing.
- Form backend.
- SEO code.
- API routes.
- Deployment.
- Sitemap.
- Schema markup.
- Production performance tuning.

The developer team will handle these.

## What To Check Before Final Handoff

For each finalized component or page, check:

- It looks good on desktop.
- It looks good on mobile.
- Text does not overlap.
- Buttons are readable.
- Images crop well.
- Animations feel smooth.
- The section order makes sense.
- The CTA is clear.
- The design feels consistent with the rest of the website.

## Final Handoff

At the end, tell Claude:

```txt
Prepare the developer handoff notes.
```

Claude should summarize:

- Finalized components.
- Finalized pages.
- Page structure.
- Which components each page uses.
- Assets used.
- Animation notes.
- Responsive notes.
- Open design questions.

That handoff is what developers will use to build the production-ready Next.js website.
