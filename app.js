// app.js

// سنة الفوتر
const yearSpan = document.getElementById("currentYear");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

// تبويبات رئيسية
const mainTabButtons = document.querySelectorAll(".main-tab-button");
const mainTabs = {
  movements: document.getElementById("movementsTab"),
  custody: document.getElementById("custodyTab"),
  fleet: document.getElementById("fleetTab"),
  members: document.getElementById("membersTab"),
  stats: document.getElementById("statsTab")
};

mainTabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    mainTabButtons.forEach((b) => b.classList.remove("tab-active"));
    btn.classList.add("tab-active");

    const tabKey = btn.dataset.mainTab;
    Object.keys(mainTabs).forEach((k) => {
      if (!mainTabs[k]) return;
      mainTabs[k].classList.toggle("hidden", k !== tabKey);
    });
  });
});

// زر التحديث اليدوي
const refreshAppBtn = document.getElementById("refreshAppBtn");
if (refreshAppBtn) {
  refreshAppBtn.addEventListener("click", () => {
    location.reload();
  });
}

// إعادة تحميل قوية عند فتح الصفحة لأول مرة (مرة واحدة فقط لكل متصفح)
window.addEventListener("load", () => {
  const key = "car-moving-force-reload-v1";
  const hasReloaded = localStorage.getItem(key);
  if (!hasReloaded) {
    localStorage.setItem(key, "1");
    location.reload();
  }
});

// تسجيل Service Worker لـ PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => {
        // لا نعرض رسائل، فقط هدوء
      })
      .catch(() => {});
  });
}
