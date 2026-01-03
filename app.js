// app.js
// ملف جافاسكربت الرئيسي للتطبيق

// استيراد Firebase (باستخدام CDN كـ ES Modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// إعداد Firebase حسب البيانات التي أعطيتها
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

// ثوابت عامة
const SESSION_KEY = "car_mgmt_session";
const SESSION_DURATION_DAYS = 30;

// عناصر DOM
const loginSection = document.getElementById("login-section");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

const adminForceChangeSection = document.getElementById("admin-force-change-section");
const adminChangeForm = document.getElementById("admin-change-form");
const adminChangeError = document.getElementById("admin-change-error");

const appSection = document.getElementById("app-section");
const logoutBtn = document.getElementById("logout-btn");

const headerDatetime = document.getElementById("header-datetime");
const currentUserInfo = document.getElementById("current-user-info");
const footerYear = document.getElementById("footer-year");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// ضبط سنة الفوتر
footerYear.textContent = new Date().getFullYear().toString();

/**
 * دالة لتنسيق التاريخ والوقت بتوقيت GMT+4 بنظام 12 ساعة وبأرقام إنجليزية
 */
function updateHeaderDateTime() {
    const nowUtc = new Date();
    // إزاحة +4 ساعات عن UTC
    const offsetMs = 4 * 60 * 60 * 1000;
    const localTime = new Date(nowUtc.getTime() + offsetMs);

    const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const dayName = days[localTime.getUTCDay()];

    let hours = localTime.getUTCHours();
    const minutes = localTime.getUTCMinutes();
    const ampm = hours >= 12 ? "م" : "ص";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    const pad = (num) => num.toString().padStart(2, "0");

    const dateStr = `${localTime.getUTCFullYear()}-${pad(localTime.getUTCMonth() + 1)}-${pad(localTime.getUTCDate())}`;
    const timeStr = `${pad(hours)}:${pad(minutes)} ${ampm}`;

    headerDatetime.textContent = `${dayName} | ${dateStr} | ${timeStr}`;
}

// تحديث الوقت كل 30 ثانية
updateHeaderDateTime();
setInterval(updateHeaderDateTime, 30000);

/**
 * دالة لإنشاء جلسة وتخزينها في localStorage
 */
function saveSession(user) {
    const now = Date.now();
    const expiry = now + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

    const sessionData = {
        userId: user.id,
        username: user.username,
        role: user.role,
        phone: user.phone || "",
        expiry
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

/**
 * قراءة الجلسة إن وجدت وكانت صالحة
 */
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

/**
 * حذف الجلسة
 */
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

/**
 * إظهار أقسام الواجهة حسب حالة المستخدم
 */
function showAppForUser(session) {
    loginSection.classList.add("hidden");
    adminForceChangeSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");

    currentUserInfo.textContent = `${session.username} (${session.role})`;

    // الصلاحيات على مستوى التبويبات (سنفعلها لاحقًا بشكل أدق)
    // عضو عادي لا يرى الأسطول
    if (session.role === "member") {
        document.querySelector('[data-tab="tab-fleet"]').style.display = "none";
    } else {
        document.querySelector('[data-tab="tab-fleet"]').style.display = "inline-block";
    }
}

/**
 * إظهار شاشة إجبار تغيير بيانات المدير
 */
function showAdminForceChange() {
    loginSection.classList.add("hidden");
    appSection.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    adminForceChangeSection.classList.remove("hidden");
}

/**
 * إظهار شاشة تسجيل الدخول
 */
function showLogin() {
    adminForceChangeSection.classList.add("hidden");
    appSection.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    loginSection.classList.remove("hidden");
    currentUserInfo.textContent = "";
}

/**
 * إنشاء مستخدم المدير الافتراضي إذا لم يكن موجودًا
 * user document structure:
 *  - username
 *  - password
 *  - role: "admin" | "supervisor" | "member"
 *  - phone
 *  - mustChangePassword: boolean
 */
async function ensureDefaultAdmin() {
    // سنخزن المدير الافتراضي باسم مستخدم ثابت admin
    const usersCol = collection(db, "users");
    const q = query(usersCol, where("role", "==", "admin"));
    const snap = await getDocs(q);

    if (snap.empty) {
        // لا يوجد مدير، ننشئ المدير الافتراضي
        const adminDocRef = doc(usersCol); // id تلقائي
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
        // يوجد مدير، نرجع أول واحد
        const d = snap.docs[0];
        return {
            id: d.id,
            ...d.data()
        };
    }
}

/**
 * البحث عن مستخدم حسب username و password
 */
async function findUserByCredentials(username, password) {
    const usersCol = collection(db, "users");
    const q = query(
        usersCol,
        where("username", "==", username),
        where("password", "==", password)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const d = snap.docs[0];
    return {
        id: d.id,
        ...d.data()
    };
}

/**
 * تحديث بيانات المدير بعد الدخول الأول
 */
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

/**
 * تهيئة التبويبات
 */
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

/**
 * تهيئة تسجيل الدخول و الجلسات
 */
async function initAuthFlow() {
    // نتأكد من وجود المدير الافتراضي أو استعادته
    await ensureDefaultAdmin();

    // محاولة تحميل جلسة سابقة
    const session = loadSession();
    if (session) {
        showAppForUser(session);
    } else {
        showLogin();
    }

    // معالجة نموذج تسجيل الدخول
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loginError.textContent = "";

        const username = (document.getElementById("login-username").value || "").trim();
        const password = (document.getElementById("login-password").value || "").trim();

        if (username.length < 4 || password.length < 6) {
            loginError.textContent = "يرجى إدخال بيانات صحيحة (اسم مستخدم لا يقل عن 4 أحرف وكلمة مرور لا تقل عن 6 أحرف/أرقام).";
            return;
        }

        try {
            const user = await findUserByCredentials(username, password);
            if (!user) {
                loginError.textContent = "بيانات الدخول غير صحيحة.";
                return;
            }

            // إذا كان مديرًا ويجب تغيير كلمة المرور
            if (user.role === "admin" && user.mustChangePassword) {
                // نخزن بيانات المدير مؤقتًا في sessionStorage لاستغلالها في شاشة التغيير
                sessionStorage.setItem("pending_admin_id", user.id);
                showAdminForceChange();
            } else {
                // إنشاء جلسة طبيعية
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
            loginError.textContent = "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.";
        }
    });

    // معالجة نموذج تغيير بيانات المدير بعد أول دخول
    adminChangeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        adminChangeError.textContent = "";

        const newUsername = (document.getElementById("new-admin-username").value || "").trim();
        const newPassword = (document.getElementById("new-admin-password").value || "").trim();
        const newPhone = (document.getElementById("new-admin-phone").value || "").trim();

        if (newUsername.length < 4) {
            adminChangeError.textContent = "اسم المستخدم يجب ألا يقل عن 4 أحرف.";
            return;
        }

        if (newPassword.length < 6) {
            adminChangeError.textContent = "كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام.";
            return;
        }

        if (!/^\d{10}$/.test(newPhone)) {
            adminChangeError.textContent = "رقم الجوال يجب أن يكون مكونًا من 10 أرقام.";
            return;
        }

        const pendingAdminId = sessionStorage.getItem("pending_admin_id");
        if (!pendingAdminId) {
            adminChangeError.textContent = "خطأ في البيانات الداخلية. أعد تحميل الصفحة وحاول مرة أخرى.";
            return;
        }

        try {
            await updateAdminCredentials(pendingAdminId, newUsername, newPassword, newPhone);
            sessionStorage.removeItem("pending_admin_id");

            // نجلب بيانات المدير المحدثة من جديد لتخزين الجلسة
            const userRef = doc(db, "users", pendingAdminId);
            const d = await getDoc(userRef);
            const user = {
                id: userRef.id,
                ...d.data()
            };

            saveSession(user);
            showAppForUser({
                id: user.id,
                username: user.username,
                role: user.role,
                phone: user.phone
            });
        } catch (err) {
            console.error(err);
            adminChangeError.textContent = "حدث خطأ أثناء تحديث بيانات المدير. حاول مرة أخرى.";
        }
    });

    // تسجيل الخروج
    logoutBtn.addEventListener("click", () => {
        clearSession();
        showLogin();
    });
}

/**
 * تهيئة Service Worker لـ PWA
 */
function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js").catch((err) => {
            console.warn("Service worker registration failed:", err);
        });
    }
}

// تشغيل التهيئة بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initAuthFlow();
    registerServiceWorker();
});
