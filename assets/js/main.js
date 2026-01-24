const projectsGrid = document.getElementById("projects-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("theme-toggle");
const contactEmailLinks = document.querySelectorAll(".contact-chip[data-email]");

const state = {
  projects: [],
  filter: "all",
};

const getPreferredTheme = () => {
  const stored = localStorage.getItem("yg-theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const applyTheme = (theme) => {
  if (theme === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("light");
    themeToggle.textContent = "🌙";
  }
  localStorage.setItem("yg-theme", theme);
};

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(nextTheme);
});

applyTheme(getPreferredTheme());

// Copy email to clipboard, then open compose link
contactEmailLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const email = link.dataset.email;
    if (!email) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    // allow default navigation to Gmail compose (href)
  });
});

const buildLinkPill = (label, href) => {
  const a = document.createElement("a");
  a.className = "link-pill";
  a.href = href;
  a.target = "_blank";
  a.rel = "noreferrer";
  a.textContent = label;
  return a;
};

const renderProjects = () => {
  if (!projectsGrid) return;
  projectsGrid.innerHTML = "";
  const filtered = state.projects.filter((project) => {
    if (state.filter === "all") return true;
    return project.category === state.filter;
  });

  filtered.forEach((project) => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.className = "card__title";
    title.textContent = project.title;

    const desc = document.createElement("p");
    desc.className = "card__desc";
    desc.textContent = project.description;

    const meta = document.createElement("div");
    meta.className = "card__meta";
    const categoryChip = document.createElement("span");
    categoryChip.className = "meta-chip";
    categoryChip.textContent = project.category;
    meta.appendChild(categoryChip);

    (project.techStack || []).forEach((tech) => {
      const chip = document.createElement("span");
      chip.className = "meta-chip";
      chip.textContent = tech;
      meta.appendChild(chip);
    });

    const links = document.createElement("div");
    links.className = "card__links";
    if (project.liveDemo) links.appendChild(buildLinkPill("Live", project.liveDemo));
    if (project.github) links.appendChild(buildLinkPill("Code", project.github));
    if (project.reportPdf) links.appendChild(buildLinkPill("Report", project.reportPdf));
    if (project.posterPdf) links.appendChild(buildLinkPill("Poster", project.posterPdf));
    if (project.fullReportPdf) links.appendChild(buildLinkPill("Full Report", project.fullReportPdf));
    if (project.video) links.appendChild(buildLinkPill("Video", project.video));

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(meta);
    if (links.childElementCount) card.appendChild(links);

    projectsGrid.appendChild(card);
  });
};


filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.filter = btn.dataset.filter;
    renderProjects();
  });
});

fetch("assets/data/projects.json")
  .then((res) => res.json())
  .then((data) => {
    state.projects = data.projects || [];
    renderProjects();
  })
  .catch(() => {
    projectsGrid.innerHTML = "<p class='card__desc'>Unable to load projects right now. Please retry after a refresh.</p>";
  });
