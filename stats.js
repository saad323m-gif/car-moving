import { db, ref, onValue } from "./firebase.js";

export function loadStats(role) {
  if (!['مطور','مدير','مشرف'].includes(role)) return;

  const content = document.getElementById('content');
  content.innerHTML = `
    <h2>الإحصائيات</h2>
    <select id="period">
      <option value="day">اليوم</option>
      <option value="week">أسبوع</option>
      <option value="month">شهر</option>
      <option value="year">سنة</option>
    </select>
    <button class="action-btn" id="print-stats">🖨 طباعة الإحصائيات</button>
    <div id="stats-content"></div>
  `;

  document.getElementById('period').onchange = () => calculateStats();
  document.getElementById('print-stats').onclick = () => window.print();
  calculateStats();

  function calculateStats() {
    const period = document.getElementById('period').value;
    const now = Date.now();
    const start = {
      day: now - 24*60*60*1000,
      week: now - 7*24*60*60*1000,
      month: now - 30*24*60*60*1000,
      year: now - 365*24*60*60*1000
    }[period];

    let movementsCount = 0, receiveCount = 0, deliverCount = 0;
    let membersCount = 0, carsInCustody = 0, fleetCount = 0;

    onValue(ref(db, 'movements'), (snap) => {
      movementsCount = 0; receiveCount = 0; deliverCount = 0;
      snap.forEach(child => {
        if (child.val().timestamp >= start) {
          movementsCount++;
          if (child.val().type === 'receive') receiveCount++;
          else deliverCount++;
        }
      });
      display();
    }, { onlyOnce: true });

    onValue(ref(db, 'members'), (snap) => { membersCount = snap.numChildren(); display(); }, { onlyOnce: true });
    onValue(ref(db, 'custody'), (snap) => { carsInCustody = snap.numChildren(); display(); }, { onlyOnce: true });
    onValue(ref(db, 'fleet'), (snap) => { fleetCount = snap.numChildren(); display(); }, { onlyOnce: true });

    function display() {
      document.getElementById('stats-content').innerHTML = `
        <h3>إحصائيات ${period === 'day' ? 'اليوم' : period === 'week' ? 'الأسبوع' : period === 'month' ? 'الشهر' : 'السنة'}</h3>
        <p>عدد الحركات: ${movementsCount}</p>
        <p>استلام: ${receiveCount} | تسليم: ${deliverCount}</p>
        <p>عدد الأعضاء: ${membersCount}</p>
        <p>سيارات في العهدة: ${carsInCustody}</p>
        <p>إجمالي الأسطول: ${fleetCount}</p>
      `;
    }
  }
}