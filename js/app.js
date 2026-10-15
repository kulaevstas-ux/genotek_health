(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  var state = "none";
  if (params.get("state") === "voice" || params.get("done") === "voice") state = "voice";
  if (params.get("state") === "both" || params.get("done") === "all") state = "both";

  function $$(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }

  function render() {
    $$("[data-view]").forEach(function (el) {
      el.hidden = el.getAttribute("data-view") !== state;
    });
    $$("[data-state]").forEach(function (b) {
      var on = b.getAttribute("data-state") === state;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  $$("[data-state]").forEach(function (b) {
    b.addEventListener("click", function () {
      state = b.getAttribute("data-state");
      var url = new URL(location.href);
      url.searchParams.set("state", state);
      url.hash = "";
      history.replaceState(null, "", url.pathname + url.search);
      render();
      window.scrollTo(0, 0);
    });
  });

  var toast = document.getElementById("toast");
  var toastTimer;
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-noop]");
    if (!b) return;
    ev.preventDefault();
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 1800);
  });

  var app = document.querySelector(".app");
  var sidebar = document.getElementById("sidebar");
  var backdrop = document.getElementById("nav-backdrop");
  var desktop = window.matchMedia("(min-width: 901px)");

  function closeNav() {
    sidebar.classList.remove("open");
    backdrop.hidden = true;
    document.body.style.overflow = "";
    if (desktop.matches) app.classList.add("nav-collapsed");
  }

  function openNav() {
    app.classList.remove("nav-collapsed");
    if (!desktop.matches) {
      sidebar.classList.add("open");
      backdrop.hidden = false;
      document.body.style.overflow = "hidden";
    }
  }

  document.getElementById("nav-open").addEventListener("click", openNav);
  document.getElementById("nav-close").addEventListener("click", closeNav);
  backdrop.addEventListener("click", closeNav);
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") closeNav();
  });
  desktop.addEventListener("change", function () {
    sidebar.classList.remove("open");
    backdrop.hidden = true;
    document.body.style.overflow = "";
  });

  render();
})();
