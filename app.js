// app.js
// ===============================
// إدارة التبويبات + الهيدر + التحديث + PWA
// ===============================

// ضبط سنة الفوتر
const yearSpan = document.getElementById("currentYear");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

// ===============================
// التبويبات الرئيسية
// ===============================

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = {
  movements: document.getElementById("movementsTab"),
  custody: document.getElementById("custodyTab"),
  fleet: document.getElementById("fleetTab"),
  members: document.getElementById("membersTab"),
  stats: document.getElementById("statsTab")
};

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // إزالة التفعيل من كل الأزرار
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;

    // إخفاء كل التبويبات
    Object.keys(tabContents).forEach(key => {
      tabContents[key].classList.add("hidden");
    });

    // إظهار التبويب المطلوب
    tabContents[tab].classList.remove("hidden");
  });
});

// ===============================
// زر التحديث اليدوي
// ===============================

const refreshAppBtn = document.getElementById("refreshAppBtn");
if (refreshAppBtn) {
  refreshAppBtn.addEventListener("click", () => {
    location.reload();
  });
}

// ===============================
// إعادة تحميل قوية مرة واحدة فقط
// ===============================

window.addEventListener("load", () => {
  const key = "car-moving-force-reload-v1";
  const hasReloaded = localStorage.getItem(key);

  if (!hasReloaded) {
    localStorage.setItem(key, "1");
    location.reload();
  }
});

// ===============================
// تسجيل Service Worker لتفعيل PWA
// ===============================

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => {
        // تم التسجيل بنجاح (بدون رسائل)
      })
      .catch(() => {
        // فشل التسجيل (نتجاهله)
      });
  });
}
