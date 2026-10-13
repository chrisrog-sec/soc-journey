(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. File the cards in once, staggered by position.
  document.querySelectorAll(".soc-grid").forEach(function (grid) {
    grid.querySelectorAll(":scope > .soc-card").forEach(function (card, i) {
      card.style.setProperty("--i", i);
    });
    requestAnimationFrame(function () { grid.classList.add("is-in"); });
  });

  // 2. Read time under the H1 on long report pages.
  var h1 = document.querySelector(".main-content h1");
  var main = document.querySelector(".main-content main");
  var isIndex = document.querySelector(".soc-grid, .editorial-intro");
  if (h1 && main && !isIndex) {
    var words = (main.innerText || "").trim().split(/\s+/).length;
    if (words > 400) {
      var meta = document.createElement("p");
      meta.className = "soc-meta";
      meta.textContent = Math.max(1, Math.round(words / 220)) + " min read";
      h1.insertAdjacentElement("afterend", meta);
    }
  }

  // 3. Reading progress bar, only where the page actually scrolls.
  var doc = document.documentElement;
  if (!isIndex && doc.scrollHeight > window.innerHeight * 2) {
    var bar = document.createElement("div");
    bar.id = "soc-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    var ticking = false;
    var update = function () {
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = "scaleX(" + p + ")";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
