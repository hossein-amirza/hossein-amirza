
(function () {
  "use strict";

  function initializeWorksLibrary() {
    const searchInput = document.getElementById("work-search");
    const worksGrid = document.getElementById("works-grid");
    const countElement = document.getElementById("work-count");
    const emptyMessage = document.getElementById("empty-message");
    const categoryButtons = document.querySelectorAll(".category-button");

    if (!searchInput || !worksGrid) {
      return;
    }

    const cards = Array.from(
      worksGrid.querySelectorAll(".work-card")
    );

    let activeCategory = "all";

    function filterWorks() {
      const query = searchInput.value
        .trim()
        .toLocaleLowerCase("fa");

      let visibleCount = 0;

      cards.forEach(function (card) {
        const category = card.dataset.category || "";
        const searchableText = (
          card.dataset.search + " " + card.textContent
        ).toLocaleLowerCase("fa");

        const matchesCategory =
          activeCategory === "all" ||
          category === activeCategory;

        const matchesSearch =
          query.length === 0 ||
          searchableText.includes(query);

        const isVisible = matchesCategory && matchesSearch;

        card.hidden = !isVisible;

        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (countElement) {
        countElement.textContent = visibleCount + " اثر";
      }

      if (emptyMessage) {
        emptyMessage.hidden = visibleCount !== 0;
      }
    }

    searchInput.addEventListener("input", filterWorks);

    categoryButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeCategory = button.dataset.category || "all";

        categoryButtons.forEach(function (item) {
          const isActive = item === button;

          item.classList.toggle("active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });

        filterWorks();
      });
    });

    filterWorks();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeWorksLibrary
    );
  } else {
    initializeWorksLibrary();
  }
})();
