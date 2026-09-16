/* ==========================================================================
   Real Africa map renderer, built from actual Natural Earth boundary data
   (see /assets/js/africa-map-data.js). Renders the full continent with
   markers for GAYO's country offices, and can zoom into a single country's
   real, accurate shape on demand.
   ========================================================================== */

(function () {
  "use strict";
  if (typeof window.AFRICA_MAP_DATA === "undefined") return;

  var DATA = window.AFRICA_MAP_DATA;

  var OFFICE_INFO = {
    "Ghana":    { label: "Ghana — HQ",  meta: "Accra · West Africa",      projects: 62, staff: 34, color: "#008037" },
    "Kenya":    { label: "Kenya",       meta: "Nairobi · East Africa",    projects: 34, staff: 21, color: "#00203f" },
    "Nigeria":  { label: "Nigeria",     meta: "Lagos · West Africa",      projects: 29, staff: 19, color: "#008037" },
    "Uganda":   { label: "Uganda",      meta: "Kampala · East Africa",    projects: 21, staff: 14, color: "#00203f" },
    "Botswana": { label: "Botswana",    meta: "Gaborone · Southern Africa", projects: 14, staff: 9, color: "#6f9f1f" },
    "Senegal":  { label: "Senegal",     meta: "Dakar · West Africa",      projects: 11, staff: 8, color: "#008037" }
  };

  function renderFullMap(container) {
    var full = DATA.full;
    var markers = DATA.markers;
    var countryPaths = full.countries.map(function (c) {
      var isOffice = !!OFFICE_INFO[c.name];
      return '<path d="' + c.d + '" data-country="' + c.name + '" ' +
        'fill="' + (isOffice ? "#cdeeda" : "#eef2f0") + '" stroke="#ffffff" stroke-width="0.9" ' +
        'class="africa-country' + (isOffice ? " africa-country--office" : "") + '"></path>';
    }).join("");

    var markerDots = Object.keys(markers).map(function (name) {
      var m = markers[name];
      var info = OFFICE_INFO[name] || {};
      var color = info.color || "#008037";
      return '<g class="geo-marker" data-country="' + name + '" tabindex="0" role="button" ' +
        'aria-label="Zoom into ' + name + '">' +
        '<circle cx="' + m.x + '" cy="' + m.y + '" r="9" fill="' + color + '" opacity="0.22"></circle>' +
        '<circle cx="' + m.x + '" cy="' + m.y + '" r="4.6" fill="' + color + '"></circle>' +
        '</g>';
    }).join("");

    container.innerHTML =
      '<svg viewBox="0 0 ' + full.w + ' ' + full.h + '" aria-label="Map of Africa showing GAYO country offices" style="width:100%; height:100%;">' +
      countryPaths + markerDots +
      '</svg>';

    container.querySelectorAll(".geo-marker").forEach(function (marker) {
      marker.style.cursor = "pointer";
      marker.addEventListener("click", function () {
        renderZoomedCountry(container, marker.getAttribute("data-country"));
      });
      marker.addEventListener("keypress", function (e) {
        if (e.key === "Enter") renderZoomedCountry(container, marker.getAttribute("data-country"));
      });
    });
  }

  function renderZoomedCountry(container, name) {
    var z = DATA.zoomed[name];
    var info = OFFICE_INFO[name] || {};
    if (!z) return;

    container.innerHTML =
      '<div class="zoomed-map">' +
        '<button class="zoomed-map__back" type="button">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M15 6l-6 6 6 6"/></svg>' +
          'Full map' +
        '</button>' +
        '<svg viewBox="0 0 ' + z.w + ' ' + z.h + '" aria-label="Map of ' + name + '" style="width:100%; height:100%;">' +
          '<path d="' + z.d + '" fill="' + (info.color || "#008037") + '"></path>' +
        '</svg>' +
        '<div class="zoomed-map__caption">' +
          '<b>' + (info.label || name) + '</b>' +
          '<span>' + (info.meta || "") + '</span>' +
          (info.projects ? '<span class="zoomed-map__stats"><b>' + info.projects + '</b> projects · <b>' + info.staff + '</b> staff</span>' : '') +
        '</div>' +
      '</div>';

    container.querySelector(".zoomed-map__back").addEventListener("click", function () {
      renderFullMap(container);
    });
  }

  window.renderAfricaMap = function (containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return;
    renderFullMap(container);
    if (opts && opts.focusCountry) {
      renderZoomedCountry(container, opts.focusCountry);
    }
    // Allow external elements (e.g. office list rows) to trigger zoom via data-focus-country
    document.querySelectorAll("[data-focus-country]").forEach(function (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", function (e) {
        var target = el.getAttribute("data-focus-country");
        if (DATA.zoomed[target]) {
          e.preventDefault();
          renderZoomedCountry(container, target);
          container.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });
  };
})();
