const projectsGrid = document.getElementById("projects-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("theme-toggle");
const contactEmailLinks = document.querySelectorAll(".contact-chip[data-email]");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.querySelector(".nav-links");

const state = {
  projects: [],
  filter: "all",
};

const groupOrder = {
  main: 0,
  course: 1,
  learning: 2,
};

const groupLabels = {
  main: "Main",
  course: "Course",
  learning: "Learning",
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

const closeNav = () => {
  if (!navLinks) return;
  navLinks.classList.remove("open");
  navToggle?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  if (!navLinks) return;
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

window.addEventListener(
  "scroll",
  () => {
    if (navLinks?.classList.contains("open")) closeNav();
  },
  { passive: true }
);

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
    return (project.projectGroup || "learning") === state.filter;
  });

  const sorted = filtered
    .map((project, index) => ({ ...project, _sortIndex: index }))
    .sort((left, right) => {
      const leftOrder = groupOrder[left.projectGroup || "learning"] ?? groupOrder.learning;
      const rightOrder = groupOrder[right.projectGroup || "learning"] ?? groupOrder.learning;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left._sortIndex - right._sortIndex;
    });

  sorted.forEach((project) => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.className = "card__title";
    title.textContent = project.title;

    const desc = document.createElement("p");
    desc.className = "card__desc";
    desc.textContent = project.description;

    const meta = document.createElement("p");
    meta.className = "card__tags";
    meta.textContent = [project.category, ...(project.techStack || [])].join(" · ");

    const links = document.createElement("div");
    links.className = "card__links";
    if (project.liveDemo) links.appendChild(buildLinkPill("Live", project.liveDemo));
    if (project.github) links.appendChild(buildLinkPill("Code", project.github));
    if (project.reportPdf) links.appendChild(buildLinkPill("Report", project.reportPdf));
    if (project.posterPdf) links.appendChild(buildLinkPill("Poster", project.posterPdf));
    if (project.fullReportPdf) links.appendChild(buildLinkPill("Full Report", project.fullReportPdf));
    if (project.video) links.appendChild(buildLinkPill("Video", project.video));

    card.appendChild(title);
    const projectGroup = project.projectGroup || "learning";

    const kicker = document.createElement("p");
    kicker.className = "card__kicker";
    kicker.textContent = `${groupLabels[projectGroup] || groupLabels.learning}${project.timeline ? ` · ${project.timeline}` : ""}`;
    card.appendChild(kicker);

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

fetch("assets/data/projects.json?v=20260603-6")
  .then((res) => res.json())
  .then((data) => {
    state.projects = data.projects || [];
    renderProjects();
  })
  .catch(() => {
    projectsGrid.innerHTML = "<p class='card__desc'>Unable to load projects right now. Please retry after a refresh.</p>";
  });
