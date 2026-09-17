/* ==========================================================================
   Data Collection page — form builder, analytics charts
   (view-tab switching itself now lives in shared app.js)
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- */
  /* Analytics charts build lazily the first time that tab is shown    */
  /* ---------------------------------------------------------------- */
  window.addEventListener("viewtab:shown", function (e) {
    if (e.detail.key === "analytics" && !window._dcChartsBuilt) {
      buildAnalyticsCharts();
      window._dcChartsBuilt = true;
    }
  });

  // "Create Form" header button jumps straight to the builder tab
  var createFormBtn = document.getElementById("createFormBtn");
  if (createFormBtn) {
    createFormBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (window._showView) window._showView("builder");
      document.getElementById("view-builder").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------------------------------------------------------------- */
  /* Form builder                                                       */
  /* ---------------------------------------------------------------- */
  var FIELD_TYPES = {
    text: { label: "Text", icon: "ic-text" },
    number: { label: "Number", icon: "ic-hash" },
    date: { label: "Date", icon: "ic-calendar" },
    time: { label: "Time", icon: "ic-clock" },
    choice: { label: "Single Choice", icon: "ic-check-square" },
    multichoice: { label: "Multiple Choice", icon: "ic-list" },
    dropdown: { label: "Dropdown", icon: "ic-caret-box" },
    ranking: { label: "Ranking", icon: "ic-ranking" },
    likert: { label: "Likert Scale", icon: "ic-likert" },
    matrix: { label: "Matrix", icon: "ic-grid" },
    repeat: { label: "Repeat Group", icon: "ic-repeat" },
    location: { label: "GPS Location", icon: "ic-pin" },
    photo: { label: "Photo", icon: "ic-image" },
    video: { label: "Video", icon: "ic-video" },
    audio: { label: "Audio", icon: "ic-audio" },
    barcode: { label: "Barcode", icon: "ic-barcode" },
    qrcode: { label: "QR Code", icon: "ic-qrcode" },
    signature: { label: "Signature", icon: "ic-signature" },
    calc: { label: "Calculation", icon: "ic-calc" },
    note: { label: "Note / Instructions", icon: "ic-file" }
  };

  var fieldList = document.getElementById("fieldList");
  var fieldCount = 0;

  function updateEmptyState() {
    var empty = document.getElementById("builderEmpty");
    if (!empty || !fieldList) return;
    empty.style.display = fieldList.children.length ? "none" : "block";
  }

  function addField(typeKey, presetLabel) {
    if (!fieldList) return;
    var type = FIELD_TYPES[typeKey] || FIELD_TYPES.text;
    fieldCount += 1;
    var card = document.createElement("div");
    card.className = "field-card";
    card.innerHTML =
      '<span class="field-card__handle"><svg><use href="#ic-grip"/></svg></span>' +
      '<span class="field-card__body">' +
        '<span class="field-card__type"><svg style="width:11px;height:11px;vertical-align:-1px;margin-right:4px;"><use href="#' + type.icon + '"/></svg>' + type.label + '</span>' +
        '<input class="field-card__label-input" value="' + (presetLabel || ("Untitled " + type.label + " field")) + '">' +
      '</span>' +
      '<span class="field-card__actions">' +
        '<span class="switch-label">Required</span>' +
        '<button type="button" class="switch" aria-label="Toggle required"></button>' +
        '<button type="button" class="field-remove" aria-label="Remove field"><svg><use href="#ic-trash"/></svg></button>' +
      '</span>';
    fieldList.appendChild(card);

    card.querySelector(".switch").addEventListener("click", function () {
      this.classList.toggle("is-on");
    });
    card.querySelector(".field-remove").addEventListener("click", function () {
      card.remove();
      updateEmptyState();
    });
    updateEmptyState();
    card.querySelector(".field-card__label-input").focus();
  }

  document.querySelectorAll(".field-palette-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      addField(btn.getAttribute("data-type"));
    });
  });

  var resetBuilderBtn = document.getElementById("resetBuilder");
  if (resetBuilderBtn) {
    resetBuilderBtn.addEventListener("click", function () {
      if (fieldList) fieldList.innerHTML = "";
      updateEmptyState();
    });
  }

  var publishBtn = document.getElementById("publishFormBtn");
  if (publishBtn) {
    publishBtn.addEventListener("click", function () {
      var original = publishBtn.innerHTML;
      publishBtn.innerHTML = '<svg><use href="#ic-check-square"/></svg>Published';
      setTimeout(function () {
        if (window._showView) window._showView("forms");
        publishBtn.innerHTML = original;
      }, 900);
    });
  }

  // seed the builder with a couple of starter fields so it doesn't look empty
  if (fieldList) {
    addField("text", "Enumerator name");
    addField("location", "Household GPS location");
    addField("choice", "Waste segregation practiced?");
  }

  // QA validation-rule toggles
  document.querySelectorAll(".qa-rule .switch").forEach(function (sw) {
    sw.addEventListener("click", function () { sw.classList.toggle("is-on"); });
  });

  /* ---------------------------------------------------------------- */
  /* Analytics charts (built lazily on first visit to the tab)         */
  /* ---------------------------------------------------------------- */
  function buildAnalyticsCharts() {
    if (typeof Chart === "undefined") return;
    var green = "#008037", lime = "#a7d13d", navy = "#00203f", line = "#e1e8e3";

    var trendCanvas = document.getElementById("submissionsTrendChart");
    if (trendCanvas) {
      new Chart(trendCanvas, {
        type: "line",
        data: {
          labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"],
          datasets: [{
            label: "Submissions",
            data: [1850, 2020, 2240, 2480, 2650, 2900, 3120, 3300, 3490],
            borderColor: green, backgroundColor: "rgba(0,128,55,0.12)",
            borderWidth: 2.5, fill: true, tension: 0.35, pointRadius: 0, pointHoverRadius: 5
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { grid: { display: false } }, y: { grid: { color: line }, ticks: { callback: function (v) { return v.toLocaleString(); } } } }
        }
      });
    }

    var byFormCanvas = document.getElementById("submissionsByFormChart");
    if (byFormCanvas) {
      new Chart(byFormCanvas, {
        type: "bar",
        data: {
          labels: ["Household Waste Survey","Climate Vulnerability","Apprentice Checklist","Worker Intake","Vendor Registration","Relocation Form"],
          datasets: [{ data: [1240, 386, 612, 204, 890, 158], backgroundColor: green, borderRadius: 6 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, indexAxis: "y",
          plugins: { legend: { display: false } },
          scales: { x: { grid: { color: line } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } }
        }
      });
    }

    var completenessCanvas = document.getElementById("dataCompletenessChart");
    if (completenessCanvas) {
      new Chart(completenessCanvas, {
        type: "doughnut",
        data: {
          labels: ["Complete", "Partial", "Flagged"],
          datasets: [{ data: [82, 12, 6], backgroundColor: [green, lime, "#e08a2c"], borderWidth: 0 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: "68%",
          plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } } }
        }
      });
    }
  }

  // If the page loads directly on the analytics tab (rare), build charts immediately
  if (document.querySelector('.view-tabs button[data-view="analytics"].is-active')) {
    buildAnalyticsCharts();
    window._dcChartsBuilt = true;
  }
})();
