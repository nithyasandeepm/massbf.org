# massbf.org

An Astro.js static website with Tailwind CSS v4.

## Tech Stack

- **Framework**: Astro v5
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **Package Manager**: Bun
- **Linting/Formatting**: Biome, Prettier

## Project Structure

- `src/pages/` - Astro pages (index, events, donate)
- `src/components/` - Reusable Astro components (Navbar, DonateButton)
- `src/layouts/` - Page layouts
- `src/content/` - Markdown content files
- `public/` - Static assets

## Development

- **Dev server**: `bun run dev` on port 5000 (host 0.0.0.0)
- **Build**: `bun run build` outputs to `dist/`

## Deployment

Configured as a static site deployment with `bun run build` and `dist/` as the public directory.
