(function () {
  "use strict";

  function initRitualToggle() {
    var tabs = document.querySelectorAll('[role="tab"][data-ritual-tab]');
    var panels = document.querySelectorAll('[role="tabpanel"][data-ritual-panel]');

    if (!tabs.length || !panels.length) return;

    function activateTab(tabToActivate) {
      var targetId = tabToActivate.getAttribute("aria-controls");

      tabs.forEach(function (tab) {
        var isCurrent = tab === tabToActivate;
        tab.setAttribute("aria-selected", isCurrent ? "true" : "false");
        tab.setAttribute("tabindex", isCurrent ? "0" : "-1");
        if (isCurrent) {
          tab.classList.add("ritual-tab--active");
        } else {
          tab.classList.remove("ritual-tab--active");
        }
      });

      panels.forEach(function (panel) {
        if (panel.id === targetId) {
          panel.removeAttribute("hidden");
          panel.classList.add("ritual-panel--active");
        } else {
          panel.setAttribute("hidden", "");
          panel.classList.remove("ritual-panel--active");
        }
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activateTab(tab);
      });

      tab.addEventListener("keydown", function (e) {
        var nextTab = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          nextTab = tabs[(index + 1) % tabs.length];
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          nextTab = tabs[(index - 1 + tabs.length) % tabs.length];
        } else if (e.key === "Home") {
          e.preventDefault();
          nextTab = tabs[0];
        } else if (e.key === "End") {
          e.preventDefault();
          nextTab = tabs[tabs.length - 1];
        }

        if (nextTab) {
          nextTab.focus();
          activateTab(nextTab);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRitualToggle);
  } else {
    initRitualToggle();
  }
})();
