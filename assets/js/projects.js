/* Renders projects from assets/data/projects.js into any element carrying
   data-projects="<tier>". Nothing here needs editing to add a project. */

(function () {
  "use strict";

  var ALL = window.PROJECTS || [];

  var ICON = {
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h11v11h-2V8.41L6.41 19 5 17.59 15.59 7H8V5Z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 2v4a1 1 0 0 0 1 1h4v11H6V4h7Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h11v11h-2V8.41L6.41 19 5 17.59 15.59 7H8V5Z"/></svg>',
    chevron: '<svg class="early__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5 5.5 9 7 7.5l5 5 5-5L18.5 9 12 15.5Z"/></svg>'
  };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Stable anchor for each project, so a single project can be linked directly. */
  function slug(title) {
    return String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function isPdf(href) {
    return /\.pdf($|\?)/i.test(href);
  }

  function isExternal(href) {
    return /^https?:/i.test(href);
  }

  function linkHTML(link, primary) {
    var target = isExternal(link.href) || isPdf(link.href) || /\.(html|mp4)$/i.test(link.href)
      ? ' target="_blank" rel="noopener"'
      : "";
    return (
      '<a class="link-btn' + (primary ? " link-btn--primary" : "") + '" href="' + esc(link.href) + '"' + target + ">" +
      esc(link.label) +
      (isPdf(link.href) ? ICON.doc : ICON.ext) +
      "</a>"
    );
  }

  function linksHTML(links) {
    if (!links || !links.length) return "";
    return '<div class="links">' + links.map(function (l, i) { return linkHTML(l, i === 0); }).join("") + "</div>";
  }

  function chipsHTML(tech) {
    if (!tech || !tech.length) return "";
    return '<div class="chips">' + tech.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div>";
  }

  /* Big editorial row — featured tier. */
  function featuredHTML(p, i) {
    var titleText = esc(p.title);
    var title = p.links && p.links.length
      ? '<a href="' + esc(p.links[0].href) + '"' + (isExternal(p.links[0].href) ? ' target="_blank" rel="noopener"' : "") + ">" + titleText + ICON.arrow + "</a>"
      : titleText;

    return (
      '<article class="project" id="' + slug(p.title) + '" data-reveal>' +
        '<div class="project__rail">' +
          '<span class="project__index">' + String(i + 1).padStart(2, "0") + "</span>" +
          (p.timeline ? '<span class="project__when">' + esc(p.timeline) + "</span>" : "") +
          (p.kind ? '<span class="project__kind">' + esc(p.kind) + "</span>" : "") +
          (p.tech && p.tech.length
            ? '<ul class="stack">' + p.tech.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>"
            : "") +
        "</div>" +
        "<div>" +
          '<h3 class="project__title">' + title + "</h3>" +
          (p.context ? '<p class="project__context">' + esc(p.context) + "</p>" : "") +
          (p.summary ? '<p class="project__summary">' + esc(p.summary) + "</p>" : "") +
          (p.highlights && p.highlights.length
            ? '<ul class="project__points">' + p.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>"
            : "") +
          (p.metric
            ? '<div class="metric"><span class="metric__value">' + esc(p.metric.value) +
              '</span><span class="metric__label">' + esc(p.metric.label) + "</span></div>"
            : "") +
          chipsHTML(p.tech) +
          linksHTML(p.links) +
        "</div>" +
      "</article>"
    );
  }

  /* Compact card — course and applied tiers. */
  function cardHTML(p) {
    return (
      '<article class="card" id="' + slug(p.title) + '" data-reveal>' +
        '<div class="card__top">' +
          '<h3 class="card__title">' + esc(p.title) + "</h3>" +
          (p.timeline ? '<span class="card__when">' + esc(p.timeline) + "</span>" : "") +
        "</div>" +
        (p.context ? '<p class="project__context">' + esc(p.context) + "</p>" : "") +
        (p.summary ? '<p class="card__summary">' + esc(p.summary) + "</p>" : "") +
        chipsHTML(p.tech) +
        linksHTML(p.links) +
      "</article>"
    );
  }

  /* One line each — early tier, inside a collapsed <details>. */
  function earlyHTML(p) {
    return (
      '<div class="early__item">' +
        "<h3>" + esc(p.title) + "</h3>" +
        (p.summary ? "<p>" + esc(p.summary) + "</p>" : "") +
        linksHTML(p.links) +
      "</div>"
    );
  }

  var RENDER = { featured: featuredHTML, course: cardHTML, applied: cardHTML, early: earlyHTML };

  document.querySelectorAll("[data-projects]").forEach(function (mount) {
    var tier = mount.getAttribute("data-projects");
    var list = ALL.filter(function (p) { return p.tier === tier; });
    var render = RENDER[tier] || cardHTML;
    mount.innerHTML = list.map(render).join("");
  });

  document.querySelectorAll("[data-project-count]").forEach(function (el) {
    el.textContent = ALL.length;
  });

  document.querySelectorAll("[data-early-chevron]").forEach(function (el) {
    el.outerHTML = ICON.chevron;
  });
})();
