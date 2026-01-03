// استيراد Firebase من CDNimport { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
query,
 import {
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
rebaseapp.com",
  projecconst firebaseConfig = {
  apiKey: "AIzaSyD-qlIfpFyam5UgjxzhwAEhkttIQCBZXUw",
  authDomain: "carmanagement-79bfb.f
itId: "carmanagement-79bfb",
  storageBucket: "carmanagement-79bfb.firebasestorage.app",
  messagingSenderId: "313516916430",
  appId: "1:313516916430:web:6f2c20740bced9e7211a9f"
UR};

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
t.getElementById("global-search-btn");
const searchTypeSelect = document.getElemeconst globalSearchContainer = document.getElementById("global-search-container");
const globalSearchInput = document.getElementById("global-search-input");
const globalSearchBtn = docume
nntById("search-type");
const searchSortSelect = document.getElementById("search-sort");

// عناصر الطباعة
const printTemplate = document.getElementById("print-template");
const shareTemplate = document.getElementById("share-template");

// ========== عناصر عامة ==========
getElementById("login-form");
const loginError = document.getElemeconst headerDatetime = document.getElementById("header-datetime");
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
-role");
const userPhoneInput = document.getElementById("user-const tabContents = document.querySelectorAll(".tab-content");

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
/ العهدة
const assForm = document.getElementById("assignmenconst movNotesInput = document.getElementById("mov-notes");
const movementsFormError = document.getElementById("movements-form-error");
const movementsList = document.getElementById("movements-list");
const movReportRange = document.getElementById("mov-report-range");
const movReportType = document.getElementById("mov-report-type");
const movPrintReportBtn = document.getElementById("mov-print-report");
const movPrintAllBtn = document.getElementById("mov-print-all");

/t-form");
const assCarNumberInput = document.getElementById("ass-car-number");
fleetPlateCodeInput = document.getElementById("fleet-plate-code");
cconst assPlateCodeInput = document.getElementById("ass-plate-code");
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
 {
    showLoading(false);
  }
}

/** ========== دالة إظهار/إfooterYear.textContent = new Date().getFullYear().toString();

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
ation-info { background: linear-gradient(135deg,  const style = document.createElement('style');
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
ue;
  const sort = searchSortSelec    if (notification.parentNode) {
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
      
) {
        results.movements = result      if (session.role === 'member') {
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
) => a.createdAt - b.createdAt);
      result    if (type === 'all' || type === 'fleet') {
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
d=  
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
     </div>
                      </div>
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
                ${ca              </div>
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
ng: 10px; margin: 25              </div>
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
          .section-title { background-color: #e3f2fd; padd
ipx 0 15px; }
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
              <td>${ass.plateCode || '-'}</td
> <td>${ass.userName || '-'}</td>
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
ansform: translate(-50%, -50%); opacity: 0.05; pointer-events: none; z-index: 1;">
        <div style="f            <div style="font-weight: bold; font-size: 16px; color: #d32f2f;">${data.action || '-'}</div>
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
      <div style="position: absolute; top: 50%; left: 50%; t
ront-size: 100px; color: #1a4399; font-weight: bold; white-space: nowrap;">AL MASAOOD</div>
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
r>
        <td>${item.carNumber || '-'}</td>    console.error('خطأ في المشاركة:', error);
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
      <
t        <td>${item.plateCode || '-'}</td>
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
 #f5f7fa;
            padding: 15px;
            border-radius: 8px;
          }
          table        <td>${item.insuranceEnd ? formatTimestampMs(item.insuranceEnd).split(' ')[0] : '-'}</td>
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
            background
: { 
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
tHours();
  const minutes = gmt4.getMinutes();
  const seconds = gmt4.getSeconds();
  const ampm = hours >= 12 ? "م" : "ص";
  hours = hours % 12;
  if             <div class="print-date"><strong>تاريخ الطباعة:</strong> ${new Date().toLocaleDateString('ar')} ${new Date().toLocaleTimeString('ar')}</div>
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

  let hours = gmt4.g
e(hours === 0) hours = 12;

  const pad = (n) => n.toString().padStart(2, "0");

  const dateStr = `${gmt4.getFullYear()}/${pad(gmt4.getMonth() + 1)}/${pad(gmt4.getDate())}`;
  const timeStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;

  headerDatetime.textContent = `${dayName} | ${dateStr} | ${timeStr}`;
  
  // تحديث تلقائي كل ثانية
  setTimeout(updateHeaderDateTime, 1000);
}

// بدء تحديث الوقت
updateHeaderDateTime();

/** تنسيق timestamp */
function formatTimestampMs(ms) {
  if (!ms) return "";
  const date = new Date(ms);
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const local = new Date(utc + 4 * 60 * 60 * 1000);

  let hours = local.getHours();
  const minutes = local.getMinutes();
  const ampm = hours >= 12 ? "م" : "ص";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const pad = (n) => n.toString().padStart(2, "0");
  const dateStr = `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(
    local.getDate()
  )}`;
  const timeStr = `${pad(hours)}:${pad(minutes)} ${ampm}`;

  return `${dateStr} ${timeStr}`;
}

/** الجلسة */
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
t.add("hidden");
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

/** الشاشات */
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
  
  const tabFleetBtn = document.querySelector('[data-tab="tab-fleet"]');
  const tabUsersBtn = document.querySelector('[data-tab="tab-users"]');
  if (session.role === "member") {
    if (tabFleetBtn) tabFleetBtn.classList.add("hidden");
    if (tabUsersBtn) tabUsersBtn.classLi
s } else {
    if (tabFleetBtn) tabFleetBtn.classList.remove("hidden");
    if (tabUsersBtn) tabUsersBtn.classList.remove("hidden");
  }

  loadAllUsers().then(() => {
    populateUserSelects();
    loadMovements();
    loadAssignments();
    loadFleet();
  });
}

/** التأكد من وجود مدير افتراضي */
async function ensureDefaultAdmin() {
  const usersCol = collection(db, "users");
  const qAdmin = query(usersCol, where("role", "==", "admin"));
  const snap = await getDocs(qAdmin);
  if (snap.empty) {
    const adminDocRef = doc(usersCol);
    await setDoc(adminDocRef, {
      username: "admin",
      password: "admin123",
      role: "admin",
      phone: "",
      mustChangePassword: true,
      createdAt: Date.now()
    });
    return {
      id: adminDocRef.id,
      username: "admin",
      password: "admin123",
      role: "admin",
      phone: "",
      mustChangePassword: true
    };
  } else {
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  }
}

/** البحث عن مستخدم */
async function findUserByCredentials(username, password) {
  const usersCol = collection(db, "users");
  const qUser = query(
    usersCol,
    where("username", "==", username),
    where("password", "==", password)
  );
  const snap = await getDocs(qUser);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

/** تحديث بيانات المدير */
async function updateAdminCredentials(userId, newUsername, newPassword, newPhone) {
  const userRef = doc(db, "users", userId);
  const d = await getDoc(userRef);
  if (!d.exists()) throw new Error("لا يمكن العثور على حساب المدير.");
  const data = d.data();
  if (data.role !== "admin") throw new Error("هذا المستخدم ليس مديرًا.");

  await setDoc(userRef, {
    ...data,
    username: newUsername,
    password: newPassword,
    phone: newPhone,
    mustChangePassword: false
  });
}

/** التبويبات */
function initTabs() {
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      if (!target) return;
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });
}

/** الأعضاء */
let cachedUsers = [];

async function loadAllUsers() {
  const usersCol = collection(db, "users");
  const qUsers = query(usersCol, orderBy("createdAt", "asc"));
  const snap = await getDocs(qUsers);
  cachedUsers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  renderUsersList();
}

function populateUserSelects() {
  const session = loadSession();
  movUserSelect.innerHTML = "";
  assUserSelect.innerHTML = "";

  const optionsSource =
    session && (session.role === "admin" || session.role === "supervisor")
      ? cachedUsers
      : cachedUsers.filter((u) => u.id === session.userId);

  optionsSource.forEach((user) => {
    const opt1 = document.createElement("option");
    opt1.value = user.id;
    opt1.textContent = user.username;
    movUserSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = user.id;
    opt2.textContent = user.username;
    assUserSelect.appendChild(opt2);
  });

  const emptyOpt1 = document.createElement("option");
  emptyOpt1.value = "";
  emptyOpt1.textContent = "اختر العضو";
  movUserSelect.insertBefore(emptyOpt1, movUserSelect
.firstChild);

  const emptyOpt2 = document.createElement("option");
  emptyOpt2.value = "";
  emptyOpt2.textContent = "اختر العضو";
  assUserSelect.insertBefore(emptyOpt2, assUserSelect.firstChild);
}

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

    const row1 = document.createElement("div");
    row1.className = "accordion-row";
    row1.innerHTML = `
      <span class="accordion-label">اسم المستخدم:</span>
      <span>${user.username}</span>
    `;

    const row2 = document.createElement("div");
er.addEventListener("click", () => {    row2.className = "accordion-row";
    row2.innerHTML = `
      <span class="accordion-label">الدور:</span>
      <span>${user.role}</span>
    `;

    const row3 = document.createElement("div");
    row3.className = "accordion-row";
    row3.innerHTML = `
      <span class="accordion-label">الجوال:</span>
      <span>${user.phone || "-"}</span>
    `;

    const actions = document.createElement("div");
    actions.className = "accordion-actions";

    const sessionUserRole = session.role;
    const canEdit =
      sessionUserRole === "admin" ||
      (sessionUserRole === "supervisor" && user.role !== "admin");

    if (canEdit) {
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-secondary";
      editBtn.textContent = "تعديل";
      editBtn.addEventListener("click", () => {
        userIdInput.value = user.id;
        userUsernameInput.value = user.username;
        userPasswordInput.value = user.password;
        userRoleInput.value = user.role;
        userPhoneInput.value = user.phone || "";
        window.scrollTo({ top: userForm.offsetTop - 20, behavior: "smooth" });
      });
      actions.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-secondary";
      delBtn.style.backgroundColor = "#c62828";
      delBtn.textContent = "حذف";
      delBtn.addEventListener("click", async () => {
        if (!confirm("هل أنت متأكد من حذف هذا العضو؟")) return;
        await deleteDoc(doc(db, "users", user.id));
        await loadAllUsers();
      });
      actions.appendChild(delBtn);
    }

    body.appendChild(row1);
    body.appendChild(row2);
    body.appendChild(row3);
    body.appendChild(actions);

    hea
d      body.classList.toggle("hidden");
    });

    item.appendChild(header);
    item.appendChild(body);
    usersList.appendChild(item);
  });
}

async function handleUserFormSubmit(e) {
  e.preventDefault();
  usersFormError.textContent = "";
  const session = loadSession();
  if (!session) return;

  const isEdit = !!userIdInput.value;
  const username = userUsernameInput.value.trim();
  const password = userPasswordInput.value.trim();
  const role = userRoleInput.value;
  const phone = userPhoneInput.value.trim();

  if (username.length < 4) {
    usersFormError.textContent = "اسم المستخدم يجب ألا يقل عن 4 أحرف.";
    return;
  }
  if (password.length < 6) {
    usersFormError.textContent = "كلمة المرور يجب ألا تقل عن 6 أحرف/أرقام.";
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    usersFormError.textContent = "رقم الجوال يجب أن يكون 10 أرقام.";
    return;
  }

  if (session.role === "member") {
    usersFormError.textContent = "ليست لديك صلاحية لإدارة الأعضاء.";
    return;
  }
  if (session.role === "supervisor") {
    if (isEdit) {
      const existing = cachedUsers.find((u) => u.id === userIdInput.value);
      if (existing && existing.role === "admin") {
        usersFormError.textContent = "لا يمكنك تعديل بيانات المدير.";
        return;
      }
    }
    if (role === "admin") {
      usersFormError.textContent = "لا يمكنك إنشاء مدير جديد.";
      return;
    }
  }

  const usersCol = collection(db, "users");
  if (isEdit) {
    const ref = doc(db, "users", userIdInput.value);
    const existingSnap = await getDoc(ref);
    if (!existingSnap.exists()) {
      usersFormError.textContent = "لا يمكن العثور على هذا العضو.";
      return;
    }
    const existing = existingSnap.data();
    await setDoc(ref, {
      ...existing,
      username,
warning";
    a      password,
      role,
      phone
    });
  } else {
    const ref = doc(usersCol);
    await setDoc(ref, {
      username,
      password,
      role,
      phone,
      mustChangePassword: false,
      createdAt: Date.now()
    });
  }

  userIdInput.value = "";
  userUsernameInput.value = "";
  userPasswordInput.value = "";
  userPhoneInput.value = "";
  userRoleInput.value = "member";

  await loadAllUsers();
  populateUserSelects();
}

/** التحركات */
async function loadMovements() {
  const session = loadSession();
  if (!session) return;
  const movesCol = collection(db, "movements");
  const qBase = query(movesCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(qBase);
  let moves = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (session.role === "member") {
    moves = moves.filter((m) => m.userId === session.userId);
  }

  renderMovementsList(moves);
}

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
    actionBadge.className = "badge
-ctionBadge.textContent = m.action;
    
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

    const row1 = document.createElement("div");
    row1.className = "accordion-row";
    row1.innerHTML = `
      <span class="accordion-label">السائق:</span>
      <span>${m.userName || ""}</span>
    `;

    const row2 = document.createElement("div");
    row2.className = "accordion-row";
    row2.innerHTML = `
      <span class="accordion-label">ملاحظات:</span>
      <span>${m.notes || "-"}</span>
    `;

    const row3 = document.createElement("div");
    row3.className = "accordion-row";
    let editInfo = "";
    if (m.edited) {
      editInfo = `<span class="badge-warning">تم التعديل - الملاحظات الأصلية: ${
        m.originalNotes || "-"
      }</span>`;
    }
    row3.innerHTML = editInfo;

    const actions = document.createElement("div");
    actions.className = "accordion-actions";

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
    actions.appendChild(shareBtn);

    const printBtn = document.createElement("button");
w2);
    if (editInfo) body.appendChild(row3)    printBtn.className = "btn btn-secondary";
    printBtn.textContent = "🖨️ طباعة";
    printBtn.addEventListener("click", () => {
      const w = window.open("", "_blank");
      w.document.write(`<pre>${JSON.stringify(m, null, 2)}</pre>`);
      w.print();
      w.close();
    });
    actions.appendChild(printBtn);

    const sessionRole = session.role;
    const canEdit =
      sessionRole === "admin" ||
      sessionRole === "supervisor" ||
      (sessionRole === "member" && m.userId === session.userId);
    const canDelete = sessionRole === "admin" || sessionRole === "supervisor";
    const within24h = Date.now() - m.createdAt <= 24 * 60 * 60 * 1000;

    if (canEdit && (sessionRole !== "member" || within24h)) {
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-secondary";
      editBtn.textContent = "✏️ تعديل";
      editBtn.addEventListener("click", () => {
        movCarNumberInput.value = m.carNumber;
        movPlateCodeInput.value = m.plateCode;
        movUserSelect.value = m.userId;
        movActionSelect.value = m.action;
        movNotesInput.value = m.notes || "";
        movForm.dataset.editId = m.id;
        window.scrollTo({ top: movForm.offsetTop - 20, behavior: "smooth" });
      });
      actions.appendChild(editBtn);
    }

    if (canDelete) {
      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-secondary";
      delBtn.style.backgroundColor = "#c62828";
      delBtn.textContent = "🗑️ حذف";
      delBtn.addEventListener("click", async () => {
        if (!confirm("هل أنت متأكد من حذف هذه الحركة؟")) return;
        await deleteDoc(doc(db, "movements", m.id));
        await loadMovements();
      });
      actions.appendChild(delBtn);
    }

    body.appendChild(row1);
    body.appendChild(r
o;
    body.appendChild(actions);

    header.addEventListener("click", () => {
      body.classList.toggle("hidden");
    });

    item.appendChild(header);
    item.appendChild(body);
    movementsList.appendChild(item);
  });
}

async function handleMovementFormSubmit(e) {
  e.preventDefault();
  movementsFormError.textContent = "";
  const session = loadSession();
  if (!session) return;

  const carNumber = movCarNumberInput.value.trim();
  const plateCode = movPlateCodeInput.value.trim();
  const userId = movUserSelect.value;
  const action = movActionSelect.value;
  const notes = movNotesInput.value.trim();

  if (!carNumber || !plateCode || !userId || !action) {
    movementsFormError.textContent = "يرجى تعبئة جميع الحقول المطلوبة.";
    return;
  }

  if (session.role === "member" && userId !== session.userId) {
    movementsFormError.textContent = "لا يمكنك إضافة حركة لعضو آخر.";
    return;
  }

  const targetUser = cachedUsers.find((u) => u.id === userId);
  const userName = targetUser ? targetUser.username : "";

  const editId = movForm.dataset.editId;
  const now = Date.now();
  const movesCol = collection(db, "movements");

  if (editId) {
    const ref = doc(db, "movements", editId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      movementsFormError.textContent = "لا يمكن العثور على هذه الحركة.";
      return;
    }
    const existing = snap.data();

    if (session.role === "member" && now - existing.createdAt > 24 * 60 * 60 * 1000) {
      movementsFormError.textContent = "لا يمكنك تعديل الحركة بعد مرور 24 ساعة.";
      return;
    }

    await setDoc(ref, {
      ...existing,
      carNumber,
      plateCode,
      userId,
      userName,
      action,
      originalNotes: existing.notes || "",
      notes,
      edited: true,
      editedAt: now
    });
    delete movForm.dataset.editId;
  } else {
ves, 'movements', title), 1000    const ref = doc(movesCol);
    await setDoc(ref, {
      carNumber,
      plateCode,
      userId,
      userName,
      action,
      notes,
      createdAt: now,
      edited: false,
      originalNotes: "",
      createdByUserId: session.userId
    });
  }

  movCarNumberInput.value = "";
  movPlateCodeInput.value = "";
  movUserSelect.value = "";
  movActionSelect.value = "";
  movNotesInput.value = "";

  await loadMovements();
}

async function handleMovPrintReport(e) {
  e.preventDefault();
  const session = loadSession();
  if (!session) return;

  const range = movReportRange.value;
  const reportType = movReportType ? movReportType.value : 'print';
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
    setTimeout(() => printReport(m
o);
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

async function handleMovPrintAll(e) {
  if (e) e.preventDefault();
  const session = loadSession();
  if (!session) return;
  
  const movesCol = collection(db, "movements");
  const snap = await getDocs(query(movesCol, orderBy("createdAt", "desc")));
  let moves = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  
  if (session.role === "member") {
    moves = moves.filter((m) => m.userId === session.userId);
  }
  
  await printReport(moves, 'movements', 'تقرير التحركات - الكل');
}

/** العهدة */
async function loadAssignments() {
  const session = loadSession();
  if (!session) return;
  const assCol = collection(db, "assignments");
  const snap = await getDocs(assCol);
  let assignments = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (session.role === "member") {
    assignments = assignments.filter((a) => a.userId === session.userId);
  }

  renderAssignmentsList(assignments);
}

function renderAssignmentsList(assignments) {
  const session = loadSession();
  assignmentsList.innerHTML = "";
  const grouped = {};
  assignments.forEach((a) => {
    if (!grouped[a.userId]) grouped[a.userId] = { userName: a.userName, items: [] };
    grouped[a.userId].items.push(a);
  });

  Object.keys(grouped).forEach((userId) => {
    const g = grouped[userId];

    const item = document.createElement("div");
    item.className = "accordion-item";

    const header = document.createElement("div");
shareBtn);

      const printBtn = documen    header.className = "accordion-header";

    const headerContent = document.createElement("div");
    headerContent.className = "accordion-header-content";
    
    const userInfo = document.createElement("div");
    userInfo.className = "user-info";
    userInfo.innerHTML = `👤 ${g.userName}`;
    
    const countBadge = document.createElement("span");
    countBadge.className = "badge-warning";
    countBadge.textContent = `${g.items.length} سيارة`;
    
    headerContent.appendChild(userInfo);
    headerContent.appendChild(countBadge);

    const meta = document.createElement("div");
    meta.className = "accordion-meta";
    meta.textContent = "عهدة";

    header.appendChild(headerContent);
    header.appendChild(meta);

    const body = document.createElement("div");
    body.className = "accordion-body hidden";

    g.items.forEach((a) => {
      const row = document.createElement("div");
      row.className = "accordion-row";
      row.innerHTML = `
        <span class="accordion-label">السيارة:</span>
        <span>${a.carNumber} - ${a.plateCode} (مالك: ${a.owner})</span>
      `;
      const notesRow = document.createElement("div");
      notesRow.className = "accordion-row";
      notesRow.innerHTML = `
        <span class="accordion-label">ملاحظات:</span>
        <span>${a.notes || "-"}</span>
      `;

      const actions = document.createElement("div");
      actions.className = "accordion-actions";

      const shareBtn = document.createElement("button");
      shareBtn.className = "btn btn-secondary";
      shareBtn.textContent = "📤 مشاركة";
      shareBtn.addEventListener("click", () => {
        shareAsImage(shareBtn, "عهدة سيارة", {
          type: 'assignment',
          carNumber: a.carNumber,
          plateCode: a.plateCode,
          userName: a.userName,
          owner: a.owner,
          notes: a.notes,
          createdAt: a.createdAt
        });
      });
      actions.appendChild
(t.createElement("button");
      printBtn.className = "btn btn-secondary";
      printBtn.textContent = "🖨️ طباعة";
      printBtn.addEventListener("click", () => {
        const w = window.open("", "_blank");
        w.document.write(`<pre>${JSON.stringify(a, null, 2)}</pre>`);
        w.print();
        w.close();
      });
      actions.appendChild(printBtn);

      const canManage = session.role === "admin" || session.role === "supervisor";
      if (canManage) {
        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-secondary";
        editBtn.textContent = "✏️ تعديل";
        editBtn.addEventListener("click", () => {
          assCarNumberInput.value = a.carNumber;
          assPlateCodeInput.value = a.plateCode;
          assUserSelect.value = a.userId;
          assOwnerInput.value = a.owner;
          assNotesInput.value = a.notes || "";
          assForm.dataset.editId = a.id;
          window.scrollTo({ top: assForm.offsetTop - 20, behavior: "smooth" });
        });
        actions.appendChild(editBtn);

        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-secondary";
        delBtn.style.backgroundColor = "#c62828";
        delBtn.textContent = "🗑️ حذف";
        delBtn.addEventListener("click", async () => {
          if (!confirm("هل أنت متأكد من حذف هذه العهدة؟")) return;
          await deleteDoc(doc(db, "assignments", a.id));
          await loadAssignments();
        });
        actions.appendChild(delBtn);
      }

      body.appendChild(row);
      body.appendChild(notesRow);
      body.appendChild(actions);
      body.appendChild(document.createElement("hr"));
    });

    header.addEventListener("click", () => {
      body.classList.toggle("hidden");
    });

    item.appendChild(header);
    item.appendChild(body);
    assignmentsList.appendChild(item);
  });
}

async function handleAssignmentFormSubmit(e) {
  e.preventDefault();
  assignmentsFormError.textContent = "";
eetList.innerHTML = "";
  cars.f  const session = loadSession();
  if (!session) return;

  const carNumber = assCarNumberInput.value.trim();
  const plateCode = assPlateCodeInput.value.trim();
  const userId = assUserSelect.value;
  const owner = assOwnerInput.value.trim();
  const notes = assNotesInput.value.trim();

  if (!carNumber || !plateCode || !userId || !owner) {
    assignmentsFormError.textContent = "يرجى تعبئة جميع الحقول المطلوبة.";
    return;
  }

  if (session.role === "member") {
    assignmentsFormError.textContent = "ليست لديك صلاحية لإدارة العهدة.";
    return;
  }

  const targetUser = cachedUsers.find((u) => u.id === userId);
  const userName = targetUser ? targetUser.username : "";

  const assCol = collection(db, "assignments");
  const editId = assForm.dataset.editId;

  if (editId) {
    const ref = doc(db, "assignments", editId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      assignmentsFormError.textContent = "لا يمكن العثور على هذه العهدة.";
      return;
    }
    const existing = snap.data();
    await setDoc(ref, {
      ...existing,
      carNumber,
      plateCode,
      userId,
      userName,
      owner,
      notes
    });
    delete assForm.dataset.editId;
  } else {
    const ref = doc(assCol);
    await setDoc(ref, {
      carNumber,
      plateCode,
      userId,
      userName,
      owner,
      notes,
      createdAt: Date.now()
    });
  }

  assCarNumberInput.value = "";
  assPlateCodeInput.value = "";
  assUserSelect.value = "";
  assOwnerInput.value = "";
  assNotesInput.value = "";

  await loadAssignments();
}

/** الأسطول */
async function loadFleet() {
  const session = loadSession();
  if (!session) return;
  const fleetCol = collection(db, "fleet");
  const snap = await getDocs(fleetCol);
  const cars = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  renderFleetList(cars);
}

function renderFleetList(cars) {
  const today = new Date();
  const todayMs = today.getTime();
  const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;

  f
lorEach((c) => {
    const item = document.createElement("div");
    item.className = "accordion-item";

    const header = document.createElement("div");
    header.className = "accordion-header";

    const headerContent = document.createElement("div");
    headerContent.className = "accordion-header-content";
    
    const carInfo = document.createElement("div");
    carInfo.className = "car-info";
    carInfo.innerHTML = `🚗 ${c.carNumber} - ${c.plateCode}`;
    
    const ownerInfo = document.createElement("div");
    ownerInfo.style.cssText = "color: #1976d2; font-weight: 600; font-size: 1rem; background-color: rgba(25, 118, 210, 0.1); padding: 6px 12px; border-radius: 6px; display: flex; align-items: center; gap: 8px;";
    ownerInfo.innerHTML = `👑 ${c.owner}`;
    
    headerContent.appendChild(carInfo);
    headerContent.appendChild(ownerInfo);

    const meta = document.createElement("div");
    meta.className = "accordion-meta";

    const licenseDateStr = c.licenseEnd ? formatTimestampMs(c.licenseEnd).split(" ")[0] : "-";
    const insuranceDateStr = c.insuranceEnd ? formatTimestampMs(c.insuranceEnd).split(" ")[0] : "-";

    meta.innerHTML = `📅 ترخيص: ${licenseDateStr}<br>📄 تأمين: ${insuranceDateStr}`;

    header.appendChild(headerContent);
    header.appendChild(meta);

    const body = document.createElement("div");
    body.className = "accordion-body hidden";

    const row1 = document.createElement("div");
    row1.className = "accordion-row";
    row1.innerHTML = `
      <span class="accordion-label">المالك:</span>
      <span>${c.owner}</span>
    `;

    const row2 = document.createElement("div");
    row2.className = "accordion-row";
    row2.innerHTML = `
      <span class="accordion-label">ملاحظات:</span>
      <span>${c.notes || "-"}</span>
    `;

    const row3 = document.createElement("div");
    row3.className = "accordion-row";
    let alertsHtml = "";
    if (c.licenseEnd && c.licenseEnd - todayMs <= fifteenDaysMs && c.licenseEnd >= todayMs) {
      alertsHtml += `<span class="badge-warning">⚠️ تنبيه: ترخيص ينتهي خلال 15 يوم</span>`;
leetI    }
    if (c.insuranceEnd && c.insuranceEnd - todayMs <= fifteenDaysMs && c.insuranceEnd >= todayMs) {
      alertsHtml += `<span class="badge-warning">⚠️ تنبيه: تأمين ينتهي خلال 15 يوم</span>`;
    }
    row3.innerHTML = alertsHtml;

    const actions = document.createElement("div");
    actions.className = "accordion-actions";

    const shareBtn = document.createElement("button");
    shareBtn.className = "btn btn-secondary";
    shareBtn.textContent = "📤 مشاركة";
    shareBtn.addEventListener("click", () => {
      shareAsImage(shareBtn, "سيارة الأسطول", {
        type: 'fleet',
        carNumber: c.carNumber,
        plateCode: c.plateCode,
        owner: c.owner,
        licenseEnd: c.licenseEnd,
        insuranceEnd: c.insuranceEnd,
        notes: c.notes
      });
    });
    actions.appendChild(shareBtn);

    const printBtn = document.createElement("button");
    printBtn.className = "btn btn-secondary";
    printBtn.textContent = "🖨️ طباعة";
    printBtn.addEventListener("click", () => {
      const w = window.open("", "_blank");
      w.document.write(`<pre>${JSON.stringify(c, null, 2)}</pre>`);
      w.print();
      w.close();
    });
    actions.appendChild(printBtn);

    const canManage = session.role === "admin" || session.role === "supervisor";
    if (canManage) {
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-secondary";
      editBtn.textContent = "✏️ تعديل";
      editBtn.addEventListener("click", () => {
        fleetCarNumberInput.value = c.carNumber;
        fleetPlateCodeInput.value = c.plateCode;
        fleetOwnerInput.value = c.owner;
        fleetNotesInput.value = c.notes || "";
        if (c.licenseEnd) {
          const d = new Date(c.licenseEnd);
          const pad = (n) => n.toString().padStart(2, "0");
          fleetLicenseEndInput.value = `${d.getFullYear()}-${pad(
            d.getMonth() + 1
          )}-${pad(d.getDate())}`;
        }
        if (c.insuranceEnd) {
          const d = new Date(c.insuranceEnd);
          const pad = (n) => n.toString().padStart(2, "0");
          
fnsuranceEndInput.value = `${d.getFullYear()}-${pad(
            d.getMonth() + 1
          )}-${pad(d.getDate())}`;
        }
        fleetForm.dataset.editId = c.id;
        window.scrollTo({ top: fleetForm.offsetTop - 20, behavior: "smooth" });
      });
      actions.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-secondary";
      delBtn.style.backgroundColor = "#c62828";
      delBtn.textContent = "🗑️ حذف";
      delBtn.addEventListener("click", async () => {
        if (!confirm("هل أنت متأكد من حذف هذه السيارة؟")) return;
        await deleteDoc(doc(db, "fleet", c.id));
        await loadFleet();
      });
      actions.appendChild(delBtn);
    }

    body.appendChild(row1);
    body.appendChild(row2);
    if (alertsHtml) body.appendChild(row3);
    body.appendChild(actions);

    header.addEventListener("click", () => {
      body.classList.toggle("hidden");
    });

    item.appendChild(header);
    item.appendChild(body);
    fleetList.appendChild(item);
  });
}

async function handleFleetFormSubmit(e) {
  e.preventDefault();
  fleetFormError.textContent = "";
  const session = loadSession();
  if (!session) return;

  if (session.role === "member") {
    fleetFormError.textContent = "ليست لديك صلاحية لإدارة الأسطول.";
    return;
  }

  const carNumber = fleetCarNumberInput.value.trim();
  const plateCode = fleetPlateCodeInput.value.trim();
  const owner = fleetOwnerInput.value.trim();
  const notes = fleetNotesInput.value.trim();
  const licenseEndStr = fleetLicenseEndInput.value;
  const insuranceEndStr = fleetInsuranceEndInput.value;

  if (!carNumber || !plateCode || !owner || !licenseEndStr || !insuranceEndStr) {
    fleetFormError.textContent = "يرجى تعبئة جميع الحقول المطلوبة.";
    return;
  }

  const licenseEndMs = new Date(licenseEndStr + "T00:00:00Z").getTime();
  const insuranceEndMs = new Date(insuranceEndStr + "T00:00:00Z").getTime();

  const fleetCol = collection(db, "fleet");
  const editId = fleetForm.dataset.editId;

  if (editId) {
    const ref = doc(db, "fleet", editId);
    const snap = await getDoc(ref);
   contains(m.carNumber)     if (!snap.exists()) {
      fleetFormError.textContent = "لا يمكن العثور على هذه السيارة.";
      return;
    }
    const existing = snap.data();
    await setDoc(ref, {
      ...existing,
      carNumber,
      plateCode,
      owner,
      notes,
      licenseEnd: licenseEndMs,
      insuranceEnd: insuranceEndMs
    });
    delete fleetForm.dataset.editId;
  } else {
    const ref = doc(fleetCol);
    await setDoc(ref, {
      carNumber,
      plateCode,
      owner,
      notes,
      licenseEnd: licenseEndMs,
      insuranceEnd: insuranceEndMs,
      createdAt: Date.now()
    });
  }

  fleetCarNumberInput.value = "";
  fleetPlateCodeInput.value = "";
  fleetOwnerInput.value = "";
  fleetLicenseEndInput.value = "";
  fleetInsuranceEndInput.value = "";
  fleetNotesInput.value = "";

  await loadFleet();
}

/** البحث */
async function handleSearch(e) {
  e.preventDefault();
  const session = loadSession();
  if (!session) return;

  const qStr = searchQueryInput.value.trim().toLowerCase();
  if (!qStr) {
    searchResultsDiv.innerHTML = "";
    return;
  }

  searchResultsDiv.innerHTML = "جاري البحث...";

  const [usersSnap, movSnap, assSnap, fleetSnap] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "movements")),
    getDocs(collection(db, "assignments")),
    getDocs(collection(db, "fleet"))
  ]);

  let users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  let moves = movSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  let assignments = assSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  let cars = fleetSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (session.role === "member") {
    users = users.filter((u) => u.id === session.userId);
    moves = moves.filter((m) => m.userId === session.userId);
    assignments = assignments.filter((a) => a.userId === session.userId);
    cars = [];
  }

  const contains = (val) =>
    val && val.toString().toLowerCase().includes(qStr);

  const usersRes = users.filter(
    (u) => contains(u.username) || contains(u.phone) || contains(u.role)
  );
  const movesRes = moves.filter(
    (m) =>
  
 ||
      contains(m.plateCode) ||
      contains(m.userName) ||
      contains(m.action) ||
      contains(m.notes)
  );
  const assignmentsRes = assignments.filter(
    (a) =>
      contains(a.carNumber) ||
      contains(a.plateCode) ||
      contains(a.userName) ||
      contains(a.owner) ||
      contains(a.notes)
  );
  const fleetRes = cars.filter(
    (c) =>
      contains(c.carNumber) ||
      contains(c.plateCode) ||
      contains(c.owner) ||
      contains(c.notes)
  );

  searchResultsDiv.innerHTML = "";

  const addSection = (title, items) => {
    const card = document.createElement("div");
    card.className = "card";
    const h = document.createElement("h3");
    h.className = "section-subtitle";
    h.textContent = `${title} (${items.length})`;
    card.appendChild(h);

    if (items.length === 0) {
      const p = document.createElement("p");
      p.textContent = "لا توجد نتائج.";
      card.appendChild(p);
    } else {
      items.forEach((it) => {
        const div = document.createElement("div");
        div.className = "accordion-row";
        div.style.borderBottom = "1px solid #eee";
        div.style.paddingBottom = "4px";
        div.style.marginBottom = "4px";
        div.textContent = JSON.stringify(it);
        card.appendChild(div);
      });
    }
    searchResultsDiv.appendChild(card);
  };

  addSection("الأعضاء", usersRes);
  addSection("التحركات", movesRes);
  addSection("العهدة", assignmentsRes);
  addSection("الأسطول", fleetRes);
}

/** تسجيل الدخول والجلسات */
async function initAuthFlow() {
  await ensureDefaultAdmin();

  const session = loadSession();
  if (session) {
    showAppForUser(session);
  } else {
    showLogin();
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (username.length < 4 || password.length < 6) {
      loginError.textContent =
        "يرجى إدخال اسم مستخدم لا يقل عن 4 أحرف وكلمة مرور لا تقل عن 6.";
      return;
    }

    try {
      const user = await findUserByCredentials(username, password);
========= إعداد ال      if (!user) {
        loginError.textContent = "بيانات الدخول غير صحيحة.";
        return;
      }

      if (user.role === "admin" && user.mustChangePassword) {
        sessionStorage.setItem("pending_admin_id", user.id);
        showAdminForceChange();
      } else {
        saveSession(user);
        showAppForUser({
          id: user.id,
          username: user.username,
          role: user.role,
          phone: user.phone
        });
      }
    } catch (err) {
      console.error(err);
      loginError.textContent = "حدث خطأ أثناء تسجيل الدخول.";
    }
  });

  adminChangeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    adminChangeError.textContent = "";

    const newUsername = document.getElementById("new-admin-username").value.trim();
    const newPassword = document.getElementById("new-admin-password").value.trim();
    const newPhone = document.getElementById("new-admin-phone").value.trim();

    if (newUsername.length < 4) {
      adminChangeError.textContent = "اسم المستخدم يجب ألا يقل عن 4 أحرف.";
      return;
    }
    if (newPassword.length < 6) {
      adminChangeError.textContent = "كلمة المرور يجب ألا تقل عن 6 أحرف/أرقام.";
      return;
    }
    if (!/^\d{10}$/.test(newPhone)) {
      adminChangeError.textContent = "رقم الجوال يجب أن يكون 10 أرقام.";
      return;
    }

    const pendingAdminId = sessionStorage.getItem("pending_admin_id");
    if (!pendingAdminId) {
      adminChangeError.textContent = "خطأ داخلي، أعد تحميل الصفحة.";
      return;
    }

    try {
      await updateAdminCredentials(pendingAdminId, newUsername, newPassword, newPhone);
      sessionStorage.removeItem("pending_admin_id");

      const userRef = doc(db, "users", pendingAdminId);
      const d = await getDoc(userRef);
      const user = { id: userRef.id, ...d.data() };

      saveSession(user);
      showAppForUser({
        id: user.id,
        username: user.username,
        role: user.role,
        phone: user.phone
      });
    } catch (err) {
      console.error(err);
      adminChangeError.textContent = "حدث خطأ أثناء تحديث البيانات.";
    }
  });

  logoutBtn.addEventListener("click", () => {
    clearSession();
    showLogin();
  });
}

/** 
=أحداث ========== */
function initEventListeners() {
  // زر التحديث اليدوي
  if (refreshBtn) {
    refreshBtn.addEventListener("click", manualRefresh);
  }
  
  // البحث العام
  if (globalSearchInput && globalSearchBtn) {
    globalSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleGlobalSearch();
    });
    globalSearchBtn.addEventListener("click", handleGlobalSearch);
  }
  
  // البحث المتقدم
  if (searchBtn) {
    searchBtn.addEventListener("click", handleAdvancedSearch);
  }
  
  // طباعة الكل
  if (movPrintAllBtn) {
    movPrintAllBtn.addEventListener("click", handleMovPrintAll);
  }
}

/** Service Worker */
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  }
}

/** تشغيل */
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initAuthFlow();
  initEventListeners();

  if (userForm) userForm.addEventListener("submit", handleUserFormSubmit);
  if (movForm) movForm.addEventListener("submit", handleMovementFormSubmit);
  if (movPrintReportBtn) movPrintReportBtn.addEventListener("click", handleMovPrintReport);
  if (assForm) assForm.addEventListener("submit", handleAssignmentFormSubmit);
  if (fleetForm) fleetForm.addEventListener("submit", handleFleetFormSubmit);
  if (searchBtn) searchBtn.addEventListener("click", handleSearch);

  registerServiceWorker();
});