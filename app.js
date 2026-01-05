import { initAuth } from "./auth.js";
import { loadMovements } from "./movements.js";
import { loadCustody } from "./custody.js";
import { loadFleet } from "./fleet.js";
import { loadMembers } from "./members.js";
import { loadStats } from "./stats.js";
import { initGlobalSearch } from "./search.js";

let currentRole = '';
let currentUid = '';

document.addEventListener('DOMContentLoaded', () => {
  initAuth();

  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      if (tab === 'movements') loadMovements(currentRole, currentUid);
      else if (tab === 'custody') loadCustody(currentRole, currentUid);
      else if (tab === 'fleet') loadFleet(currentRole, currentUid);
      else if (tab === 'members') loadMembers(currentRole, currentUid);
      else if (tab === 'stats') loadStats(currentRole);
    };
  });

  // تحديث الصلاحيات عند تسجيل الدخول
  window.updateRole = (role, uid) => {
    currentRole = role;
    currentUid = uid;
    initGlobalSearch(role, uid);
    if (['مطور','مدير','مشرف'].includes(role)) {
      document.getElementById('fleet-tab').style.display = 'block';
      document.getElementById('stats-tab').style.display = 'block';
    }
  };
});