// auth.js
import {
  auth,
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "./firebase.js";

import {
  ROLE_DEVELOPER,
  ROLE_MEMBER,
  ROLE_LABELS,
  ROLE_CLASS
} from "./roles.js";

// عناصر الواجهة
const authView = document.getElementById("authView");
const appView = document.getElementById("appView");
const loadingOverlay = document.getElementById("loadingOverlay");
const logoutBtn = document.getElementById("logoutBtn");
const authMessage = document.getElementById("authMessage");
const currentUserNameSpan = document.getElementById("currentUserName");
const currentUserRoleBadge = document.getElementById("currentUserRoleBadge");

const authTabs = document.querySelectorAll(".auth-card .tab-button");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// حالة المستخدم الحالي
export let currentUserProfile = null;

// تبديل تبويبات الدخول/التسجيل
authTabs.forEach(btn => {
  btn.addEventListener("click", () => {
    authTabs.forEach(b => b.classList.remove("tab-active"));
    btn.classList.add("tab-active");

    const tab = btn.dataset.authTab;
    if (tab === "login") {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
      authMessage.textContent = "";
    } else {
      loginForm.classList.add("hidden");
      registerForm.classList.remove("hidden");
      authMessage.textContent = "";
    }
  });
});

// توليد إيميل وهمي من اسم المستخدم لاستخدام Auth
function usernameToEmail(username) {
  return `${username.toLowerCase()}@local.car-app`;
}

// فحص إن كان هناك أي مستخدمين في النظام
async function isFirstUser() {
  const snap = await getDocs(collection(db, "members"));
  return snap.empty;
}

// إنشاء بروفايل عضو في مجموعة members
async function createMemberProfile(uid, fullName, username, phone, role) {
  const ref = doc(db, "members", uid);
  await setDoc(ref, {
    uid,
    fullName,
    username,
    phone,
    role,
    createdAt: new Date().toISOString()
  });
}

// تحميل بروفايل عضو
async function loadMemberProfile(uid) {
  const ref = doc(db, "members", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}

// تسجيل جديد
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMessage.textContent = "";

  const fullName = document.getElementById("registerFullName").value.trim();
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const phone = document.getElementById("registerPhone").value.trim();

  if (username.length < 4 || password.length < 6 || phone.length !== 10) {
    authMessage.textContent = "تحقق من صحة البيانات المدخلة.";
    return;
  }

  try {
    loadingOverlay.classList.add("overlay-visible");

    const email = usernameToEmail(username);
    const first = await isFirstUser();
    const role = first ? ROLE_DEVELOPER : ROLE_MEMBER;

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: fullName });

    await createMemberProfile(cred.user.uid, fullName, username, phone, role);

    authMessage.style.color = "#16a34a";
    authMessage.textContent = "تم التسجيل بنجاح، جاري تسجيل الدخول...";
  } catch (err) {
    console.error(err);
    authMessage.style.color = "#d9534f";
    authMessage.textContent = "حدث خطأ أثناء التسجيل.";
  } finally {
    loadingOverlay.classList.remove("overlay-visible");
  }
});

// تسجيل الدخول
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMessage.textContent = "";

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) {
    authMessage.textContent = "يرجى إدخال اسم المستخدم وكلمة المرور.";
    return;
  }

  try {
    loadingOverlay.classList.add("overlay-visible");
    const email = usernameToEmail(username);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    authMessage.textContent = "بيانات الدخول غير صحيحة.";
  } finally {
    loadingOverlay.classList.remove("overlay-visible");
  }
});

// تسجيل خروج
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
  });
}

// مراقبة حالة تسجيل الدخول
onAuthStateChanged(auth, async (user) => {
  loadingOverlay.classList.remove("overlay-visible");
  if (user) {
    // تحميل بروفايل العضو
    currentUserProfile = await loadMemberProfile(user.uid);

    if (!currentUserProfile) {
      // إن لم يوجد بروفايل، نغلق الجلسة احتياطاً
      await signOut(auth);
      authMessage.textContent = "حدث خلل في بيانات الحساب، يرجى المحاولة مجدداً.";
      return;
    }

    authView.classList.add("hidden");
    appView.classList.remove("hidden");
    logoutBtn.style.display = "inline-flex";

    // عرض الاسم والصلاحية
    currentUserNameSpan.textContent = currentUserProfile.fullName;
    const role = currentUserProfile.role;
    currentUserRoleBadge.textContent = ROLE_LABELS[role] || "";
    currentUserRoleBadge.className = `role-badge ${ROLE_CLASS[role] || ""}`;

    document.dispatchEvent(new CustomEvent("user-ready", { detail: currentUserProfile }));

  } else {
    currentUserProfile = null;
    authView.classList.remove("hidden");
    appView.classList.add("hidden");
    logoutBtn.style.display = "none";
    currentUserNameSpan.textContent = "";
    currentUserRoleBadge.textContent = "";
    currentUserRoleBadge.className = "role-badge";
  }
});
