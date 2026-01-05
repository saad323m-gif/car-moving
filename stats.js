// stats.js
// ===============================
// الإحصائيات (اليوم – الأسبوع – الشهر)
// ===============================

import {
  db,
  collection,
  getDocs,
  query,
  orderBy
} from "./firebase.js";

import { currentUserProfile } from "./auth.js";
import { canSeeStats } from "./roles.js";

// عناصر الواجهة
const statsTab = document.getElementById("statsTab");

// ===============================
// حساب بداية اليوم / الأسبوع / الشهر
// ===============================

function getStartOfDay() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function getStartOfWeek() {
  const d = new Date();
  const day = d.getDay(); // 0 = الأحد
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getStartOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ===============================
// بناء واجهة الإحصائيات
// ===============================

function renderStatsUI() {
  const canSeeAll = canSeeStats(currentUserProfile.role);

  statsTab.innerHTML = `
    <div class="tab-inner-header">
      <h3>الإحصائيات</h3>
    </div>

    <div class="tab-content">

      <label>الفترة</label>
      <select id="statsPeriod">
        <option value="day">اليوم</option>
        <option value="week">هذا الأسبوع</option>
        <option value="month">هذا الشهر</option>
      </select>

      ${
        canSeeAll
          ? `
      <label style="margin-top:0.6rem;">تصفية حسب المستخدم</label>
      <input type="text" id="statsUserFilter" placeholder="اكتب اسم المستخدم..." />
      `
          : ""
      }

      <button id="loadStatsBtn" class="btn-primary" style="margin-top:0.8rem;">عرض الإحصائيات</button>

      <div id="statsResults" style="margin-top:1rem;"></div>

    </div>
  `;

  document.getElementById("loadStatsBtn").addEventListener("click", loadStats);
}

// ===============================
// تحميل الإحصائيات
// ===============================

async function loadStats() {
  const period = document.getElementById("statsPeriod").value;
  const userFilter = document.getElementById("statsUserFilter")?.value.trim().toLowerCase();

  const results = document.getElementById("statsResults");
  results.innerHTML = "جاري التحميل...";

  let startDate;

  if (period === "day") startDate = getStartOfDay();
  if (period === "week") startDate = getStartOfWeek();
  if (period === "month") startDate = getStartOfMonth();

  try {
    // تحميل كل البيانات
    const movementsSnap = await getDocs(query(collection(db, "movements"), orderBy("createdAt", "desc")));
    const custodySnap = await getDocs(query(collection(db, "custody"), orderBy("createdAt", "desc")));
    const fleetSnap = await getDocs(query(collection(db, "fleet"), orderBy("createdAt", "desc")));
    const membersSnap = await getDocs(query(collection(db, "members"), orderBy("createdAt", "desc")));

    // ===============================
    // تصفية حسب الفترة
    // ===============================

    const filterByDate = (snap) =>
      snap.docs.filter((d) => {
        const data = d.data();
        if (!data.createdAt) return false;
        const created = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        return created >= startDate;
      });

    let movements = filterByDate(movementsSnap);
    let custody = filterByDate(custodySnap);
    let fleet = filterByDate(fleetSnap);
    let members = filterByDate(membersSnap);

    // ===============================
    // تصفية حسب المستخدم (للمدير/المشرف/المطور فقط)
    // ===============================

    if (userFilter) {
      movements = movements.filter((d) =>
        d.data().createdByName.toLowerCase().includes(userFilter)
      );

      custody = custody.filter((d) =>
        d.data().custodianName.toLowerCase().includes(userFilter)
      );
    }

    // ===============================
    // عرض النتائج
    // ===============================

    results.innerHTML = `
      <div class="accordion-list">

        <div class="accordion-item">
          <div class="accordion-header">
            <div class="accordion-header-main">
              <div class="accordion-title">عدد الحركات</div>
              <div class="accordion-subtitle">${movements.length}</div>
            </div>
            <div class="accordion-toggle">▼</div>
          </div>
          <div class="accordion-body hidden">
            <p>عدد الحركات المسجلة خلال الفترة المختارة: ${movements.length}</p>
          </div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header">
            <div class="accordion-header-main">
              <div class="accordion-title">عدد العهد</div>
              <div class="accordion-subtitle">${custody.length}</div>
            </div>
            <div class="accordion-toggle">▼</div>
          </div>
          <div class="accordion-body hidden">
            <p>عدد العهد المسجلة خلال الفترة المختارة: ${custody.length}</p>
          </div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header">
            <div class="accordion-header-main">
              <div class="accordion-title">عدد السيارات</div>
              <div class="accordion-subtitle">${fleet.length}</div>
            </div>
            <div class="accordion-toggle">▼</div>
          </div>
          <div class="accordion-body hidden">
            <p>عدد السيارات المضافة خلال الفترة المختارة: ${fleet.length}</p>
          </div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header">
            <div class="accordion-header-main">
              <div class="accordion-title">عدد الأعضاء</div>
              <div class="accordion-subtitle">${members.length}</div>
            </div>
            <div class="accordion-toggle">▼</div>
          </div>
          <div class="accordion-body hidden">
            <p>عدد الأعضاء المسجلين خلال الفترة المختارة: ${members.length}</p>
          </div>
        </div>

      </div>
    `;

    // تفعيل الأكورديون
    results.querySelectorAll(".accordion-header").forEach((header) => {
      const body = header.nextElementSibling;
      const toggle = header.querySelector(".accordion-toggle");

      header.addEventListener("click", () => {
        const isHidden = body.classList.contains("hidden");
        body.classList.toggle("hidden", !isHidden);
        toggle.textContent = isHidden ? "▲" : "▼";
      });
    });

  } catch (err) {
    console.error(err);
    results.innerHTML = "<p>تعذر تحميل الإحصائيات.</p>";
  }
}

// ===============================
// عند جاهزية المستخدم
// ===============================

document.addEventListener("user-ready", () => {
  renderStatsUI();
});
