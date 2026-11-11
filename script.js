
(function () {
  "use strict";

  /*
   * Works Library
   * Version: 2.0
   *
   * Features:
   * - Persian and Arabic character normalization
   * - Live search
   * - Category filtering
   * - Multiple categories per card
   * - Dynamic card detection
   * - Result count
   * - Empty state
   * - Clear search support
   * - Accessibility improvements
   */

  const SELECTORS = {
    search: "#work-search",
    grid: "#works-grid",
    count: "#work-count",
    empty: "#empty-message",
    categoryButton: ".category-button",
    card: ".work-card",
    clearButton: "[data-work-search-clear]",
    resultStatus: "[data-work-results]"
  };

  const state = {
    activeCategory: "all",
    searchTerm: "",
    observer: null
  };

  /*
   * Normalize Persian and Arabic text
   * for more accurate search.
   */
  function normalizeText(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .toLocaleLowerCase("fa")
      .replace(/[يى]/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/ة/g, "ه")
      .replace(/ۀ/g, "ه")
      .replace(/ؤ/g, "و")
      .replace(/إ|أ|ٱ/g, "ا")
      .replace(/[\u064B-\u065F\u0670]/g, "")
      .replace(/\u0640/g, "")
      .replace(/[\u200B-\u200F\uFEFF]/g, "")
      .replace(/[۰-۹]/g, function (digit) {
        return String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit));
      })
      .replace(/[٠-٩]/g, function (digit) {
        return String("٠١٢٣٤٥٦٧٨٩".indexOf(digit));
      })
      .replace(/\s+/g, " ")
      .trim();
  }

  /*
   * Read all work cards.
   * This is called again when dynamic cards are added.
   */
  function getCards(grid) {
    return Array.from(grid.querySelectorAll(SELECTORS.card));
  }

  /*
   * Read categories from a card.
   *
   * Supported:
   * data-category="history"
   * data-categories="history, culture, literature"
   */
  function getCardCategories(card) {
    const values = [];

    if (card.dataset.category) {
      values.push(card.dataset.category);
    }

    if (card.dataset.categories) {
      values.push(
        ...card.dataset.categories.split(",")
      );
    }

    return values
      .map(normalizeText)
      .filter(Boolean);
  }

  /*
   * Build searchable content for each card.
   */
  function getSearchableText(card) {
    const customText = card.dataset.search || "";
    const visibleText = card.textContent || "";

    return normalizeText(
      customText + " " + visibleText
    );
  }

  /*
   * Update category button states.
   */
  function updateCategoryButtons(buttons) {
    buttons.forEach(function (button) {
      const category = normalizeText(
        button.dataset.category || "all"
      );

      const isActive =
        category === state.activeCategory;

      button.classList.toggle("active", isActive);
      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });
  }

  /*
   * Update the visible result count.
   */
  function updateCount(element, count) {
    if (!element) return;

    element.textContent = count + " اثر";
  }

  /*
   * Update empty state.
   */
  function updateEmptyMessage(element, count) {
    if (!element) return;

    element.hidden = count !== 0;
  }

  /*
   * Update accessible result status.
   */
  function updateResultStatus(element, count) {
    if (!element) return;

    element.textContent =
      count === 0
        ? "هیچ اثری پیدا نشد."
        : count + " اثر پیدا شد.";
  }

  /*
   * Main filtering function.
   */
  function filterWorks(elements) {
    const {
      searchInput,
      worksGrid,
      countElement,
      emptyMessage,
      resultStatus
    } = elements;

    const cards = getCards(worksGrid);

    state.searchTerm = normalizeText(
      searchInput.value
    );

    let visibleCount = 0;

    cards.forEach(function (card) {
      const categories = getCardCategories(card);
      const searchableText = getSearchableText(card);

      const matchesCategory =
        state.activeCategory === "all" ||
        categories.includes(state.activeCategory);

      const matchesSearch =
        state.searchTerm.length === 0 ||
        searchableText.includes(state.searchTerm);

      const isVisible =
        matchesCategory && matchesSearch;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;
      }
    });

    updateCount(countElement, visibleCount);
    updateEmptyMessage(emptyMessage, visibleCount);
    updateResultStatus(resultStatus, visibleCount);

    return visibleCount;
  }

  /*
   * Initialize one works library.
   */
  function initializeWorksLibrary(root) {
    const searchInput = root.querySelector(
      SELECTORS.search
    );

    const worksGrid = root.querySelector(
      SELECTORS.grid
    );

    if (!searchInput || !worksGrid) {
      return;
    }

    const countElement = root.querySelector(
      SELECTORS.count
    );

    const emptyMessage = root.querySelector(
      SELECTORS.empty
    );

    const categoryButtons = Array.from(
      root.querySelectorAll(SELECTORS.categoryButton)
    );

    const clearButton = root.querySelector(
      SELECTORS.clearButton
    );

    const resultStatus = root.querySelector(
      SELECTORS.resultStatus
    );

    const elements = {
      searchInput,
      worksGrid,
      countElement,
      emptyMessage,
      resultStatus
    };

    /*
     * Initialize active category.
     */
    const initiallyActive = categoryButtons.find(
      function (button) {
        return (
          button.classList.contains("active") ||
          button.getAttribute("aria-pressed") === "true"
        );
      }
    );

    state.activeCategory = initiallyActive
      ? normalizeText(
          initiallyActive.dataset.category || "all"
        )
      : "all";

    updateCategoryButtons(categoryButtons);

    /*
     * Search event.
     */
    searchInput.addEventListener("input", function () {
      filterWorks(elements);
    });

    /*
     * Clear search with Escape.
     */
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        searchInput.value = "";
        filterWorks(elements);
        searchInput.focus();
      }
    });

    /*
     * Optional clear button.
     */
    if (clearButton) {
      clearButton.addEventListener("click", function () {
        searchInput.value = "";
        filterWorks(elements);
        searchInput.focus();
      });
    }

    /*
     * Category buttons.
     */
    categoryButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        state.activeCategory = normalizeText(
          button.dataset.category || "all"
        );

        updateCategoryButtons(categoryButtons);
        filterWorks(elements);
      });
    });

    /*
     * Detect dynamically added work cards.
     * For example, cards created from JSON or another script.
     */
    if ("MutationObserver" in window) {
      state.observer = new MutationObserver(function (changes) {
        const hasNewChildren = changes.some(
          function (change) {
            return change.type === "childList";
          }
        );

        if (hasNewChildren) {
          filterWorks(elements);
        }
      });

      state.observer.observe(worksGrid, {
        childList: true,
        subtree: true
      });
    }

    /*
     * Initial filtering.
     */
    filterWorks(elements);
  }

  /*
   * Start after the document is ready.
   */
  function initialize() {
    const libraries = document.querySelectorAll(
      "[data-works-library]"
    );

    if (libraries.length > 0) {
      libraries.forEach(initializeWorksLibrary);
      return;
    }

    /*
     * Backward compatibility:
     * Supports the existing ID-based HTML structure.
     */
    initializeWorksLibrary(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );
  } else {
    initialize();
  }
})();
