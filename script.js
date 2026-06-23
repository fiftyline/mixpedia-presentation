const SECTIONS = ["cover", "s1", "s2", "s3", "s4", "s5", "s6", "appendix"];
const SIDEBAR_WIDTH_KEY = "mixpedia-sidebar-width";
const SIDEBAR_MIN_WIDTH = 220;
const SIDEBAR_MAX_WIDTH = 420;

async function loadSections() {
  const main = document.getElementById("main-content");
  for (const id of SECTIONS) {
    const res = await fetch(`sections/${id}.html`);
    const html = await res.text();
    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    while (wrap.firstChild) main.appendChild(wrap.firstChild);
  }
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initSidebarResizer();
  initToggleChips();
  initObserver();
}

function setSidebarWidth(width) {
  const clampedWidth = Math.min(
    SIDEBAR_MAX_WIDTH,
    Math.max(SIDEBAR_MIN_WIDTH, width),
  );
  document.documentElement.style.setProperty(
    "--sidebar-width",
    `${clampedWidth}px`,
  );
  localStorage.setItem(SIDEBAR_WIDTH_KEY, String(clampedWidth));
}

function initSidebarResizer() {
  const resizer = document.querySelector(".sidebar-resizer");
  if (!resizer) return;

  const savedWidth = Number(localStorage.getItem(SIDEBAR_WIDTH_KEY));
  if (Number.isFinite(savedWidth) && savedWidth > 0) {
    setSidebarWidth(savedWidth);
  }

  resizer.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    document.body.classList.add("is-resizing-sidebar");
    resizer.setPointerCapture(event.pointerId);
  });

  resizer.addEventListener("pointermove", (event) => {
    if (!document.body.classList.contains("is-resizing-sidebar")) return;
    setSidebarWidth(event.clientX);
  });

  resizer.addEventListener("pointerup", (event) => {
    document.body.classList.remove("is-resizing-sidebar");
    resizer.releasePointerCapture(event.pointerId);
  });

  resizer.addEventListener("pointercancel", () => {
    document.body.classList.remove("is-resizing-sidebar");
  });

  resizer.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentWidth = Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--sidebar-width",
      ),
      10,
    );
    const direction = event.key === "ArrowRight" ? 1 : -1;
    setSidebarWidth(currentWidth + direction * 16);
  });
}

function initToggleChips() {
  document.querySelectorAll("[data-toggle-target]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const target = document.getElementById(toggle.dataset.toggleTarget);
      if (!target) return;
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      target.hidden = isExpanded;
    });
  });
}

function initObserver() {
  const sectionEls = document.querySelectorAll("section[id], div[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          const active = document.querySelector(
            `.nav-link[href="#${entry.target.id}"]`,
          );
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" },
  );

  sectionEls.forEach((s) => observer.observe(s));
}

loadSections();

const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });
