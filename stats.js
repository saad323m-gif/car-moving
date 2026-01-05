// stats.js
import {
  db,
  collection,
  getDocs,
  query
} from "./firebase.js";

import { currentUserProfile } from "./auth.js";
import { canSeeStats } from "./roles.js";

const statsPeriodSelect = document.getElementById("statsPeriod");
const loadStatsBtn = document.getElementById("loadStatsBtn");
const printStatsBtn = document.getElementById("printStatsBtn");
const statsContent = document.getElementById("statsContent");

function getPeriodStart(period) {
  const now = new Date();
  const start = new Date(now);

  switch (period) {
    case "day":
      start.setHours(0, 0, 0, 0);
      break;
    case "week": {
      const day = start.getDay(); // 0-6
      const diff = (day + 6) % 7; // نعتبر الاثنين بداية الأسبوع مثلاً
      start.setDate(start.getDate() - diff);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case "year":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    case "all":
    default:
      return null;
  }

  return start;
}

async function computeStats() {
  const user = currentUserProfile;
  if (!canSeeStats(user.role)) {
    statsContent.innerHTML = "<p>لا تملك صلاحية عرض الإحصائيات.</p>";
    return;
  }

  const period = statsPeriodSelect.value;
  const start = getPeriodStart(period);

  const [movementsSnap, custodySnap, fleetSnap] = await Promise.all([
    getDocs(query(collection(db, "movements"))),
    getDocs(query(collection(db, "custody"))),
    getDocs(query(collection(db, "fleet")))
  ]);

  let movementsCount = 0;
  let movementsReceive = 0;
  let movementsDeliver = 0;

  movementsSnap.forEach((d) => {
    const data = d.data();
    const created = data.createdAt?.toDate ? data.createdAt.toDate() : null;
    if (start && created && created < start) return;

    movementsCount++;
    if (data.movementType === "استلام") movementsReceive++;
    if (data.movementType === "تسليم") movementsDeliver++;
  });

  let custodyCount = 0;
  custodySnap.forEach((d) => {
    const data = d.data();
    const created = data.createdAt?.toDate ? data.createdAt.toDate() : null;
    if (start && created && created < start) return;
    custodyCount++;
  });

  const fleetTotal = fleetSnap.size;

  statsContent.innerHTML = `
    <h3>ملخص الإحصائيات (${period === "all" ? "كل المدة" : statsPeriodSelect.options[statsPeriodSelect.selectedIndex].text})</h3>
    <ul style="list-style:none;padding:0;margin:0.5rem 0;">
      <li>إجمالي الحركات في الفترة: <strong>${movementsCount}</strong></li>
      <li>عدد حركات الاستلام: <strong>${movementsReceive}</strong></li>
      <li>عدد حركات التسليم: <strong>${movementsDeliver}</strong></li>
      <li>إجمالي بيانات العهدة في الفترة: <strong>${custodyCount}</strong></li>
      <li>إجمالي سيارات الأسطول (غير مرتبط بالفترة): <strong>${fleetTotal}</strong></li>
    </ul>
  `;
}

if (loadStatsBtn) {
  loadStatsBtn.addEventListener("click", () => {
    computeStats().catch((err) => {
      console.error(err);
      statsContent.innerHTML = "<p>تعذر تحميل الإحصائيات.</p>";
    });
  });
}

if (printStatsBtn) {
  printStatsBtn.addEventListener("click", () => {
    const content = statsContent.innerHTML;
    if (!content.trim()) {
      alert("لا توجد بيانات إحصائية للطباعة.");
      return;
    }
    const w = window.open("", "_blank");
    w.document.write(`
      <html dir="rtl" lang="ar"><head><title>طباعة الإحصائيات</title></head><body>
      ${content}
      </body></html>
    `);
    w.document.close();
    w.print();
  });
}

document.addEventListener("user-ready", () => {
  const user = currentUserProfile;
  if (!canSeeStats(user.role)) {
    const statsTabBtn = document.querySelector('[data-main-tab="stats"]');
    const statsTab = document.getElementById("statsTab");
    if (statsTabBtn) statsTabBtn.style.display = "none";
    if (statsTab) statsTab.style.display = "none";
    return;
  }
  computeStats().catch(() => {});
});
