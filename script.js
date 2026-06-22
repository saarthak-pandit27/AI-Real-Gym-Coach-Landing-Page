// ==========================================
// SMOOTH SCROLL ANIMATIONS
// ==========================================

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document
  .querySelectorAll(
    ".feature-card, .journey-item, .shot, .tech-grid div, .stat-card"
  )
  .forEach((el) => observer.observe(el));

// ==========================================
// NAVBAR ACTIVE LINK
// ==========================================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;

    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// ==========================================
// COUNTER ANIMATION
// ==========================================

const counters = document.querySelectorAll(".stat-card h2");

const runCounter = (counter) => {
  const text = counter.innerText;

  if (!text.includes("%") && !text.includes("+")) return;

  const target = parseInt(text);

  if (isNaN(target)) return;

  let count = 0;

  const update = () => {
    const increment = target / 40;

    if (count < target) {
      count += increment;

      if (text.includes("%")) {
        counter.innerText = `${Math.ceil(count)}%`;
      } else {
        counter.innerText = `${Math.ceil(count)}+`;
      }

      requestAnimationFrame(update);
    } else {
      counter.innerText = text;
    }
  };

  update();
};

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(
          entry.target.querySelector("h2")
        );
      }
    });
  },
  {
    threshold: 0.5,
  }
);

document
  .querySelectorAll(".stat-card")
  .forEach((card) => statObserver.observe(card));

// ==========================================
// HERO IMAGE FLOAT EFFECT
// ==========================================

const heroImage = document.querySelector(".hero-right img");

window.addEventListener("mousemove", (e) => {
  if (!heroImage) return;

  const x =
    (window.innerWidth / 2 - e.clientX) /
    40;

  const y =
    (window.innerHeight / 2 - e.clientY) /
    40;

  heroImage.style.transform =
    `translate(${x}px, ${y}px)`;
});