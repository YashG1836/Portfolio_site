# yashgoyal29.in

Personal portfolio for Yash Goyal. Plain HTML, CSS and vanilla JavaScript — no framework,
no build step, no dependencies. What is in the repo is exactly what gets served.

```
.
├── index.html              home page  (hero, about, experience, work, skills, education, achievements, contact)
├── projects/index.html     the full project archive
├── 404.html
├── CNAME                   custom domain for GitHub Pages
├── favicon.svg
├── robots.txt · sitemap.xml
└── assets/
    ├── css/style.css       the entire stylesheet
    ├── js/main.js          theme, nav, scroll reveal, copy-to-clipboard
    ├── js/projects.js      renders projects — you should never need to edit this
    ├── data/projects.js    >>> ALL PROJECT CONTENT LIVES HERE <<<
    ├── img/                profile photo (webp + jpg), social card, app icon
    ├── resume/             the PDF résumé
    ├── reports/            project reports and posters
    ├── sites/              the old HTML/CSS/JS demos, served directly
    └── videos/
```

---

## Adding a project

Open **`assets/data/projects.js`**. It is one array. Copy any existing block, paste it where
you want it to appear, and change the fields. Nothing else in the repo needs to change — both
the home page and the projects page read from this file.

```js
{
  tier: "featured",                       // see the table below
  kind: "Research",                       // small grey label above the title
  title: "Under Vehicle Surveillance System",
  context: "CVIG Lab · Advisor: Prof. ...",   // optional — lab, course, advisor
  timeline: "Aug – Nov 2025",             // shown to visitors; keep the format consistent
  summary: "One or two sentences: what it is and why it exists.",
  highlights: [                           // featured tier only; 2–3 bullets
    "What you built and the technique behind it.",
    "The result, with the number if you have one."
  ],
  metric: { value: "95.7%", label: "Recall@10 on MS MARCO" },   // optional
  tech: ["Python", "PyTorch"],
  links: [
    { label: "Live demo", href: "https://..." },
    { label: "Code",      href: "https://github.com/..." },
    { label: "Report",    href: "/assets/reports/your-report.pdf" }
  ]
}
```

### `tier` — the only field that decides where a project shows up

| `tier`       | Where it appears                                              | Layout |
|--------------|---------------------------------------------------------------|--------|
| `"featured"` | Home page **and** top of `/projects/`                          | Large row with highlights and metric |
| `"course"`   | `/projects/` → "Course & team projects"                        | Compact card |
| `"applied"`  | `/projects/` → "Applied ML & side builds"                      | Compact card |
| `"early"`    | `/projects/` → "Early work", collapsed by default              | One line |

Keep `featured` to about five projects. That section is the one people actually read, and it
stops working the moment it turns into a list.

### The rest of the fields

- **`highlights`** are only rendered for `featured`. Other tiers show `summary` alone.
- **`metric`** renders a boxed headline number. Leave it out when there isn't a real one —
  an empty-sounding metric is worse than none.
- **`links`** is a plain list, so add as many as the project has. The first one is emphasised
  and the title links to it, so put the best link first (usually a live demo). A `.pdf` href
  automatically gets a document icon; everything else gets an external-link arrow.
- **`timeline`** may be omitted, but every project reads better with a date. Prefer
  `"Jan – Apr 2026"`, or just `"2025"` when the month isn't worth pinning down.
- Any field you leave out simply isn't rendered — nothing breaks and nothing shows empty.

Each project automatically gets an anchor made from its title, so you can link straight to one:
`/projects/#semantic-search-engine`.

---

## Updating everything else

| What | Where |
|---|---|
| About text, "Currently" card | `index.html` → `<section id="about">` |
| Experience and campus roles | `index.html` → `<section id="experience">` |
| Skills groups and their "used in" lines | `index.html` → `<section id="skills">` |
| Education and coursework | `index.html` → `<section id="education">` |
| Achievements | `index.html` → `<section id="achievements">` |
| Contact links and closing note | `index.html` → `<section id="contact">` |
| Résumé PDF | replace `assets/resume/Yash_Goyal_Resume.pdf`, keeping the filename |
| Profile photo | see below |
| Colours, type, spacing | the token block at the top of `assets/css/style.css` |

These sections are written directly in HTML rather than generated from data: they change once
or twice a year, and keeping them in the markup means they load with the page and are visible
to search engines.

### Replacing the profile photo

Crop the source once, then export the three sizes the page expects:

```bash
CROP="820x1025+400+320"       # width x height + xOffset + yOffset, 4:5 ratio
SRC=assets/Profile_photo/pfp2.jpeg
magick "$SRC" -crop $CROP +repage -resize 400x500  -strip -quality 80 assets/img/yash-400.webp
magick "$SRC" -crop $CROP +repage -resize 800x1000 -strip -quality 80 assets/img/yash-800.webp
magick "$SRC" -crop $CROP +repage -resize 800x1000 -strip -interlace Plane -quality 82 assets/img/yash-800.jpg
```

Keep the 4:5 ratio and the filenames — both are referenced from the stylesheet.

On desktop the photo sits in `.hero__frame`, where the lower half softens and dissolves
into the page. That is two layers in `assets/css/style.css`: `.hero__veil`, a blurred copy of
`yash-800.webp` masked so it only takes over toward the bottom, and `.hero__frame::after`,
a gradient to the page colour. Both live inside the desktop media query, so the mobile
avatar stays sharp and never downloads the second image. To show more or less of yourself,
move the mask and gradient percentages; to change how soft it gets, change `blur(12px)`.

The circular mobile version is positioned with `object-position` in `.hero__photo img`
— adjust the vertical percentage if the face sits off-centre.

---

## Running it locally

The pages use root-relative paths (`/assets/...`), so they need a server rather than opening
`index.html` from disk:

```bash
python3 -m http.server 5500
# then open http://localhost:5500
```

There is no build, no install and no `node_modules`. What you see locally is what deploys.

## Deploying

GitHub Pages serves this repository's `main` branch from the root, with `CNAME` pointing at
`yashgoyal29.in`. Pushing to `main` deploys.

Because paths are root-relative, the site must be served from a domain root — which the custom
domain gives it. If you ever drop the custom domain, the `yashg1836.github.io/Portfolio_site/`
URL would need those paths made relative.

## Notes

- Theme follows the system setting on first visit and remembers a manual choice in
  `localStorage` under `yg-theme`. An inline script in `<head>` applies it before first paint,
  so there is no flash of the wrong theme.
- Animations are limited to short fades and hover states, and are disabled entirely for
  visitors who set `prefers-reduced-motion`.
- `assets/videos/WOE_FINAL.mp4` is 77 MB and is committed directly to git. It is only fetched
  when someone clicks the demo link, but if the repo ever needs slimming, moving that file to
  YouTube or Drive and linking out is the single biggest win available.
