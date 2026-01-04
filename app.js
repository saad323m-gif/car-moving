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

// عناصر عامة
const headerDatetime = document.getElementById("header-datetime");
const currentUserInfo = document.getElementById("current-user-info");
const footerYear = document.getElementById("footer-year");
lementById("login-section");
const loginForm = document.const logoutBtn = document.getElementById("logout-btn");
const refreshBtn = document.getElementById("refresh-btn");
const globalSearchSection = document.getElementById("global-search-section");

const loginSection = document.get
EgetElementById("login-form");
const loginError = document.getElementById("login-error");

const adminForceChangeSection = document.getElementById("admin-force-change-section");
const adminChangeForm = document.getElementById("admin-change-form");
const adminChangeError = document.getElementById("admin-change-error");

const appSection = document.getElementById("app-section");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// الأعضاء
const userForm = document.getElementById("user-form");
const userIdInput = document.getElementById("user-id");
const userUser
nameInput = document.getElementById("user-username");
const userPasswordInput = document.getElementById("user-password");
const userRoleInput = document.getElementById("user-role");
const userPhoneInput = document.getElementById("user-phone");
const usersFormError = document.getElementById("users-form-error");
const usersList = document.getElementById("users-list");

// التحركات
const movForm = document.getElementById("movement-form");
const movCarNumberInput = document.getElementById("mov-car-number");
const movPlateCodeInput = document.getElementById("mov-plate-code");
const movUserSelect = document.getElementById("mov-user-select");
const movActionSelect = document.getElementById("mov-action");
const movNotesInput = document
.getElementById("mov-notes");
const movementsFormError = document.getElementById("movements-form-error");
const movementsList = document.getElementById("movements-list");
const movReportRange = document.getElementById("mov-report-range");
const movPrintReportBtn = document.getElementById("mov-print-report");

// العهدة
const assForm = document.getElementById("assignment-form");
ignments-form-error");
const assignmentsList = document.getElementByconst assCarNumberInput = document.getElementById("ass-car-number");
const assPlateCodeInput = document.getElementById("ass-plate-code");
const assUserSelect = document.getElementById("ass-user-select");
const assOwnerInput = document.getElementById("ass-owner");
const assNotesInput = document.getElementById("ass-notes");
const assignmentsFormError = document.getElementById("as
sId("assignments-list");

// الأسطول
const fleetForm = document.getElementById("fleet-form");
const fleetCarNumberInput = document.getElementById("fleet-car-number");
const fleetPlateCodeInput = document.getElementById("fleet-plate-code");
const fleetOwnerInput = document.getElementById("fleet-owner");
const fleetLicenseEndInput = document.getElementById("fleet-license-end");
const fleetInsuranceEndInput = document.getElementById("fleet-insurance-end");
tring();

/** التاريخ والوقت GMT+4 بنظام 12 ساعة */
function upconst fleetNotesInput = document.getElementById("fleet-notes");
const fleetFormError = document.getElementById("fleet-form-error");
const fleetList = document.getElementById("fleet-list");

// البحث
const searchQueryInput = document.getElementById("search-query");
const searchBtn = document.getElementById("search-btn");
const searchResultsDiv = document.getElementById("search-results");

// سنة الفوتر
footerYear.textContent = new Date().getFullYear().to
SdateHeaderDateTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const gmt4 = new Date(utc + 4 * 60 * 60 * 1000);

  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const dayName = days[gmt4.getDay()];

  let hours = gmt4.getHours();
  const minutes = gmt4.getMinutes();
  const ampm = hours >= 12 ? "م" : "ص";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const pad = (n) => n.toString().padStart(2, "0");

  const dateStr = `${gmt4.getFullYear()}-${pad(gmt4.getMonth() + 1)}-${pad(
f (hours === 0) ho    gmt4.getDate()
  )}`;
  const timeStr = `${pad(hours)}:${pad(minutes)} ${ampm}`;

  headerDatetime.textContent = `${dayName} | ${dateStr} | ${timeStr}`;
}
updateHeaderDateTime();
setInterval(updateHeaderDateTime, 30000);

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
  
iurs = 12;

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
 ? "role-admin"
      : session.role === "superv  const raw = localStorage.getItem(SESSION_KEY);
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

/** عرض المستخدم في الهيدر كبادج ملون */
function renderCurrentUserBadge(session) {
  if (!session) {
    currentUserInfo.textContent = "";
    return;
  }
  const roleClass =
    session.role === "admin"
    
 isor"
      ? "role-supervisor"
      : "role-member";

  currentUserInfo.innerHTML = `
    <span class="user-role-badge ${roleClass}">
      <span>${session.username}</span>
      <span>(${session.role})</span>
    </span>
  `;
}

/** الشاشات */
function showLogin() {
  loginSection.classList.remove("hidden");
  adminForceChangeSection.classList.add("hidden");
  appSection.classList.add("hidden");
  logoutBtn.classList.add("hidden");
  globalSearchSection.classList.add("hidden");
  currentUserInfo.textContent = "";
}

function showAdminForceChange() {
  loginSection.classList.add("hidden");
  adminForceChangeSection.classList.remove("hidden");
  appSection.classList.add("hidden");
f (tabFleetBtn) tabFleetBtn.classLis  logoutBtn.classList.add("hidden");
  globalSearchSection.classList.add("hidden");
}

function showAppForUser(session) {
  loginSection.classList.add("hidden");
  adminForceChangeSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
  globalSearchSection.classList.remove("hidden");

  renderCurrentUserBadge(session);

  const tabFleetBtn = document.querySelector('[data-tab="tab-fleet"]');
  const tabUsersBtn = document.querySelector('[data-tab="tab-users"]');
  if (session.role === "member") {
    if (tabFleetBtn) tabFleetBtn.classList.add("hidden");
    if (tabUsersBtn) tabUsersBtn.classList.add("hidden");
  } else {
    
it.remove("hidden");
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
serRef);
  if (!d.exists())      password: "admin123",
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
  const d = await getDoc(
u throw new Error("لا يمكن العثور على حساب المدير.");
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

    con
st opt2 = document.createElement("option");
    opt2.value = user.id;
    opt2.textContent = user.username;
    assUserSelect.appendChild(opt2);
  });

  const emptyOpt1 = document.createElement("option");
  emptyOpt1.value = "";
  emptyOpt1.textContent = "اختر العضو";
  movUserSelect.insertBefore(emptyOpt1, movUserSelect.firstChild);

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
   <span>${user.username}</span>
    `;

    co    const item = document.createElement("div");
    item.className = "accordion-item";

    const header = document.createElement("div");
    header.className = "accordion-header";

    const title = document.createElement("div");
    title.className = "accordion-title";
    title.textContent = `${user.username} (${user.role})`;

    const meta = document.createElement("div");
    meta.className = "accordion-meta";
    meta.textContent = user.phone ? `جوال: ${user.phone}` : "";

    header.appendChild(title);
    header.appendChild(meta);

    const body = document.createElement("div");
    body.className = "accordion-body hidden";

    const row1 = document.createElement("div");
    row1.className = "accordion-row";
    row1.innerHTML = `
      <span class="accordion-label">اسم المستخدم:</span>
  
 nst row2 = document.createElement("div");
    row2.className = "accordion-row";
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
body.appendChild(actions);

    head        userIdInput.value = user.id;
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
   
 er.addEventListener("click", () => {
      body.classList.toggle("hidden");
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
  const phoneRaw = userPhoneInput.value.trim();

  const normalizedPhone = phoneRaw.replace(/\D/g, "");

  if (username.length < 4) {
    usersFormError.textContent = "اسم المستخدم يجب ألا يقل عن 4 أحرف.";
    return;
  }
  if (password.length < 6) {
    usersFormError.textContent = "كلمة المرور يجب ألا تقل عن 6 أحرف/أرقام.";
    return;
  }
  if (normalizedPhone.length !== 10) {
    usersFormError.textContent = "رقم الجوال يجب أن يكون 10 أرقام.";
hone
    })    return;
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
      password,
      role,
      phone: normalized
P;
  } else {
    const ref = doc(usersCol);
    await setDoc(ref, {
      username,
      password,
      role,
      phone: normalizedPhone,
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

/** طباعة حركة واحدة بتقرير منسق */
function printSingleMovement(m) {
  const w = window.open("", "_blank");
><td>${m.notes |  const html = `
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>بيان حركة سيارة</title>
        <style>
          body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; direction: rtl; padding: 16px; }
          ${document.querySelector("style#print-styles")?.textContent || ""}
        </style>
      </head>
      <body>
        <div class="print-header">
          <img src="logo.png" class="print-logo" alt="AL MASAOOD" />
          <h1 class="print-title">بيان حركة سيارة</h1>
          <p class="print-subtitle">نظام إدارة وتسجيل حركة السيارات المتكامل - AL MASAOOD</p>
        </div>
        <table class="print-table">
          <tr><th>رقم السيارة</th><td>${m.carNumber || "-"}</td></tr>
          <tr><th>كود اللوحة</th><td>${m.plateCode || "-"}</td></tr>
          <tr><th>السائق</th><td>${m.userName || "-"}</td></tr>
          <tr><th>نوع الحركة</th><td>${m.action || "-"}</td></tr>
          <tr><th>الملاحظات</t
h| "-"}</td></tr>
          <tr><th>التاريخ</th><td>${formatTimestampMs(m.createdAt) || "-"}</td></tr>
        </table>
        <div class="print-footer">
          AL MASAOOD - المسعود | تم إنشاء التقرير من النظام
        </div>
      </body>
    </html>
  `;
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}

function renderMovementsList(moves) {
  const session = loadSession();
  movementsList.innerHTML = "";
  moves.forEach((m) => {
    const item = document.createElement("div");
    item.className = "accordion-item";

    const header = document.createElement("div");
    header.className = "accordion-header";

    const title = document.createElement("div");
    title.className = "accordion-title";
    // رقم السيارة + اللوحة + اسم السائق لسهولة القراءة
    title.textContent = `${m.carNumber || ""} - ${m.plateCode || ""} | ${
      m.userName || ""
    } (${m.action})`;

    const meta = document.createElement("div");
    meta.className = "accordion-meta";
    meta.textContent = formatTimestampMs(m.createdAt);

    header.appendChild(title);
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
    shareBtn.className = "btn btn-se
condary";
    shareBtn.textContent = "مشاركة";
    shareBtn.addEventListener("click", () => {
      // مشاركة بنص منسق وواضح
      const text = `
[بيان حركة سيارة - AL MASAOOD]

رقم السيارة: ${m.carNumber}
كود اللوحة: ${m.plateCode}
السائق: ${m.userName}
نوع الحركة: ${m.action}
الملاحظات: ${m.notes || "-"}
التاريخ: ${formatTimestampMs(m.createdAt)}

(تم إنشاء هذا البيان من نظام إدارة حركة السيارات التابع للمسعود)
      `.trim();
      if (navigator.share) {
        navigator.share({ text }).catch(() => {});
      } else {
        alert(text);
      }
    });
    actions.appendChild(shareBtn);

    const printBtn = document.createElement("button");
    printBtn.className = "btn btn-secondary";
    printBtn.textContent = "طباعة";
    printBtn.addEventListener("click", () => {
      printSingleMovement(m);
    });
    actions.appendChild(printBtn);

    const sessionRole = session.role;
    const canEdit =
      sessionRole === "admin" ||
      sessionRole === "supervisor" ||
      (sessionRole === "member" && m.userId === session.userId);
    const canDelete = sessionRole === "admin" || sessionRole === "supervisor";
   actions.appendChild(delBtn);
    }

    body.appendChild(row1);
       const within24h = Date.now() - m.createdAt <= 24 * 60 * 60 * 1000;

    if (canEdit && (sessionRole !== "member" || within24h)) {
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-secondary";
      editBtn.textContent = "تعديل";
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
      delBtn.textContent = "حذف";
      delBtn.addEventListener("click", async () => {
        if (!confirm("هل أنت متأكد من حذف هذه الحركة؟")) return;
        await deleteDoc(doc(db, "movements", m.id));
        await loadMovements();
      });
  
  body.appendChild(row2);
    if (editInfo) body.appendChild(row3);
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
    const ref = doc(movesCol);
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

/** طباعة تقرير التحركات */
async function handleMovPrintReport
(e) {
  e.preventDefault();
  const session = loadSession();
  if (!session) return;

  const range = movReportRange.value;
  const movesCol = collection(db, "movements");
  const snap = await getDocs(query(movesCol, orderBy("createdAt", "desc")));
  let moves = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (session.role === "member") {
    moves = moves.filter((m) => m.userId === session.userId);
  }

  const now = Date.now();
  let fromTime = 0;
  if (range === "day") fromTime = now - 24 * 60 * 60 * 1000;
  else if (range === "week") fromTime = now - 7 * 24 * 60 * 60 * 1000;
  else if (range === "month") fromTime = now - 30 * 24 * 60 * 60 * 1000;
  else if (range === "year") fromTime = now - 365 * 24 * 60 * 60 * 1000;

  if (range !== "all") {
    moves = moves.filter((m) => m.createdAt >= fromTime);
  }

  const w = window.open("", "_blank");
  const rowsHtml = moves
    .map(
      (m) => `
      <tr>
        <td>${m.carNumber || "-"}</td>
        <td>${m.plateCode || "-"}</td>
        <td>${m.userName || "-"}</td>
        <td>${m.action || "-"}</td>
        <td>${m.notes || "-"}</td>
        <td>${formatTimestampMs(m.createdAt) || "-"}</td>
      </tr>
    `
    )
    .join("");

  const html = `
document.close();
  w.focus();    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>تقرير التحركات</title>
        <style>
          body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; direction: rtl; padding: 16px; }
          ${document.querySelector("style#print-styles")?.textContent || ""}
        </style>
      </head>
      <body>
        <div class="print-header">
          <img src="logo.png" class="print-logo" alt="AL MASAOOD" />
          <h1 class="print-title">تقرير التحركات</h1>
          <p class="print-subtitle">نظام إدارة وتسجيل حركة السيارات المتكامل - AL MASAOOD</p>
        </div>
        <table class="print-table">
          <thead>
            <tr>
              <th>رقم السيارة</th>
              <th>كود اللوحة</th>
              <th>السائق</th>
              <th>الحركة</th>
              <th>الملاحظات</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="6">لا توجد بيانات</td></tr>'}
          </tbody>
        </table>
        <div class="print-footer">
          AL MASAOOD - المسعود | تم إنشاء التقرير من النظام
        </div>
      </body>
    </html>
  `;
  w.document.write(html);
  w
.
  w.print();
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

/** طباعة عهدة واحدة */
function printSingleAssignment(a) {
  const w = window.open("", "_blank");
  const html = `
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>بيان عهدة سيارة</title>
        <style>
          body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; direction: rtl; padding: 16px; }
          ${document.querySelector("style#print-styles")?.textContent || ""}
        </style>
      </head>
      <body>
        <div class="print-header">
          <img src="logo.png" class="print-logo" alt="AL MASAOOD" />
          <h1 class="print-title">بيان عهدة سيارة</h1>
          <p class="print-subtitle">نظام إدارة وتسجيل حركة السيارات المتكامل - AL MASAOOD</p>
        </div>
        <table class="print-table">
          <tr><th>رقم السيارة</th><td>${a.carNumber || "-"}</td></tr>
 `${g.items.length} سيارة`;

    header.appendChild(title);
    head          <tr><th>كود اللوحة</th><td>${a.plateCode || "-"}</td></tr>
          <tr><th>العضو</th><td>${a.userName || "-"}</td></tr>
          <tr><th>المالك</th><td>${a.owner || "-"}</td></tr>
          <tr><th>الملاحظات</th><td>${a.notes || "-"}</td></tr>
        </table>
        <div class="print-footer">
          AL MASAOOD - المسعود | تم إنشاء التقرير من النظام
        </div>
      </body>
    </html>
  `;
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
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
    header.className = "accordion-header";

    const title = document.createElement("div");
    title.className = "accordion-title";
    title.textContent = `عهدة: ${g.userName}`;

    const meta = document.createElement("div");
    meta.className = "accordion-meta";
    meta.textContent 
=er.appendChild(meta);

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
      shareBtn.textContent = "مشاركة";
      shareBtn.addEventListener("click", () => {
        const text = `
[بيان عهدة سيارة - AL MASAOOD]

السيارة: ${a.carNumber}
اللوحة: ${a.plateCode}
العضو: ${a.userName}
المالك: ${a.owner}
الملاحظات: ${a.notes || "-"}

(تم إنشاء هذا البيان من نظام إدارة حركة السيارات التابع للمسعود)
        `.trim();
        if (navigator.share) {
          navigator.share({ text }).catch(() => {});
        } else {
          alert(text);
        }
      });
      actions.appendChild(shareBtn);

      const printBtn = document.createElement("button");
    }

      body.appendChild(row);
      body.      printBtn.className = "btn btn-secondary";
      printBtn.textContent = "طباعة";
      printBtn.addEventListener("click", () => {
        printSingleAssignment(a);
      });
      actions.appendChild(printBtn);

      const sessionRole = session.role;
      const canManage = sessionRole === "admin" || sessionRole === "supervisor";
      if (canManage) {
        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-secondary";
        editBtn.textContent = "تعديل";
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
        delBtn.textContent = "حذف";
        delBtn.addEventListener("click", async () => {
          if (!confirm("هل أنت متأكد من حذف هذه العهدة؟")) return;
          await deleteDoc(doc(db, "assignments", a.id));
          await loadAssignments();
        });
        actions.appendChild(delBtn);
 
 appendChild(notesRow);
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
  const session = loadSession();
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
 <body>
        <d      ...existing,
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

/** طباعة سيارة واحدة من الأسطول */
function printSingleCar(c) {
  const w = window.open("", "_blank");
  const licenseDateStr = c.licenseEnd ? formatTimestampMs(c.licenseEnd).split(" ")[0] : "-";
  const insuranceDateStr = c.insuranceEnd ? formatTimestampMs(c.insuranceEnd).split(" ")[0] : "-";

  const html = `
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>بيان سيارة من الأسطول</title>
        <style>
          body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; direction: rtl; padding: 16px; }
          ${document.querySelector("style#print-styles")?.textContent || ""}
        </style>
      </head>
    
 iv class="print-header">
          <img src="logo.png" class="print-logo" alt="AL MASAOOD" />
          <h1 class="print-title">بيان سيارة من الأسطول</h1>
          <p class="print-subtitle">نظام إدارة وتسجيل حركة السيارات المتكامل - AL MASAOOD</p>
        </div>
        <table class="print-table">
          <tr><th>رقم السيارة</th><td>${c.carNumber || "-"}</td></tr>
          <tr><th>كود اللوحة</th><td>${c.plateCode || "-"}</td></tr>
          <tr><th>المالك</th><td>${c.owner || "-"}</td></tr>
          <tr><th>نهاية الترخيص</th><td>${licenseDateStr}</td></tr>
          <tr><th>نهاية التأمين</th><td>${insuranceDateStr}</td></tr>
          <tr><th>الملاحظات</th><td>${c.notes || "-"}</td></tr>
        </table>
        <div class="print-footer">
          AL MASAOOD - المسعود | تم إنشاء التقرير من النظام
        </div>
      </body>
    </html>
  `;
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}

function renderFleetList(cars) {
  const today = new Date();
  const todayMs = today.getTime();
  const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;

  fleetList.innerHTML = "";
  cars.forEach((c) => {
    const item = document.createElement("div");
    item.className = "accordion-item";

    const header = document.createElement("div");
    header.className = "accordion-header";

    const title = document.createElement("div");
    title.className = "accordion-title";
    title.textContent = `${c.carNumber} - ${c.plateCode}`;

    const meta = document.createElement("div");
  const shareBtn = document.createElem    meta.className = "accordion-meta";

    const licenseDateStr = c.licenseEnd ? formatTimestampMs(c.licenseEnd).split(" ")[0] : "-";
    const insuranceDateStr = c.insuranceEnd
      ? formatTimestampMs(c.insuranceEnd).split(" ")[0]
      : "-";

    meta.innerHTML = `ترخيص: ${licenseDateStr} | تأمين: ${insuranceDateStr}`;

    header.appendChild(title);
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
      alertsHtml += `<span class="badge-warning">تنبيه: ترخيص ينتهي خلال 15 يوم</span>`;
    }
    if (c.insuranceEnd && c.insuranceEnd - todayMs <= fifteenDaysMs && c.insuranceEnd >= todayMs) {
      alertsHtml += `<span class="badge-warning">تنبيه: تأمين ينتهي خلال 15 يوم</span>`;
    }
    row3.innerHTML = alertsHtml;

    const actions = document.createElement("div");
    actions.className = "accordion-actions";

 
 ent("button");
    shareBtn.className = "btn btn-secondary";
    shareBtn.textContent = "مشاركة";
    shareBtn.addEventListener("click", () => {
      const text = `
[بيان سيارة من الأسطول - AL MASAOOD]

السيارة: ${c.carNumber}
اللوحة: ${c.plateCode}
المالك: ${c.owner}
نهاية الترخيص: ${licenseDateStr}
نهاية التأمين: ${insuranceDateStr}
الملاحظات: ${c.notes || "-"}

(تم إنشاء هذا البيان من نظام إدارة حركة السيارات التابع للمسعود)
      `.trim();
      if (navigator.share) {
        navigator.share({ text }).catch(() => {});
      } else {
        alert(text);
      }
    });
    actions.appendChild(shareBtn);

    const printBtn = document.createElement("button");
    printBtn.className = "btn btn-secondary";
    printBtn.textContent = "طباعة";
    printBtn.addEventListener("click", () => {
      printSingleCar(c);
    });
    actions.appendChild(printBtn);

    const session = loadSession();
    const canManage = session.role === "admin" || session.role === "supervisor";
    if (canManage) {
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-secondary";
      editBtn.textContent = "تعديل";
      editBtn.addEventListener("click", () => {
        fleetCarNumberInput.value = c.carNumber;
        fleetPlateCodeInput.value = c.plateCode;
        fleetOwnerInput.value = c.owner;
        fleetNotesInput.value = c.notes || "";
        if (c.licenseEnd) {
          const d = new Date(c.licenseEnd);
          const pad = (n) => n.toString().padStart(2, "0");
          fleetLicenseEndInput.value = `${d.getFullYear()}-${pad(
rNumberInput.value.trim();
             d.getMonth() + 1
          )}-${pad(d.getDate())}`;
        }
        if (c.insuranceEnd) {
          const d = new Date(c.insuranceEnd);
          const pad = (n) => n.toString().padStart(2, "0");
          fleetInsuranceEndInput.value = `${d.getFullYear()}-${pad(
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
      delBtn.textContent = "حذف";
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

  const carNumber = fleetC
a const plateCode = fleetPlateCodeInput.value.trim();
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
    if (!snap.exists()) {
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
eetRes = cars.filter(  e.preventDefault();
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

  const contains = (val) => val && val.toString().toLowerCase().includes(qStr);

  const usersRes = users.filter(
    (u) => contains(u.username) || contains(u.phone) || contains(u.role)
  );
  const movesRes = moves.filter(
    (m) =>
      contains(m.carNumber) ||
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
  const f
l
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
e.getItem("pending_admin_id");      loginError.textContent =
        "يرجى إدخال اسم مستخدم لا يقل عن 4 أحرف وكلمة مرور لا تقل عن 6.";
      return;
    }

    try {
      const user = await findUserByCredentials(username, password);
      if (!user) {
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
    const newPhoneRaw = document.getElementById("new-admin-phone").value.trim();

    const normalizedNewPhone = newPhoneRaw.replace(/\D/g, "");

    if (newUsername.length < 4) {
      adminChangeError.textContent = "اسم المستخدم يجب ألا يقل عن 4 أحرف.";
      return;
    }
    if (newPassword.length < 6) {
      adminChangeError.textContent = "كلمة المرور يجب ألا تقل عن 6 أحرف/أرقام.";
      return;
    }
    if (normalizedNewPhone.length !== 10) {
      adminChangeError.textContent = "رقم الجوال يجب أن يكون 10 أرقام.";
      return;
    }

    const pendingAdminId = sessionStora
g
    if (!pendingAdminId) {
      adminChangeError.textContent = "خطأ داخلي، أعد تحميل الصفحة.";
      return;
    }

    try {
      await updateAdminCredentials(
        pendingAdminId,
        newUsername,
        newPassword,
        normalizedNewPhone
      );
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
  // ستايل الطباعة كـ <style> في الدوكيومنت ليتم نسخها للتقارير
  const printStyleTag = document.createElement("style");
  printStyleTag.id = "print-styles";
  printStyleTag.textContent = `
    .print-header {
      text-align: center;
      margin-bottom: 16px;
    }
    .print-logo {
      height: 64px;
      display: block;
      margin: 0 auto 8px auto;
      opacity: 0.9;
    }
    .print-title {
      font-size: 1.1rem;
      margin: 0;
      font-weight: 700;
    }
    .print-subtitle {
      font-size: 0.9rem;
      margin: 4px 0 0 0;
    }
    .print-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    .print-table th,
    .print-table td {
      border: 1px solid #ccc;
      padding: 6px 8px;
      text-align: center;
    }
    .print-footer {
      margin-top: 16px;
      font-size: 0.8rem;
      text-align: center;
      color: #555;
      opacity: 0.9;
    }
  `;
  document.head.appendChild(printStyleTag);

  initTabs();
  initAuthFlow();

  if (userForm) userForm.addEventListener("submit", handleUserFormSubmit);
  if (movForm) movForm.addEventListener("submit", handleMovementFormSubmit);
  if (movPrintReportBtn) movPrintReportBtn.addEventListener("click", handleMovPrintReport);
  if (assForm) assForm.addEventListener("submit", handleAssignmentFormSubmit);
  if (fleetForm) fleetForm.addEventListener("submit", handleFleetFormSubmit);
  if (searchBtn) searchBtn.addEventListener("click", handleSearch);

  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      // تحديث يدوي للصفحة
      window.location.reload();
    });
  }

  registerServiceWorker();
});