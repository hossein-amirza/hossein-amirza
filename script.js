"use strict";

/* =========================================================
   HOSSEIN MOHAMMADI AMIRZA — SITE SCRIPT
   Version 4.0 — Combined Edition
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector("#main-nav");
  const year = document.querySelector("#year");
  const form = document.querySelector("#contact-form");
  const note = document.querySelector("#form-note");
  const header = document.querySelector(".site-header");

  /* =========================
     1. MOBILE MENU
     ========================= */

  if (menuButton && mainNav) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("is-open");
    };

    const openMenu = () => {
      menuButton.setAttribute("aria-expanded", "true");
      mainNav.classList.add("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen =
        menuButton.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    // بستن منو پس از انتخاب یک لینک
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // بستن منو با کلید Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    // بستن منو با کلیک خارج از آن
    document.addEventListener("click", (event) => {
      if (
        !mainNav.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // هنگام بازگشت به نمایش دسکتاپ، منو بسته شود
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  /* =========================
     2. CURRENT YEAR (SHAMSI)
     ========================= */

  if (year) {
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

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameField = document.querySelector("#name");
      const emailField = document.querySelector("#email");
      const messageField = document.querySelector("#message");

      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const message = messageField ? messageField.value.trim() : "";

      // اعتبارسنجی
      if (!name || !email || !message) {
        setNote(note, "لطفاً نام، ایمیل و متن پیام را تکمیل کنید.", "warn");
        return;
      }

      if (!isValidEmail(email)) {
        setNote(note, "ایمیل وارد‌شده معتبر نیست.", "warn");
        return;
      }

      // ساخت لینک ایمیل
      const subject = encodeURIComponent("پیام از وب‌سایت — " + name);
      const body = encodeURIComponent(
        "نام: " + name +
        "\nایمیل: " + email +
        "\n\nمتن پیام:\n" + message
      );

      const mailto =
        "mailto:hosseinmohammadi.writer@gmail.com" +
        "?subject=" + subject +
        "&body=" + body;

      setNote(note, "در حال باز کردن برنامهٔ ایمیل…", "ok");
      window.location.href = mailto;
    });
  }

  /* =========================
     4. HEADER SHADOW ON SCROLL
     ========================= */

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* =========================
     5. SCROLL SPY — لینک فعال منو
     ========================= */

  const navLinks = document.querySelectorAll(".main-nav a[href^='#']");

  if (navLinks.length && "IntersectionObserver" in window) {
    const sections = Array.from(navLinks)
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (sections.length) {
      const setActive = (id) => {
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === "#" + id;
          if (isActive) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      };

      const spyObserver = new IntersectionObserver(
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

      sections.forEach((section) => spyObserver.observe(section));
    }
  }

  /* =========================
     6. REVEAL ON SCROLL
     ========================= */

  const revealTargets = document.querySelectorAll(
    ".section-heading, .about-copy, .about-aside, .book-card, .title-row, .series-card, .poetry-intro, .quote-card, .contact-copy, .contact-panel, .intro-item"
  );

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (revealTargets.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
    } else {
      revealTargets.forEach((el) => el.classList.add("reveal"));

      const revealObserver = new IntersectionObserver(
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

      revealTargets.forEach((el) => revealObserver.observe(el));
    }
  }

  /* =========================
     HELPERS
     ========================= */

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setNote(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.dataset.state = type;
  }
});
