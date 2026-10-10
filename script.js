"use strict";

/* =========================================================
   HOSSEIN MOHAMMADI AMIRZA — SITE SCRIPT
   Version 3.0 — Color Edition
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initCurrentYear();
  initContactForm();
  initScrollSpy();
  initHeaderShadow();
  initRevealOnScroll();
});

/* =========================
   1. MOBILE MENU
   ========================= */

function initMobileMenu() {
  const menuButton = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector("#main-nav");

  if (!menuButton || !mainNav) return;

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("is-open");
  };

  const openMenu = () => {
    menuButton.setAttribute("aria-expanded", "true");
    mainNav.classList.add("is-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      !mainNav.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
  });
}

/* =========================
   2. CURRENT YEAR (SHAMSI)
   ========================= */

function initCurrentYear() {
  const year = document.querySelector("#year");
  if (!year) return;

  try {
    year.textContent = new Intl.NumberFormat("fa-IR", {
      useGrouping: false,
    }).format(new Date().getFullYear());
  } catch {
    year.textContent = new Date().getFullYear();
  }
}

/* =========================
   3. CONTACT FORM → MAILTO
   ========================= */

function initContactForm() {
  const form = document.querySelector("#contact-form");
  const note = document.querySelector("#form-note");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#name")?.value.trim() ?? "";
    const email = document.querySelector("#email")?.value.trim() ?? "";
    const message = document.querySelector("#message")?.value.trim() ?? "";

    if (!name || !email || !message) {
      setNote(note, "لطفاً نام، ایمیل و متن پیام را تکمیل کنید.", "warn");
      return;
    }

    if (!isValidEmail(email)) {
      setNote(note, "ایمیل وارد‌شده معتبر نیست.", "warn");
      return;
    }

    const subject = encodeURIComponent("پیام از وب‌سایت — " + name);
    const body = encodeURIComponent(
      "نام: " + name + "\n" +
      "ایمیل: " + email + "\n\n" +
      "متن پیام:\n" + message
    );

    const mailto =
      "mailto:hosseinmohammadi.writer@gmail.com" +
      "?subject=" + subject +
      "&body=" + body;

    setNote(note, "در حال باز کردن برنامهٔ ایمیل…", "ok");
    window.location.href = mailto;
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setNote(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.dataset.state = type;
}

/* =========================
   4. SCROLL SPY (active link)
   ========================= */

function initScrollSpy() {
  const navLinks = document.querySelectorAll(".main-nav a[href^='#']");
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === "#" + id;
      link.toggleAttribute("aria-current", isActive);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) setActive(visible[0].target.id);
    },
    {
      rootMargin: "-40% 0px -55% 0px",
      threshold: [0.1, 0.3, 0.6],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =========================
   5. HEADER SHADOW ON SCROLL
   ========================= */

function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* =========================
   6. REVEAL ON SCROLL
   ========================= */

function initRevealOnScroll() {
  const targets = document.querySelectorAll(
    ".section-heading, .about-copy, .about-aside, .book-card, .title-row, .series-card, .poetry-intro, .quote-card, .contact-copy, .contact-panel, .intro-item"
  );

  if (!targets.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}
