import { auth, db, ref, onValue, set, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "./firebase.js";

let currentUser = null;
let userRole = 'عضو';
let currentUid = null;

const authMsg = document.getElementById('auth-msg');
const userInfo = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');

// عند تغيير حالة المستخدم
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    currentUid = user.uid;

    // جلب بيانات العضو من قاعدة البيانات
    const userRef = ref(db, 'members/' + user.uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        userRole = data.role || 'عضو';
        showApp(data.username, userRole);
        // إعلام app.js بالصلاحية والـ uid
        if (window.updateRole) {
          window.updateRole(userRole, currentUid);
        }
      } else {
        // إذا لم يكن هناك بيانات في members → أول دخول (مطور)
        createMemberProfile(user, 'مطور');
      }
    }, { onlyOnce: false });
  } else {
    currentUser = null;
    currentUid = null;
    userRole = 'عضو';
    showLogin();
  }
});

function showApp(username, role) {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app-screen').style.display = 'block';
  logoutBtn.style.display = 'block';
  userInfo.innerText = `مرحباً: ${username} - ${role}`;
  document.getElementById('year').innerText = new Date().getFullYear();
}

function showLogin() {
  document.getElementById('auth-screen').style.display = 'block';
  document.getElementById('app-screen').style.display = 'none';
  logoutBtn.style.display = 'none';
  authMsg.textContent = '';
}

// زر تسجيل الدخول
document.getElementById('login-btn').onclick = async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    authMsg.textContent = 'يرجى إدخال اسم المستخدم وكلمة المرور';
    return;
  }

  authMsg.textContent = 'جاري تسجيل الدخول...';

  try {
    await signInWithEmailAndPassword(auth, username + '@car-system.com', password);
    // النجاح يتم التعامل معه في onAuthStateChanged
  } catch (error) {
    let msg = 'فشل تسجيل الدخول';
    if (error.code === 'auth/user-not-found') msg = 'اسم المستخدم غير موجود';
    else if (error.code === 'auth/wrong-password') msg = 'كلمة المرور غير صحيحة';
    else if (error.code === 'auth/invalid-email') msg = 'اسم المستخدم غير صالح';
    authMsg.textContent = msg;
  }
};

// زر التسجيل (لأول مرة فقط - يصبح مطور تلقائيًا)
document.getElementById('register-btn').onclick = async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || username.length < 4) {
    authMsg.textContent = 'اسم المستخدم يجب أن يكون 4 أحرف على الأقل';
    return;
  }
  if (!password || password.length < 6) {
    authMsg.textContent = 'كلمة المرور يجب أن تكون 6 أحرف/أرقام على الأقل';
    return;
  }

  authMsg.textContent = 'جاري إنشاء الحساب...';

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, username + '@car-system.com', password);
    // إنشاء ملف العضو كمطور تلقائيًا
    await createMemberProfile(userCredential.user, 'مطور', username);
    authMsg.textContent = 'تم إنشاء الحساب بنجاح كمطور!';
  } catch (error) {
    let msg = 'فشل إنشاء الحساب';
    if (error.code === 'auth/email-already-in-use') msg = 'اسم المستخدم موجود مسبقًا';
    authMsg.textContent = msg;
  }
};

async function createMemberProfile(user, role, customUsername = null) {
  const username = customUsername || user.email.split('@')[0];
  await set(ref(db, 'members/' + user.uid), {
    username: username,
    role: role,
    phone: '',
    createdAt: Date.now()
  });
}

// تسجيل الخروج
logoutBtn.onclick = async () => {
  await signOut(auth);
};

// تحديث يدوي
document.getElementById('refresh-btn').onclick = () => location.reload();