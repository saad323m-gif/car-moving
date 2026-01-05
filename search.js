// search.js
// ===============================
// البحث الشامل في كل التبويبات
// ===============================

// عنصر البحث
const searchInput = document.getElementById("globalSearchInput");

// ===============================
// دالة البحث العامة
// ===============================

function applySearch() {
  const term = searchInput.value.trim().toLowerCase();

  // كل عناصر الأكورديون في كل التبويبات
  const allItems = document.querySelectorAll(".accordion-item");

  allItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    const match = text.includes(term);

    item.style.display = match ? "" : "none";
  });
}

// ===============================
// تشغيل البحث أثناء الكتابة
// ===============================

if (searchInput) {
  searchInput.addEventListener("input", applySearch);
}

// ===============================
// إعادة تطبيق البحث بعد تحميل أي تبويب
// ===============================

document.addEventListener("movements-loaded", applySearch);
document.addEventListener("custody-loaded", applySearch);
document.addEventListener("fleet-loaded", applySearch);
document.addEventListener("members-loaded", applySearch);
