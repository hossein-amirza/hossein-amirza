```javascript
/* =========================================================
   HOSSEIN MOHAMMADI AMIRZA — PERSONAL WEBSITE
   script.js | Version 6.0
   Synchronized with the current index.html
   ========================================================= */

(() => {
  "use strict";

  /* -------------------------------------------------------
     1. CONFIGURATION
     ------------------------------------------------------- */

  const CONFIG = {
    // ایمیل مقصد فرم تماس
    // فرم با mailto برنامهٔ ایمیل کاربر را باز می‌کند.
    contactEmail: "hosseinmohammadi.writer@gmail.com",

    // مدت نمایش پیام‌های فرم (میلی‌ثانیه)
    statusDuration: 6000,

    // کلاس‌های نمایش تدریجی
    revealSelector: ".reveal",

    // لینک‌های اصلی منو
    navSelector: "#navLinks"
  };

  /* -------------------------------------------------------
     2. HELPERS
     ------------------------------------------------------- */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const safely = (callback, fallback = null) => {
    try {
      return callback();
    } catch (error) {
      console.error("[Website]", error);
      return fallback;
    }
  };

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------------------------------------
     3. CURRENT PERSIAN YEAR
     ------------------------------------------------------- */

  function initializeYear() {
    const yearElement = $("#year");
    if (!yearElement) return;

    try {
      const persianYear = new Intl.DateTimeFormat(
        "fa-IR-u-ca-persian",
        { year: "numeric" }
      ).format(new Date());

      yearElement.textContent = persianYear;
    } catch {
      // جایگزین ساده در مرورگرهای قدیمی
      yearElement.textContent = String(
        new Date().getFullYear() - 621
      );
    }
  }

  /* -------------------------------------------------------
     4. MOBILE NAVIGATION
     HTML:
     #menuToggle
     #navLinks.links
     ------------------------------------------------------- */

  function initializeNavigation() {
    const menuToggle = $("#menuToggle");
    const navLinks = $(CONFIG.navSelector);

    if (!menuToggle || !navLinks) return;

    const navAnchors = $$('a[href]', navLinks);

    function isOpen() {
      return (
        navLinks.classList.contains("is-open") ||
        navLinks.classList.contains("active")
      );
    }

    function setMenu(open) {
      navLinks.classList.toggle("is-open", open);
      navLinks.classList.toggle("active", open);

      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute(
        "aria-label",
        open ? "بستن منو" : "باز کردن منو"
      );
    }

    menuToggle.setAttribute("aria-controls", "navLinks");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "باز کردن منو");

    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      setMenu(!isOpen());
    });

    // بستن منو پس از انتخاب یک لینک
    navAnchors.forEach((anchor) => {
      anchor.addEventListener("click", () => {
        setMenu(false);
      });
    });

    // بستن منو با Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        setMenu(false);
        menuToggle.focus();
      }
    });

    // بستن منو با کلیک خارج از آن
    document.addEventListener("click", (event) => {
      if (!isOpen()) return;

      const clickedInside =
        navLinks.contains(event.target) ||
        menuToggle.contains(event.target);

      if (!clickedInside) setMenu(false);
    });

    // بستن منو هنگام بازگشت به نمای دسکتاپ
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        setMenu(false);
      }
    });

    // وضعیت اولیه
    setMenu(false);
  }

  /* -------------------------------------------------------
     5. LIGHT / DARK THEME
     HTML:
     #themeToggle
     ------------------------------------------------------- */

  function initializeTheme() {
    const themeToggle = $("#themeToggle");
    const root = document.documentElement;
    const storageKey = "hossein-amirza-theme";

    function readSavedTheme() {
      return safely(() => localStorage.getItem(storageKey), null);
    }

    function saveTheme(theme) {
      safely(() => localStorage.setItem(storageKey, theme));
    }

    function getInitialTheme() {
      const saved = readSavedTheme();

      if (saved === "light" || saved === "dark") {
        return saved;
      }

      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    function applyTheme(theme, persist = false) {
      const normalized = theme === "dark" ? "dark" : "light";

      root.dataset.theme = normalized;
      root.style.colorScheme = normalized;

      if (themeToggle) {
        const isDark = normalized === "dark";

        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute(
          "aria-label",
          isDark ? "فعال‌کردن حالت روشن" : "فعال‌کردن حالت تاریک"
        );
        themeToggle.setAttribute(
          "title",
          isDark ? "حالت روشن" : "حالت تاریک"
        );
      }

      if (persist) saveTheme(normalized);
    }

    applyTheme(getInitialTheme());

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const nextTheme =
          root.dataset.theme === "dark" ? "light" : "dark";

        applyTheme(nextTheme, true);
      });
    }

    // تغییر خودکار فقط زمانی که کاربر انتخاب قبلی ندارد
    const colorScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    colorScheme.addEventListener?.("change", (event) => {
      if (!readSavedTheme()) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
  }

  /* -------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS
     HTML elements use .reveal
     ------------------------------------------------------- */

  function initializeReveal() {
    const elements = $$(CONFIG.revealSelector);

    if (!elements.length) return;

    // جلوگیری از پنهان ماندن محتوا در حالت کاهش حرکت
    if (
      prefersReducedMotion() ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    elements.forEach((element) => observer.observe(element));
  }

  /* -------------------------------------------------------
     7. ACTIVE NAVIGATION LINK
     Highlight the link for the visible section
     ------------------------------------------------------- */

  function initializeActiveNavigation() {
    const navLinks = $(CONFIG.navSelector);
    if (!navLinks) return;

    const links = $$('a[href^="#"]', navLinks);

    const sections = links
      .map((link) => {
        const id = link.getAttribute("href");

        if (!id || id === "#") return null;

        const section = $(id);
        return section ? { link, section } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    function setActive(activeLink) {
      links.forEach((link) => {
        link.classList.remove("is-active", "active");
        link.removeAttribute("aria-current");
      });

      if (activeLink) {
        activeLink.classList.add("is-active", "active");
        activeLink.setAttribute("aria-current", "location");
      }
    }

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visible.length) return;

        const current = sections.find(
          (item) => item.section === visible[0].target
        );

        if (current) setActive(current.link);
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.15, 0.35, 0.6]
      }
    );

    sections.forEach(({ section }) => observer.observe(section));

    // انتخاب لینک هنگام کلیک
    links.forEach((link) => {
      link.addEventListener("click", () => setActive(link));
    });
  }

  /* -------------------------------------------------------
     8. BACK TO TOP
     HTML: #scrollTop
     ------------------------------------------------------- */

  function initializeScrollTop() {
    const button = $("#scrollTop");
    if (!button) return;

    const updateButton = () => {
      const visible = window.scrollY > 400;

      button.classList.toggle("is-visible", visible);
      button.classList.toggle("visible", visible);
      button.setAttribute("aria-hidden", String(!visible));
      button.tabIndex = visible ? 0 : -1;
    };

    button.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth"
      });
    });

    window.addEventListener("scroll", updateButton, {
      passive: true
    });

    updateButton();
  }

  /* -------------------------------------------------------
     9. IMAGE ERROR HANDLING
     Keep the page layout intact if an image is missing.
     ------------------------------------------------------- */

  function initializeImages() {
    const images = $$("img");

    images.forEach((img) => {
      img.addEventListener("error", () => {
        img.classList.add("image-missing");
        img.setAttribute("data-image-error", "true");

        const container = img.closest(
          ".screenplay-poster, .portrait-frame, .book-cover, .portrait"
        );

        if (container) {
          container.classList.add("has-image-error");
        }

        console.warn("[Website] Image could not be loaded:", img.src);
      });

      img.addEventListener("load", () => {
        img.classList.remove("image-missing");
        img.removeAttribute("data-image-error");

        const container = img.closest(
          ".screenplay-poster, .portrait-frame, .book-cover, .portrait"
        );

        if (container) {
          container.classList.remove("has-image-error");
        }
      });
    });
  }

  /* -------------------------------------------------------
     10. CONTACT FORM
     HTML:
     #contactForm
     #contactName
     #contactEmail
     #contactSubject
     #contactMessage
     #submitContact
     #formStatus

     This fallback opens the visitor's email application.
     It does NOT send a message directly from the website.
     ------------------------------------------------------- */

  function initializeContactForm() {
    const form = $("#contactForm");
    if (!form) return;

    const nameInput = $("#contactName", form);
    const emailInput = $("#contactEmail", form);
    const subjectInput = $("#contactSubject", form);
    const messageInput = $("#contactMessage", form);
    const submitButton = $("#submitContact", form);
    const statusElement = $("#formStatus");

    if (
      !nameInput ||
      !emailInput ||
      !messageInput ||
      !submitButton
    ) {
      console.warn(
        "[Website] Contact form fields do not match the expected HTML."
      );
      return;
    }

    function showStatus(message, type = "info") {
      if (!statusElement) return;

      statusElement.textContent = message;
      statusElement.dataset.status = type;
      statusElement.setAttribute("role", "status");
      statusElement.setAttribute("aria-live", "polite");
    }

    // فعال‌کردن دکمه؛ ارسال واقعی با mailto انجام نمی‌شود.
    submitButton.disabled = false;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput?.value.trim() || "پیام از وب‌سایت";
      const message = messageInput.value.trim();

      if (!name || !email || !message) {
        showStatus(
          "لطفاً نام، ایمیل و متن پیام را کامل وارد کنید.",
          "error"
        );
        return;
      }

      if (!CONFIG.contactEmail) {
        showStatus(
          "برای ارسال پیام، ابتدا سرویس تماس سایت را پیکربندی کنید.",
          "error"
        );
        return;
      }

      const emailSubject = `[وب‌سایت] ${subject}`;
      const emailBody = [
        `نام: ${name}`,
        `ایمیل فرستنده: ${email}`,
        "",
        "متن پیام:",
        message
      ].join("\n");

      const mailtoURL =
        `mailto:${CONFIG.contactEmail}` +
        `?subject=${encodeURIComponent(emailSubject)}` +
        `&body=${encodeURIComponent(emailBody)}`;

      showStatus(
        "برنامهٔ ایمیل شما باز می‌شود. برای ارسال نهایی، پیام را در آن تأیید کنید.",
        "info"
      );

      // فقط برنامهٔ ایمیل کاربر را باز می‌کند.
      // ارسال خودکار یا ارسال به سرور در این روش وجود ندارد.
      window.location.href = mailtoURL;
    });
  }

  /* -------------------------------------------------------
     11. ACCESSIBILITY IMPROVEMENTS
     ------------------------------------------------------- */

  function initializeAccessibility() {
    // افزودن focus-visible به‌صورت CSS در فایل style.css توصیه می‌شود.
    const menuToggle = $("#menuToggle");

    if (menuToggle && !menuToggle.hasAttribute("type")) {
      menuToggle.setAttribute("type", "button");
    }

    const themeToggle = $("#themeToggle");

    if (themeToggle && !themeToggle.hasAttribute("type")) {
      themeToggle.setAttribute("type", "button");
    }

    const scrollTop = $("#scrollTop");

    if (scrollTop && !scrollTop.hasAttribute("type")) {
      scrollTop.setAttribute("type", "button");
    }
  }

  /* -------------------------------------------------------
     12. INITIALIZE EVERYTHING
     ------------------------------------------------------- */

  function initializeWebsite() {
    initializeYear();
    initializeNavigation();
    initializeTheme();
    initializeReveal();
    initializeActiveNavigation();
    initializeScrollTop();
    initializeImages();
    initializeContactForm();
    initializeAccessibility();

    document.documentElement.classList.add("js-ready");

    console.info(
      "[Website] Hossein Amirza website initialized successfully."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeWebsite,
      { once: true }
    );
  } else {
    initializeWebsite();
  }
})();
```
