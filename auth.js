// auth.js
// ===============================
// نظام الدخول والتسجيل + تحميل بروفايل المستخدم
// ===============================

import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc
} from "./firebase.js";

import {
  ROLE_DEVELOPER,
  ROLE_MEMBER,
  ROLE_LABELS,
  ROLE_CLASS
} from "./roles.js";

// عناصر الواجهة
const authView = document.getElementById("authView");
const appHeader = document.getElementById("appHeader");
const appView = document.getElementById("appView");
const logoutBtn = document.getElementById("logoutBtn");
const authMessage = document.getElementById("authMessage");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const authTabs = document.querySelectorAll(".auth-tab");

const currentUserName = document.getElementById("currentUserName");
const currentUserRole = document.getElementById("currentUserRole");

// حالة المستخدم الحالية
export let currentUserProfile = null;

// ===============================
// تبديل تبويبات الدخول / التسجيل
// ===============================

authTabs.forEach(btn => {
  btn.addEventListener("click", () => {
    authTabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;

    if (tab === "login") {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
    } else {
      loginForm.classList.add("hidden");
      registerForm.classList.remove("hidden");
    }

    authMessage.textContent = "";
  });
});

// ===============================
// تحويل اسم المستخدم إلى إيميل وهمي
// ===============================

function usernameToEmail(username) {
  return `${username.toLowerCase()}@local.app`;
}

// ===============================
// هل هذا أول مستخدم في النظام؟
// ===============================

async function isFirstUser() {
  const snap = await getDocs(collection(db, "members"));
  return snap.empty;
}

// ===============================
// إنشاء بروفايل عضو في Firestore
// ===============================

async function createMemberProfile(uid, fullName, username, phone, role) {
  await setDoc(doc(db, "members", uid), {
    uid,
    fullName,
    username,
    phone,
    role,
    createdAt: new Date().toISOString()
  });
}

// ===============================
// تحميل بروفايل عضو
// ===============================

async function loadMemberProfile(uid) {
  const ref = doc(db, "members", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// ===============================
// تسجيل جديد
// ===============================

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
    authMessage.style.color = "#dc2626";
    authMessage.textContent = "حدث خطأ أثناء التسجيل.";
  }
});

// ===============================
// تسجيل الدخول
// ===============================

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
    const email = usernameToEmail(username);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    authMessage.textContent = "بيانات الدخول غير صحيحة.";
  }
});

// ===============================
// تسجيل خروج
// ===============================

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// ===============================
// مراقبة حالة تسجيل الدخول
// ===============================

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // تحميل بروفايل العضو
    currentUserProfile = await loadMemberProfile(user.uid);

    if (!currentUserProfile) {
      await signOut(auth);
      authMessage.textContent = "حدث خلل في بيانات الحساب.";
      return;
    }

    // إظهار واجهة التطبيق
    authView.classList.add("hidden");
    appHeader.classList.remove("hidden");
    appView.classList.remove("hidden");

    // عرض الاسم والصلاحية
    currentUserName.textContent = currentUserProfile.fullName;
    currentUserRole.textContent = ROLE_LABELS[currentUserProfile.role];
    currentUserRole.className = `role-badge ${ROLE_CLASS[currentUserProfile.role]}`;

    // إعلام بقية الملفات أن المستخدم جاهز
    document.dispatchEvent(new CustomEvent("user-ready", { detail: currentUserProfile }));

  } else {
    // العودة لشاشة الدخول
    currentUserProfile = null;
    authView.classList.remove("hidden");
    appHeader.classList.add("hidden");
    appView.classList.add("hidden");
  }
});
