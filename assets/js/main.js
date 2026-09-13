/* Site behaviour: theme toggle, mobile nav, scroll reveal, active section,
   copy-to-clipboard. Deliberately small — no framework, no dependencies. */

(function () {
  "use strict";

  var root = document.documentElement;

  /* --- theme ------------------------------------------------------------ */

  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("yg-theme", next); } catch (e) {}
      toggle.setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
  }

  /* --- mobile nav ------------------------------------------------------- */

  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (navToggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    };
    navToggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });
  }

  /* --- sticky header hairline ------------------------------------------- */

  var head = document.querySelector(".site-head");
  if (head) {
    var onScroll = function () { head.classList.toggle("is-stuck", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- scroll reveal ----------------------------------------------------- */

  var targets = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        reveal.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    targets.forEach(function (el) { reveal.observe(el); });
  }

  /* --- active nav section ------------------------------------------------ */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav] a[href*='#']"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").split("#")[1];
      var el = id && document.getElementById(id);
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  if (sections.length) {
    sections.sort(function (a, b) { return a.el.offsetTop - b.el.offsetTop; });

    /* Active = the last section whose top has passed just under the header.
       Comparing against one line avoids the off-by-one that happens when two
       adjacent sections both overlap a band. */
    var ticking = false;
    var syncNav = function () {
      ticking = false;
      var line = 96;
      var current = null;
      sections.forEach(function (s) {
        if (s.el.getBoundingClientRect().top <= line) current = s;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1];
      }
      sections.forEach(function (s) { s.link.classList.toggle("is-active", s === current); });
    };

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(syncNav);
    }, { passive: true });
    window.addEventListener("resize", syncNav, { passive: true });
    syncNav();
  }

  /* --- copy to clipboard ------------------------------------------------- */

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var original = btn.textContent;
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.textContent = "Copied";
        btn.classList.add("is-done");
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove("is-done");
        }, 1600);
      };
      var fallback = function () {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });
  });

  /* --- current year ------------------------------------------------------ */

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
