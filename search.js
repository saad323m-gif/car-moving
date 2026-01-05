import { db, ref, onValue } from "./firebase.js";

export function initGlobalSearch(role, uid) {
  document.getElementById('global-search').oninput = (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query.length < 2) {
      document.getElementById('content').innerHTML = '';
      return;
    }

    const results = [];
    const content = document.getElementById('content');

    // بحث في الحركات
    onValue(ref(db, 'movements'), (snap) => {
      snap.forEach(child => {
        const m = child.val();
        if (role === 'عضو' && m.driverUid !== uid) return;
        const text = `${m.driverName} ${m.carNumber} ${m.plateCode} ${m.carType} ${m.notes}`.toLowerCase();
        if (text.includes(query)) {
          results.push(`<p>حركة: ${m.driverName} - ${m.carNumber} (${m.type === 'receive' ? 'استلام' : 'تسليم'})</p>`);
        }
      });
      displayResults();
    }, { onlyOnce: true });

    // بحث في العهدة والأسطول والأعضاء بنفس الطريقة...
    // (يمكن توسيعها لاحقاً)

    function displayResults() {
      content.innerHTML = `<h3>نتائج البحث عن "${query}"</h3>` + results.join('');
    }
  };
}