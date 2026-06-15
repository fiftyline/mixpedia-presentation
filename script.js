const SECTIONS = ["cover", "s1", "s2", "s3", "s4", "s5", "s6", "appendix"];

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
  initObserver();
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
