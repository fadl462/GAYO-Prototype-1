/* ==========================================================================
   MIOMS — Role-based dashboard switcher (RBAC demonstration)
   Applies to every page via the shared sidebar/topbar. Stores the chosen
   role in localStorage so it persists as you navigate between pages.
   ========================================================================== */

(function () {
  "use strict";

  var ROLE_INFO = {
    exec:    { label: "Executive / Director",  persona: "Fadl · GAYO User",     initials: "FR", note: "Full visibility across the organization." },
    pm:      { label: "Programme Manager",     persona: "Ama K. · Programmes", initials: "AK", note: "Scoped to assigned projects, activities and MERL data." },
    merl:    { label: "MERL Officer",          persona: "Joseph M. · MERL",     initials: "JM", note: "Scoped to indicators, data quality and evidence." },
    finance: { label: "Finance Manager",       persona: "Grace N. · Finance",   initials: "GN", note: "Scoped to budgets, expenditure and financial reporting." },
    field:   { label: "Field Officer",         persona: "Chidi O. · Field Team", initials: "CO", note: "Scoped to activities, data collection and beneficiaries." },
    partner: { label: "Partner / Donor",       persona: "External Partner",     initials: "EP", note: "Read-only access to shared projects and reports." }
  };

  var STORAGE_KEY = "miomsRole";

  function getRole() {
    try { return localStorage.getItem(STORAGE_KEY) || "exec"; } catch (e) { return "exec"; }
  }
  function setRole(role) {
    try { localStorage.setItem(STORAGE_KEY, role); } catch (e) { /* ignore */ }
  }

  function applyNavVisibility(role) {
    document.querySelectorAll("[data-roles]").forEach(function (el) {
      var roles = el.getAttribute("data-roles").split(",");
      el.style.display = roles.indexOf(role) !== -1 ? "" : "none";
    });
    // Hide a nav group's label if every link inside that group is hidden
    document.querySelectorAll(".sidebar__group-label").forEach(function (label) {
      var next = label.nextElementSibling;
      var anyVisible = false;
      while (next && !next.classList.contains("sidebar__group-label")) {
        if (next.style.display !== "none") anyVisible = true;
        next = next.nextElementSibling;
      }
      label.style.display = anyVisible ? "" : "none";
    });
  }

  function applyContentVisibility(role) {
    document.querySelectorAll("[data-role-hide]").forEach(function (el) {
      var hidden = el.getAttribute("data-role-hide").split(",");
      el.style.display = hidden.indexOf(role) !== -1 ? "none" : "";
    });
  }

  function applyProfile(role) {
    var info = ROLE_INFO[role] || ROLE_INFO.exec;
    var nameEl = document.getElementById("profileName");
    var roleEl = document.getElementById("profileRole");
    var avatarEl = document.getElementById("profileAvatar");
    if (nameEl) nameEl.textContent = info.persona;
    if (roleEl) roleEl.textContent = info.label;
    if (avatarEl) avatarEl.textContent = info.initials;
  }

  function applyBanner(role) {
    var content = document.querySelector(".content");
    if (!content) return;
    var info = ROLE_INFO[role] || ROLE_INFO.exec;
    var banner = document.getElementById("roleBanner");
    if (!banner) {
      banner = document.createElement("div");
      banner.className = "role-banner";
      banner.id = "roleBanner";
      content.insertBefore(banner, content.firstChild);
    }
    banner.innerHTML = '<svg><use href="#ic-users"/></svg><span>Viewing MIOMS as <b>' + info.label + '</b> — ' + info.note + ' Use the role switcher in the top bar to preview other roles.</span>';
  }

  function applyRole(role) {
    applyNavVisibility(role);
    applyContentVisibility(role);
    applyProfile(role);
    applyBanner(role);
    var select = document.getElementById("roleSwitcher");
    if (select) select.value = role;
    window.dispatchEvent(new CustomEvent("role:changed", { detail: { role: role } }));
  }

  document.addEventListener("DOMContentLoaded", function () {
    var role = getRole();
    applyRole(role);
    var select = document.getElementById("roleSwitcher");
    if (select) {
      select.addEventListener("change", function () {
        setRole(select.value);
        applyRole(select.value);
      });
    }
  });

  // In case this script runs after DOMContentLoaded already fired
  if (document.readyState !== "loading") {
    var role = getRole();
    applyRole(role);
    var select = document.getElementById("roleSwitcher");
    if (select) {
      select.value = role;
      select.addEventListener("change", function () {
        setRole(select.value);
        applyRole(select.value);
      });
    }
  }
})();
