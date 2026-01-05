import { auth, db, ref, onValue, set, push, createUser, signIn, onAuthStateChanged, signOut } from "./firebase.js";

let currentUser = null;
let userRole = 'عضو'; // افتراضي

export function initAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      const userRef = ref(db, 'members/' + user.uid);
      onValue(userRef, (snap) => {
        const data = snap.val();
        if (data) {
          userRole = data.role || 'عضو';
          showApp();
          loadRoleFeatures();
        }
      });
    } else {
      showLogin();
    }
  });
}

function showApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app-screen').style.display = 'block';
  document.getElementById('logout-btn').style.display = 'block';
  document.getElementById('user-info').innerText = `مرحباً: ${currentUser.email} - ${userRole}`;
  document.getElementById('year').innerText = new Date().getFullYear();
}

function showLogin() {
  document.getElementById('auth-screen').style.display = 'block';
  document.getElementById('app-screen').style.display = 'none';
}

// تسجيل (مطور فقط في البداية)
document.getElementById('register-btn').onclick = async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (!username || !password) return;
  try {
    const userCred = await createUser(auth, username + '@system.com', password);
    await set(ref(db, 'members/' + userCred.user.uid), {
      username, role: 'مطور', phone: '', createdAt: Date.now()
    });
    alert('تم التسجيل كمطور');
  } catch (e) { document.getElementById('auth-msg').innerText = e.message; }
};

// دخول
document.getElementById('login-btn').onclick = async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    await signIn(auth, username + '@system.com', password);
  } catch (e) { document.getElementById('auth-msg').innerText = e.message; }
};

// خروج
document.getElementById('logout-btn').onclick = () => signOut(auth);

// تحديث يدوي
document.getElementById('refresh-btn').onclick = () => location.reload();