/* ==========================================================================
   Remon Younan — portfolio renderer
   Zero-build. Reads window.SITE_CONFIG and populates the DOM per page.
   Empty string ("") or empty array ([]) in config hides the element.
   ========================================================================== */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var page = document.body.getAttribute("data-page");

  /* ---------- tiny helpers ---------- */
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function has(v) {
    return (
      v !== undefined &&
      v !== null &&
      v !== "" &&
      !(Array.isArray(v) && v.length === 0)
    );
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }
  function set(sel, value) {
    var n = $(sel);
    if (!n) return;
    if (has(value)) n.textContent = value;
    else n.remove();
  }
  function firstImage(p) {
    if (has(p.cover)) return p.cover;
    if (has(p.gallery)) return p.gallery[0];
    return "";
  }
  var ARROW =
    '<svg class="arrow" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHEVRON =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  var CHECK =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  var WHATSAPP_ICON =
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.02 8.02 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.1 8.09a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.03 8.03 0 0 1-1.24-4.3c0-4.46 3.63-8.09 8.1-8.09Zm4.68 10.29c-.06-.11-.24-.18-.5-.31-.26-.13-1.54-.76-1.78-.85-.24-.09-.42-.13-.6.13-.18.26-.68.85-.83 1.03-.15.18-.31.2-.57.07-.26-.13-1.09-.4-2.08-1.28-.77-.69-1.29-1.53-1.44-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.16.17-.26.26-.44.09-.18.04-.33-.02-.46-.06-.13-.6-1.45-.83-1.98-.22-.52-.44-.45-.6-.46l-.51-.01c-.18 0-.46.07-.7.33-.24.26-.92.9-.92 2.2 0 1.3.94 2.55 1.07 2.73.13.18 1.85 2.82 4.48 3.96.63.27 1.11.43 1.49.55.63.2 1.2.17 1.65.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24Z"/></svg> ';
  var LINKEDIN_ICON =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.98v-6.57c0-3.7 4.82-4 4.82 0V21H22v-7.94c0-6.22-7.12-5.99-8.68-2.93V8.48Z"/></svg> ';

  /* ---------- store marks ----------
     Official silhouettes, not approximations: the Apple mark (24-grid) and the
     Google Play triangle (512-grid, four segments in the brand colorway). Both
     are shared by the project-card glyph row and the detail-page badges. */
  var APPLE_PATH =
    "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701";
  var PLAY_PATHS =
    '<path fill="#00D2FF" d="M32.139 20.116C25.698 28.679 21.99 39.193 21.99 50.315v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116z"/>' +
    '<path fill="#00E676" d="M99.617 8.057a50.191 50.191 0 0 0-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057z"/>' +
    '<path fill="#FFCE00" d="M464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907z"/>' +
    '<path fill="#FF3A44" d="M60.802 511.354a50.192 50.192 0 0 0 38.815-6.713l290.156-165.239-74.846-74.846L60.802 511.354z"/>';
  function appleMark(size) {
    return (
      '<svg class="store-badge__icon" width="' +
      size +
      '" height="' +
      size +
      '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' +
      APPLE_PATH +
      '"/></svg>'
    );
  }
  function playMark(size) {
    return (
      '<svg class="store-badge__icon" width="' +
      size +
      '" height="' +
      size +
      '" viewBox="0 0 512 512" aria-hidden="true">' +
      PLAY_PATHS +
      "</svg>"
    );
  }

  /* ---------- testimonial rail ----------
     Horizontal carousel: arrow buttons, pointer drag, and an edge mask that
     only fades the side that still has cards behind it. Native scroll does the
     work on touch, so this only adds the desktop affordances. */
  function initTestimonialRail(rail) {
    var nav = $("[data-tst-nav]");
    var prev = $("[data-tst-prev]");
    var next = $("[data-tst-next]");

    function step() {
      var card = rail.querySelector(".tst-card");
      if (!card) return rail.clientWidth;
      var gap = parseFloat(getComputedStyle(rail).columnGap || "20") || 20;
      return card.getBoundingClientRect().width + gap;
    }

    function sync() {
      var max = rail.scrollWidth - rail.clientWidth;
      var overflows = max > 4;
      if (nav) nav.hidden = !overflows;
      /* Only claim the rail is draggable while there is somewhere to drag to. */
      rail.classList.toggle("is-draggable", overflows);
      var x = rail.scrollLeft;
      rail.style.setProperty("--fade-l", x > 4 ? "44px" : "0px");
      rail.style.setProperty("--fade-r", x < max - 4 ? "44px" : "0px");
      if (prev) prev.disabled = x <= 4;
      if (next) next.disabled = x >= max - 4;
    }

    var calm =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function nudge(dir) {
      rail.scrollBy({ left: dir * step(), behavior: calm ? "auto" : "smooth" });
    }

    if (prev) prev.addEventListener("click", function () { nudge(-1); });
    if (next) next.addEventListener("click", function () { nudge(1); });

    rail.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); nudge(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-1); }
    });

    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    /* Drag to scroll with a mouse. Touch already scrolls natively, and a
       pen/touch pointer here would fight it, so only mouse is captured. */
    var down = false, startX = 0, startLeft = 0, moved = 0;
    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = 0;
      startX = e.clientX;
      startLeft = rail.scrollLeft;
    });
    rail.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 4) return;
      if (!moved) {
        moved = 1;
        rail.classList.add("is-dragging");
        rail.setPointerCapture(e.pointerId);
        /* A selection started in the first few pixels would fight the drag and
           leave the quote highlighted; user-select:none only lands from here. */
        var sel = window.getSelection && window.getSelection();
        if (sel && sel.removeAllRanges) sel.removeAllRanges();
      }
      rail.scrollLeft = startLeft - dx;
    });
    function release(e) {
      if (!down) return;
      down = false;
      rail.classList.remove("is-dragging");
      if (e && e.pointerId !== undefined && rail.hasPointerCapture(e.pointerId)) {
        rail.releasePointerCapture(e.pointerId);
      }
    }
    rail.addEventListener("pointerup", release);
    rail.addEventListener("pointercancel", release);

    sync();
    /* Card widths use clamp(), so measure again once fonts/layout settle. */
    setTimeout(sync, 200);
  }

  /* ---------- capability icons ---------- */
  var ICONS = {
    signal:
      '<path d="M4.9 16.1a10 10 0 0 1 0-8.2M8 13.5a5 5 0 0 1 0-3M19.1 7.9a10 10 0 0 1 0 8.2M16 10.5a5 5 0 0 1 0 3"/><circle cx="12" cy="12" r="1.6"/>',
    call: '<path d="M15.5 3a5.5 5.5 0 0 1 5.5 5.5M14.8 6.4a2.5 2.5 0 0 1 2.8 2.8"/><path d="M4.5 5.5A1.5 1.5 0 0 1 6 4h2.2a1.5 1.5 0 0 1 1.5 1.3l.5 3a1.5 1.5 0 0 1-.7 1.5l-1.3.8a12 12 0 0 0 5 5l.8-1.3a1.5 1.5 0 0 1 1.5-.7l3 .5a1.5 1.5 0 0 1 1.3 1.5V18a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 4.5 5.5Z"/>',
    sync: '<path d="M20 11a8 8 0 0 0-14.3-4.3M4 5v3h3"/><path d="M4 13a8 8 0 0 0 14.3 4.3M20 19v-3h-3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 6 2.5 7 2.5 7H3.5S6 14 6 8Z"/><path d="M10.5 20a1.7 1.7 0 0 0 3 0"/>',
    code: '<path d="m9 8-4 4 4 4M15 8l4 4-4 4"/>',
    gauge:
      '<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="m14 10 3-3"/><path d="M4.5 18a9 9 0 1 1 15 0"/>',
    link: '<path d="M10.2 13.8a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.5 1.5"/><path d="M13.8 10.2a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.5-1.5"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="9.5" rx="2.2"/><path d="M8.2 10.5V7.4a3.8 3.8 0 0 1 7.6 0v3.1"/><path d="M12 14.3v2.4"/>',
    wrench:
      '<path d="M15.6 3.6a5.5 5.5 0 0 0-4.9 8l-6.4 6.4a2 2 0 0 0 2.8 2.8l6.4-6.4a5.5 5.5 0 0 0 6.8-7l-3.1 3.1-2.7-.7-.7-2.7 3.1-3.1a5.5 5.5 0 0 0-1.3-.4Z"/>',
  };
  function capIcon(name) {
    var p = ICONS[name] || ICONS.code;
    return (
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      p +
      "</svg>"
    );
  }

  /* ---------- theme ---------- */
  var SUN =
    '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON =
    '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }
  function paintToggle() {
    var isDark = currentTheme() === "dark";
    if (typeof window.paintThemeColor === "function") window.paintThemeColor();
    $all("[data-theme-toggle]").forEach(function (b) {
      b.innerHTML = isDark ? SUN : MOON;
      b.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme",
      );
    });
  }
  /** Rewrite a <meta name> in place, or add it if the page has none. */
  function setMeta(name, content) {
    if (!content) return;
    var m = document.querySelector('meta[name="' + name + '"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", name);
      document.head.appendChild(m);
    }
    m.setAttribute("content", content);
  }

  /** Point <link rel="canonical"> at a path relative to the canonical host. */
  function setCanonical(path) {
    var link = document.querySelector('link[rel="canonical"]');
    if (!link) return;
    var base = link.getAttribute("href").replace(/\/[^/]*$/, "/");
    link.setAttribute("href", base + path);
  }

  function initTheme() {
    paintToggle();
    $all("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try {
          localStorage.setItem("theme", next);
        } catch (e) {}
        paintToggle();
        /* The boot script paints <meta name="theme-color"> once, so without
           this the browser chrome keeps the colour the page loaded with and a
           flip to dark leaves a cream status bar above a black page. */
        if (typeof window.paintThemeColor === "function") window.paintThemeColor();
      });
    });
  }

  /* ---------- nav (shared) ---------- */
  function initNav() {
    var brand = $("[data-brand]");
    if (brand && has(C.name)) {
      brand.innerHTML = '<span class="nav__brand-dot"></span>' + esc(C.name);
    }

    // availability marker
    $all("[data-availability]").forEach(function (n) {
      if (has(C.availability))
        n.innerHTML =
          '<span class="chip"><span class="chip__dot"></span>' +
          esc(C.availability) +
          "</span>";
      else n.remove();
    });

    // primary CTAs → mailto
    var mail = has(C.email) ? "mailto:" + C.email : "";
    $all("[data-nav-cta]").forEach(function (a) {
      if (mail) a.setAttribute("href", mail);
      else a.remove();
    });

    // mobile menu
    var nav = $("#nav");
    var toggle = $("[data-menu-toggle]");
    if (toggle) {
      toggle.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      $all("[data-menu] a").forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    // scrolled border
    function onScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- footer + contact (shared) ---------- */
  function initShared() {
    var year = new Date().getFullYear();
    set("[data-copyright]", "© " + year + " " + (C.name || ""));

    var links = $("[data-footer-links]");
    if (links) {
      var social = [
        ["GitHub", C.github],
        ["LinkedIn", C.linkedin],
        ["WhatsApp", has(C.whatsapp) ? "https://wa.me/" + C.whatsapp : ""],
        ["Twitter", C.twitter],
        ["Email", has(C.email) ? "mailto:" + C.email : ""],
      ];
      var any = false;
      social.forEach(function (s) {
        if (!has(s[1])) return;
        any = true;
        var a = el("a", null, esc(s[0]));
        a.href = s[1];
        if (s[1].indexOf("http") === 0) {
          a.target = "_blank";
          a.rel = "noopener";
        }
        links.appendChild(a);
      });
      if (!any) links.remove();
    }

    // contact panel (index + projects)
    set("[data-contact-heading]", C.contactHeading);
    set("[data-contact-text]", C.contactText);
    $all("[data-contact-cta]").forEach(function (a) {
      if (has(C.email)) a.setAttribute("href", "mailto:" + C.email);
      else a.remove();
    });
    set("[data-contact-cta-label]", has(C.email) ? "Start your project" : "");

    // Lower-friction channels under the email CTA (WhatsApp + LinkedIn).
    $all("[data-contact-links]").forEach(function (box) {
      var chans = [];
      if (has(C.whatsapp))
        chans.push(["https://wa.me/" + C.whatsapp, WHATSAPP_ICON + "WhatsApp"]);
      if (has(C.linkedin)) chans.push([C.linkedin, LINKEDIN_ICON + "LinkedIn"]);
      if (!chans.length) {
        box.remove();
        return;
      }
      box.innerHTML = chans
        .map(function (c) {
          return (
            '<a class="btn btn--ghost btn--sm" href="' +
            esc(c[0]) +
            '" target="_blank" rel="noopener">' +
            c[1] +
            "</a>"
          );
        })
        .join("");
    });
  }

  /* ---------- reveal + count-up ---------- */
  function initReveal() {
    var items = $all(".reveal");
    if (!("IntersectionObserver" in window) || !items.length) {
      items.forEach(function (n) {
        n.classList.add("in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach(function (n) {
      io.observe(n);
    });
  }

  function countUp(node, target, suffix) {
    // Preserve one decimal for non-integer targets (e.g. a 4.6 rating) —
    // Math.round would turn 4.6 into 5.
    var isFloat = target % 1 !== 0;
    function fmt(n) {
      return isFloat ? Number(n).toFixed(1) : Math.round(n);
    }
    var suffixHtml = suffix
      ? '<span class="suffix">' + esc(suffix) + "</span>"
      : "";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      node.innerHTML = fmt(target) + suffixHtml;
      return;
    }
    var dur = 1400,
      start = null;
    function frame(t) {
      if (start == null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      node.innerHTML = fmt(target * eased) + suffixHtml;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ========================================================================
     HOME
     ======================================================================== */
  function renderHome() {
    // hero
    var eyebrow = $("[data-hero-eyebrow]");
    if (eyebrow) {
      var focus = has(C.focus) ? C.focus : "I design and build mobile apps";
      var loc = has(C.location) ? " · " + C.location.split(",")[0] : "";
      eyebrow.textContent = focus + loc;
    }
    set("[data-hero-title]", "Your idea, live in the app stores.");
    set("[data-hero-sub]", C.tagline);

    var primary = $("[data-hero-primary]");
    if (primary && has(C.email))
      primary.setAttribute("href", "mailto:" + C.email);

    var note = $("[data-hero-note]");
    if (note) {
      note.innerHTML =
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> I reply within 24 hours';
    }

    // hero wall = drifting collage of screenshots from every project
    var wallEl = $("[data-hero-wall]");
    var projects = has(C.projects) ? C.projects : [];
    if (wallEl) buildHeroWall(wallEl, projects);

    // strengths marquee (thin ticker between hero and stats)
    var marqueeEl = $("[data-strengths-marquee]");
    if (marqueeEl) buildMarquee(marqueeEl, has(C.strengths) ? C.strengths : []);

    // stats
    var statsWrap = $("[data-stats]");
    if (statsWrap) {
      if (!has(C.stats)) {
        var ss = $("[data-stats-section]");
        if (ss) ss.remove();
      } else {
        C.stats.forEach(function (s) {
          var card = el("div", "stat reveal");
          // countUp rewrites .stat__value's innerHTML on every frame, so an icon
          // has to sit beside that node rather than inside it — hence the
          // wrapper, which is only added when the stat actually asks for one.
          var value =
            '<div class="stat__value" data-count="' +
            s.value +
            '" data-suffix="' +
            esc(s.suffix || "") +
            '">0</div>';
          // Icon trails the digits, the side the gold suffixes sit on in the
          // other stats ("100k+", "4.6★"), so all three read the same way.
          if (has(s.icon))
            value =
              '<div class="stat__figure">' +
              value +
              '<span class="stat__icon" aria-hidden="true">' +
              metricIcon(s.icon) +
              "</span></div>";
          card.innerHTML =
            value + '<div class="stat__label">' + esc(s.label) + "</div>";
          statsWrap.appendChild(card);
        });
        // count-up when strip enters
        var strip = $("[data-stats-section]");
        var fired = false;
        if ("IntersectionObserver" in window) {
          var io = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (e) {
                if (e.isIntersecting && !fired) {
                  fired = true;
                  $all("[data-count]", strip).forEach(function (n) {
                    countUp(
                      n,
                      parseFloat(n.getAttribute("data-count")),
                      n.getAttribute("data-suffix"),
                    );
                  });
                  io.disconnect();
                }
              });
            },
            { threshold: 0.4 },
          );
          io.observe(strip);
        } else {
          $all("[data-count]", strip).forEach(function (n) {
            countUp(
              n,
              parseFloat(n.getAttribute("data-count")),
              n.getAttribute("data-suffix"),
            );
          });
        }
      }
    }

    // capabilities
    var caps = $("[data-caps]");
    if (caps) {
      if (!has(C.capabilities)) {
        var cs = $("[data-caps-section]");
        if (cs) cs.remove();
      } else {
        C.capabilities.forEach(function (cap, i) {
          var card = el("article", "cap-card reveal");
          card.style.transitionDelay = i * 40 + "ms";
          card.innerHTML =
            '<span class="cap-card__icon">' +
            capIcon(cap.icon) +
            "</span>" +
            "<h3>" +
            esc(cap.title) +
            "</h3>" +
            "<p>" +
            esc(cap.text) +
            "</p>";
          caps.appendChild(card);
        });
      }
    }

    // featured work (one featured card + a 2x2 grid on the landing page)
    var HOME_WORK = 5;
    var work = $("[data-work]");
    if (work) {
      projects.slice(0, HOME_WORK).forEach(function (p, i) {
        work.appendChild(projectCard(p, i === 0));
      });
    }

    // The section-head link is easy to scroll past, so the rest of the work is
    // also offered as a highlighted band at the end of the grid - in the
    // reading path, with the covers of what is behind it as the proof there is
    // more. No counts: the names carry it, and they never go stale.
    var more = $("[data-work-more]");
    if (more) {
      var rest = projects.slice(HOME_WORK);
      if (!rest.length) more.remove();
      else {
        more.hidden = false;
        more.setAttribute("aria-label", "Browse every project");
        more.innerHTML =
          '<span class="work-more__thumbs" aria-hidden="true">' +
          rest
            .slice(0, 4)
            .map(function (p) {
              var img = firstImage(p);
              return img
                ? '<span class="work-more__thumb"><img src="' +
                    esc(imgSrc(img, IMG_WIDTHS[0])) +
                    '" alt="" loading="lazy" decoding="async" /></span>'
                : '<span class="work-more__thumb work-more__thumb--glyph">' +
                    esc(initials(p.name)) +
                    "</span>";
            })
            .join("") +
          "</span>" +
          '<span class="work-more__text">' +
          '<span class="work-more__kicker">More work</span>' +
          '<strong class="work-more__title">Every app, with the story behind it.</strong>' +
          '<span class="work-more__sub">' +
          esc(
            rest
              .slice(0, 3)
              .map(function (p) {
                return shortName(p.name);
              })
              .join(" · "),
          ) +
          (rest.length > 3 ? " and more" : "") +
          "</span>" +
          "</span>" +
          '<span class="work-more__cta">Browse all projects' +
          ARROW +
          "</span>";
      }
    }

    // experience
    var roster = $("[data-experience]");
    if (roster) {
      // `showExperience` is the switch; the entries themselves are the other
      // gate. Only an explicit `false` hides it, so a config missing the flag
      // keeps behaving as it did.
      if (C.showExperience === false || !has(C.experience)) {
        var xs = $("[data-experience-section]");
        if (xs) xs.remove();
      } else {
        groupExperience(C.experience).forEach(function (g, i) {
          roster.appendChild(stintEntry(g, i === 0));
        });
      }
    }

    // testimonials
    var tst = $("[data-testimonials]");
    if (tst) {
      if (!has(C.testimonials)) {
        var ts = $("[data-testimonials-section]");
        if (ts) ts.remove();
      } else {
        C.testimonials.forEach(function (t) {
          var card = el("article", "tst-card");
          card.innerHTML =
            '<div class="tst-card__top">' +
            '<span class="tst-card__mark" aria-hidden="true">“</span>' +
            (has(t.myRole)
              ? '<span class="tst-card__work">' + esc(t.myRole) + "</span>"
              : "") +
            "</div>" +
            '<p class="tst-card__quote">' +
            esc(t.quote) +
            "</p>" +
            '<div class="tst-card__who">' +
            '<span class="tst-card__name">' +
            esc(t.name) +
            "</span>" +
            (has(t.role)
              ? '<span class="tst-card__role">' + esc(t.role) + "</span>"
              : "") +
            "</div>";
          tst.appendChild(card);
        });
        initTestimonialRail(tst);
      }
    }

    // process
    var proc = $("[data-process]");
    if (proc) {
      if (!has(C.process)) {
        var ps = $("[data-process-section]");
        if (ps) ps.remove();
      } else {
        C.process.forEach(function (step, i) {
          var s = el("div", "step reveal");
          s.style.transitionDelay = i * 50 + "ms";
          s.innerHTML =
            '<div class="step__num">0' +
            (i + 1) +
            "</div>" +
            "<h3>" +
            esc(step.title) +
            "</h3>" +
            "<p>" +
            esc(step.text) +
            "</p>";
          proc.appendChild(s);
        });
      }
    }

    // about
    var bio = $("[data-bio]");
    if (bio && has(C.bio)) bio.innerHTML = boldNumbers(C.bio);
    else if (bio) bio.remove();

    set("[data-availability-text]", C.availability);
    var locChip = $("[data-location-chip]");
    if (locChip) {
      if (has(C.location)) locChip.innerHTML = pinIcon() + esc(C.location);
      else locChip.remove();
    }

    // pitch bullets
    var pitch = $("[data-pitch]");
    if (pitch) {
      if (!has(C.pitch)) {
        var pc = $("[data-pitch-card]");
        if (pc) pc.remove();
      } else {
        C.pitch.forEach(function (line) {
          /* A bullet is either a plain string or { text, lead } — `lead` pulls
             the line out as the card's headline. */
          var item = typeof line === "string" ? { text: line } : line || {};
          if (!has(item.text)) return;
          var li = el("li", item.lead ? "is-lead" : "");
          li.innerHTML =
            '<span class="pitch-check">' +
            CHECK +
            "</span><span>" +
            esc(item.text) +
            "</span>";
          pitch.appendChild(li);
        });
      }
    }

    // skills (flatten grouped skills into tags)
    var skills = $("[data-skills]");
    if (skills) {
      var flat = [];
      if (C.skills && typeof C.skills === "object") {
        Object.keys(C.skills).forEach(function (k) {
          (C.skills[k] || []).forEach(function (t) {
            if (flat.indexOf(t) === -1) flat.push(t);
          });
        });
      }
      if (!flat.length) skills.remove();
      else
        flat.slice(0, 12).forEach(function (t) {
          skills.appendChild(el("span", "tech-tag", esc(t)));
        });
    }

    // contact eyebrow already static
  }

  function boldNumbers(text) {
    // Bold %/number-ish phrases. Match on the RAW text and escape each piece
    // as we go — escaping first would let the regex hit the digits inside an
    // entity ("aren&#39;t" → "aren&<strong>39</strong>;t") and print it raw.
    var re = /\b(?:up to )?\d[\d.,]*%?\b(?:\s*(?:less|off|users|apps))?/gi;
    var src = String(text == null ? "" : text);
    var out = "",
      last = 0,
      m;
    while ((m = re.exec(src)) !== null) {
      out +=
        esc(src.slice(last, m.index)) + "<strong>" + esc(m[0]) + "</strong>";
      last = m.index + m[0].length;
    }
    return out + esc(src.slice(last));
  }
  function pinIcon() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/></svg>';
  }

  /* ---------- generated image derivatives ----------
     config.js writes image paths as "assets/projects/<name>.<ext>". That is a
     logical id, not a file on the server: the full-resolution masters live in
     assets-src/ and are never deployed. tools/images/build.py encodes each one
     to WebP at IMG_WIDTHS, and these two helpers address the results.

     Both encode the URL because ten of the masters have spaces in their names,
     and a space is the srcset delimiter — left raw, those entries parse as
     garbage and the image silently fails to load.

     Anything that isn't a project image (an absolute URL, say) passes through
     untouched, and imgSrcset returns "" so the caller omits the attribute. */
  var IMG_WIDTHS = [800, 1600];
  function imgSrc(src, width) {
    var m = String(src).match(/^assets\/projects\/(.+)\.(png|jpe?g|webp)$/i);
    return m ? encodeURI("assets/img/" + m[1] + "-" + width + ".webp") : src;
  }
  function imgSrcset(src) {
    if (imgSrc(src, IMG_WIDTHS[0]) === src) return "";
    return IMG_WIDTHS.map(function (w) {
      return imgSrc(src, w) + " " + w + "w";
    }).join(", ");
  }

  /* ---------- hero app wall ---------- */
  function shortName(name) {
    return String(name || "")
      .split(":")[0]
      .trim();
  }

  /* Social-proof stat icons (installs / rating / users). */
  var METRIC_ICON = {
    download:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11M8 10.5l4 4 4-4"/><path d="M5 20h14"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3.4 2.6 5.4 5.9.9-4.3 4.2 1 5.9L12 17l-5.2 2.8 1-5.9L3.5 9.7l5.9-.9z"/></svg>',
    users:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.9M17.5 20a5.5 5.5 0 0 0-3-4.9"/></svg>',
    // A phone, not a platform mark: these apps ship to both stores, so an Apple
    // or Android logo would claim only half the truth. Drawn a little heavier
    // than the other glyphs because a tall narrow outline carries less visual
    // weight than the gold "k+" and star it sits in line with.
    apps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="6.3" y="2.3" width="11.4" height="19.4" rx="3"/><path d="M10.7 18.8h2.6"/></svg>',
  };
  function metricIcon(name) {
    return METRIC_ICON[name] || METRIC_ICON.star;
  }
  // Compact one-liner for the hero-wall pill, e.g. "100k+ · 4.6★".
  function metricShort(metrics) {
    if (!has(metrics)) return "";
    return metrics
      .map(function (m) {
        return m.icon === "star" ? m.value + "★" : m.value;
      })
      .join(" · ");
  }
  // Strengths ticker: identical groups laid side by side; CSS slides the track
  // by -50% (an integer number of groups) so it loops seamlessly. 4 copies keep
  // the row filled even on very wide screens where one group is narrower.
  function buildMarquee(track, items) {
    if (!has(items)) {
      var sec = track.closest("[data-marquee-section]");
      if (sec) sec.remove();
      return;
    }
    function group(hidden) {
      var g = el("div", "marquee__group");
      if (hidden) g.setAttribute("aria-hidden", "true");
      items.forEach(function (s) {
        g.appendChild(
          el(
            "span",
            "marquee__item",
            '<span class="marquee__dot"></span>' + esc(s),
          ),
        );
      });
      return g;
    }
    for (var i = 0; i < 4; i++) track.appendChild(group(i !== 0));
  }

  function buildHeroWall(wall, projects) {
    // 5 fixed-width columns: the wall shows more shots at a smaller size
    // (CSS centers the row and fades clipped edges into the background).
    var PER_APP = 3,
      COLS = 5,
      SPEEDS = [56, 70, 48, 64, 60];

    // up to PER_APP shots per project, interleaved so neighbours differ
    var perProject = [];
    projects.forEach(function (p) {
      if (p.heroWall === false) return; // opted out of the wall in config
      var imgs = has(p.gallery)
        ? p.gallery.slice(0, PER_APP)
        : has(p.cover)
          ? [p.cover]
          : [];
      if (imgs.length) perProject.push({ p: p, imgs: imgs });
    });
    // `heroLead: true` projects surface first in the wall (top-left, and lead
    // each interleaved round) — stable, so config order holds otherwise.
    perProject.sort(function (a, b) {
      return (b.p.heroLead ? 1 : 0) - (a.p.heroLead ? 1 : 0);
    });
    var pool = [];
    for (var n = 0; n < PER_APP; n++) {
      perProject.forEach(function (entry) {
        if (entry.imgs[n])
          pool.push({
            src: entry.imgs[n],
            name: entry.p.name,
            slug: entry.p.slug,
            metric: metricShort(entry.p.metrics),
            labeled: n === 0,
          });
      });
    }
    if (!pool.length) {
      var visual = wall.closest(".hero__visual");
      if (visual) visual.remove();
      return;
    }
    while (pool.length < COLS * 3) pool = pool.concat(pool);

    var cols = [];
    for (var c = 0; c < COLS; c++) cols.push([]);
    pool.forEach(function (item, i) {
      cols[i % COLS].push(item);
    });

    var tracks = [];
    cols.forEach(function (items, c) {
      var col = el("div", "app-wall__col");
      var track = el("div", "app-wall__track");
      track.appendChild(wallStack(items, false));
      track.appendChild(wallStack(items, true)); // second copy makes the loop seamless
      col.appendChild(track);
      wall.appendChild(col);
      tracks.push({
        el: track,
        dur: SPEEDS[c % SPEEDS.length], // seconds for one stack to pass
        dir: c % 2 ? 1 : -1, // odd columns drift down, even ones up
        y: 0,
        h: 0,
      });
    });
    driveHeroWall(wall, tracks);
  }

  /* ---------- hero wall motion ----------
     The drift used to be a CSS animation that paused on :hover, so the wall
     froze the moment a pointer crossed the hero — exactly when it should feel
     alive. It runs on a rAF loop instead: hover keeps it moving, and the wall
     can be grabbed and thrown up or down, with the flick bleeding back into
     the drift. Touch presses are ignored on purpose (see the CSS note on
     touch-action) so a phone swipe still scrolls the page. Focus still holds
     the wall still, so a keyboard user can see the tile they landed on. */
  function driveHeroWall(wall, tracks) {
    var THRESHOLD = 5, // px of travel before a press counts as a drag, not a click
      FRICTION = 3.4, // per second — how fast a throw bleeds off
      MAX_FLING = 2600; // px/s cap so a hard throw stays readable

    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var fine =
      !window.matchMedia || window.matchMedia("(pointer: fine)").matches;

    var fling = 0, // px/s carried from the last drag, decaying
      onscreen = true,
      dragging = false,
      moved = 0,
      pointerId = null,
      lastY = 0,
      lastT = 0,
      prev = 0;

    function measure() {
      tracks.forEach(function (t) {
        var stack = t.el.firstElementChild;
        // offsetHeight, not a bounding rect: the wall is rotated, which
        // inflates every descendant's rect. This wants the layout height.
        t.h = stack ? stack.offsetHeight : 0;
      });
    }

    function place(t) {
      // Keep the offset inside [-h, 0): the duplicate stack covers the gap, so
      // the wrap is invisible whichever way the wall is moving.
      if (t.h > 0) t.y = (((t.y % t.h) + t.h) % t.h) - t.h;
      t.el.style.transform = "translate3d(0," + t.y.toFixed(2) + "px,0)";
    }

    function drifting() {
      if (reduce) return false;
      // Keyboard focus holds the wall still so a tabbed-to tile can be read —
      // but a *mouse* press focuses the link it lands on, so plain
      // :focus-within would leave the wall frozen after every drag until the
      // reader clicked elsewhere. :focus-visible is the keyboard-only half.
      var f = document.activeElement;
      if (!f || f === document.body || !wall.contains(f)) return true;
      try {
        return !f.matches(":focus-visible");
      } catch (err) {
        return false; // no :focus-visible support: fall back to pausing
      }
    }

    function frame(now) {
      // Nothing to do while the hero is scrolled away or the tab is in the
      // background; dropping `prev` keeps that gap from arriving as one jump.
      if (!onscreen || document.hidden) {
        prev = 0;
        requestAnimationFrame(frame);
        return;
      }
      var dt = prev ? Math.min((now - prev) / 1000, 0.05) : 0;
      prev = now;
      if (!dragging && dt) {
        if (fling) {
          fling *= Math.exp(-FRICTION * dt);
          if (Math.abs(fling) < 4) fling = 0;
        }
        var base = drifting() ? 1 : 0;
        for (var i = 0; i < tracks.length; i++) {
          var t = tracks[i];
          if (!t.h) continue;
          t.y += (base * t.dir * (t.h / t.dur) + fling) * dt;
          place(t);
        }
      }
      requestAnimationFrame(frame);
    }

    function onDown(e) {
      moved = 0; // reset first: a touch tap must not inherit an old drag
      if (e.pointerType === "touch") return;
      if (e.button != null && e.button !== 0) return;
      dragging = true;
      fling = 0;
      pointerId = e.pointerId;
      lastY = e.clientY;
      lastT = e.timeStamp;
      wall.classList.add("is-grabbing");
      if (wall.setPointerCapture && pointerId != null)
        wall.setPointerCapture(pointerId);
    }

    function onMove(e) {
      if (!dragging || e.pointerId !== pointerId) return;
      var dy = e.clientY - lastY,
        dt = (e.timeStamp - lastT) / 1000;
      lastY = e.clientY;
      lastT = e.timeStamp;
      moved += Math.abs(dy);
      if (dt > 0) {
        // Smoothed, so one stuttery frame can't define the throw.
        var v = Math.max(-MAX_FLING, Math.min(MAX_FLING, dy / dt));
        fling = fling * 0.7 + v * 0.3;
      }
      for (var i = 0; i < tracks.length; i++) {
        tracks[i].y += dy;
        place(tracks[i]);
      }
      if (moved > THRESHOLD) dropHint();
      e.preventDefault();
    }

    function onUp(e) {
      if (!dragging || (e.pointerId != null && e.pointerId !== pointerId))
        return;
      dragging = false;
      wall.classList.remove("is-grabbing");
      if (moved <= THRESHOLD) fling = 0; // a click, not a throw
    }

    var hint = null;
    function dropHint() {
      if (hint) {
        hint.remove();
        hint = null;
      }
    }

    if (fine) {
      wall.classList.add("app-wall--grab");
      var visual = wall.closest(".hero__visual");
      if (visual) {
        hint = el(
          "div",
          "app-wall__hint",
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v8"/><path d="m9 6 3-3 3 3"/><path d="M12 21v-8"/><path d="m9 18 3 3 3-3"/></svg>Drag',
        );
        hint.setAttribute("aria-hidden", "true");
        visual.appendChild(hint);
      }
    }

    wall.addEventListener("pointerdown", onDown);
    wall.addEventListener("pointermove", onMove);
    wall.addEventListener("pointerup", onUp);
    wall.addEventListener("pointercancel", onUp);
    wall.addEventListener("dragstart", function (e) {
      e.preventDefault(); // the browser's native image drag fights the grab
    });
    // Capture phase: a drag that ends over a tile must not open its case study.
    wall.addEventListener(
      "click",
      function (e) {
        if (moved > THRESHOLD) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );

    function remeasure() {
      measure();
      tracks.forEach(place);
    }
    remeasure();
    // The wrap distance is a stack's own height, and that lands late: the shots
    // have no intrinsic size until they decode, and the column width is a
    // clamp. The wall's box is inset-driven and never changes, so watch the
    // stacks themselves — a wall observer would never fire.
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(remeasure);
      tracks.forEach(function (t) {
        if (t.el.firstElementChild) ro.observe(t.el.firstElementChild);
      });
    } else {
      window.addEventListener("resize", remeasure);
      window.addEventListener("load", remeasure);
    }
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        onscreen = entries[entries.length - 1].isIntersecting;
      }).observe(wall);
    }
    requestAnimationFrame(frame);
  }

  function wallStack(items, isDup) {
    var stack = el("div", "app-wall__stack");
    if (isDup) stack.setAttribute("aria-hidden", "true");
    items.forEach(function (it) {
      var a = el("a", "app-wall__item");
      a.href = "project.html?p=" + encodeURIComponent(it.slug);
      a.setAttribute("aria-label", "Read the " + shortName(it.name) + " story");
      if (isDup) a.tabIndex = -1;
      var img = document.createElement("img");
      img.alt = "";
      img.decoding = "async";
      // The wall sits in the hero, above the fold, so these stay eager. Tiles
      // are small and the row is duplicated for the marquee, so the 800 tier is
      // the only one worth offering here.
      img.src = imgSrc(it.src, IMG_WIDTHS[0]);
      a.appendChild(img);
      if (it.labeled) {
        var metric = has(it.metric) ? it.metric : "";
        var tag = el(
          "span",
          "app-wall__tag" + (metric ? " app-wall__tag--metric" : ""),
        );
        tag.innerHTML =
          '<span class="app-wall__tag-name">' +
          esc(shortName(it.name)) +
          "</span>" +
          (metric
            ? '<span class="app-wall__tag-metric">' + esc(metric) + "</span>"
            : "");
        a.appendChild(tag);
      }
      stack.appendChild(a);
    });
    return stack;
  }

  /* ---------- experience roster ----------
     The config keeps one entry per role, in CV order. Two of them are the same
     employer at different times, and three of the four periods overlap, so a
     flat newest-first list would read as a mistake (two "Present" rows) rather
     than as concurrent work. Group by employer instead: the company carries the
     full span it covers, the roles inside it carry their own. */
  function groupExperience(list) {
    var order = [];
    var byCompany = {};
    list.forEach(function (e) {
      var key = String(e.company || "").trim();
      if (!byCompany[key]) {
        byCompany[key] = { company: key, roles: [] };
        order.push(key);
      }
      byCompany[key].roles.push(e);
    });
    return order.map(function (key) {
      var g = byCompany[key];
      g.span = spanOf(g.roles);
      return g;
    });
  }

  /* The config carries CV punctuation, which the page does not: date ranges
     render with a plain hyphen. Normalising here keeps `config.js` verbatim. */
  function dashes(str) {
    return String(str == null ? "" : str).replace(/\s*[—–]\s*/g, " - ");
  }

  /* Periods are written for humans ("06/2024 - 10/2025", "2023 - Present"), so
     parse loosely: take a MM/YYYY or YYYY on each side of the dash and rank it
     as a month number. An open end sorts last and prints as written. */
  function periodParts(period) {
    var halves = String(period || "").split(/\s*[—–-]\s*/);
    var from = (halves[0] || "").trim();
    var to = (halves[1] || "").trim();
    return { from: from, to: to, start: monthRank(from), end: monthRank(to) };
  }
  function monthRank(label) {
    var m = String(label).match(/(?:(\d{1,2})\/)?(\d{4})/);
    if (!m) return Infinity; // "Present" and anything unparsed sort to the end
    return Number(m[2]) * 12 + (m[1] ? Number(m[1]) : 0);
  }
  /* Earliest start to latest end across an employer's roles. */
  function spanOf(roles) {
    var parts = roles.map(function (r) {
      return periodParts(r.period);
    });
    var first = parts[0];
    var last = parts[0];
    parts.forEach(function (p) {
      if (p.start < first.start) first = p;
      if (p.end > last.end) last = p;
    });
    return first.from && last.to ? first.from + " - " + last.to : "";
  }

  /* One employer, with every role held inside it. A plain <details>: it opens
     and closes on click only, each one independent of the others, and it needs
     no JS of its own to do it - the keyboard and screen-reader behaviour comes
     with the element. */
  function stintEntry(g, first) {
    var d = el("details", "stint reveal");
    if (first) d.open = true; // the section is never a bare list of names
    d.innerHTML =
      '<summary class="stint__head">' +
      '<h3 class="stint__name">' +
      esc(g.company) +
      "</h3>" +
      '<span class="stint__roles">' +
      g.roles
        .map(function (r) {
          return '<span class="stint__chip">' + esc(r.role) + "</span>";
        })
        .join("") +
      "</span>" +
      '<span class="stint__span">' +
      esc(dashes(g.span)) +
      "</span>" +
      '<span class="stint__mark" aria-hidden="true">' +
      CHEVRON +
      "</span>" +
      "</summary>" +
      '<div class="stint__body">' +
      g.roles.map(stintRole).join("") +
      "</div>";
    return d;
  }

  function stintRole(r) {
    return (
      '<article class="stint__role">' +
      '<div class="stint__meta">' +
      '<h4 class="stint__title">' +
      esc(r.role) +
      "</h4>" +
      '<span class="stint__period">' +
      esc(dashes(r.period)) +
      "</span>" +
      "</div>" +
      '<p class="stint__text">' +
      esc(r.text || "") +
      "</p>" +
      "</article>"
    );
  }

  /* ---------- project card builder ----------
     Card is an <article> (not an anchor) so it can host real external links.
     A stretched title link makes the whole card open the case study, while the
     live-links row sits above it (z-index) and stays independently clickable. */
  function projectCard(p, featured) {
    var art = el(
      "article",
      "project-card reveal" + (featured ? " project-card--featured" : ""),
    );

    var img = firstImage(p);
    var media = el("div", "project-card__media");
    if (img) {
      // Cards sit in a two-column grid (one column under 720px), so a card is
      // roughly half the container above that breakpoint and full width below.
      media.innerHTML =
        '<img src="' +
        esc(imgSrc(img, 800)) +
        '" srcset="' +
        esc(imgSrcset(img)) +
        '" sizes="(max-width: 720px) 92vw, 46vw" alt="' +
        esc(p.name) +
        '" loading="lazy" decoding="async" />';
    } else {
      media.classList.add("cover-fallback");
      media.innerHTML =
        '<div class="cover-fallback__glyph">' +
        esc(initials(p.name)) +
        "</div>" +
        (has(p.tech)
          ? '<div class="cover-fallback__tags">' +
            p.tech
              .slice(0, 3)
              .map(function (t) {
                return '<span class="tech-tag">' + esc(t) + "</span>";
              })
              .join("") +
            "</div>"
          : "");
    }

    var href = "project.html?p=" + encodeURIComponent(p.slug);
    var metaBits = "<span>" + esc(p.tagline || "") + "</span>" + cardMetrics(p);
    var titleLink =
      '<a class="project-card__link" href="' +
      href +
      '"><h3>' +
      esc(p.name) +
      "</h3></a>";
    var foot =
      '<div class="project-card__foot">' +
      '<span class="project-card__cta">View project ' +
      ARROW +
      "</span>" +
      cardLinks(p) +
      "</div>";

    var body = el("div", "project-card__body");
    if (featured) {
      body.innerHTML =
        '<span class="project-card__eyebrow">Featured project</span>' +
        '<div class="project-card__meta">' +
        metaBits +
        "</div>" +
        titleLink +
        '<p class="project-card__desc">' +
        esc(p.description || "") +
        "</p>" +
        tagRow(p.tech, 4) +
        foot;
    } else {
      body.innerHTML =
        '<div class="project-card__meta">' +
        metaBits +
        "</div>" +
        titleLink +
        foot;
    }
    art.appendChild(media);
    art.appendChild(body);
    return art;
  }

  /* Live external links surfaced on a card (website, stores, source). Real
     anchors, kept above the stretched title link so taps land on them. */
  var CARD_GLYPH = {
    web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9Z"/></svg>',
    apple:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="' +
      APPLE_PATH +
      '"/></svg>',
    play: '<svg viewBox="0 0 512 512">' + PLAY_PATHS + "</svg>",
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 8-4 4 4 4M15 8l4 4-4 4"/></svg>',
  };
  // Highlighted stat pills on the card meta row (installs / rating).
  function cardMetrics(p) {
    if (!has(p.metrics)) return "";
    return (
      '<span class="project-card__metrics">' +
      p.metrics
        .map(function (m) {
          return (
            '<span class="stat-pill' +
            (m.icon === "star" ? " stat-pill--star" : "") +
            '">' +
            '<span class="stat-pill__icon">' +
            metricIcon(m.icon) +
            "</span>" +
            esc(m.value) +
            "</span>"
          );
        })
        .join("") +
      "</span>"
    );
  }
  function cardLinks(p) {
    var items = [];
    if (has(p.website)) items.push(["web", p.website, "website"]);
    if (has(p.appStore)) items.push(["apple", p.appStore, "App Store"]);
    if (has(p.playStore)) items.push(["play", p.playStore, "Google Play"]);
    if (has(p.github)) items.push(["code", p.github, "source"]);
    if (!items.length) return "";
    return (
      '<div class="project-card__links">' +
      items
        .map(function (it) {
          return (
            '<a class="project-card__ext" href="' +
            esc(it[1]) +
            '" target="_blank" rel="noopener" aria-label="' +
            esc(p.name + " — " + it[2]) +
            '">' +
            CARD_GLYPH[it[0]] +
            "</a>"
          );
        })
        .join("") +
      "</div>"
    );
  }
  function tagRow(tech, max) {
    if (!has(tech)) return "";
    var out = '<div class="project-card__tags">';
    tech.slice(0, max || 5).forEach(function (t) {
      out += '<span class="tech-tag">' + esc(t) + "</span>";
    });
    out += "</div>";
    return out;
  }
  function initials(name) {
    return (
      String(name || "?")
        .replace(/[^A-Za-z0-9 ]/g, "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(function (w) {
          return w[0];
        })
        .join("")
        .toUpperCase() || "·"
    );
  }

  /* ========================================================================
     PROJECTS (all)
     ======================================================================== */
  function renderProjects() {
    var grid = $("[data-all-projects]");
    if (!grid) return;
    (C.projects || []).forEach(function (p) {
      grid.appendChild(projectCard(p, false));
    });
  }

  /* ---------- case-study traction row ----------
     A spec sheet, not cards: hairline-separated columns, mono label over a
     display numeral. A rating also draws a 5-star meter (the gold row is
     clipped to value / 5) so the score is not carried by the number alone. */
  function starMeter(value) {
    var num = parseFloat(value);
    if (isNaN(num)) return "";
    var pct = Math.max(0, Math.min(100, (num / 5) * 100));
    var row = "";
    for (var i = 0; i < 5; i++) row += METRIC_ICON.star;
    return (
      '<span class="traction__meter" role="img" aria-label="' +
      esc(num) +
      ' out of 5 stars">' +
      '<span class="traction__meter-track">' +
      row +
      "</span>" +
      '<span class="traction__meter-fill" style="width:' +
      pct.toFixed(1) +
      '%">' +
      row +
      "</span>" +
      "</span>"
    );
  }
  function tractionRow(p) {
    var items = (p.metrics || []).map(function (m) {
      return (
        '<div class="traction__item">' +
        "<dt>" +
        esc(m.label) +
        "</dt>" +
        "<dd>" +
        esc(m.value) +
        (m.icon === "star" ? starMeter(m.value) : "") +
        "</dd>" +
        "</div>"
      );
    });
    if (!items.length) return "";
    return '<dl class="traction">' + items.join("") + "</dl>";
  }
  // "iPhone · Android · Web" — derived from the store links that actually exist,
  // so it never claims a platform the project is not actually live on.
  function platformLine(p) {
    var out = [];
    if (has(p.appStore)) out.push("iPhone");
    if (has(p.playStore)) out.push("Android");
    if (has(p.website)) out.push("Web");
    if (!out.length) return "";
    return (
      '<span class="case-status"><span class="case-status__dot"></span>Live on ' +
      out.join(" · ") +
      "</span>"
    );
  }

  /* The hero frame takes the asset's own aspect ratio, clamped to a sane band
     (0.72 — tall phone screenshot, 1.3 — landscape banner) so neither extreme
     runs the layout.

     The 1.3 ceiling exists for the side-by-side layout, where the shot sits
     next to the text column and a very wide asset would leave the column
     towering over it. Stacked (<= 767px) there is no column to match, and the
     ceiling only bought a hard `object-fit: cover` crop: Launderland's cover
     is a 2.05 store feature graphic, so a third of it — including the panel
     that reads "Pay in the basket" — was cut off the right edge on every
     phone. Below the stack breakpoint the asset runs at its own shape. */
  var SHOT_AR_MIN = 0.72;
  var SHOT_AR_MAX = 1.3;
  var SHOT_AR_MAX_STACKED = 2.1;

  function fitShot(scope) {
    var img = (scope || document).querySelector(".case-shot__img");
    if (!img) return;
    var stacked = window.matchMedia("(max-width: 767px)");
    function apply() {
      if (!img.naturalWidth || !img.naturalHeight) return;
      var frame = img.closest(".case-shot__frame");
      if (!frame) return;
      var max = stacked.matches ? SHOT_AR_MAX_STACKED : SHOT_AR_MAX;
      var r = Math.max(
        SHOT_AR_MIN,
        Math.min(max, img.naturalWidth / img.naturalHeight),
      );
      frame.style.aspectRatio = r.toFixed(3);
    }
    if (img.complete) apply();
    else img.addEventListener("load", apply, { once: true });
    // Crossing the breakpoint (rotation, a resized window) swaps the ceiling.
    if (stacked.addEventListener) stacked.addEventListener("change", apply);
    else if (stacked.addListener) stacked.addListener(apply);
  }

  /* `galleryFrame` picks the gallery presentation:
       "iphone" (default) — full device mockup: bezel, Dynamic Island, buttons
       "plain"            — the old flat rounded phone frame, no device chrome
       false / "none"     — raw asset at its own aspect ratio (already-mockup'd
                            art, tablets, web captures)
     `true` is accepted as an alias for the default. */
  function frameMode(p) {
    // Tolerant of quoted values ("false") — the config is hand-edited.
    var v = p.galleryFrame;
    if (typeof v === "string") v = v.trim().toLowerCase();
    if (
      v === false ||
      v === "false" ||
      v === "none" ||
      v === "raw" ||
      v === "off" ||
      v === "no"
    )
      return "none";
    if (v === "plain" || v === "flat") return "plain";
    return "iphone";
  }

  /* The leading shots are fetched eagerly: they sit in the track's horizontal
     overflow, where a lazy <img> never intersects the viewport and so decodes
     late — after Swiper has already measured the slides. */
  function shotHtml(src, name, mode, eager) {
    // A shot is locked to --shot-w, which clamps at 248px; the sizes hint keeps
    // the browser on the 800 tier rather than pulling the lightbox-grade one.
    var img =
      '<img src="' +
      esc(imgSrc(src, 800)) +
      '" srcset="' +
      esc(imgSrcset(src)) +
      '" sizes="248px" alt="' +
      esc(name) +
      ' screenshot" decoding="async" ' +
      (eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"') +
      " />";
    if (mode === "none")
      return '<figure class="shot shot--raw">' + img + "</figure>";
    if (mode === "plain")
      return '<figure class="shot shot--plain">' + img + "</figure>";
    // Device mockup: the chrome is drawn in CSS, the shot sits in the screen.
    return (
      '<figure class="shot shot--device">' +
      '<span class="device__btn device__btn--silent"></span>' +
      '<span class="device__btn device__btn--up"></span>' +
      '<span class="device__btn device__btn--down"></span>' +
      '<span class="device__btn device__btn--power"></span>' +
      '<span class="device__screen">' +
      img +
      '<span class="device__island"></span></span>' +
      "</figure>"
    );
  }

  /* ========================================================================
     GALLERY CAROUSEL
     Swiper (CDN, UMD build) drives the track; GLightbox drives the full-size
     viewer. Both are loaded in project.html — if either fails to load the
     markup degrades to a plain scroll-snap strip and plain image links, so the
     screens are always reachable.
     ======================================================================== */

  var CHEV_L =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>';
  var CHEV_R =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
  var ZOOM_ICON =
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6M11 8.4v5.2M8.4 11h5.2"/></svg>';

  /* Swiper's loop wants slidesPerView + loopedSlides slides on hand before it
     will wrap cleanly — with centeredSlides that works out near 1.5 viewports,
     and a 4-6 shot gallery is short of it on a wide screen (the library falls
     back to a broken half-loop and logs a warning). The set is repeated in the
     markup until there are enough. The repeats are presentation only: the
     lightbox is built from the unique list, so it still reads "3 of 5". */
  var LOOP_MIN_SLIDES = 15;

  function reducedMotion() {
    return !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function carouselHtml(p) {
    var mode = frameMode(p);
    var n = p.gallery.length;
    var reps = Math.max(1, Math.ceil(LOOP_MIN_SLIDES / n));

    var slides = "";
    for (var r = 0; r < reps; r++) {
      slides += p.gallery
        .map(function (g, i) {
          // data-shot is the index in the *unique* gallery, so a repeat opens the
          // same lightbox entry as the original.
          return (
            '<div class="swiper-slide carousel__slide">' +
            // Without GLightbox this anchor is the fallback viewer, so it
            // points at the same wide derivative the lightbox would open.
            '<a class="carousel__open" href="' +
            esc(imgSrc(g, IMG_WIDTHS[IMG_WIDTHS.length - 1])) +
            '" data-shot="' +
            i +
            '" ' +
            'aria-label="Open screen ' +
            (i + 1) +
            " of " +
            n +
            ' full size">' +
            shotHtml(g, p.name, mode, r === 0 && i < 3) +
            '<span class="carousel__zoom" aria-hidden="true">' +
            ZOOM_ICON +
            "</span>" +
            "</a>" +
            "</div>"
          );
        })
        .join("");
    }

    /* The arrows overlay the track instead of sitting in the heading row: they
       stay reachable at every width (the head pair was display:none under
       768px, which left touch users with no visible control at all) and they
       land on the same edges the fade masks already mark. */
    var arrows =
      '<button class="carousel__arrow carousel__arrow--prev" type="button" data-car-prev aria-label="Previous screens">' +
      CHEV_L +
      "</button>" +
      '<button class="carousel__arrow carousel__arrow--next" type="button" data-car-next aria-label="Next screens">' +
      CHEV_R +
      "</button>";

    return (
      '<section class="section section--tight carousel" data-carousel>' +
      '<div class="container">' +
      '<div class="section__head reveal">' +
      '<span class="eyebrow">Inside the app</span><h2>A look at every screen.</h2>' +
      "</div>" +
      "</div>" +
      '<div class="carousel__frame reveal">' +
      '<div class="swiper" data-swiper>' +
      '<div class="swiper-wrapper">' +
      slides +
      "</div>" +
      "</div>" +
      arrows +
      "</div>" +
      "</section>"
    );
  }

  function initCarousel(root, p) {
    var car = $("[data-carousel]", root);
    if (!car) return;
    var node = $("[data-swiper]", car);
    var shots = $all(".shot img", car);
    var swiper = null;

    initLightbox(car, p);

    /* Raw (un-framed) shots used to be sized by their own decoded <img>, which
       tied every slide width to a network round trip — and a slide parked in
       the horizontal overflow never intersects the viewport, so its lazy <img>
       stays 0x0 and Swiper measures a collapsed track (wrong snap points, wrong
       arrow and dot state). The card ratio is now read once off the first
       decoded shot and applied to all of them, so the geometry is known up
       front and every slide has a width before it has pixels. */
    function fitSlides() {
      var img = shots[0];
      if (!img || !img.naturalWidth || !img.naturalHeight) return;
      var r = Math.max(
        0.4,
        Math.min(1.6, img.naturalWidth / img.naturalHeight),
      );
      car.style.setProperty("--shot-ar", r.toFixed(4));
    }
    fitSlides();

    shots.forEach(function (img) {
      if (img.complete) return;
      img.addEventListener(
        "load",
        function () {
          fitSlides();
          if (swiper) swiper.update();
        },
        { once: true },
      );
    });

    /* The gap between shots is a CSS token (--gap on .carousel) because the
       stylesheet needs it to size the band and Swiper needs it as a number.
       Reading it back here keeps one definition instead of two breakpoint
       ladders that have to be remembered together. */
    function gapPx() {
      var v = parseFloat(getComputedStyle(car).getPropertyValue("--gap"));
      return isNaN(v) ? 20 : v;
    }

    // No Swiper on the page (offline, blocked CDN): the CSS fallback turns the
    // wrapper into a scroll-snap strip, so the shots stay browsable.
    if (!node || typeof window.Swiper !== "function") {
      car.classList.add("is-native");
      return;
    }

    swiper = new window.Swiper(node, {
      slidesPerView: "auto",
      // One arrow press advances exactly one shot, so a click always maps to a
      // single, predictable step rather than a jump of however many happen to
      // fit the viewport.
      slidesPerGroup: 1,
      // The lead shot sits in the middle of the track with its neighbours
      // peeking either side. Swiper derives its own centring offsets, so the
      // old slidesOffsetBefore/After pair is gone — running both drifts them.
      centeredSlides: true,
      /* Endless in both directions, so the arrows never dead-end. Swiper 11's
         loop reorders the real slides rather than cloning them, and the extra
         margin covers the variable widths slidesPerView:"auto" produces. */
      loop: true,
      loopAdditionalSlides: 2,
      spaceBetween: gapPx(),
      grabCursor: true,
      speed: reducedMotion() ? 0 : 380,
      watchSlidesProgress: true,
      watchOverflow: true,
      // Snapped rather than free scrolling: the arrows and the track read off
      // one snap grid, so a click always lands on a slide edge. Free momentum
      // drifts off it and, with loop on, fights loopFix mid-glide.
      threshold: 4,
      resistanceRatio: 0.6,
      keyboard: { enabled: true, onlyInViewport: true },
      mousewheel: { forceToAxis: true, thresholdDelta: 8 },
      a11y: {
        enabled: true,
        containerMessage: p.name + " screenshots",
        prevSlideMessage: "Previous screens",
        nextSlideMessage: "Next screens",
      },
      navigation: {
        prevEl: $("[data-car-prev]", car),
        nextEl: $("[data-car-next]", car),
        disabledClass: "is-disabled",
        lockClass: "is-locked",
      },
      on: {
        // Edge state drives the fade masks.
        init: reportState,
        activeIndexChange: reportState,
        progress: reportState,
        resize: function (s) {
          s.params.spaceBetween = gapPx();
          s.update();
        },
      },
    });

    function reportState(s) {
      // In loop mode neither edge is ever reached, so both fades stay lit —
      // which is the truth: there is always more track in both directions.
      car.classList.toggle("at-start", s.isBeginning);
      car.classList.toggle("at-end", s.isEnd);
      // Everything fits: the controls have nothing to do, so they go away.
      car.classList.toggle(
        "is-static",
        s.isLocked || (s.isBeginning && s.isEnd),
      );
    }
  }

  /* GLightbox handles full-size viewing: Esc, arrow keys, swipe, zoom and the
     focus handling all ship with it.

     It is fed an explicit `elements` list built from the unique gallery rather
     than left to collect `.glightbox` anchors off the DOM — the track repeats
     the set to satisfy Swiper's loop, and DOM collection would turn 5 screens
     into 15 lightbox entries. Each slide carries its index into that list.

     Without the library the anchors stay plain links to the image, which is a
     working fallback rather than a dead control. */
  function initLightbox(scope, p) {
    if (typeof window.GLightbox !== "function") return;
    var n = p.gallery.length;
    var lb = window.GLightbox({
      // The lightbox is the one place a shot is shown large and zoomable, so it
      // gets the widest derivative rather than the tier the strip renders.
      elements: p.gallery.map(function (g, i) {
        return {
          href: imgSrc(g, IMG_WIDTHS[IMG_WIDTHS.length - 1]),
          type: "image",
          description: "Screen " + (i + 1) + " of " + n,
        };
      }),
      touchNavigation: true,
      loop: true,
      zoomable: true,
      draggable: true,
      openEffect: reducedMotion() ? "none" : "zoom",
      closeEffect: reducedMotion() ? "none" : "fade",
      slideEffect: reducedMotion() ? "none" : "slide",
    });

    $all("[data-shot]", scope).forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        lb.openAt(parseInt(a.getAttribute("data-shot"), 10) || 0);
      });
    });
    scope.classList.add("has-lightbox");
  }

  /* ========================================================================
     PROJECT DETAIL
     ======================================================================== */
  function renderProject() {
    var root = $("[data-project-root]");
    if (!root) return;
    var slug = new URLSearchParams(window.location.search).get("p");
    var list = C.projects || [];
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].slug === slug) {
        idx = i;
        break;
      }
    }

    if (idx === -1) {
      root.innerHTML =
        '<div class="container notfound"><h1>Project not found</h1>' +
        "<p>That project doesn't exist, or it moved.</p>" +
        '<a class="btn btn--gold" href="projects.html">Back to all work ' +
        ARROW +
        "</a></div>";
      return;
    }

    var p = list[idx];
    document.title = p.name + " — " + (C.name || "");
    /* One HTML file serves every case study, so the head this page shipped
       describes none of them. Search crawlers run this script and pick the
       rewritten tags up; the social scrapers do not, which is why the static
       og:* block stays generic rather than pretending to be per-project. */
    setMeta("description", p.description || p.tagline || "");
    setCanonical("project.html?p=" + encodeURIComponent(p.slug || ""));
    var cover = firstImage(p);

    // ---- hero ----
    // The shot is presented flush: the asset fills its frame edge to edge, the
    // frame takes the asset's own aspect (see fitShot), and the only chrome is
    // a hairline and the page shadow. No glow, no floating chips on top of it.
    var coverHtml = cover
      ? '<figure class="case-shot reveal">' +
        '<span class="case-shot__frame">' +
        // This is the largest thing above the fold on a detail page, so it is
        // eager and high priority — the one image on the site worth blocking on.
        '<img class="case-shot__img" src="' +
        esc(imgSrc(cover, 1600)) +
        '" srcset="' +
        esc(imgSrcset(cover)) +
        '" sizes="(max-width: 900px) 94vw, 900px" alt="' +
        esc(p.name) +
        ' app interface" fetchpriority="high" decoding="async" />' +
        "</span>" +
        "</figure>"
      : '<div class="case-shot cover-fallback reveal"><div class="cover-fallback__glyph">' +
        esc(initials(p.name)) +
        "</div>" +
        (has(p.tech)
          ? '<div class="cover-fallback__tags">' +
            p.tech
              .slice(0, 4)
              .map(function (t) {
                return '<span class="tech-tag">' + esc(t) + "</span>";
              })
              .join("") +
            "</div>"
          : "") +
        "</div>";

    var stores = "";
    if (has(p.website)) stores += storeBtn("web", p.website);
    if (has(p.appStore)) stores += storeBtn("apple", p.appStore);
    if (has(p.playStore)) stores += storeBtn("play", p.playStore);
    if (has(p.github)) stores += storeBtn("code", p.github);

    var heroHtml =
      '<div class="container">' +
      // One meta row, not two: the way back on the left, what the app runs on
      // at the right, a hairline under both. The old "The story" kicker said
      // nothing the h1 right below it doesn't already say.
      '<div class="case-rule reveal">' +
      '<a class="back-link" href="projects.html">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg> All work</a>' +
      platformLine(p) +
      "</div>" +
      // Lean = no metrics and no store links: the text column is short, so the
      // shot is held back rather than towering over half a screen of nothing.
      '<div class="case-hero' +
      (!has(p.metrics) && !stores ? " case-hero--lean" : "") +
      '">' +
      '<div class="case-hero__head reveal">' +
      "<h1>" +
      esc(p.name) +
      "</h1>" +
      (has(p.tagline)
        ? '<p class="case-hero__tagline">' + esc(p.tagline) + "</p>"
        : "") +
      "</div>" +
      coverHtml +
      '<div class="case-hero__col reveal">' +
      (has(p.description)
        ? '<p class="detail-desc">' + esc(p.description) + "</p>"
        : "") +
      tractionRow(p) +
      (stores ? '<div class="store-row">' + stores + "</div>" : "") +
      (has(p.tech)
        ? '<div class="detail-tags">' +
          p.tech
            .map(function (t) {
              return '<span class="tech-tag">' + esc(t) + "</span>";
            })
            .join("") +
          "</div>"
        : "") +
      "</div>" +
      "</div>" +
      "</div>";

    // ---- challenge band ----
    var challengeHtml = has(p.challenge)
      ? '<section class="quote-band"><div class="container reveal"><span class="eyebrow">The hard part</span><blockquote>' +
        esc(p.challenge) +
        "</blockquote></div></section>"
      : "";

    // ---- features ----
    var featuresHtml = "";
    if (has(p.features)) {
      featuresHtml =
        '<section class="section"><div class="container">' +
        '<div class="section__head reveal"><span class="eyebrow">What it does</span><h2>Everything it does, feature by feature.</h2></div>' +
        '<div class="features-grid reveal">' +
        p.features
          .map(function (f) {
            return (
              '<div class="feature"><span class="pitch-check">' +
              CHECK +
              "</span><span>" +
              esc(f) +
              "</span></div>"
            );
          })
          .join("") +
        "</div>" +
        "</div></section>";
    }

    // ---- gallery ----
    var galleryHtml = has(p.gallery) ? carouselHtml(p) : "";

    // ---- pager ----
    var prev = list[(idx - 1 + list.length) % list.length];
    var next = list[(idx + 1) % list.length];
    var pagerHtml =
      list.length > 1
        ? '<section class="section section--tight"><div class="container"><div class="pager">' +
          '<a class="pager--prev" href="project.html?p=' +
          encodeURIComponent(prev.slug) +
          '"><span class="pager__label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg> Previous</span><span class="pager__name">' +
          esc(prev.name) +
          "</span></a>" +
          '<a class="pager--next" href="project.html?p=' +
          encodeURIComponent(next.slug) +
          '"><span class="pager__label">Next <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span><span class="pager__name">' +
          esc(next.name) +
          "</span></a>" +
          "</div></div></section>"
        : "";

    // ---- CTA ----
    var ctaHtml =
      '<section class="section section--tight"><div class="container"><div class="cta-panel reveal">' +
      '<span class="eyebrow" style="justify-content:center">Your turn</span>' +
      "<h2>Want something like this?</h2>" +
      "<p class=\"lede\">Tell me what you're making. I'll come back with what it will take and the first big decision I'd settle.</p>" +
      (has(C.email)
        ? '<a class="btn btn--gold" href="mailto:' +
          esc(C.email) +
          '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg> Start a project</a>'
        : "") +
      "</div></div></section>";

    root.innerHTML =
      '<section class="section--tight" style="padding-top:0">' +
      heroHtml +
      "</section>" +
      galleryHtml +
      challengeHtml +
      featuresHtml +
      pagerHtml +
      ctaHtml;

    fitShot(root);
    initCarousel(root, p);
  }

  function storeBtn(kind, href) {
    var isExternal = href.indexOf("http") === 0;
    var ext = isExternal ? ' target="_blank" rel="noopener"' : "";

    if (kind === "apple") {
      return (
        '<a class="store-badge" href="' +
        esc(href) +
        '"' +
        ext +
        ' aria-label="Download on the App Store">' +
        appleMark(22) +
        '<span class="store-badge__text"><span class="store-badge__sub">Download on the</span><span class="store-badge__name">App Store</span></span></a>'
      );
    }
    if (kind === "play") {
      return (
        '<a class="store-badge" href="' +
        esc(href) +
        '"' +
        ext +
        ' aria-label="Get it on Google Play">' +
        playMark(21) +
        '<span class="store-badge__text"><span class="store-badge__sub">Get it on</span><span class="store-badge__name">Google Play</span></span></a>'
      );
    }
    if (kind === "web") {
      var globe =
        '<circle cx="12" cy="12" r="9.2"/><path d="M2.8 12h18.4"/><path d="M12 2.8c2.5 2.5 3.9 5.8 3.9 9.2s-1.4 6.7-3.9 9.2c-2.5-2.5-3.9-5.8-3.9-9.2S9.5 5.3 12 2.8Z"/>';
      return (
        '<a class="store-badge" href="' +
        esc(href) +
        '"' +
        ext +
        ' aria-label="Visit the website">' +
        '<svg class="store-badge__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        globe +
        "</svg>" +
        '<span class="store-badge__text"><span class="store-badge__sub">Visit the</span><span class="store-badge__name">Website</span></span></a>'
      );
    }
    return (
      '<a class="btn btn--ghost btn--sm" href="' +
      esc(href) +
      '"' +
      ext +
      ">" +
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 8-4 4 4 4M15 8l4 4-4 4"/></svg> Source</a>'
    );
  }

  /* ---------- boot ---------- */
  initTheme();
  initNav();
  initShared();
  if (page === "home") renderHome();
  else if (page === "projects") renderProjects();
  else if (page === "project") renderProject();
  initReveal();
})();
