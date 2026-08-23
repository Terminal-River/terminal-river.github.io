/* RIVER project page: minimal JS.
   Two behaviors live here:
   1. Tab switching for Section 8b (false-positive / false-negative rollout traces),
      following the WAI-ARIA tabs keyboard pattern (arrow keys, roving tabindex).
   2. In-page anchor handling: opening closed <details> ancestors of a link target.
   Everything else on the page works without JS (native <details>/<summary>).
   Without JS, both 8b panels render stacked and the inert tab controls are hidden
   by CSS (html:not(.js) rules). */

(function () {
  "use strict";

  /* ---- 1. Tabs (Section 8b) ---- */
  document.querySelectorAll(".tabs").forEach(function (tabs) {
    var tabButtons = Array.prototype.slice.call(
      tabs.querySelectorAll('[role="tab"]')
    );
    var panels = tabs.querySelectorAll('[role="tabpanel"]');
    if (!tabButtons.length) return;

    function activate(panelId, focus) {
      tabButtons.forEach(function (btn) {
        var selected = btn.getAttribute("aria-controls") === panelId;
        btn.setAttribute("aria-selected", String(selected));
        btn.tabIndex = selected ? 0 : -1; // roving tabindex
        if (selected && focus) btn.focus();
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.id !== panelId;
      });
    }

    tabButtons.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        activate(btn.getAttribute("aria-controls"));
      });
      // WAI-ARIA APG tabs keyboard pattern: arrows move focus and activate.
      btn.addEventListener("keydown", function (event) {
        var next;
        if (event.key === "ArrowRight") next = (i + 1) % tabButtons.length;
        else if (event.key === "ArrowLeft")
          next = (i - 1 + tabButtons.length) % tabButtons.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabButtons.length - 1;
        else return;
        event.preventDefault();
        activate(tabButtons[next].getAttribute("aria-controls"), true);
      });
    });

    // Make each panel itself focusable, so Tab from an active tab lands on it.
    panels.forEach(function (panel) {
      panel.tabIndex = 0;
    });

    // Initial state: first tab active (no-JS fallback shows both panels).
    activate(tabButtons[0].getAttribute("aria-controls"));
  });

  /* ---- 2. In-page anchors into expandable content ---- */
  function revealHash() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    var target;
    try {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch (e) {
      return;
    }
    if (!target) return;
    // Open any closed <details> ancestors (also hardens older browsers that
    // don't auto-expand <details> on fragment navigation).
    var details = target.closest("details");
    while (details) {
      details.open = true;
      details = details.parentElement && details.parentElement.closest("details");
    }
    target.scrollIntoView();
  }

  window.addEventListener("hashchange", revealHash);
  revealHash(); // handle a hash present on initial load
})();
