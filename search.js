// search.js
const globalSearchInput = document.getElementById("globalSearchInput");
const sections = [
  document.getElementById("movementsList"),
  document.getElementById("custodyList"),
  document.getElementById("fleetList"),
  document.getElementById("membersList")
];

function indexAccordionItems() {
  sections.forEach((sec) => {
    if (!sec) return;
    const items = sec.querySelectorAll(".accordion-item");
    items.forEach((item) => {
      const text = item.textContent || "";
      item.dataset.search = text.toLowerCase();
    });
  });
}

function applySearchFilter(term) {
  const q = term.trim().toLowerCase();
  sections.forEach((sec) => {
    if (!sec) return;
    const items = sec.querySelectorAll(".accordion-item");
    items.forEach((item) => {
      if (!q) {
        item.style.display = "";
        return;
      }
      const haystack = item.dataset.search || "";
      item.style.display = haystack.includes(q) ? "" : "none";
    });
  });
}

if (globalSearchInput) {
  globalSearchInput.addEventListener("input", () => {
    applySearchFilter(globalSearchInput.value);
  });
}

["movements-loaded", "custody-loaded", "fleet-loaded", "members-loaded"].forEach(
  (evt) => {
    document.addEventListener(evt, () => {
      indexAccordionItems();
      applySearchFilter(globalSearchInput?.value || "");
    });
  }
);
