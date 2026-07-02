# ToolNova — Brand Guidelines

## Logo
The mark is a "nova burst" — four rounded petals converging on a bright core point, symbolizing speed, convergence (many tools, one place), and a spark of instant results.

- `assets/logo-mark.svg` — icon only, use for favicon / app icon / social avatar
- `assets/logo-full-dark.svg` — full lockup for dark backgrounds
- `assets/logo-full-light.svg` — full lockup for light backgrounds

**Clear space:** keep padding around the mark equal to at least the height of the core dot.
**Don't:** recolor the burst outside the brand gradient, stretch it non-uniformly, or place it on a busy photographic background without a solid backing shape.

To get PNG/ICO exports (app store icons, .ico favicon), run any of the SVGs above through a converter such as realfavicongenerator.net — the source files here are vector and print/scale cleanly at any size.

## Color palette
| Token | Hex | Use |
|---|---|---|
| Ink | `#0B0E14` | Primary dark background |
| Surface | `#12161F` | Cards, panels (dark mode) |
| Border | `#262C3A` | Dividers, card borders (dark mode) |
| Text | `#E7EAF0` | Primary text (dark mode) |
| Muted | `#8891A6` | Secondary text |
| Nova 1 | `#FF6B4A` | Primary accent (coral) |
| Nova 2 | `#7C5CFF` | Secondary accent (violet) |

The signature "nova gradient" is `linear-gradient(135deg, #FF6B4A, #7C5CFF)` — used for the logo, primary buttons, and category icons only. Keep it rare so it stays a signal, not wallpaper.

## Typography
- **Display / headings:** Space Grotesk (700) — geometric, technical, a little unconventional
- **Body:** Inter (400/500/600) — neutral, highly legible at small sizes
- **Utility / code / tool output:** JetBrains Mono — used inside tool inputs and outputs to signal "this is data, not prose"

## Voice
Direct, plain-spoken, no hype. Say what a tool does, not why it's the best. Never apologize with filler ("Oops! Something went wrong!") — state what happened and what to do next.

## Usage across the site
"ToolNova" is used consistently in: browser titles, the nav logo, footer, meta titles/descriptions, Open Graph tags, JSON-LD structured data, the copyright line, robots.txt/sitemap references, and all legal pages. No placeholder brand names appear anywhere in the codebase.
