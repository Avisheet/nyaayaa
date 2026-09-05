/* ==========================================================================
   NYAYA.AI — Public Website
   Configuration objects — edit these to replace placeholders.
   ========================================================================== */

import { inject } from "@vercel/analytics";
inject();

// Update these with your real numbers/emails before going live.
const CONTACT = {
  whatsappPrimary: "+917518905006",   // e.g. "+919876543210"
  whatsappSecondary: "+917807425728",
  emailPrimary: "avisheetsrivastava@gmail.com",
  emailSecondary: "alikeakb4@gmail.com",
};

const IMAGES = {
  hero: "/assets/images/hero-advocate.jpg",
  documents: "/assets/images/legal-documents.jpg",
  library: "/assets/images/legal-library.jpg",
  advocateDesk: "/assets/images/advocate-desk.jpg",
  architecture: "/assets/images/court-architecture.jpeg",
  contactWorkspace: "/assets/images/contact-workspace.jpeg",
};

const DEMO_VIDEO = {
  src: "/assets/video/nyaya-demo.mp4",
  poster: "/assets/screenshots/drafts-tab.png",
};

const SCREENSHOTS = [
  {
    num: "01",
    label: "MATTERS",
    title: "One matter, opened.",
    caption: "Every matter starts with the essentials — parties, court, case number — and becomes the home for the documents, research and drafts that follow.",
    src: "/assets/screenshots/matter-overview-tab.png",
    alt: "NYAYA.AI matter overview screen showing client, opposing party, matter type and the Matter Intelligence panel",
  },
  {
    num: "02",
    label: "LEGAL SEARCH",
    title: "Research, and its challenge.",
    caption: "Generate research queries from the matter's legal issues, then deliberately search for what could work against the position with Find What Hurts My Case.",
    src: "/assets/screenshots/legal-research-tab.png",
    alt: "NYAYA.AI legal research screen with Find What Hurts My Case adversarial search",
  },
  {
    num: "03",
    label: "BRAINSTORMING",
    title: "Think it through, in context.",
    caption: "Work through arguments, counterarguments and open questions with the matter's own facts and issues as context. In development — not yet available in the live product.",
    panel: true,
  },
  {
    num: "04",
    label: "DRAFTING",
    title: "A first draft, in context.",
    caption: "First drafts generated from the matter's own facts and research — always intended for review by a qualified advocate.",
    src: "/assets/screenshots/drafts-tab.png",
    alt: "NYAYA.AI drafts screen generating a legal notice",
  },
];

/* ==========================================================================
   Nav
   ========================================================================== */

const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 8);
}, { passive: true });

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });
}

/* ==========================================================================
   Scroll reveal
   ========================================================================== */

const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ==========================================================================
   Scroll-driven product story
   ========================================================================== */

function initStory() {
  const storyEl = document.querySelector(".story");
  if (!storyEl) return;

  const track = storyEl.querySelector(".story-track");
  const stages = Array.from(storyEl.querySelectorAll(".story-stage"));
  const progressFill = storyEl.querySelector(".story-progress-fill");
  const mobileFill = storyEl.querySelector(".story-mobile-fill");
  const STEPS_PER_STAGE = 8; // more than any stage actually uses — harmless
  // maps each stage index to one of the 7 side-rail labels
  const LABEL_FOR_STAGE = [0, 0, 0, 1, 1, 1, 2, 3, 4, 5, 6];

  function applyStepState(stage, stepReached) {
    stage.querySelectorAll("[data-step]").forEach((el) => {
      const step = parseInt(el.getAttribute("data-step"), 10) || 0;
      el.classList.toggle("is-in", step <= stepReached);
    });
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isNarrow = window.matchMedia("(max-width: 880px)").matches;

  if (reduced || isNarrow) {
    // Unpinned mobile/reduced-motion mode: each stage reveals itself via
    // IntersectionObserver, with a light stagger between its own elements.
    stages.forEach((stage) => {
      const items = stage.querySelectorAll("[data-step]");
      items.forEach((el, i) => el.style.setProperty("--mi", i));
    });
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              applyStepState(entry.target, STEPS_PER_STAGE);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
      );
      stages.forEach((s) => io.observe(s));
    } else {
      stages.forEach((s) => applyStepState(s, STEPS_PER_STAGE));
    }

    // A simple top progress bar tracking overall scroll through the story,
    // independent of the (disabled) pinning mechanics above.
    let mTicking = false;
    function updateMobileProgress() {
      mTicking = false;
      const rect = storyEl.getBoundingClientRect();
      const total = storyEl.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      storyEl.classList.toggle("is-in-view", rect.top < window.innerHeight && rect.bottom > 0);
      if (mobileFill) mobileFill.style.width = `${pct}%`;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!mTicking) {
          mTicking = true;
          requestAnimationFrame(updateMobileProgress);
        }
      },
      { passive: true }
    );
    updateMobileProgress();
    return;
  }

  // Desktop pinned scroll-scrubbed mode.
  let ticking = false;

  function update() {
    ticking = false;
    const rect = track.getBoundingClientRect();
    const total = track.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const overallProgress = total > 0 ? scrolled / total : 0;

    storyEl.classList.toggle("is-in-view", rect.top < window.innerHeight && rect.bottom > 0);

    const raw = overallProgress * stages.length;
    let stageIndex = Math.floor(raw);
    if (stageIndex >= stages.length) stageIndex = stages.length - 1;
    if (stageIndex < 0) stageIndex = 0;
    const frac = Math.min(Math.max(raw - stageIndex, 0), 0.999);
    const stepReached = Math.floor(frac * STEPS_PER_STAGE);

    stages.forEach((stage, i) => {
      const active = i === stageIndex;
      stage.classList.toggle("is-active", active);
      if (active) {
        applyStepState(stage, stepReached);
      } else if (i < stageIndex) {
        applyStepState(stage, STEPS_PER_STAGE);
      } else {
        applyStepState(stage, -1);
      }
    });

    if (progressFill) progressFill.style.height = `${overallProgress * 100}%`;
    if (mobileFill) mobileFill.style.width = `${overallProgress * 100}%`;

    const activeLabel = LABEL_FOR_STAGE[stageIndex] ?? 0;
    storyEl.querySelectorAll(".story-progress-labels li").forEach((li) => {
      li.classList.toggle("is-active", parseInt(li.dataset.plabel, 10) === activeLabel);
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", () => requestAnimationFrame(update));
  update();
}

initStory();

/* ==========================================================================
   Four core products — tab list drives the connected diagram
   ========================================================================== */

function initCoreProducts() {
  const buttons = document.querySelectorAll(".core-product");
  const diagram = document.querySelector(".core-diagram");
  if (!buttons.length || !diagram) return;

  function activate(key) {
    buttons.forEach((b) => {
      const active = b.dataset.product === key;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    diagram.querySelectorAll("[data-node]").forEach((node) => {
      node.classList.toggle("is-highlight", node.dataset.node === key);
    });
  }

  buttons.forEach((b) => {
    b.addEventListener("click", () => activate(b.dataset.product));
  });

  activate("matters");
}

initCoreProducts();

/* ==========================================================================
   Matter hub — position nodes evenly around the circle
   ========================================================================== */

function layoutMatterHub() {
  const hub = document.querySelector(".matter-hub");
  if (!hub) return;
  const nodes = hub.querySelectorAll(".matter-node");
  const svg = hub.querySelector(".matter-hub-lines");
  const radius = hub.offsetWidth / 2;
  const nodeRadius = radius * 0.86;
  const count = nodes.length;

  if (svg) svg.innerHTML = "";
  const lines = [];

  nodes.forEach((node, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    const x = radius + nodeRadius * Math.cos(angle);
    const y = radius + nodeRadius * Math.sin(angle);
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    if (svg) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      // stop short of the center circle and the node label for a cleaner look
      const innerStop = 0.34; // roughly the center circle's radius fraction
      const outerStop = 0.9;
      const x1 = radius + nodeRadius * innerStop * Math.cos(angle);
      const y1 = radius + nodeRadius * innerStop * Math.sin(angle);
      const x2 = radius + nodeRadius * outerStop * Math.cos(angle);
      const y2 = radius + nodeRadius * outerStop * Math.sin(angle);
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      const len = Math.hypot(x2 - x1, y2 - y1);
      line.style.setProperty("--len", len.toFixed(1));
      line.style.setProperty("--delay", `${i * 0.07}s`);
      svg.appendChild(line);
      lines.push(line);

      node.addEventListener("mouseenter", () => line.classList.add("is-active"));
      node.addEventListener("mouseleave", () => line.classList.remove("is-active"));
    }
  });

  if (lines.length && "IntersectionObserver" in window) {
    const drawIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            lines.forEach((line) => line.classList.add("draw-in"));
            drawIO.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    drawIO.observe(hub);
  } else {
    lines.forEach((line) => line.classList.add("draw-in"));
  }
}

window.addEventListener("load", layoutMatterHub);
window.addEventListener("resize", layoutMatterHub);

/* ==========================================================================
   Product showcase tabs
   ========================================================================== */

function buildShowcase() {
  const tabWrap = document.querySelector(".showcase-nav");
  const panelWrap = document.querySelector(".showcase-panels");
  if (!tabWrap || !panelWrap) return;

  SCREENSHOTS.forEach((shot, i) => {
    const tab = document.createElement("button");
    tab.className = "showcase-tab" + (i === 0 ? " is-active" : "");
    tab.type = "button";
    tab.textContent = `${shot.num} — ${shot.label}`;
    tab.addEventListener("click", () => activateShowcase(i));
    tabWrap.appendChild(tab);

    const panel = document.createElement("div");
    panel.className = "showcase-panel" + (i === 0 ? " is-active" : "");
    const frameContent = shot.panel
      ? `<div class="showcase-frame showcase-frame--placeholder">
          <span class="showcase-placeholder-tag">In development</span>
          <ul>
            <li>"What is the strongest argument here?"</li>
            <li>"What could the other side argue?"</li>
            <li>"What are the weaknesses in this position?"</li>
          </ul>
        </div>`
      : `<div class="showcase-frame">
          <img src="${shot.src}" alt="${shot.alt}" loading="lazy" />
        </div>`;
    panel.innerHTML = `
      ${frameContent}
      <div class="showcase-caption">
        <div><span class="num">${shot.num}</span><h3>${shot.title}</h3></div>
        <p>${shot.caption}</p>
      </div>
    `;
    panelWrap.appendChild(panel);
  });
}

function activateShowcase(index) {
  document.querySelectorAll(".showcase-tab").forEach((t, i) => t.classList.toggle("is-active", i === index));
  document.querySelectorAll(".showcase-panel").forEach((p, i) => p.classList.toggle("is-active", i === index));
}

buildShowcase();

/* ==========================================================================
   Video playback
   ========================================================================== */

const videoWrap = document.querySelector(".video-wrap");
if (videoWrap) {
  const videoEl = videoWrap.querySelector("video");
  const playBtn = videoWrap.querySelector(".video-play");
  const backBtn = videoWrap.querySelector(".video-skip--back");
  const fwdBtn = videoWrap.querySelector(".video-skip--fwd");
  const SKIP_SECONDS = 10;

  function playVideo() {
    videoWrap.classList.add("is-playing");
    videoWrap.classList.remove("is-paused");
    if (playBtn) playBtn.setAttribute("aria-label", "Pause video");
    videoEl.play().catch(() => {
      // video source not yet supplied — poster remains visible via CSS fallback
      videoWrap.classList.remove("is-playing");
    });
  }

  function pauseVideo() {
    videoEl.pause();
    videoWrap.classList.add("is-paused");
    if (playBtn) playBtn.setAttribute("aria-label", "Play video");
  }

  function toggleVideo() {
    if (!videoWrap.classList.contains("is-playing") || videoEl.paused) {
      playVideo();
    } else {
      pauseVideo();
    }
  }

  function skip(seconds) {
    if (!videoWrap.classList.contains("is-playing")) return; // nothing to skip before playback starts
    const duration = videoEl.duration || Infinity;
    videoEl.currentTime = Math.min(Math.max(videoEl.currentTime + seconds, 0), duration);
  }

  // Clicking anywhere on the frame, or the dedicated button, toggles playback.
  videoWrap.addEventListener("click", toggleVideo);

  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      skip(-SKIP_SECONDS);
    });
  }
  if (fwdBtn) {
    fwdBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      skip(SKIP_SECONDS);
    });
  }

  // Pause automatically once the video scrolls out of view, either direction.
  if ("IntersectionObserver" in window) {
    const videoIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !videoEl.paused) {
            pauseVideo();
          }
        });
      },
      { threshold: 0 }
    );
    videoIO.observe(videoWrap);
  }
}

/* ==========================================================================
   Contact links
   ========================================================================== */

function digitsOnly(v) {
  return (v || "").replace(/[^\d]/g, "");
}

function buildContactLinks() {
  const waMessage = encodeURIComponent(
    "Hello, I came across NYAYA.AI and would like to learn more about the product and have a discussion."
  );
  const emailSubject = encodeURIComponent("NYAYA.AI — Demo Request");

  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    const which = el.getAttribute("data-whatsapp");
    const number = which === "secondary" ? CONTACT.whatsappSecondary : CONTACT.whatsappPrimary;
    el.href = `https://wa.me/${digitsOnly(number)}?text=${waMessage}`;
    el.target = "_blank";
    el.rel = "noopener";
    const label = el.querySelector("[data-value]");
    if (label) label.textContent = number;
  });

  document.querySelectorAll("[data-email]").forEach((el) => {
    const which = el.getAttribute("data-email");
    const address = which === "secondary" ? CONTACT.emailSecondary : CONTACT.emailPrimary;
    el.href = `mailto:${address}?subject=${emailSubject}`;
    const label = el.querySelector("[data-value]");
    if (label) label.textContent = address;
  });
}

buildContactLinks();

/* ==========================================================================
   Year in footer
   ========================================================================== */

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();