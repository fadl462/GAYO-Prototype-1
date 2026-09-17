/* ==========================================================================
   MIOMS — Executive Overview
   Prototype interactivity. All data below is illustrative demo data.
   ========================================================================== */

(function () {
  "use strict";

  var COLORS = {
    green: "#008037",
    lime: "#a7d13d",
    navy: "#00203f",
    mint: "#adefd1",
    ink: "#1a1a1a",
    inkSoft: "#7c877f",
    line: "#e1e8e3",
  };

  /* ---------------------------------------------------------------- */
  /* Mobile sidebar drawer                                             */
  /* ---------------------------------------------------------------- */
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("overlay");
  var menuBtn = document.getElementById("menuBtn");
  var closeBtn = document.getElementById("sidebarClose");

  function openMenu() {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-visible");
  }
  function closeMenu() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-visible");
  }
  if (menuBtn) menuBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);

  document.querySelectorAll(".navlink").forEach(function (link) {
    link.addEventListener("click", function () {
      document.querySelectorAll(".navlink").forEach(function (l) { l.classList.remove("is-active"); });
      link.classList.add("is-active");
      closeMenu();
    });
  });

  /* ---------------------------------------------------------------- */
  /* Generic tab / toggle groups (visual state only — demo prototype) */
  /* ---------------------------------------------------------------- */
  function wireToggleGroup(selector, itemSelector) {
    document.querySelectorAll(selector).forEach(function (group) {
      group.querySelectorAll(itemSelector).forEach(function (btn) {
        btn.addEventListener("click", function () {
          group.querySelectorAll(itemSelector).forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
        });
      });
    });
  }
  wireToggleGroup("#rangeGroup", "button");
  wireToggleGroup(".status-toggle", "button");
  wireToggleGroup(".geo-controls", "button");

  var applyBtn = document.getElementById("applyFilters");
  var resetBtn = document.getElementById("resetFilters");
  if (applyBtn) {
    applyBtn.addEventListener("click", function () {
      applyBtn.textContent = "";
      var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.innerHTML = '<use href="#ic-check-square"></use>';
      applyBtn.appendChild(icon);
      applyBtn.appendChild(document.createTextNode("Filters Applied"));
      setTimeout(function () {
        applyBtn.innerHTML = '<svg><use href="#ic-check-square"></use></svg>Apply Filters';
      }, 1400);
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      document.querySelectorAll(".filterbar select").forEach(function (s) { s.selectedIndex = 0; });
    });
  }

  /* ---------------------------------------------------------------- */
  /* Charts (Chart.js)                                                  */
  /* ---------------------------------------------------------------- */
  if (typeof Chart === "undefined") return;

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = COLORS.inkSoft;

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
  var YEARS = ["2022", "2023", "2024", "2025", "2026"];

  var METRIC_SERIES = {
    projects:      { monthly: [58,60,63,66,68,70,71,73,74,75,76,77], quarterly: [61,68,73,77], annual: [40,52,63,77], prev: [50,53,56,58,60,62,63,64,65,66,67,68], target: 80 },
    indicators:    { monthly: [70,71,73,74,76,77,78,80,81,82,84,85], quarterly: [72,77,81,85], annual: [58,66,74,85], prev: [62,64,65,67,68,69,70,71,72,73,74,75], target: 90 },
    activities:    { monthly: [75,77,79,80,82,84,85,87,88,89,90,92], quarterly: [77,82,88,92], annual: [63,73,84,92], prev: [66,68,70,71,73,75,76,78,79,80,81,83], target: 95 },
    budget:        { monthly: [40,44,47,50,53,55,57,59,61,63,64,65.5], quarterly: [44,50,57,65.5], annual: [22,35,50,65.5], prev: [35,37,39,41,43,45,46,48,49,50,51,52], target: 70 },
    beneficiaries: { monthly: [62,64,66,68,70,72,74,76,78,80,82,84], quarterly: [64,68,74,84], annual: [45,58,70,84], prev: [50,52,54,56,58,60,61,63,64,65,66,67], target: 88 },
  };

  var perfCanvas = document.getElementById("orgPerformanceChart");
  var orgChart = null;

  function buildOrgChart(metric, range) {
    var data = METRIC_SERIES[metric];
    var labels = range === "monthly" ? MONTHS : range === "quarterly" ? QUARTERS : YEARS;
    var current = data[range];
    var prevFull = data.prev;
    var prev = range === "monthly" ? prevFull
      : range === "quarterly" ? [prevFull[2], prevFull[5], prevFull[8], prevFull[11]]
      : [prevFull[2], prevFull[5], prevFull[8], prevFull[11]];
    var target = labels.map(function () { return data.target; });

    var cfg = {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Current period",
            data: current,
            borderColor: COLORS.green,
            backgroundColor: "rgba(0,128,55,0.12)",
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 5,
          },
          {
            label: "Previous period",
            data: prev,
            borderColor: COLORS.lime,
            borderWidth: 2,
            borderDash: [5, 4],
            fill: false,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
          {
            label: "Target",
            data: target,
            borderColor: COLORS.navy,
            borderWidth: 1.5,
            borderDash: [2, 3],
            fill: false,
            pointRadius: 0,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#00203f",
            padding: 10,
            titleFont: { weight: "600" },
            callbacks: {
              label: function (ctx) { return ctx.dataset.label + ": " + ctx.parsed.y + "%"; },
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: {
            min: 0, max: 100,
            grid: { color: COLORS.line },
            ticks: { callback: function (v) { return v + "%"; }, font: { size: 11 } },
          },
        },
      },
    };

    if (orgChart) { orgChart.destroy(); }
    orgChart = new Chart(perfCanvas, cfg);
  }

  var currentMetric = "projects";
  var currentRange = "monthly";
  if (perfCanvas) {
    buildOrgChart(currentMetric, currentRange);

    document.querySelectorAll("#perfTabs button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("#perfTabs button").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        currentMetric = btn.getAttribute("data-metric");
        buildOrgChart(currentMetric, currentRange);
      });
    });
    document.querySelectorAll("#rangeGroup button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentRange = btn.getAttribute("data-range");
        buildOrgChart(currentMetric, currentRange);
      });
    });
  }

  /* ---------------------------------------------------------------- */
  /* Thematic area sparklines                                          */
  /* ---------------------------------------------------------------- */
  var sparkData = {
    waste: [70, 74, 76, 79, 82, 85, 88],
    adaptation: [66, 68, 71, 74, 76, 79, 82],
    transition: [60, 63, 65, 68, 72, 76, 79],
    jobs: [78, 81, 83, 86, 88, 89, 91],
  };
  document.querySelectorAll(".theme-card").forEach(function (card) {
    var theme = card.getAttribute("data-theme");
    var canvas = card.querySelector(".theme-card__spark canvas");
    if (!canvas || !sparkData[theme]) return;
    var accent = getComputedStyle(card.querySelector(".theme-card__tag")).backgroundColor;
    new Chart(canvas, {
      type: "line",
      data: {
        labels: sparkData[theme].map(function (_, i) { return i; }),
        datasets: [{
          data: sparkData[theme],
          borderColor: accent,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
          backgroundColor: accent.replace("rgb", "rgba").replace(")", ",0.12)"),
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        elements: { line: { borderJoinStyle: "round" } },
      },
    });
  });

  /* ---------------------------------------------------------------- */
  /* MERL target vs actual                                             */
  /* ---------------------------------------------------------------- */
  var merlCanvas = document.getElementById("merlChart");
  if (merlCanvas) {
    new Chart(merlCanvas, {
      type: "bar",
      data: {
        labels: ["Output", "Outcome", "Impact"],
        datasets: [
          { label: "Actual", data: [91, 78, 72], backgroundColor: COLORS.green, borderRadius: 6, barPercentage: 0.55 },
          { label: "Target", data: [95, 85, 80], backgroundColor: COLORS.mint, borderRadius: 6, barPercentage: 0.55 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } },
          tooltip: { callbacks: { label: function (ctx) { return ctx.dataset.label + ": " + ctx.parsed.y + "%"; } } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11.5 } } },
          y: { min: 0, max: 100, grid: { color: COLORS.line }, ticks: { callback: function (v) { return v + "%"; } } },
        },
      },
    });
  }

  /* ---------------------------------------------------------------- */
  /* Generic in-page view tabs (Data Collection, Project Workspace, …) */
  /* ---------------------------------------------------------------- */
  (function () {
    var tabBtns = document.querySelectorAll(".view-tabs button");
    var panes = document.querySelectorAll(".view-pane");
    if (!tabBtns.length || !panes.length) return;

    function showView(key) {
      tabBtns.forEach(function (b) { b.classList.toggle("is-active", b.getAttribute("data-view") === key); });
      panes.forEach(function (p) { p.classList.toggle("is-active", p.id === "view-" + key); });
      window.dispatchEvent(new CustomEvent("viewtab:shown", { detail: { key: key } }));
    }

    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { showView(btn.getAttribute("data-view")); });
    });

    window._showView = showView;
  })();

  /* ---------------------------------------------------------------- */
  /* Time-aware greeting + live local date/time                        */
  /* ---------------------------------------------------------------- */
  function timeGreeting(hour) {
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 22) return "Good evening";
    return "Good night";
  }

  function applyLiveTime() {
    var now = new Date();
    var greeting = timeGreeting(now.getHours());

    document.querySelectorAll(".js-time-greeting").forEach(function (el) {
      el.textContent = greeting;
    });

    document.querySelectorAll(".js-live-datetime").forEach(function (el) {
      var opts = { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" };
      el.textContent = now.toLocaleString(undefined, opts);
    });
  }

  applyLiveTime();
  // keep it honest if the dashboard is left open across a time-of-day boundary
  setInterval(applyLiveTime, 60000);

  /* ---------------------------------------------------------------- */
  /* Geo marker hover emphasis                                          */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll(".geo-marker").forEach(function (marker) {
    marker.style.cursor = "pointer";
    marker.addEventListener("mouseenter", function () {
      marker.querySelectorAll("circle").forEach(function (c) {
        c.setAttribute("data-r0", c.getAttribute("r"));
        c.setAttribute("r", parseFloat(c.getAttribute("r")) * 1.3);
      });
    });
    marker.addEventListener("mouseleave", function () {
      marker.querySelectorAll("circle").forEach(function (c) {
        var r0 = c.getAttribute("data-r0");
        if (r0) c.setAttribute("r", r0);
      });
    });
  });
})();
