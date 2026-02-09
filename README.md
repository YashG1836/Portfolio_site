# Yash Goyal Portfolio

Production-ready static portfolio for Yash Goyal (B.Tech CSE, IIT Gandhinagar). Built to host all projects with a single source of truth via `projects.json`. Optimized for GitHub Pages, responsive layouts, and dark mode.

## Folder structure
```
portfolio-site/
├── index.html              # Main entry
├── assets/
│   ├── css/style.css       # Styling & theme
│   ├── js/main.js          # Data loading, filters, theming
│   ├── data/projects.json  # Project metadata (single source of truth)
│   ├── resume/Yash_Goyal_Resume.pdf
│   └── reports/ieee-sample.pdf
```

## Running locally
Fetching JSON requires serving files over HTTP.
1) Open a terminal in `portfolio-site`.
2) Run any simple server, e.g.:
   - Python: `python -m http.server 8000`
   - Node: `npx serve .`
3) Visit `http://localhost:8000`.

## Adding or updating projects
All project metadata lives in `assets/data/projects.json`.
Each entry supports:
```json
{
  "title": "Project Name",
  "category": "ML | Web | Full Stack | College",
  "techStack": ["HTML", "CSS", "JavaScript"],
  "description": "Short, action-focused summary.",
  "github": "https://github.com/...",            // optional
  "liveDemo": "https://..." or "../path/to/page.html", // optional
  "reportPdf": "assets/reports/your-report.pdf", // optional
  "video": "https://youtu.be/..."                // optional
}
```
Guidelines:
- Omit fields you do not have; the UI hides missing links.
- For local/demo HTML projects already in this repo, point `liveDemo` to the relative path (e.g., `../Amazon_Project/amz_html.html`).
- Place PDFs in `assets/reports/` and update `reportPdf` accordingly.
- Keep categories consistent with the filter buttons: `ML`, `Web`, `Full Stack`, `College`.

## Resume
Replace `assets/resume/Yash_Goyal_Resume.pdf` with the latest CV. The download button pulls from this path.

## Deploying to GitHub Pages
Option A: Deploy the `portfolio-site` folder as Pages root.
1) Commit/push the repository.
2) In GitHub → Settings → Pages, pick the branch (e.g., `main`) and set the source folder to `/portfolio-site`.
3) Save; Pages will serve `index.html` with assets.

Option B: Move contents to repo root
1) Move files from `portfolio-site/` to the repository root.
2) Set Pages source to the root of the branch.

## Project links & reports
- Hardware/report projects (Smart Highway Lighting, UVSS) link to PDFs already present at repo root (e.g., `../Elec_Project_YAssssssssssh.pdf`). Keep the repo structure intact so links remain valid.
- World of Engineering smart glove demo links its video from `../WOE_FINAL.mp4`.
- Web projects link to their existing HTML files in sibling folders.
- Streamlit apps: run locally, then use the matching ports — RAG `streamlit run Project_RAG_AI/streamlit_app.py` → `http://localhost:8501`, Spam `http://localhost:8502`, Movie Recs `http://localhost:8503`, Housing Price (California) `streamlit run Project_gurgaon/streamlit_app.py --server.port 8504` → `http://localhost:8504`.

## SEO & accessibility
- Semantic sections with proper landmarks (header, main, footer).
- Metadata description set in `index.html`.
- Filter buttons are keyboard-focusable.

## Dark mode
- System preference respected on first load.
- Manual toggle stored in `localStorage` (`yg-theme`).

## Troubleshooting
- If projects do not load locally, ensure you are running a local server (CORS prevents `file://` fetch).
- Broken links are avoided by hiding unset fields; verify external URLs manually after editing.


Student os: 5173



cd "C:\Users\YASH GOYAL\Desktop\Portfolio_Yash\projects\Student_Os - Copy - Copy\shadcn-ui" && pnpm run dev 

cd "C:\Users\YASH GOYAL\Desktop\Portfolio_Yash\projects\portfolio-site" && python -m http.server 5500

Website: yashgoyal29.in
