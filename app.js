import { initAuth } from "./auth.js";
// import functions from other files when ready

document.addEventListener('DOMContentLoaded', () => {
  initAuth();

  // Tabs switching
  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadTab(btn.dataset.tab);
    };
  });
});

function loadTab(tab) {
  // Here call functions from movements.js, custody.js, etc.
  document.getElementById('content').innerHTML = `<h2>${tab}</h2><p>جاري التحميل...</p>`;
  // Example: if (tab === 'movements') loadMovements();
}

function loadRoleFeatures() {
  if (['مطور', 'مدير', 'مشرف'].includes(userRole)) {
    document.getElementById('fleet-tab').style.display = 'block';
    document.getElementById('stats-tab').style.display = 'block';
  }
}