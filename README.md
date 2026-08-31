# fadiamg.github.io

Personal portfolio — **[fadiamg.github.io](https://fadiamg.github.io)** · **[/de](https://fadiamg.github.io/de/)**

A statically-exported Next.js site that navigates sideways: eight full-screen
chapters on a horizontal spine, each with its own generative pattern. Deployed
to GitHub Pages on every push.

![Portfolio](docs/preview.png)

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Motion | [Motion](https://motion.dev) for scroll and gesture, [anime.js v4](https://animejs.com) for text and timelines |
| Patterns | Hand-written SVG generators, after [Book of Shapes](https://bookofshapes.com) |
| Fonts | Bricolage Grotesque, Familjen Grotesk, Martian Mono |
| Output | Static export — no server, no runtime |
| Hosting | GitHub Pages via GitHub Actions |

---

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build + static export → out/
npm run lint
npx tsc --noEmit
```

Node 22+ (the deploy workflow pins 22).

---

## How it works

### The deck

`HorizontalDeck` is the core idea. A tall spacer supplies scroll distance, a
sticky viewport holds the track, and vertical scroll progress maps to
horizontal translation.

Nothing is hijacked — the page is still, mechanically, scrolling down. Wheel,
trackpad, scrollbar and keyboard all keep working, so the deck can't trap
anyone. Scrolling settles onto the nearest chapter once it stops, so you never
come to rest between two.

**It falls back to ordinary vertical stacking** on narrow or coarse-pointer
devices and under `prefers-reduced-motion`. Horizontal scroll is hostile on
phones, so the fallback is the default and the deck is the enhancement.

Two knobs, both at the top of the file: `TRAVEL_VH` (scroll cost per chapter)
and the settle debounce.

### Chapter replay

Every chapter mounts at page load, so anything animating on mount would fire
for all of them at once — arriving at chapter six would show an animation that
finished minutes earlier.

`lib/chapter.tsx` carries an activity signal instead. Chapters replay their
entry animation each time they come into frame, and animation loops park
themselves when their chapter isn't the one you're looking at.

### Shapes

`lib/shapes.ts` has six generators, one per chapter: truchet tiles,
phyllotaxis, isometric cubes, Joy Division mesh, radial interference, and
lissajous curves.

Each is a pure function of a seed — no `Math.random`, no `Date` — so the server
and the client emit identical markup and React never reports a hydration
mismatch. `ShapeField` draws the strokes on with anime.js `svg.createDrawable`,
and masks each pattern away from the reading column. Unmasked, they run
straight through body copy and cost more legibility than they add atmosphere.

### Experience dial

Roles sit on the arc of a large circle whose centre is off-screen. Selecting
one rotates the arc to the reading line and expands its detail sideways.

An accordion would have been the obvious choice and the wrong one: the panel is
exactly one viewport tall, and an accordion grows downward — the one direction
with no room.

---

## Languages

English at `/`, German at `/de/`. Two statically-built pages, each with its own
`<html lang>` and reciprocal `hreflang`, so both get indexed and either can be
linked directly.

| File | Holds |
|---|---|
| `src/data/resume.ts` | CV content, English. The editing surface. |
| `src/data/content.en.ts` · `content.de.ts` | One object per locale |
| `src/data/types.ts` | The shape both must satisfy |
| `src/lib/locale.tsx` | Provider and `useLocale()` |

Both locales are typed against `Content`, so dropping a field in one language
fails the build instead of shipping a half-translated page.

> **The German has not been reviewed by a native speaker.** Professional German
> fails in ways that are invisible to a non-native author, and the audience for
> `/de/` is German employers. Have it read before relying on it.

> **Both locales serve the same English CV PDF.** Point `cvPath` in
> `content.de.ts` at a German one when you have it.

---

## Making it yours

Almost everything is data.

**Content** — all copy lives in [`src/data/resume.ts`](src/data/resume.ts):
`identity`, `profile`, `howIWork`, `experience`, `selectedWork`, `skills`,
`education`. Edit that and the whole site follows.

**Colour and type** — six CSS custom properties at the top of
[`globals.css`](src/app/globals.css), one block for light and one for dark:

```css
--bg  --fg  --dim  --ink1  --ink2  --hair
```

Change those and the entire site re-themes, dark mode included.

**Chapters** — the array in [`Portfolio.tsx`](src/components/Portfolio.tsx).
Each entry is an id, a label, a node, and optionally `span: 2` for a chapter
that needs two screens of width.

**CV** — replace `public/cv/fadi-thomas-cv.pdf`.

> Anything in `public/` is served at a guessable URL and is fully
> text-extractable. See [Privacy](#privacy).

---

## Project structure

```
src/
  app/
    (en)/            English root layout + page  → /
    (de)/de/         German root layout + page   → /de/
    globals.css      design tokens + base styles
    favicon.ico · apple-icon.png · opengraph-image.png
  components/
    HorizontalDeck   the chapter spine
    ShapeField       renders one generative pattern
    ExperienceDial   rotating role selector
    KineticHero · FlowField · WorkGallery · Cursor · Preloader · …
  data/
    resume.ts        ← CV content
    content.*.ts     per-locale objects
    types.ts         the contract
  lib/
    shapes.ts        six seeded generators
    chapter.tsx      per-chapter activity signal
    locale.tsx · theme.ts · fonts.ts · motion-preference.ts
```

---

## Accessibility

- Skip link; chapter index is a real `<nav>`; the dial is a listbox with
  `aria-activedescendant`
- `prefers-reduced-motion` respected throughout, and the deck itself falls back
  to vertical
- Text opacity is only ever set by JavaScript after mount, so a failed script
  leaves content visible rather than blank
- Minimum 44px touch targets; theme applied before first paint, so no flash
- Arrow keys move between chapters but stand down when focus is in a control

---

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on every
push to `main`: `npm ci` → `npm run build` → upload `out/` → deploy.

**One-time setup:** Settings → Pages → Source → **GitHub Actions** (*not*
"Deploy from a branch", which ignores the workflow).

Least-privilege permissions, no secrets.

---

## Privacy

- **Email is not in the HTML.** It's split across two fields and reassembled in
  the browser, so it never appears in the static markup scrapers read.
- **The CV is different.** `public/cv/*.pdf` sits at a fixed URL and its text —
  including any phone number — extracts in one command. If you don't want a
  phone number public, publish a variant without it.
- No secrets, keys or env files are tracked.

---

## Roadmap

- [ ] Per-role variants — targeted versions from the same content
- [ ] Theme presets from one config value
- [ ] German CV for `/de/`

---

## License

Code is MIT. Content — CV, copy, personal details — is not.
