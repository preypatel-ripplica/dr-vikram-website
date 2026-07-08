# Dr. Vikram Website

Next.js static website using the Pages Router structure.

## Structure

- `pages/` - route files, including `pages/index.tsx` and `pages/_app.tsx`
- `components/` - shared and homepage components
- `styles/` - global CSS and CSS modules
- `public/` - static assets copied into the export
- `content/`, `data/`, `lib/`, `scripts/` - project support folders

There is intentionally no `src/` folder and no `app/` router folder.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Static Export

```bash
npm run build
```

The build uses `output: "export"` in `next.config.ts` and generates the static site in:

```text
out/
```
