Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
 
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// إعدادات Firebase
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010const firebaseConfig = {
  apiKey: "AIzaSyD-qlIfpFyam5UgjxzhwAEhkttIQCBZXUw",
  authDomain: "carmanagement-79bfb.f
itId: "carmanagement-79bfb",
  storageBucket: "carmanagement-79bfb.firebasestorage.app",
  messagingSenderId: "313516916430",
  appId: "1:313516916430:web:6f2c20740bced9e7211a9f"
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010};

// تهيئة Firebase و Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ثوابت الجلسة
const SESSION_KEY = "car_mgmt_session";
const SESSION_
DATION_DAYS = 30;

// ========== عناصر جديدة ==========
const currentUserBadge = document.getElementById("current-user-badge");
const refreshBtn = document.getElementById("refresh-btn");
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010const globalSearchContainer = document.getElementById("global-search-container");
const globalSearchInput = document.getElementById("global-search-input");
const globalSearchBtn = docume
nntById("search-type");
const searchSortSelect = document.getElementById("search-sort");

// عناصر الطباعة
const printTemplate = document.getElementById("print-template");
const shareTemplate = document.getElementById("share-template");

// ========== عناصر عامة ==========
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010const headerDatetime = document.getElementById("header-datetime");
const footerYear = document.getElementById("footer-year");
const logoutBtn = document.getElementById("logout-btn");

const loginSection = document.getElementById("login-section");
const loginForm = document
.ntById("login-error");

const adminForceChangeSection = document.getElementById("admin-force-change-section");
const adminChangeForm = document.getElementById("admin-change-form");
const adminChangeError = document.getElementById("admin-change-error");

const appSection = document.getElementById("app-section");

const tabButtons = document.querySelectorAll(".tab-btn");
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010const tabContents = document.querySelectorAll(".tab-content");

// الأعضاء
const userForm = document.getElementById("user-form");
const userIdInput = document.getElementById("user-id");
const userUsernameInput = document.getElementById("user-username");
const userPasswordInput = document.getElementById("user-password");
const userRoleInput = document.getElementById("use
rphone");
const usersFormError = document.getElementById("users-form-error");
const usersList = document.getElementById("users-list");

// التحركات
const movForm = document.getElementById("movement-form");
const movCarNumberInput = document.getElementById("mov-car-number");
const movPlateCodeInput = document.getElementById("mov-plate-code");
const movUserSelect = document.getElementById("mov-user-select");
const movActionSelect = document.getElementById("mov-action");
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010const movNotesInput = document.getElementById("mov-notes");
const movementsFormError = document.getElementById("movements-form-error");
const movementsList = document.getElementById("movements-list");
const movReportRange = document.getElementById("mov-report-range");
const movReportType = document.getElementById("mov-report-type");
const movPrintReportBtn = document.getElementById("mov-print-report");
const movPrintAllBtn = document.getElementById("mov-print-all");

/t-form");
const assCarNumberInput = document.getElementById("ass-car-number");
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010const assPlateCodeInput = document.getElementById("ass-plate-code");
const assUserSelect = document.getElementById("ass-user-select");
const assOwnerInput = document.getElementById("ass-owner");
const assNotesInput = document.getElementById("ass-notes");
const assignmentsFormError = document.getElementById("assignments-form-error");
const assignmentsList = document.getElementById("assignments-list");

// الأسطول
const fleetForm = document.getElementById("fleet-form");
const fleetCarNumberInput = document.getElementById("fleet-car-number");
const
 onst fleetOwnerInput = document.getElementById("fleet-owner");
const fleetLicenseEndInput = document.getElementById("fleet-license-end");
const fleetInsuranceEndInput = document.getElementById("fleet-insurance-end");
const fleetNotesInput = document.getElementById("fleet-notes");
const fleetFormError = document.getElementById("fleet-form-error");
const fleetList = document.getElementById("fleet-list");

// البحث
const searchQueryInput = document.getElementById("search-query");
const searchBtn = document.getElementById("search-btn");
const searchResultsDiv = document.getElementById("search-results");

// سنة الفوتر
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010footerYear.textContent = new Date().getFullYear().toString();

/** ========== دالة التحديث اليدوي ========== */
async function manualRefresh() {
  const session = loadSession();
  if (!session) return;
  
  try {
    // إظهار مؤشر تحميل
    showLoading(true);
    
    // تحديث جميع البيانات
    await loadAllUsers();
    await loadMovements();
    await loadAssignments();
    await loadFleet();
    
    // إظهار رسالة نجاح
    showNotification("تم تحديث البيانات بنجاح", "success");
    
  } catch (error) {
    console.error("خطأ في التحديث:", error);
    showNotification("حدث خطأ أثناء التحديث", "error");
  } finall
yخفاء التحميل ========== */
function showLoading(show) {
  if (show) {
    refreshBtn.innerHTML = '<span class="loading-spinner"></span> جاري التحديث...';
    refreshBtn.disabled = true;
  } else {
    refreshBtn.innerHTML = '🔄 تحديث';
    refreshBtn.disabled = false;
  }
}

/** ========== دالة إظهار الإشعارات ========== */
function showNotification(message, type = 'info') {
  // إنشاء عنصر الإشعار
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">${message}</div>
    <button class="notification-close">×</button>
  `;
  
  // إضافة أنماط للإشعار
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 300px;
      max-width: 500px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    }
    .notification-success { background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%); }
    .notification-error { background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%); }
    .notifi
c #1976d2 0%, #2196f3 100%); }
    .notification-warning { background: linear-gradient(135deg, #f57c00 0%, #ff9800 100%); }
    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-right: 10px;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(notification);
  
  // إضافة حدث الإغلاق
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });
  
  // إزالة الإشعار تلقائياً بعد 5 ثواني
  setTimeout(() => {
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

/** ========== دالة البحث العام ========== */
async function handleGlobalSearch() {
  const query = globalSearchInput.value.trim().toLowerCase();
  if (!query) return;
  
  // فتح تبويب البحث
  document.querySelector('[data-tab="tab-search"]').click();
  
  // تعبئة حقل البحث
  searchQueryInput.value = query;
  
  // تشغيل البحث
  const event = new Event('submit');
  searchBtn.dispatchEvent(event);
}

/** ========== دالة البحث المتقدم ========== */
async function handleAdvancedSearch(e) {
  e.preventDefault();
  const session = loadSession();
  if (!session) return;

  const query = searchQueryInput.value.trim().toLowerCase();
  const type = searchTypeSelect.va
lt.value;

  if (!query) {
    searchResultsDiv.innerHTML = '<div class="card">يرجى إدخال نص للبحث</div>';
    return;
  }

  searchResultsDiv.innerHTML = '<div class="card"><div class="loading-spinner" style="margin: 0 auto;"></div> جاري البحث...</div>';

  try {
    const results = {
      users: [],
      movements: [],
      assignments: [],
      fleet: []
    };

    // البحث في الأعضاء
    if (type === 'all' || type === 'users') {
      const usersSnap = await getDocs(collection(db, "users"));
      results.users = usersSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => 
          (u.username && u.username.toLowerCase().includes(query)) ||
          (u.phone && u.phone.includes(query)) ||
          (u.role && u.role.includes(query))
        );
      
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010      if (session.role === 'member') {
        results.users = results.users.filter(u => u.id === session.userId);
      }
    }

    // البحث في التحركات
    if (type === 'all' || type === 'movements') {
      const movSnap = await getDocs(query(collection(db, "movements"), orderBy("createdAt", "desc")));
      results.movements = movSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(m =>
          (m.carNumber && m.carNumber.toLowerCase().includes(query)) ||
          (m.plateCode && m.plateCode.toLowerCase().includes(query)) ||
          (m.userName && m.userName.toLowerCase().includes(query)) ||
          (m.action && m.action.includes(query)) ||
          (m.notes && m.notes.toLowerCase().includes(query))
        );
      
      if (session.role === 'member
's.movements.filter(m => m.userId === session.userId);
      }
    }

    // البحث في العهدة
    if (type === 'all' || type === 'assignments') {
      const assSnap = await getDocs(collection(db, "assignments"));
      results.assignments = assSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(a =>
          (a.carNumber && a.carNumber.toLowerCase().includes(query)) ||
          (a.plateCode && a.plateCode.toLowerCase().includes(query)) ||
          (a.userName && a.userName.toLowerCase().includes(query)) ||
          (a.owner && a.owner.toLowerCase().includes(query)) ||
          (a.notes && a.notes.toLowerCase().includes(query))
        );
      
      if (session.role === 'member') {
        results.assignments = results.assignments.filter(a => a.userId === session.userId);
      }
    }

    // البحث في الأسطول
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010    if (type === 'all' || type === 'fleet') {
      const fleetSnap = await getDocs(collection(db, "fleet"));
      results.fleet = fleetSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(f =>
          (f.carNumber && f.carNumber.toLowerCase().includes(query)) ||
          (f.plateCode && f.plateCode.toLowerCase().includes(query)) ||
          (f.owner && f.owner.toLowerCase().includes(query)) ||
          (f.notes && f.notes.toLowerCase().includes(query))
        );
    }

    // ترتيب النتائج
    if (sort === 'newest') {
      results.movements.sort((a, b) => b.createdAt - a.createdAt);
      results.assignments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      results.fleet.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sort === 'oldest') {
      results.movements.sort((a, 
bs.assignments.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      results.fleet.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    } else if (sort === 'carNumber') {
      results.movements.sort((a, b) => (a.carNumber || '').localeCompare(b.carNumber || ''));
      results.assignments.sort((a, b) => (a.carNumber || '').localeCompare(b.carNumber || ''));
      results.fleet.sort((a, b) => (a.carNumber || '').localeCompare(b.carNumber || ''));
    }

    renderSearchResults(results, query);

  } catch (error) {
    console.error("خطأ في البحث:", error);
    searchResultsDiv.innerHTML = '<div class="card">حدث خطأ أثناء البحث</div>';
  }
}

/** ========== دالة عرض نتائج البحث ========== */
function renderSearchResults(results, query) {
  searchResultsDiv.innerHTML = '';
  
  const totalResults = results.users.length + results.movements.length + 
                      results.assignments.length + results.fleet.length;
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010  
  if (totalResults === 0) {
    searchResultsDiv.innerHTML = `
      <div class="card">
        <h3 class="section-subtitle">نتائج البحث</h3>
        <p>لا توجد نتائج للبحث: "${query}"</p>
      </div>
    `;
    return;
  }
  
  // عرض عدد النتائج
  const summaryCard = document.createElement('div');
  summaryCard.className = 'card';
  summaryCard.innerHTML = `
    <h3 class="section-subtitle">نتائج البحث: "${query}"</h3>
    <div style="display: flex; gap: 20px; flex-wrap: wrap; margin: 15px 0;">
      <span class="badge-warning">الأعضاء: ${results.users.length}</span>
      <span class="badge-warning">التحركات: ${results.movements.length}</span>
      <span class="badge-warning">العهدة: ${results.assignments.length}</span>
      <span class="badge-warning">الأسطول: ${results.fleet.length}</span>
      <span style="color: #1a4399; font-weight: bold;">المجموع: ${totalResults}</span>
    </div>
    <button class="btn btn-secondary" 
i"print-search-results">🖨️ طباعة نتائج البحث</button>
  `;
  searchResultsDiv.appendChild(summaryCard);
  
  // إضافة حدث طباعة نتائج البحث
  document.getElementById('print-search-results')?.addEventListener('click', () => {
    printSearchResults(results, query);
  });
  
  // عرض نتائج الأعضاء
  if (results.users.length > 0) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3 class="section-subtitle">الأعضاء (${results.users.length})</h3>
      <div class="accordion-list">
        ${results.users.map(user => `
          <div class="accordion-item">
            <div class="accordion-header">
              <div class="accordion-header-content">
                <div class="user-info">
                  👤 ${user.username}
                </div>
                <span class="badge-warning">${user.role}</span>
              </div>
              <div class="accordion-meta">
                ${user.phone || 'لا يوجد جوال'}
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    searchResultsDiv.appendChild(card);
  }
  
  // عرض نتائج التحركات
  if (results.movements.length > 0) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3 class="section-subtitle">التحركات (${results.movements.length})</h3>
      <div class="accordion-list">
        ${results.movements.slice(0, 10).map(mov => `
          <div class="accordion-item">
            <div class="accordion-header">
              <div class="accordion-header-content">
                <div class="car-info">
                  🚗 ${mov.carNumber || ''} - ${mov.plateCode || ''}
                </div>
                <div class="user-info">
                  👤 ${mov.userName || ''}
                </div>
              </div>
              <div class="accordion-meta">
                ${formatTimestampMs(mov.createdAt)}
              </div>
      
   </div>
        `).join('')}
        ${results.movements.length > 10 ? 
          `<p style="text-align: center; margin-top: 15px; color: #666;">
            ... وعرض ${results.movements.length - 10} نتيجة إضافية
          </p>` : ''
        }
      </div>
    `;
    searchResultsDiv.appendChild(card);
  }
  
  // عرض نتائج العهدة
  if (results.assignments.length > 0) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3 class="section-subtitle">العهدة (${results.assignments.length})</h3>
      <div class="accordion-list">
        ${results.assignments.slice(0, 10).map(ass => `
          <div class="accordion-item">
            <div class="accordion-header">
              <div class="accordion-header-content">
                <div class="car-info">
                  🚗 ${ass.carNumber || ''} - ${ass.plateCode || ''}
                </div>
                <div class="user-info">
                  👤 ${ass.userName || ''}
                </div>
 
Position:	 Ln 1, Ch 1 	Total:	 Ln 1, Ch 0 	 
search		
replace		
match case regular expressions 
find next replace replace all
 
Editarea 0.8.2


Shortcuts:

 Tab: add tabulation to text
 Shift+Tab: remove tabulation to text
 Ctrl+f: search next / open search area
 Ctrl+r: replace / open search area
 Ctrl+h: toggle syntax highlight on/off
 Ctrl+g: go to line
 Ctrl+z: undo
 Ctrl+y: redo
 Ctrl+e: about
 Ctrl+q, Esc: close popup
 Accesskey E: Toggle editor

Notice: syntax highlight function is only for small text 
© Christophe Dolivet 2007-2010              </div>
              <div class="accordion-meta">
                ${ass.owner || ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    searchResultsDiv.appendChild(card);
  }
  
  // عرض نتائج الأسطول
  if (results.fleet.length > 0) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3 class="section-subtitle">الأسطول (${results.fleet.length})</h3>
      <div class="accordion-list">
        ${results.fleet.slice(0, 10).map(car => `
          <div class="accordion-item">
            <div class="accordion-header">
              <div class="accordion-header-content">
                <div class="car-info">
                  🚗 ${car.carNumber || ''} - ${car.plateCode || ''}
                </div>
                <div style="color: #1976d2; font-weight: 600;">
                  👑 ${car.owner || ''}
                </div>
              </div>
              <div class="accordion-meta">
r.licenseEnd ? formatTimestampMs(car.licenseEnd).split(' ')[0] : 'لا يوجد'}
              </div>
            </div>
          </div>
        `).join('')}
        
      </div>
    `;
    searchResultsDiv.appendChild(card);
  }
  
}
/** ========== دالة طباعة نتائج البحث ========== */
function printSearchResults(results, query) {
  const printWindow = window.open('', '_blank');
  
  let content = `
    <html>
      <head>
        <title>نتائج البحث - ${query}</title>
        <style>
          body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
          .print-header { text-align: center; margin-bottom: 30px; }
          .print-logo { height: 80px; margin-bottom: 10px; }
          .print-title { color: #1a4399; font-size: 24px; margin: 10px 0; }
          .print-subtitle { color: #333; font-size: 18px; margin: 10px 0; }
          .print-date { color: #666; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #f5f5f5; padding: 12px; border: 1px solid #ddd; }
          td { padding: 10px; border: 1px solid #ddd; }
          .section-title { background-color: #e3f2fd; padding: 10px; margin: 25px 0 15px; }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1 class="print-title">نظام إدارة وتسجيل حركة السيارات المتكامل</h1>
          <h2 class="print-subtitle">نتائج البحث: "${query}"</h2>
          <div class="print-date">تاريخ الطباعة: ${new Date().toLocaleDateString('ar')}</div>
        </div>
  `;
  
  // جدول الأعضاء
  if (results.users.length > 0) {
    content += `
      <h3 class="section-title">الأعضاء (${results.users.length})</h3>
      <table>
        <thead>
          <tr>
            <th>اسم المستخدم</th>
            <th>الدور</th>
            <th>الجوال</th>
          </tr>
        </thead>
        <tbody>
          ${results.users.map(user => `
            <tr>
              <td>${user.username}</td>
              <td>${user.role}</td>
              <td>${user.phone || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  
  // جدول التحركات
  if (results.movements.length > 0) {
    content += `
      <h3 class="section-title">التحركات (${results.movements.length})</h3>
      <table>
        <thead>
          <tr>
            <th>رقم السيارة</th>
            <th>كود اللوحة</th>
            <th>السائق</th>
            <th>الحركة</th>
            <th>التاريخ</th>
          </tr>
        </thead>
        <tbody>
          ${results.movements.map(mov => `
            <tr>
              <td>${mov.carNumber || '-'}</td>
              <td>${mov.plateCode || '-'}</td>
              <td>${mov.userName || '-'}</td>
              <td>${mov.action || '-'}</td>
              <td>${formatTimestampMs(mov.createdAt)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  
  // جدول العهدة
  if (results.assignments.length > 0) {
    content += `
      <h3 class="section-title">العهدة (${results.assignments.length})</h3>
      <table>
        <thead>
          <tr>
            <th>رقم السيارة</th>
            <th>كود اللوحة</th>
            <th>العضو</th>
            <th>المالك</th>
          </tr>
        </thead>
        <tbody>
          ${results.assignments.map(ass => `
            <tr>
              <td>${ass.carNumber || '-'}</td>
              <td>${ass.plateCode || '-'}</td>
              <td>${ass.userName || '-'}</td>
              <td>${ass.owner || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  
  // جدول الأسطول
  if (results.fleet.length > 0) {
    content += `
      <h3 class="section-title">الأسطول (${results.fleet.length})</h3>
      <table>
        <thead>
          <tr>
            <th>رقم السيارة</th>
            <th>كود اللوحة</th>
            <th>المالك</th>
            <th>نهاية الترخيص</th>
          </tr>
        </thead>
        <tbody>
          ${results.fleet.map(car => `
            <tr>
              <td>${car.carNumber || '-'}</td>
              <td>${car.plateCode || '-'}</td>
              <td>${car.owner || '-'}</td>
              <td>${car.licenseEnd ? formatTimestampMs(car.licenseEnd).split(' ')[0] : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  
  content += `
        <div style="margin-top: 40px; text-align: center; color: #888; font-size: 12px;">
          <hr>
          <p>تم الإنشاء تلقائياً من النظام - شكراً لاستخدامكم خدمات المسعود</p>
        </div>
      </body>
    </html>
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

/** ========== دالة المشاركة كصورة ========== */
async function shareAsImage(element, title, data) {
  try {
    // إظهار مؤشر تحميل
    element.innerHTML = '<span class="loading-spinner"></span> جاري التحويل...';
    element.disabled = true;
    
    // إنشاء العنصر المؤقت
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
      position: fixed;
      left: -10000px;
      top: -10000px;
      width: 600px;
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      direction: rtl;
      font-family: Arial, sans-serif;
    `;
    
    // إنشاء محتوى الصورة
    let content = '';
    
    if (data.type === 'movement') {
      content = `
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #1a4399; margin: 0 0 10px 0; font-size: 24px;">حركة سيارة</h2>
          <div style="color: #666; font-size: 14px;">نظام إدارة وتسجيل حركة السيارات المتكامل</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="background: #f5f7fa; padding: 12px; border-radius: 8px;">
            <div style="color: #666; font-size: 13px;">رقم السيارة</div>
            <div style="font-weight: bold; font-size: 18px; color: #1a4399;">${data.carNumber || '-'}</div>
          </div>
          <div style="background: #f5f7fa; padding: 12px; border-radius: 8px;">
            <div style="color: #666; font-size: 13px;">كود اللوحة</div>
            <div style="font-weight: bold; font-size: 18px; color: #1a4399;">${data.plateCode || '-'}</div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="background: #f5f7fa; padding: 12px; border-radius: 8px;">
            <div style="color: #666; font-size: 13px;">السائق</div>
            <div style="font-weight: bold; font-size: 16px; color: #388e3c;">${data.userName || '-'}</div>
          </div>
          <div style="background: #f5f7fa; padding: 12px; border-radius: 8px;">
            <div style="color: #666; font-size: 13px;">الحركة</div>
            <div style="font-weight: bold; font-size: 16px; color: #d32f2f;">${data.action || '-'}</div>
          </div>
        </div>
        
        ${data.notes ? `
          <div style="background: #fff8e1; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #ff9800;">
            <div style="color: #666; font-size: 13px; margin-bottom: 5px;">ملاحظات</div>
            <div style="font-size: 14px; color: #333;">${data.notes}</div>
          </div>
        ` : ''}
        
        <div style="background: #e8f5e9; padding: 12px; border-radius: 8px; margin-bottom: 25px;">
          <div style="color: #666; font-size: 13px;">تاريخ الحركة</div>
          <div style="font-weight: bold; font-size: 16px; color: #388e3c;">${formatTimestampMs(data.createdAt)}</div>
        </div>
        
        <div style="text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
          <div>شعار المسعود</div>
          <div>تاريخ الإنشاء: ${new Date().toLocaleDateString('ar')}</div>
        </div>
      `;
    }
    
    // إضافة العلامة المائية
    const watermark = `
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.05; pointer-events: none; z-index: 1;">
        <div style="font-size: 100px; color: #1a4399; font-weight: bold; white-space: nowrap;">AL MASAOOD</div>
      </div>
    `;
    
    tempDiv.innerHTML = `
      <div style="position: relative; z-index: 2;">
        ${content}
      </div>
      ${watermark}
    `;
    
    document.body.appendChild(tempDiv);
    
    // تحويل إلى صورة
    const canvas = await html2canvas(tempDiv, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false
    });
    
    // تنظيف
    document.body.removeChild(tempDiv);
    
    // تحويل إلى رابط بيانات
    const imageUrl = canvas.toDataURL('image/png');
    
    // مشاركة الصورة
    if (navigator.share && navigator.canShare) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'حركة_سيارة.png', { type: 'image/png' });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'حركة سيارة - نظام المسعود',
          text: 'مشاركة حركة سيارة من نظام إدارة السيارات'
        });
      } else {
        // إذا كان المشاركة غير مدعومة، فتح الصورة في نافذة جديدة
        window.open(imageUrl, '_blank');
      }
    } else {
      // إذا كان Web Share API غير مدعوم
      window.open(imageUrl, '_blank');
    }
    
  } catch (error) {
    console.error('خطأ في المشاركة:', error);
    alert('حدث خطأ في إنشاء الصورة. جاري المشاركة كنص...');
    
    // العودة للمشاركة كنص
    const text = `
حركة سيارة
رقم السيارة: ${data.carNumber}
كود اللوحة: ${data.plateCode}
السائق: ${data.userName}
الحركة: ${data.action}
${data.notes ? `ملاحظات: ${data.notes}` : ''}
التاريخ: ${formatTimestampMs(data.createdAt)}
    `.trim();
    
    if (navigator.share) {
      navigator.share({ text }).catch(() => {
        navigator.clipboard.writeText(text).then(() => {
          alert('تم نسخ النص إلى الحافظة');
        });
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('تم نسخ النص إلى الحافظة');
      });
    }
  } finally {
    // إعادة زر المشاركة إلى حالته الأصلية
    element.innerHTML = '📤 مشاركة';
    element.disabled = false;
  }
}

/** ========== دالة طباعة التقرير ========== */
async function printReport(data, type, title) {
  const printWindow = window.open('', '_blank');
  
  let tableHeaders = '';
  let tableRows = '';
  
  if (type === 'movements') {
    tableHeaders = `
      <tr>
        <th>رقم السيارة</th>
        <th>كود اللوحة</th>
        <th>السائق</th>
        <th>الحركة</th>
        <th>ملاحظات</th>
        <th>التاريخ</th>
      </tr>
    `;
    
    tableRows = data.map(item => `
      <tr>
        <td>${item.carNumber || '-'}</td>
        <td>${item.plateCode || '-'}</td>
        <td>${item.userName || '-'}</td>
        <td>${item.action || '-'}</td>
        <td>${item.notes || '-'}</td>
        <td>${formatTimestampMs(item.createdAt)}</td>
      </tr>
    `).join('');
    
  } else if (type === 'assignments') {
    tableHeaders = `
      <tr>
        <th>رقم السيارة</th>
        <th>كود اللوحة</th>
        <th>العضو</th>
        <th>المالك</th>
        <th>ملاحظات</th>
        <th>التاريخ</th>
      </tr>
    `;
    
    tableRows = data.map(item => `
      <tr>
        <td>${item.carNumber || '-'}</td>
        <td>${item.plateCode || '-'}</td>
        <td>${item.userName || '-'}</td>
        <td>${item.owner || '-'}</td>
        <td>${item.notes || '-'}</td>
        <td>${item.createdAt ? formatTimestampMs(item.createdAt) : '-'}</td>
      </tr>
    `).join('');
    
  } else if (type === 'fleet') {
    tableHeaders = `
      <tr>
        <th>رقم السيارة</th>
        <th>كود اللوحة</th>
        <th>المالك</th>
        <th>نهاية الترخيص</th>
        <th>نهاية التأمين</th>
        <th>ملاحظات</th>
      </tr>
    `;
    
    tableRows = data.map(item => `
      <tr>
        <td>${item.carNumber || '-'}</td>
        <td>${item.plateCode || '-'}</td>
        <td>${item.owner || '-'}</td>
        <td>${item.licenseEnd ? formatTimestampMs(item.licenseEnd).split(' ')[0] : '-'}</td>
        <td>${item.insuranceEnd ? formatTimestampMs(item.insuranceEnd).split(' ')[0] : '-'}</td>
        <td>${item.notes || '-'}</td>
      </tr>
    `).join('');
  }
  
  const content = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            direction: rtl; 
            padding: 30px; 
            background: white; 
            color: #333;
            line-height: 1.6;
          }
          .print-header { 
            text-align: center; 
            margin-bottom: 40px; 
            padding-bottom: 20px; 
            border-bottom: 3px solid #1a4399;
          }
          .print-logo { 
            height: 100px; 
            margin-bottom: 15px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          }
          .print-title { 
            color: #1a4399; 
            font-size: 28px; 
            margin: 10px 0; 
            font-weight: 800;
          }
          .print-subtitle { 
            color: #333; 
            font-size: 20px; 
            margin: 10px 0; 
            font-weight: 600;
          }
          .print-info { 
            display: flex; 
            justify-content: space-between; 
            margin: 25px 0; 
            font-size: 14px; 
            color: #666;
            background: #f5f7fa;
            padding: 15px;
            border-radius: 8px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 30px 0; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          th { 
            background: linear-gradient(135deg, #1a4399 0%, #1976d2 100%); 
            color: white; 
            padding: 15px; 
            border: 1px solid #ddd; 
            text-align: right;
            font-weight: 600;
            font-size: 15px;
          }
          td { 
            padding: 12px; 
            border: 1px solid #e0e0e0; 
            text-align: right;
            font-size: 14px;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:hover {
            background-color: #f5f5f5;
          }
          .print-footer { 
            margin-top: 50px; 
            text-align: center; 
            color: #888; 
            font-size: 13px; 
            border-top: 1px solid #ddd; 
            padding-top: 20px;
          }
          @media print {
            body { padding: 20px; }
            .print-header { margin-bottom: 30px; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1 class="print-title">نظام إدارة وتسجيل حركة السيارات المتكامل</h1>
          <h2 class="print-subtitle">${title}</h2>
          <div class="print-info">
            <div class="print-date"><strong>تاريخ الطباعة:</strong> ${new Date().toLocaleDateString('ar')} ${new Date().toLocaleTimeString('ar')}</div>
            <div class="print-count"><strong>عدد السجلات:</strong> ${data.length}</div>
            <div class="print-user"><strong>المستخدم:</strong> ${loadSession()?.username || '-'}</div>
          </div>
        </div>
        
        <table class="print-table">
          <thead>${tableHeaders}</thead>
          <tbody>${tableRows}</tbody>
        </table>
        
        <div class="print-footer">
          <p>تم الإنشاء تلقائياً من نظام إدارة وتسجيل حركة السيارات المتكامل</p>
          <p><strong>شكراً لاستخدامكم خدمات المسعود</strong></p>
          <p style="font-size: 11px; margin-top: 10px;">جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
        </div>
      </body>
    </html>
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  
  // الانتظار قليلاً قبل الطباعة لضمان تحميل الصور
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

/** ========== دالة تحديث الهيدر المعدل ========== */
function updateHeaderDateTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const gmt4 = new Date(utc + 4 * 60 * 60 * 1000);

  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const dayName = days[gmt4.getDay()];

  let hours = gmt4.getHours();
  const minutes = gmt4.getMinutes();
  const seconds = gmt4.getSeconds();
  const ampm = hours >= 12 ? "م" : "ص";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const pad = (n) => n.toString().padStart(2, "0");

  const dateStr = `${gmt4.getFullYear()}/${pad(gmt4.getMonth() + 1)}/${pad(gmt4.getDate())}`;
  const timeStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;

  headerDatetime.textContent = `${dayName} | ${dateStr} | ${timeStr}`;
  
  // تحديث تلقائي كل ثانية
  setTimeout(updateHeaderDateTime, 1000);
}

// بدء تحديث الوقت
updateHeaderDateTime();

/** ========== دوال الجلسة (كما هي) ========== */
function saveSession(user) {
  const now = Date.now();
  const expiry = now + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;
  const data = {
    userId: user.id,
    username: user.username,
    role: user.role,
    phone: user.phone || "",
    expiry
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function loadSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    if (!session.expiry || Date.now() > session.expiry) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/** ========== دوال الشاشات المعدلة ========== */
function showLogin() {
  loginSection.classList.remove("hidden");
  adminForceChangeSection.classList.add("hidden");
  appSection.classList.add("hidden");
  globalSearchContainer.classList.add("hidden");
  logoutBtn.classList.add("hidden");
  refreshBtn.classList.add("hidden");
  currentUserBadge.classList.add("hidden");
}

function showAdminForceChange() {
  loginSection.classList.add("hidden");
  adminForceChangeSection.classList.remove("hidden");
  appSection.classList.add("hidden");
  globalSearchContainer.classList.add("hidden");
  logoutBtn.classList.add("hidden");
  refreshBtn.classList.add("hidden");
  currentUserBadge.classList.add("hidden");
}

function showAppForUser(session) {
  loginSection.classList.add("hidden");
  adminForceChangeSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  globalSearchContainer.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
  refreshBtn.classList.remove("hidden");
  
  // تحديث بقونة المستخدم
  currentUserBadge.textContent = `${session.username} (${session.role})`;
  currentUserBadge.className = `user-badge ${session.role}`;
  currentUserBadge.classList.remove("hidden");
  
  // تعديل التبويبات حسب الصلاحية
  const tabFleetBtn = document.querySelector('[data-tab="tab-fleet"]');
  const tabUsersBtn = document.querySelector('[data-tab="tab-users"]');
  
  if (session.role === "member") {
    if (tabFleetBtn) tabFleetBtn.classList.add("hidden");
    if (tabUsersBtn) tabUsersBtn.classList.add("hidden");
  } else {
    if (tabFleetBtn) tabFleetBtn.classList.remove("hidden");
    if (tabUsersBtn) tabUsersBtn.classList.remove("hidden");
  }
  
  // تحميل البيانات
  loadAllUsers().then(() => {
    populateUserSelects();
    loadMovements();
    loadAssignments();
    loadFleet();
  });
}

/** ========== دوال الأعضاء (مع تعديل عرض الأكورديون) ========== */
function renderUsersList() {
  const session = loadSession();
  if (!session) return;
  usersList.innerHTML = "";

  const visibleUsers =
    session.role === "member"
      ? cachedUsers.filter((u) => u.id === session.userId)
      : cachedUsers;

  visibleUsers.forEach((user) => {
    const item = document.createElement("div");
    item.className = "accordion-item";

    const header = document.createElement("div");
    header.className = "accordion-header";

    const headerContent = document.createElement("div");
    headerContent.className = "accordion-header-content";
    
    const userInfo = document.createElement("div");
    userInfo.className = "user-info";
    userInfo.innerHTML = `👤 ${user.username}`;
    
    const roleBadge = document.createElement("span");
    roleBadge.className = "badge-warning";
    roleBadge.textContent = user.role;
    
    headerContent.appendChild(userInfo);
    headerContent.appendChild(roleBadge);

    const meta = document.createElement("div");
    meta.className = "accordion-meta";
    meta.textContent = user.phone ? `📱 ${user.phone}` : "📱 لا يوجد";

    header.appendChild(headerContent);
    header.appendChild(meta);

    const body = document.createElement("div");
    body.className = "accordion-body hidden";

    // ... باقي كود الأكورديون كما هو ...
    
    header.addEventListener("click", () => {
      body.classList.toggle("hidden");
    });

    item.appendChild(header);
    item.appendChild(body);
    usersList.appendChild(item);
  });
}

/** ========== دوال التحركات (مع تعديل عرض الأكورديون) ========== */
function renderMovementsList(moves) {
  const session = loadSession();
  movementsList.innerHTML = "";
  
  moves.forEach((m) => {
    const item = document.createElement("div");
    item.className = "accordion-item";

    const header = document.createElement("div");
    header.className = "accordion-header";

    const headerContent = document.createElement("div");
    headerContent.className = "accordion-header-content";
    
    // عرض رقم السيارة واسم العضو بجانب بعض
    const carInfo = document.createElement("div");
    carInfo.className = "car-info";
    carInfo.innerHTML = `🚗 ${m.carNumber || ""} - ${m.plateCode || ""}`;
    
    const userInfo = document.createElement("div");
    userInfo.className = "user-info";
    userInfo.innerHTML = `👤 ${m.userName || ""}`;
    
    const actionBadge = document.createElement("span");
    actionBadge.className = "badge-warning";
    actionBadge.textContent = m.action;
    
    headerContent.appendChild(carInfo);
    headerContent.appendChild(userInfo);
    headerContent.appendChild(actionBadge);

    const meta = document.createElement("div");
    meta.className = "accordion-meta";
    meta.textContent = formatTimestampMs(m.createdAt);

    header.appendChild(headerContent);
    header.appendChild(meta);

    const body = document.createElement("div");
    body.className = "accordion-body hidden";

    // ... باقي كود الأكورديون كما هو مع تعديلات المشاركة ...
    
    // تعديل زر المشاركة لاستخدام الصورة
    const shareBtn = document.createElement("button");
    shareBtn.className = "btn btn-secondary";
    shareBtn.textContent = "📤 مشاركة";
    shareBtn.addEventListener("click", () => {
      shareAsImage(shareBtn, "حركة سيارة", {
        type: 'movement',
        carNumber: m.carNumber,
        plateCode: m.plateCode,
        userName: m.userName,
        action: m.action,
        notes: m.notes,
        createdAt: m.createdAt
      });
    });
    
    // ... باقي الأزرار كما هي ...
    
    header.addEventListener("click", () => {
      body.classList.toggle("hidden");
    });

    item.appendChild(header);
    item.appendChild(body);
    movementsList.appendChild(item);
  });
}

/** ========== تعديل دالة طباعة التقرير ========== */
async function handleMovPrintReport(e) {
  e.preventDefault();
  const session = loadSession();
  if (!session) return;

  const range = movReportRange.value;
  const reportType = movReportType.value;
  const movesCol = collection(db, "movements");
  const snap = await getDocs(query(movesCol, orderBy("createdAt", "desc")));
  let moves = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (session.role === "member") {
    moves = moves.filter((m) => m.userId === session.userId);
  }

  const now = Date.now();
  let fromTime = 0;
  let title = "تقرير التحركات - ";
  
  if (range === "day") {
    fromTime = now - 24 * 60 * 60 * 1000;
    title += "اليوم";
  } else if (range === "week") {
    fromTime = now - 7 * 24 * 60 * 60 * 1000;
    title += "أسبوع";
  } else if (range === "month") {
    fromTime = now - 30 * 24 * 60 * 60 * 1000;
    title += "شهر";
  } else if (range === "year") {
    fromTime = now - 365 * 24 * 60 * 60 * 1000;
    title += "سنة";
  } else {
    title += "الكل";
  }

  if (range !== "all") {
    moves = moves.filter((m) => m.createdAt >= fromTime);
  }

  if (reportType === 'print') {
    await printReport(moves, 'movements', title);
  } else if (reportType === 'preview') {
    // معاينة قبل الطباعة
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write('<h2>جاري تحضير المعاينة...</h2>');
    setTimeout(() => printReport(moves, 'movements', title), 1000);
  } else if (reportType === 'export') {
    // تصدير كملف CSV
    const csvContent = moves.map(m => 
      `${m.carNumber},${m.plateCode},${m.userName},${m.action},"${m.notes || ''}",${formatTimestampMs(m.createdAt)}`
    ).join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `تحركات_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }
}

/** ========== دوال العهدة والأسطول (بنفس التعديلات) ========== */
// ... نفس الكود مع تعديلات عرض الأكورديون والمشاركة ...

/** ========== إعداد الأحداث ========== */
function initEventListeners() {
  // زر التحديث اليدوي
  refreshBtn.addEventListener("click", manualRefresh);
  
  // البحث العام
  globalSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleGlobalSearch();
  });
  globalSearchBtn.addEventListener("click", handleGlobalSearch);
  
  // البحث المتقدم
  searchBtn.addEventListener("click", handleAdvancedSearch);
  
  // طباعة الكل
  if (movPrintAllBtn) {
    movPrintAllBtn.addEventListener("click", async () => {
      const session = loadSession();
      if (!session) return;
      
      const movesCol = collection(db, "movements");
      const snap = await getDocs(query(movesCol, orderBy("createdAt", "desc")));
      let moves = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      if (session.role === "member") {
        moves = moves.filter((m) => m.userId === session.userId);
      }
      
      await printReport(moves, 'movements', 'تقرير التحركات - الكل');
    });
  }
}

/** ========== التهيئة الرئيسية ========== */
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initAuthFlow();
  initEventListeners();

  // الأحداث الأصلية
  if (userForm) userForm.addEventListener("submit", handleUserFormSubmit);
  if (movForm) movForm.addEventListener("submit", handleMovementFormSubmit);
  if (movPrintReportBtn) movPrintReportBtn.addEventListener("click", handleMovPrintReport);
  if (assForm) assForm.addEventListener("submit", handleAssignmentFormSubmit);
  if (fleetForm) fleetForm.addEventListener("submit", handleFleetFormSubmit);
  
  // Service Worker
  registerServiceWorker();
});