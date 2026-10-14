"use strict";

/* =========================================================
   HOSSEIN MOHAMMADI AMIRZA — SITE SCRIPT
   Version 5.0 — Production Ready
   ========================================================= */

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       ۰. آماده‌سازی اولیه
       ===================================================== */

    // [۱۰/۱۰] علامت‌گذاری برای CSS (progressive enhancement)
    document.documentElement.classList.add("js-enabled");

    /* =====================================================
       ۱. ثابت‌های پیکربندی
       ===================================================== */

    const MOBILE_BREAKPOINT = 760;   // [۱۰/۱۰] هماهنگ با CSS
    const SCROLL_THRESHOLD  = 12;    // [۱۰/۱۰] آستانه بهتر برای هدر
    const RESIZE_DEBOUNCE   = 120;

    const ARIA_OPEN  = "باز کردن فهرست";
    const ARIA_CLOSE = "بستن فهرست";

    /* =====================================================
       ۲. کش کردن المان‌ها
       ===================================================== */

    const header     = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");

    // [۱۰/۱۰] پشتیبانی از شناسه‌های قدیمی و جدید
    const mainNav = document.querySelector(
      "#site-navigation, #main-nav"
    );

    // [۱۰/۱۰] پشتیبانی از هر دو ساختار کلاس
    const navLinks = document.querySelectorAll(
      '.site-nav a[href^="#"], ' +
      '.main-nav a[href^="#"], ' +
      '#site-navigation a[href^="#"], ' +
      '#main-nav a[href^="#"]'
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =====================================================
       ۳. توابع کمکی
       ===================================================== */

    // [۱۰/۱۰] تنظیم پیام وضعیت فرم با dataset برای استایل‌دهی CSS
    function setNote(element, text, type) {
      if (!element) return;
      element.textContent = text;
      if (type) element.dataset.state = type;
    }

    // [۱۰/۱۰] اعتبارسنجی ایمیل
    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    /* =====================================================
       ۴. منوی موبایل
       ===================================================== */

    function closeMenu(returnFocus = false) {
      if (!menuToggle || !mainNav) return;

      mainNav.classList.remove("is-open");
      document.body.classList.remove("menu-open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", ARIA_OPEN);

      // [۱۰/۱۰] بازگرداندن فوکوس به دکمه
      if (returnFocus) {
        menuToggle.focus();
      }
    }

    function openMenu() {
      if (!menuToggle || !mainNav) return;

      mainNav.classList.add("is-open");
      document.body.classList.add("menu-open");

      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", ARIA_CLOSE);
    }

    if (menuToggle && mainNav) {
      // [۱۰/۱۰] هماهنگ‌سازی وضعیت اولیه با HTML
      const initiallyOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (initiallyOpen) openMenu();
      else closeMenu();

      // کلیک روی دکمه
      menuToggle.addEventListener("click", () => {
        const isOpen =
          menuToggle.getAttribute("aria-expanded") === "true";

        if (isOpen) closeMenu();
        else openMenu();
      });

      // بستن پس از انتخاب لینک
      navLinks.forEach((link) => {
        link.addEventListener("click", () => closeMenu());
      });

      // [۱۰/۱۰] بستن با Escape + بازگرداندن فوکوس
      document.addEventListener("keydown", (event) => {
        if (
          event.key === "Escape" &&
          mainNav.classList.contains("is-open")
        ) {
          closeMenu(true);
        }
      });

      // [۱۰/۱۰] بستن با کلیک بیرون (با چک Node)
      document.addEventListener("click", (event) => {
        if (
          !mainNav.classList.contains("is-open") ||
          !(event.target instanceof Node)
        ) {
          return;
        }

        if (
          !mainNav.contains(event.target) &&
          !menuToggle.contains(event.target)
        ) {
          closeMenu();
        }
      });

      // [۱۰/۱۰] بستن با resize (debounce شده)
      let resizeTimer;
      window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (window.innerWidth > MOBILE_BREAKPOINT) {
            closeMenu();
          }
        }, RESIZE_DEBOUNCE);
      });

      // [۱۰/۱۰] بستن هنگام خروج فوکوس از منو
      mainNav.addEventListener("focusout", (event) => {
        if (!mainNav.classList.contains("is-open")) return;

        const nextTarget = event.relatedTarget;

        if (
          nextTarget instanceof Node &&
          !mainNav.contains(nextTarget) &&
          !menuToggle.contains(nextTarget)
        ) {
          closeMenu();
        }
      });
    }

    /* =====================================================
       ۵. افکت سربرگ هنگام اسکرول
       ===================================================== */

    function updateHeader() {
      if (!header) return;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      header.classList.toggle(
        "is-scrolled",
        scrollY > SCROLL_THRESHOLD
      );
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    /* =====================================================
       ۶. اسکرول اسپای — تشخیص بخش فعال
       ===================================================== */

    const observedSections = Array.from(navLinks)
      .map((link) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return null;

        const target = document.getElementById(href.slice(1));
        return target ? { link, target } : null;
      })
      .filter(Boolean);

    // [۱۰/۱۰] تابع کمکی برای تنظیم لینک فعال
    function setActiveSection(activeId) {
      navLinks.forEach((link) => {
        const isActive =
          link.getAttribute("href") === `#${activeId}`;

        link.classList.toggle("is-active", isActive);

        if (isActive) {
          // [۱۰/۱۰] مقدار صحیح: "location" نه "page"
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    if (
      "IntersectionObserver" in window &&
      observedSections.length
    ) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) => b.intersectionRatio - a.intersectionRatio
            );

          if (!visibleEntries.length) return;

          const activeId = visibleEntries[0].target.id;
          if (activeId) setActiveSection(activeId);
        },
        {
          // [۱۰/۱۰] ناحیه فعال دقیق‌تر
          rootMargin: "-35% 0px -55% 0px",
          threshold: [0, 0.2, 0.5]
        }
      );

      // [۱۰/۱۰] حذف تکراری‌ها (اگر لینک تکراری باشد)
      const uniqueTargets = new Set(
        observedSections.map(({ target }) => target)
      );

      uniqueTargets.forEach((target) => {
        sectionObserver.observe(target);
      });
    }

    /* =====================================================
       ۷. نمایش تدریجی محتوا (Reveal on Scroll)
       ===================================================== */

    const revealTargets = document.querySelectorAll(
      [
        ".hero-copy",
        ".hero-portrait",
        ".section-heading",
        ".intro-copy",
        ".intro-aside",
        ".field-card",
        ".work-card",
        ".works-note",
        ".writing-category",
        ".philosophy-inner",
        ".contact-panel"
      ].join(",")
    );

    // [۱۰/۱۰] ابتدا همه را آماده می‌کنیم
    revealTargets.forEach((element) => {
      element.classList.add("reveal");
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      // [۱۰/۱۰] محتوا در حالت کاهش حرکت پنهان نمی‌ماند
      revealTargets.forEach((element) => {
        element.classList.add("is-visible");
      });
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -30px 0px"
        }
      );

      revealTargets.forEach((element) => {
        revealObserver.observe(element);
      });
    }

    /* =====================================================
       ۸. مدیریت خطای تصاویر (Fallback)
       ===================================================== */

    document.querySelectorAll("img").forEach((image) => {
      const getContainer = () =>
        image.closest(
          ".portrait-frame, .work-cover, .work-card"
        );

      const markMissing = () => {
        const container = getContainer();
        if (container) container.classList.add("image-missing");
      };

      const markLoaded = () => {
        if (image.naturalWidth > 0) {
          const container = getContainer();
          if (container) container.classList.remove("image-missing");
        }
      };

      image.addEventListener("error", markMissing);
      image.addEventListener("load", markLoaded);

      // [۱۰/۱۰] بررسی خطای تصاویر cache شده
      if (image.complete && image.naturalWidth === 0) {
        markMissing();
      }
    });

    /* =====================================================
       ۹. سال شمسی پابرگ
       ===================================================== */

    // [۱۰/۱۰] پشتیبانی از شناسه‌های مختلف
    const yearElement = document.querySelector(
      "#year, #current-year"
    );

    if (yearElement) {
      try {
        // [۱۰/۱۰] تقویم واقعی شمسی (نه فقط ارقام فارسی)
        yearElement.textContent = new Intl.DateTimeFormat(
          "fa-IR-u-ca-persian",
          { year: "numeric" }
        ).format(new Date());
      } catch (error) {
        // [۱۰/۱۰] fallback اگر Intl پشتیبانی نشود
        yearElement.textContent = "۱۴۰۴";
      }
    }

    /* =====================================================
       ۱۰. فرم تماس (mailto)
       ===================================================== */

    const contactForm = document.querySelector("#contact-form");
    const formStatus  = document.querySelector(
      "#form-status, #form-note"
    );

    if (contactForm) {
      // [۱۰/۱۰] تنظیم ویژگی‌های ARIA برای screen reader
      if (formStatus) {
        formStatus.setAttribute("role", "status");
        formStatus.setAttribute("aria-live", "polite");
      }

      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // [۱۰/۱۰] اعتبارسنجی بومی مرورگر (اگر پشتیبانی شود)
        if (typeof contactForm.reportValidity === "function") {
          if (!contactForm.reportValidity()) return;
        }

        // [۱۰/۱۰] گرفتن فیلدها از داخل خود فرم (نه از document)
        const nameInput    = contactForm.querySelector("#name");
        const emailInput   = contactForm.querySelector("#email");
        const messageInput = contactForm.querySelector("#message");

        if (!nameInput || !emailInput || !messageInput) {
          setNote(
            formStatus,
            "ساختار فرم کامل نیست؛ لطفاً فیلدهای تماس را بررسی کنید.",
            "error"
          );
          return;
        }

        const name    = nameInput.value.trim();
        const email   = emailInput.value.trim();
        const message = messageInput.value.trim();

        // اعتبارسنجی خالی بودن
        if (!name || !email || !message) {
          setNote(
            formStatus,
            "لطفاً نام، ایمیل و متن پیام را تکمیل کنید.",
            "warn"
          );
          return;
        }

        // اعتبارسنجی ایمیل
        if (!isValidEmail(email)) {
          setNote(
            formStatus,
            "نشانی ایمیل واردشده معتبر نیست.",
            "warn"
          );
          return;
        }

        const recipient = "hosseinmohammadi.writer@gmail.com";
        const subject = `پیام از وب‌سایت — ${name}`;

        const body = [
          `نام فرستنده: ${name}`,
          `ایمیل فرستنده: ${email}`,
          "",
          "متن پیام:",
          message
        ].join("\r\n");

        const mailto =
          `mailto:${recipient}` +
          `?subject=${encodeURIComponent(subject)}` +
          `&body=${encodeURIComponent(body)}`;

        setNote(
          formStatus,
          "برنامهٔ ایمیل در حال باز شدن است. ارسال پیام را در آن تأیید کنید.",
          "ok"
        );

        // [۱۰/۱۰] روش امن‌تر برای باز کردن mailto (بدون ترک صفحه)
        const emailLink = document.createElement("a");
        emailLink.href = mailto;
        emailLink.hidden = true;
        emailLink.setAttribute("aria-hidden", "true");

        document.body.appendChild(emailLink);
        emailLink.click();
        emailLink.remove();

        // [۱۰/۱۰] پیام پشتیبان اگر mailto کار نکرد
        window.setTimeout(() => {
          if (
            formStatus &&
            document.visibilityState === "visible"
          ) {
            setNote(
              formStatus,
              `اگر برنامهٔ ایمیل باز نشد، پیام خود را مستقیماً به ${recipient} ارسال کنید.`,
              "ok"
            );
          }
        }, 2500);
      });
    }
  });
})();
