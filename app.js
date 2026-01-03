// استيراد Firebase من CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-qlIfpFyam5UgjxzhwAEhkttIQCBZXUw",
  authDomain: "carmanagement-79bfb.firebaseapp.com",
  projectId: "carmanagement-79bfb",
  storageBucket: "carmanagement-79bfb.firebasestorage.app",
  messagingSenderId: "313516916430",
  appId: "1:313516916430:web:6f2c20740bced9e7211a9f"
};

// تهيئة Firebase و Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ثوابت الجلسة
const SESSION_KEY = "car_mgmt_session";
const SESSION_DURATION_DAYS = 30;

// عناصر عامة
const headerDatetime = document.getElementById("header-datetime");
const footerYear = document.getElementById("footer-year");
const logoutBtn = document.getElementById("logout-btn");
const manualRefreshBtn = document.getElementById("manual-refresh-btn");

const currentUserBadge = document.getElementById("current-user-badge");
const currentUserNameSpan = document.getElementById("current-user-name");
const currentUserRoleSpan = document.getElementById("current-user-role");

const globalSearchBar = document.getElementById("global-search-bar");
const globalSearchInput = document.getElementById("global-search-input");
const globalSearchBtn = document.getElementById("global-search-btn");

const dashboardSummary = document.getElementById("dashboard-summary");
const summaryFleetCount = document.getElementById("summary-fleet-count");
const summaryMovementsToday = document.getElementById("summary-movements-today");
const summaryAlertsCount = document.getElementById("summary-alerts-count");
const summaryUsersCount = document.getElementById("summary-users-count");
const summaryAssignmentsCount = document.getElementById("summary-assignments-count");

const loginSection = document.getElementById("login-section");
const loginForm = document.getElementById("login-form");
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
const userUsernameInput = document.getElementById("user-username");
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
const movNotesInput = document.getElementById("mov-notes");
const movementsFormError = document.getElementById("movements-form-error");
const movementsList = document.getElementById("movements-list");
const movReportRange = document.getElementById("mov-report-range");
const movPrintReportBtn = document.getElementById("mov-print-report");

// العهدة
const assForm = document.getElementById("assignment-form");
const assCarNumberInput = document.getElementById("ass-car-number");
const assPlateCodeInput = document.getElementById("ass-plate-code");
const assUserSelect = document.getElementById("ass-user-select");
const assOwnerInput = document.getElementById("ass-owner");
const assNotesInput = document.getElementById("ass-notes");
const assignmentsFormError = document.getElementById("assignments-form-error");
const assignmentsList = document.getElementById("assignments-list");

// الأسطول
const fleetForm = document.getElementById("fleet-form");
const fleetCarNumberInput = document.getElementById("fleet-car-number");
const fleetPlateCodeInput = document.getElementById("fleet-plate-code");
const fleetOwnerInput = document.getElementById("fleet-owner");
const fleetLicenseEndInput = document.getElementById("fleet-license-end");
const fleetInsuranceEndInput = document.getElementById("fleet-insurance-end");
const fleetNotesInput = document.getElementById("fleet-notes");
const fleetFormError = document.getElementById("fleet-form-error");
const fleetList = document.getElementById("fleet-list");
const fleetFilterSelect = document.getElementById("fleet-filter");

// البحث
const searchResultsDiv = document.getElementById("search-results");

// سنة الفوتر
footerYear.textContent = new Date().getFullYear().toString();

/** التاريخ والوقت GMT+4 بنظام 12 ساعة */
function updateHeaderDateTime() {
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

  const dateStr = `${gmt4.getFullYear()}-${pad(gmt4.getMonth() + 1)}-${pad(gmt4.getDate())}`;
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
  if (hours === 0) hours = 12;

  const pad = (n) => n.toString().padStart(2, "0");
  const dateStr = `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(
    local.getDate()
  )}`;
  const timeStr = `${pad(hours)}:${pad(minutes)} ${ampm}`;

  return `${dateStr} ${timeStr}`;
}

/** تنظيف رقم الجوال إلى أرقام فقط */
function normalizePhone(phoneRaw) {
  if (!phoneRaw) return "";
  const digits = phoneRaw.replace(/\D/g, "");
  return digits;
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
  logoutBtn.classList.add("hidden");
  currentUserBadge.classList.add("hidden");
  globalSearchBar.classList.add("hidden");
  dashboardSummary.classList.add("hidden");
}

function showAdminForceChange() {
  loginSection.classList.add("hidden");
  adminForceChangeSection.classList.remove("hidden");
  appSection.classList.add("hidden");
  logoutBtn.classList.add("hidden");
  currentUserBadge.classList.add("hidden");
  globalSearchBar.classList.add("hidden");
  dashboardSummary.classList.add("hidden");
}

function showAppForUser(session) {
  loginSection.classList.add("hidden");
  adminForceChangeSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
  globalSearchBar.classList.remove("hidden");
  dashboardSummary.classList.remove("hidden");

  currentUserBadge.classList.remove("hidden");
  currentUserNameSpan.textContent = session.username;
  currentUserRoleSpan.textContent =
    session.role === "admin" ? "مدير" : session.role === "supervisor" ? "مشرف" : "عضو";
  currentUserRoleSpan.classList.remove("role-admin", "role-supervisor", "role-member");
  if (session.role === "admin") currentUserRoleSpan.classList.add("role-admin");
  else if (session.role === "supervisor")
    currentUserRoleSpan.classList.add("role-supervisor");
  else currentUserRoleSpan.classList.add("role-member");

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
  refreshAllData();
}

/** تأكيد وجود مدير افتراضي */
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
async function updateAdminCredentials(userId, newUsername, newPassword, newPhoneRaw) {
  const userRef = doc(db, "users", userId);
  const d = await getDoc(userRef);
  if (!d.exists()) throw new Error("لا يمكن العثور على حساب المدير.");
  const data = d.data();
  if (data.role !== "admin") throw new Error("هذا المستخدم ليس مديرًا.");

  const phoneDigits = normalizePhone(newPhoneRaw);
  await setDoc(userRef, {
    ...data,
    username: newUsername,
    password: newPassword,
    phone: phoneDigits,
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

function activateTab(tabId) {
  tabButtons.forEach((b) => {
    if (b.getAttribute("data-tab") === tabId) b.classList.add("active");
    else b.classList.remove("active");
  });
  tabContents.forEach((c) => {
    if (c.id === tabId) c.classList.add("active");
    else c.classList.remove("active");
  });
}

/** بيانات مخزنة في الذاكرة */
let cachedUsers = [];
let cachedMovements = [];
let cachedAssignments = [];
let cachedFleet = [];

/** تحديث لوحة الملخصات */
function updateDashboardStats() {
  const session = loadSession();
  if (!session) return;

  let users = cachedUsers.slice();
  let moves = cachedMovements.slice();
  let assignments = cachedAssignments.slice();
  let cars = cachedFleet.slice();

  if (session.role === "member") {
    users = users.filter((u) => u.id === session.userId);
    moves = moves.filter((m) => m.userId === session.userId);
    assignments = assignments.filter((a) => a.userId === session.userId);
  }

  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const gmt4 = new Date(utc + 4 * 60 * 60 * 1000);
  const todayStr = gmt4.toISOString().slice(0, 10);

  const movementsToday = moves.filter((m) => {
    const d = new Date(m.createdAt || 0);
    const dUtc = d.getTime() + d.getTimezoneOffset() * 60000;
    const dLocal = new Date(dUtc + 4 * 60 * 60 * 1000);
    return dLocal.toISOString().slice(0, 10) === todayStr;
  });

  const todayMs = gmt4.getTime();
  const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;
  const alertCars = cars.filter((c) => {
    const licSoon =
      c.licenseEnd && c.licenseEnd - todayMs <= fifteenDaysMs && c.licenseEnd >= todayMs;
    const insSoon =
      c.insuranceEnd &&
      c.insuranceEnd - todayMs <= fifteenDaysMs &&
      c.insuranceEnd >= todayMs;
    return licSoon || insSoon;
  });

  summaryFleetCount.textContent = cars.length.toString();
  summaryMovementsToday.textContent = movementsToday.length.toString();
  summaryAlertsCount.textContent = alertCars.length.toString();
  summaryUsersCount.textContent = users.length.toString();
  summaryAssignmentsCount.textContent = assignments.length.toString();
}

/** الأعضاء */
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
    const item = document.createElement("div");
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
      <span>${user.username}</span>
    `;

    const row2 = document.createElement("div");
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
        await refreshAllData();
      });
      actions.appendChild(delBtn);
    }

    const printBtn = document.createElement("button");
    printBtn.className = "btn btn-secondary";
    printBtn.textContent = "طباعة";
    printBtn.addEventListener("click", () => {
      printUserRecord(user);
    });
    actions.appendChild(printBtn);

    body.appendChild(row1);
    body.appendChild(row2);
    body.appendChild(row3);
    body.appendChild(actions);

    header.addEventListener("click", () => {
      body.classList.toggle("hidden");
    });

    item.appendChild(header);
    item.appendChild(body);
    usersList.appendChild(item);
  });

  updateDashboardStats();
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
  const phoneDigits = normalizePhone(phoneRaw);

  if (username.length < 4) {
    usersFormError.textContent = "اسم المستخدم يجب ألا يقل عن 4 أحرف.";
    return;
  }
  if (password.length < 6) {
    usersFormError.textContent = "كلمة المرور يجب ألا تقل عن 6 أحرف/أرقام.";
    return;
  }
  if (phoneDigits.length !== 10) {
    usersFormError.textContent = "رقم الجوال يجب أن يتكون من 10 أرقام.";
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
      password,
      role,
      phone: phoneDigits
    });
  } else {
    const ref = doc(usersCol);
    await setDoc(ref, {
      username,
      password,
      role,
      phone: phoneDigits,
      mustChangePassword: false,
      createdAt: Date.now()
    });
  }

  userIdInput.value = "";
  userUsernameInput.value = "";
  userPasswordInput.value = "";
  userPhoneInput.value = "";
  userRoleInput.value = "member";

  await refreshAllData();
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

  cachedMovements = moves;
  renderMovementsList();
}

function renderMovementsList() {
  const moves = cachedMovements;
  movementsList.innerHTML = "";

  moves.forEach((m) => {
    const item = document.createElement("div");
    item.className = "movement-item";

    const headerLine = document.createElement("div");
    headerLine.className = "movement-header-line";

    const left = document.createElement("div");
    left.className = "movement-left";

    const actionBadge = document.createElement("span");
    actionBadge.className = "movement-action-badge";
    if (m.action === "استلام") actionBadge.classList.add("movement-action-receive");
    else actionBadge.classList.add("movement-action-deliver");
    actionBadge.textContent = m.action || "";

    const carSpan = document.createElement("span");
    carSpan.className = "movement-car";
    carSpan.textContent = `${m.carNumber || ""} 🚗`;

    const userSpan = document.createElement("span");
    userSpan.className = "movement-user";
    userSpan.textContent = m.userName ? `(${m.userName})` : "";

    left.appendChild(actionBadge);
    left.appendChild(carSpan);
    left.appendChild(userSpan);

    const right = document.createElement("div");
    right.textContent = m.plateCode || "";

    headerLine.appendChild(left);
    headerLine.appendChild(right);

    const metaLine = document.createElement("div");
    metaLine.className = "movement-meta-line";
    metaLine.innerHTML = `
      <span>${formatTimestampMs(m.createdAt)}</span>
      <span>رقم الحركة: ${m.id}</span>
    `;

    const notesDiv = document.createElement("div");
    notesDiv.className = "movement-notes";
    const notesText = m.notes && m.notes.trim() ? m.notes : "-";
    notesDiv.textContent = `ملاحظات: ${notesText}`;

    const actions = document.createElement("div");
    actions.className = "movement-actions";

    const shareBtn = document.createElement("button");
    shareBtn.className = "btn btn-secondary";
    shareBtn.textContent = "مشاركة";
    shareBtn.addEventListener("click", () => {
      const text = `
${m.action} - ${m.userName}
السيارة: ${m.carNumber} (${m.plateCode})
الملاحظات: ${notesText}
التاريخ: ${formatTimestampMs(m.createdAt)}
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
      printMovementRecord(m);
    });
    actions.appendChild(printBtn);

    const session = loadSession();
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
        await refreshAllData();
      });
      actions.appendChild(delBtn);
    }

    if (m.edited) {
      const badge = document.createElement("div");
      badge.className = "badge-warning";
      badge.textContent = `تم التعديل - الملاحظات الأصلية: ${m.originalNotes || "-"}`;
      actions.appendChild(badge);
    }

    item.appendChild(headerLine);
    item.appendChild(metaLine);
    item.appendChild(notesDiv);
    item.appendChild(actions);

    movementsList.appendChild(item);
  });

  updateDashboardStats();
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

  await refreshAllData();
}

async function handleMovPrintReport(e) {
  e.preventDefault();
  const session = loadSession();
  if (!session) return;

  const range = movReportRange.value;
  let moves = cachedMovements.slice();

  const now = Date.now();
  let fromTime = 0;
  if (range === "day") fromTime = now - 24 * 60 * 60 * 1000;
  else if (range === "week") fromTime = now - 7 * 24 * 60 * 60 * 1000;
  else if (range === "month") fromTime = now - 30 * 24 * 60 * 60 * 1000;
  else if (range === "year") fromTime = now - 365 * 24 * 60 * 60 * 1000;

  if (range !== "all") {
    moves = moves.filter((m) => m.createdAt >= fromTime);
  }

  printMovementsReport(moves);
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

  cachedAssignments = assignments;
  renderAssignmentsList();
}

function renderAssignmentsList() {
  const session = loadSession();
  const assignments = cachedAssignments;
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
    meta.textContent = `${g.items.length} سيارة`;

    header.appendChild(title);
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
      shareBtn.textContent = "مشاركة";
      shareBtn.addEventListener("click", () => {
        const text = `
عهدة سيارة
السيارة: ${a.carNumber}
اللوحة: ${a.plateCode}
العضو: ${a.userName}
المالك: ${a.owner}
الملاحظات: ${a.notes || "-"}
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
        printAssignmentRecord(a);
      });
      actions.appendChild(printBtn);

      const canManage = session.role === "admin" || session.role === "supervisor";
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
          await refreshAllData();
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

  updateDashboardStats();
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

  await refreshAllData();
}

/** الأسطول */
async function loadFleet() {
  const session = loadSession();
  if (!session) return;
  const fleetCol = collection(db, "fleet");
  const snap = await getDocs(fleetCol);
  let cars = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  cachedFleet = cars;
  renderFleetList();
}

function renderFleetList() {
  const filter = fleetFilterSelect.value;
  const today = new Date();
  const todayMs = today.getTime();
  const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;

  let cars = cachedFleet.slice();

  if (filter === "alert") {
    cars = cars.filter((c) => {
      const licSoon =
        c.licenseEnd && c.licenseEnd - todayMs <= fifteenDaysMs && c.licenseEnd >= todayMs;
      const insSoon =
        c.insuranceEnd &&
        c.insuranceEnd - todayMs <= fifteenDaysMs &&
        c.insuranceEnd >= todayMs;
      return licSoon || insSoon;
    });
  } else if (filter === "expired") {
    cars = cars.filter((c) => {
      const licExpired = c.licenseEnd && c.licenseEnd < todayMs;
      const insExpired = c.insuranceEnd && c.insuranceEnd < todayMs;
      return licExpired || insExpired;
    });
  }

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
    meta.className = "accordion-meta";

    const licenseDateStr = c.licenseEnd ? formatTimestampMs(c.licenseEnd).split(" ")[0] : "-";
    const insuranceDateStr = c.insuranceEnd ? formatTimestampMs(c.insuranceEnd).split(" ")[0] : "-";

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
    const licSoon =
      c.licenseEnd && c.licenseEnd - todayMs <= fifteenDaysMs && c.licenseEnd >= todayMs;
    const insSoon =
      c.insuranceEnd &&
      c.insuranceEnd - todayMs <= fifteenDaysMs &&
      c.insuranceEnd >= todayMs;
    if (licSoon) {
      alertsHtml += `<span class="badge-warning">تنبيه: ترخيص ينتهي خلال 15 يوم</span>`;
    }
    if (insSoon) {
      alertsHtml += `<span class="badge-warning">تنبيه: تأمين ينتهي خلال 15 يوم</span>`;
    }
    row3.innerHTML = alertsHtml;

    if (licSoon || insSoon) {
      item.classList.add("fleet-alert");
    }

    const actions = document.createElement("div");
    actions.className = "accordion-actions";

    const shareBtn = document.createElement("button");
    shareBtn.className = "btn btn-secondary";
    shareBtn.textContent = "مشاركة";
    shareBtn.addEventListener("click", () => {
      const text = `
السيارة: ${c.carNumber}
اللوحة: ${c.plateCode}
المالك: ${c.owner}
نهاية الترخيص: ${licenseDateStr}
نهاية التأمين: ${insuranceDateStr}
الملاحظات: ${c.notes || "-"}
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
      printFleetRecord(c);
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
        await refreshAllData();
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

  updateDashboardStats();
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

  await refreshAllData();
}

/** البحث (شريط علوي + تبويب نتائج) */
async function performSearch() {
  const session = loadSession();
  if (!session) return;

  const qStr = globalSearchInput.value.trim().toLowerCase();
  if (!qStr) {
    searchResultsDiv.innerHTML = "";
    return;
  }

  // نستخدم البيانات المخبأة بدل طلب جديد
  let users = cachedUsers.slice();
  let moves = cachedMovements.slice();
  let assignments = cachedAssignments.slice();
  let cars = cachedFleet.slice();

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
  const fleetRes = cars.filter(
    (c) =>
      contains(c.carNumber) ||
      contains(c.plateCode) ||
      contains(c.owner) ||
      contains(c.notes)
  );

  searchResultsDiv.innerHTML = "";

  const addSection = (title, items, renderer) => {
    const card = document.createElement("div");
    card.className = "search-section-card";
    const h = document.createElement("h3");
    h.className = "search-section-title";
    h.textContent = `${title} (${items.length})`;
    card.appendChild(h);

    if (items.length === 0) {
      const p = document.createElement("p");
      p.textContent = "لا توجد نتائج.";
      card.appendChild(p);
    } else {
      items.forEach((it) => {
        const div = document.createElement("div");
        div.className = "search-item";
        div.innerHTML = renderer(it);

        const actions = document.createElement("div");
        actions.className = "search-item-actions";

        const printBtn = document.createElement("button");
        printBtn.className = "btn btn-secondary";
        printBtn.textContent = "طباعة";
        printBtn.addEventListener("click", () => {
          if (title === "الأعضاء") printUserRecord(it);
          else if (title === "التحركات") printMovementRecord(it);
          else if (title === "العهدة") printAssignmentRecord(it);
          else if (title === "الأسطول") printFleetRecord(it);
        });
        actions.appendChild(printBtn);

        div.appendChild(actions);
        card.appendChild(div);
      });
    }
    searchResultsDiv.appendChild(card);
  };

  addSection("الأعضاء", usersRes, (u) => {
    return `
      <div><strong>الاسم:</strong> ${u.username} (${u.role})</div>
      <div><strong>الجوال:</strong> ${u.phone || "-"}</div>
    `;
  });

  addSection("التحركات", movesRes, (m) => {
    return `
      <div><strong>الحركة:</strong> ${m.action} - ${m.userName}</div>
      <div><strong>السيارة:</strong> ${m.carNumber} - ${m.plateCode}</div>
      <div><strong>ملاحظات:</strong> ${m.notes || "-"}</div>
      <div><strong>التاريخ:</strong> ${formatTimestampMs(m.createdAt)}</div>
    `;
  });

  addSection("العهدة", assignmentsRes, (a) => {
    return `
      <div><strong>السيارة:</strong> ${a.carNumber} - ${a.plateCode}</div>
      <div><strong>العضو:</strong> ${a.userName}</div>
      <div><strong>المالك:</strong> ${a.owner}</div>
      <div><strong>ملاحظات:</strong> ${a.notes || "-"}</div>
    `;
  });

  addSection("الأسطول", fleetRes, (c) => {
    return `
      <div><strong>السيارة:</strong> ${c.carNumber} - ${c.plateCode}</div>
      <div><strong>المالك:</strong> ${c.owner}</div>
      <div><strong>نهاية الترخيص:</strong> ${
        c.licenseEnd ? formatTimestampMs(c.licenseEnd).split(" ")[0] : "-"
      }</div>
      <div><strong>نهاية التأمين:</strong> ${
        c.insuranceEnd ? formatTimestampMs(c.insuranceEnd).split(" ")[0] : "-"
      }</div>
      <div><strong>ملاحظات:</strong> ${c.notes || "-"}</div>
    `;
  });

  // الذهاب إلى تبويب البحث
  activateTab("tab-search");
}

/** طباعة مهيكلة مع شعار المسعود */
function openPrintWindow(title, htmlContent) {
  const win = window.open("", "_blank");
  win.document.write(`
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
            direction: rtl;
            padding: 20px;
          }
          .print-header {
            text-align: center;
            margin-bottom: 16px;
          }
          .print-header img {
            height: 60px;
            display: block;
            margin: 0 auto 8px auto;
          }
          .print-title {
            font-size: 1.1rem;
            font-weight: 700;
            margin: 0;
          }
          .print-section {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 12px;
          }
          .row {
            margin-bottom: 6px;
            font-size: 0.9rem;
          }
          .label {
            font-weight: 600;
          }
          hr {
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <img src="logo.png" alt="AL MASAOOD" />
          <div class="print-title">${title}</div>
        </div>
        <div class="print-section">
          ${htmlContent}
        </div>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}

/** قوالب الطباعة لكل نوع */
function printMovementRecord(m) {
  const notes = m.notes && m.notes.trim() ? m.notes : "-";
  const html = `
    <div class="row"><span class="label">نوع الحركة:</span> ${m.action}</div>
    <div class="row"><span class="label">السائق:</span> ${m.userName}</div>
    <div class="row"><span class="label">رقم السيارة:</span> ${m.carNumber}</div>
    <div class="row"><span class="label">كود اللوحة:</span> ${m.plateCode}</div>
    <div class="row"><span class="label">ملاحظات:</span> ${notes}</div>
    <div class="row"><span class="label">التاريخ:</span> ${formatTimestampMs(
      m.createdAt
    )}</div>
  `;
  openPrintWindow("بيان حركة سيارة", html);
}

function printMovementsReport(moves) {
  const rows = moves
    .map(
      (m, i) => `
      <div class="row">
        <span class="label">${i + 1}.</span>
        ${m.action} - ${m.userName} | ${m.carNumber} (${m.plateCode}) | ${formatTimestampMs(
        m.createdAt
      )} | ملاحظات: ${m.notes || "-"}
      </div>
    `
    )
    .join("");
  const html = `
    <div class="row"><span class="label">عدد الحركات:</span> ${moves.length}</div>
    <hr />
    ${rows || "<div class='row'>لا توجد بيانات.</div>"}
  `;
  openPrintWindow("تقرير حركات السيارات", html);
}

function printAssignmentRecord(a) {
  const html = `
    <div class="row"><span class="label">السيارة:</span> ${a.carNumber} - ${a.plateCode}</div>
    <div class="row"><span class="label">العضو:</span> ${a.userName}</div>
    <div class="row"><span class="label">المالك:</span> ${a.owner}</div>
    <div class="row"><span class="label">ملاحظات:</span> ${a.notes || "-"}</div>
    <div class="row"><span class="label">تاريخ التسجيل:</span> ${
      a.createdAt ? formatTimestampMs(a.createdAt) : "-"
    }</div>
  `;
  openPrintWindow("بيان عهدة سيارة", html);
}

function printFleetRecord(c) {
  const html = `
    <div class="row"><span class="label">السيارة:</span> ${c.carNumber} - ${c.plateCode}</div>
    <div class="row"><span class="label">المالك:</span> ${c.owner}</div>
    <div class="row"><span class="label">نهاية الترخيص:</span> ${
      c.licenseEnd ? formatTimestampMs(c.licenseEnd).split(" ")[0] : "-"
    }</div>
    <div class="row"><span class="label">نهاية التأمين:</span> ${
      c.insuranceEnd ? formatTimestampMs(c.insuranceEnd).split(" ")[0] : "-"
    }</div>
    <div class="row"><span class="label">ملاحظات:</span> ${c.notes || "-"}</div>
  `;
  openPrintWindow("بيان سيارة في الأسطول", html);
}

function printUserRecord(u) {
  const html = `
    <div class="row"><span class="label">اسم المستخدم:</span> ${u.username}</div>
    <div class="row"><span class="label">الدور:</span> ${u.role}</div>
    <div class="row"><span class="label">الجوال:</span> ${u.phone || "-"}</div>
  `;
  openPrintWindow("بيان عضو", html);
}

/** تحديث كل البيانات (لزر التحديث + بعد أي تعديل) */
async function refreshAllData() {
  await Promise.all([loadAllUsers(), loadMovements(), loadAssignments(), loadFleet()]);
  populateUserSelects();
  updateDashboardStats();
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
    const phoneDigits = normalizePhone(newPhoneRaw);

    if (newUsername.length < 4) {
      adminChangeError.textContent = "اسم المستخدم يجب ألا يقل عن 4 أحرف.";
      return;
    }
    if (newPassword.length < 6) {
      adminChangeError.textContent = "كلمة المرور يجب ألا تقل عن 6 أحرف/أرقام.";
      return;
    }
    if (phoneDigits.length !== 10) {
      adminChangeError.textContent = "رقم الجوال يجب أن يتكون من 10 أرقام.";
      return;
    }

    const pendingAdminId = sessionStorage.getItem("pending_admin_id");
    if (!pendingAdminId) {
      adminChangeError.textContent = "خطأ داخلي، أعد تحميل الصفحة.";
      return;
    }

    try {
      await updateAdminCredentials(pendingAdminId, newUsername, newPassword, phoneDigits);
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

/** تشغيل عام */
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initAuthFlow();

  if (userForm) userForm.addEventListener("submit", handleUserFormSubmit);
  if (movForm) movForm.addEventListener("submit", handleMovementFormSubmit);
  if (movPrintReportBtn) movPrintReportBtn.addEventListener("click", handleMovPrintReport);
  if (assForm) assForm.addEventListener("submit", handleAssignmentFormSubmit);
  if (fleetForm) fleetForm.addEventListener("submit", handleFleetFormSubmit);
  if (fleetFilterSelect) fleetFilterSelect.addEventListener("change", renderFleetList);

  if (globalSearchBtn) globalSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    performSearch();
  });
  if (globalSearchInput)
    globalSearchInput.addEventListener("input", () => {
      performSearch();
    });

  if (manualRefreshBtn) {
    manualRefreshBtn.addEventListener("click", () => {
      refreshAllData();
    });
  }

  registerServiceWorker();
});
