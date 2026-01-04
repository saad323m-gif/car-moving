// app.js (module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, doc, getDoc, getDocs, query, where,
  serverTimestamp, orderBy, updateDoc, deleteDoc, onSnapshot, limit,
  Timestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// ---------- Firebase config ----------
const firebaseConfig = {
  apiKey: "AIzaSyD-qlIfpFyam5UgjxzhwAEhkttIQCBZXUw",
  authDomain: "carmanagement-79bfb.firebaseapp.com",
  projectId: "carmanagement-79bfb",
  storageBucket: "carmanagement-79bfb.firebasestorage.app",
  messagingSenderId: "313516916430",
  appId: "1:313516916430:web:6f2c20740bced9e7211a9f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------- Global state ----------
let currentUser = null;
let currentUserDoc = null;
let allDataCache = { movements: [], assets: [], fleet: [], users: [] };
let fuse = null; // search engine

// ---------- Utilities ----------
function formatToGulf12(date){
  const d = new Date(date.getTime() + 4*60*60*1000);
  let hh = d.getHours();
  const ampm = hh >= 12 ? 'PM' : 'AM';
  hh = hh % 12 || 12;
  const mm = String(d.getMinutes()).padStart(2,'0');
  const ss = String(d.getSeconds()).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  const month = String(d.getMonth()+1).padStart(2,'0');
  const year = d.getFullYear();
  return `${hh}:${mm}:${ss} ${ampm} ,${day}/${month}/${year}`;
}
function showModal(html){
  const modal = document.getElementById('modal');
  modal.innerHTML = `<div class="card">${html}</div>`;
  modal.classList.remove('hidden');
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  }, { once:true });
}
function closeModal(){ document.getElementById('modal').classList.add('hidden'); }

// ---------- Auth (seed admin: admin@example.com / admin123) ----------
async function seedAdmin(){
  try{
    await signInWithEmailAndPassword(auth, 'admin@example.com', 'admin123');
  }catch(e){
    try{
      const cred = await createUserWithEmailAndPassword(auth, 'admin@example.com', 'admin123');
      const u = cred.user;
      await addDoc(collection(db,'users'), {
        uid: u.uid,
        displayName: 'Admin',
        phone: '0000000000',
        role: 'developer',
        username: 'Admin'
      });
      await signOut(auth);
    }catch(err){
      console.warn('seed admin err', err);
    }
  }
}

// ---------- UI wiring ----------
document.addEventListener('DOMContentLoaded', async ()=>{
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  }

  const tabs = document.querySelectorAll('.tabs button');
  tabs.forEach(t => t.addEventListener('click', ()=>switchTab(t.dataset.tab)));
  document.getElementById('refreshBtn').addEventListener('click', ()=>location.reload());
  document.getElementById('logoutBtn').addEventListener('click', ()=>signOut(auth));
  document.getElementById('searchInput').addEventListener('input', e => doSearch(e.target.value));
  document.getElementById('newMovementBtn').addEventListener('click', ()=>openMovementForm());
  document.getElementById('newAssetBtn').addEventListener('click', ()=>openAssetForm());
  document.getElementById('newFleetBtn').addEventListener('click', ()=>openFleetForm());
  document.getElementById('membersBtn').addEventListener('click', ()=>switchTab('members'));

  onAuthStateChanged(auth, async user => {
    currentUser = user;
    if (!user) {
      await showLogin();
      return;
    }
    const usersSnap = await getDocs(query(collection(db,'users'), where('uid','==', user.uid)));
    currentUserDoc = usersSnap.docs[0] ? usersSnap.docs[0].data() : null;
    renderRoleBadge();
    subscribeData();
  });

  seedAdmin();
});

// ---------- Login UI ----------
async function showLogin(){
  showModal(`
    <h2>تسجيل الدخول</h2>
    <p>المطور: admin@example.com / admin123</p>
    <label>البريد الإلكتروني</label>
    <input id="loginEmail" value="admin@example.com" />
    <label>كلمة المرور</label>
    <input id="loginPass" type="password" value="admin123" />
    <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">
      <button id="loginBtn">دخول</button>
    </div>
  `);
  document.getElementById('loginBtn').addEventListener('click', async ()=>{
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value;
    try{
      await signInWithEmailAndPassword(auth, email, pass);
      closeModal();
    }catch(e){
      alert('فشل تسجيل الدخول: '+e.message);
    }
  });
}

// ---------- Role badge ----------
function renderRoleBadge(){
  const el = document.getElementById('userRoleBadge');
  if (!currentUserDoc) { el.textContent = 'غير معروف'; return; }
  const r = currentUserDoc.role;
  el.textContent = currentUserDoc.displayName || currentUserDoc.username || currentUser.email;
  el.className = 'role-badge ' + (r==='developer'?'role-dev': r==='manager'?'role-manager': r==='supervisor'?'role-supervisor':'role-member');
  document.getElementById('statsTab').style.display = (['developer','manager','supervisor'].includes(r)) ? 'inline-block' : 'none';
}

// ---------- Data subscription ----------
function subscribeData(){
  onSnapshot(collection(db,'movements'), snap => {
    allDataCache.movements = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    renderMovements();
    rebuildSearch();
  });
  onSnapshot(collection(db,'assets'), snap => {
    allDataCache.assets = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    renderAssets();
    rebuildSearch();
  });
  onSnapshot(collection(db,'fleet'), snap => {
    allDataCache.fleet = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    renderFleet();
    rebuildSearch();
  });
  onSnapshot(collection(db,'users'), snap => {
    allDataCache.users = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    renderMembers();
    rebuildSearch();
  });
}

// ---------- Render ----------
function switchTab(tab){
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('.tabcontent').forEach(c=>c.classList.add('hidden'));
  document.getElementById(tab+'Tab').classList.remove('hidden');
  if (tab === 'stats') renderStats();
}

function renderMovements(){
  const container = document.getElementById('movementsTab');
  container.innerHTML = '';
  const list = [...allDataCache.movements].sort((a,b)=> (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
  list.forEach(m => {
    if (!canReadDoc(m)) return;
    const title = `${getUserName(m.driverId)} — ${m.vehicleNumber} — ${m.actionType}`;
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <div class="accordion-title">
        <div>
          <strong>${title}</strong>
          <div class="meta">${formatCreated(m.createdAt)}</div>
        </div>
        <div class="badge">${m.vehicleType || ''}</div>
      </div>
      <div class="details hidden">
        <p><strong>كود اللوحة:</strong> ${m.plateCode || ''}</p>
        <p><strong>ملاحظات:</strong> ${escapeHtml(m.notes || '')}</p>
        <p class="meta">
          <strong>أضيف بواسطة:</strong> ${getUserName(m.userId)}
          ${m.editedBy?`<span style="color:#b00"> (تم التعديل بواسطة ${getUserName(m.editedBy)} — النص الأصلي: ${escapeHtml(m.originalText||'—')})</span>`:''}
        </p>
        <div class="actions">
          <button class="action-btn share">مشاركة</button>
          <button class="action-btn print">طباعة</button>
          ${canEditDoc(m) ? `<button class="action-btn" data-edit="1">تعديل</button>` : ''}
          ${canDeleteDoc(m) ? `<button class="action-btn delete" data-del="1">حذف</button>` : ''}
        </div>
      </div>
    `;
    card.querySelector('.accordion-title').addEventListener('click', ()=>{
      card.querySelector('.details').classList.toggle('hidden');
    });
    card.querySelector('.action-btn.share').addEventListener('click', ()=>shareMovement(m));
    card.querySelector('.action-btn.print').addEventListener('click', ()=>printMovement(m));
    const eBtn = card.querySelector('[data-edit]');
    if (eBtn) eBtn.addEventListener('click', ()=>openEditMovement(m));
    const dBtn = card.querySelector('[data-del]');
    if (dBtn) dBtn.addEventListener('click', ()=>deleteMovement(m));
    container.appendChild(card);
  });
}

function renderAssets(){
  const container = document.getElementById('assetsTab');
  container.innerHTML = '';
  allDataCache.assets.forEach(a=>{
    if (!canReadDoc(a)) return;
    const title = `${getUserName(a.holderId)} — ${a.vehicleNumber || ''}`;
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <div class="accordion-title">
        <div>
          <strong>${title}</strong>
          <div class="meta">${a.owner || ''}</div>
        </div>
        <div class="badge">${a.vehicleType || ''}</div>
      </div>
      <div class="details hidden">
        <p><strong>ملاحظات:</strong> ${escapeHtml(a.notes||'')}</p>
        <div class="actions">
          <button class="action-btn share">مشاركة</button>
          ${canEditDoc(a)?`<button class="action-btn" data-edit="1">تعديل</button>`:''}
          ${canDeleteDoc(a)?`<button class="action-btn delete" data-del="1">حذف</button>`:''}
        </div>
      </div>
    `;
    card.querySelector('.accordion-title').addEventListener('click', ()=>card.querySelector('.details').classList.toggle('hidden'));
    card.querySelector('.action-btn.share').addEventListener('click', ()=>{/* مشاركة بسيطة إن أردت */});
    container.appendChild(card);
  });
}

function renderFleet(){
  const container = document.getElementById('fleetTab');
  container.innerHTML = '';
  allDataCache.fleet.forEach(f=>{
    if (!canReadDoc(f)) return;
    const title = `${f.vehicleNumber || ''} — ${f.vehicleType || ''}`;
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <div class="accordion-title">
        <div>
          <strong>${title}</strong>
          <div class="meta">المالك: ${f.owner || ''}</div>
        </div>
        <div class="badge">${f.plateCode || ''}</div>
      </div>
      <div class="details hidden">
        <p><strong>من المتعهد:</strong> ${getUserName(f.holderId) || '—'}</p>
        <p><strong>انتهاء الترخيص:</strong> ${f.licenseEnd?formatDateShort(f.licenseEnd):'—'}</p>
        <p><strong>انتهاء التأمين:</strong> ${f.insuranceEnd?formatDateShort(f.insuranceEnd):'—'}</p>
        <p><strong>ملاحظات:</strong> ${escapeHtml(f.notes||'')}</p>
        <div class="actions">
          <button class="action-btn share">مشاركة</button>
          ${canEditDoc(f)?`<button class="action-btn" data-edit="1">تعديل</button>`:''}
          ${canDeleteDoc(f)?`<button class="action-btn delete" data-del="1">حذف</button>`:''}
        </div>
      </div>
    `;
    card.querySelector('.accordion-title').addEventListener('click', ()=>card.querySelector('.details').classList.toggle('hidden'));
    container.appendChild(card);
  });
}

function renderMembers(){
  const container = document.getElementById('membersTab');
  container.innerHTML = '';
  allDataCache.users.forEach(u=>{
    const roleClass = u.role==='developer'?'role-dev':u.role==='manager'?'role-manager':u.role==='supervisor'?'role-supervisor':'role-member';
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <strong>${u.displayName || u.username || '—'}</strong>
          <div class="meta">${u.phone || ''}</div>
        </div>
        <div class="${roleClass}" style="padding:6px 10px;border-radius:8px">${u.role}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderStats(){
  const c = document.getElementById('statsTabContent');
  const totalMov = allDataCache.movements.length;
  const totalAssets = allDataCache.assets.length;
  const totalFleet = allDataCache.fleet.length;
  const totalUsers = allDataCache.users.length;
  c.innerHTML = `
    <div class="card">
      <h3>إحصائيات عامة</h3>
      <p>الحركات: <strong>${totalMov}</strong></p>
      <p>العهد: <strong>${totalAssets}</strong></p>
      <p>الأسطول: <strong>${totalFleet}</strong></p>
      <p>الأعضاء: <strong>${totalUsers}</strong></p>
    </div>
  `;
}

// ---------- Helpers ----------
function getUserName(uid){
  const u = allDataCache.users.find(x=>x.uid===uid || x.id===uid);
  return u ? (u.displayName || u.username) : (uid ? uid.slice(0,6) : '—');
}
function formatCreated(ts){
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts.seconds*1000);
  return formatToGulf12(d);
}
function formatDateShort(val){
  if (!val) return '';
  const d = val.toDate ? val.toDate() : new Date(val.seconds*1000);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

// ---------- Permissions ----------
function isAdminRole(){
  return currentUserDoc && ['developer','manager','supervisor'].includes(currentUserDoc.role);
}
function canReadDoc(doc){
  if (!currentUser) return false;
  if (isAdminRole()) return true;
  if (doc.userId && doc.userId === currentUser.uid) return true;
  if (doc.holderId && doc.holderId === currentUser.uid) return true;
  return false;
}
function canEditDoc(doc){
  if (!currentUser) return false;
  if (isAdminRole()) return true;
  if (doc.userId && doc.userId === currentUser.uid && doc.createdAt){
    const created = doc.createdAt.toDate ? doc.createdAt.toDate() : new Date(doc.createdAt.seconds*1000);
    const now = new Date();
    return (now - created) <= 24*60*60*1000;
  }
  return false;
}
function canDeleteDoc(doc){
  return currentUser && isAdminRole();
}

// ---------- Forms ----------
function openMovementForm(){
  const drivers = allDataCache.users.map(u=>`<option value="${u.uid}">${u.displayName||u.username}</option>`).join('');
  showModal(`
    <h3>إضافة حركة</h3>
    <label>رقم السيارة</label><input id="mv_vehicleNumber" />
    <label>كود اللوحة</label><input id="mv_plateCode" />
    <label>نوع السيارة</label><input id="mv_vehicleType" />
    <label>اسم السائق</label><select id="mv_driverId">${drivers}</select>
    <label>نوع الحركة</label>
    <select id="mv_actionType"><option>استلام</option><option>تسليم</option></select>
    <label>ملاحظات</label><textarea id="mv_notes"></textarea>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
      <button id="saveMv">حفظ الحركة</button>
    </div>
  `);
  document.getElementById('saveMv').addEventListener('click', async ()=>{
    const vehicleNumber = document.getElementById('mv_vehicleNumber').value.trim();
    const plateCode = document.getElementById('mv_plateCode').value.trim();
    const vehicleType = document.getElementById('mv_vehicleType').value.trim();
    const driverId = document.getElementById('mv_driverId').value;
    const actionType = document.getElementById('mv_actionType').value;
    const notes = document.getElementById('mv_notes').value;
    if (!isAdminRole() && driverId !== currentUser.uid){
      alert('يمكنك فقط إضافة حركة باسمك.');
      return;
    }
    try{
      await addDoc(collection(db,'movements'), {
        vehicleNumber, plateCode, vehicleType, driverId,
        actionType, notes,
        createdAt: serverTimestamp(),
        userId: currentUser.uid
      });
      closeModal();
    }catch(e){ alert('خطأ: '+e.message); }
  });
}

function openAssetForm(){
  const holders = allDataCache.users.map(u=>`<option value="${u.uid}">${u.displayName||u.username}</option>`).join('');
  showModal(`
    <h3>إضافة عهدة</h3>
    <label>رقم السيارة</label><input id="as_vehicleNumber" />
    <label>كود اللوحة</label><input id="as_plateCode" />
    <label>المتعهد (من قائمة الأعضاء)</label><select id="as_holderId">${holders}</select>
    <label>المالك</label><input id="as_owner" />
    <label>نوع السيارة</label><input id="as_vehicleType" />
    <label>ملاحظات</label><textarea id="as_notes"></textarea>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
      <button id="saveAs">حفظ العهدة</button>
    </div>
  `);
  document.getElementById('saveAs').addEventListener('click', async ()=>{
    const vehicleNumber = document.getElementById('as_vehicleNumber').value.trim();
    const plateCode = document.getElementById('as_plateCode').value.trim();
    const holderId = document.getElementById('as_holderId').value;
    const owner = document.getElementById('as_owner').value.trim();
    const vehicleType = document.getElementById('as_vehicleType').value.trim();
    const notes = document.getElementById('as_notes').value;
    try{
      await addDoc(collection(db,'assets'), {
        vehicleNumber, plateCode, holderId, owner, vehicleType, notes,
        createdAt: serverTimestamp()
      });
      closeModal();
    }catch(e){ alert('خطأ: '+e.message); }
  });
}

function openFleetForm(){
  const holders = `<option value="">—</option>` + allDataCache.users.map(u=>`<option value="${u.uid}">${u.displayName||u.username}</option>`).join('');
  showModal(`
    <h3>إضافة سيارة للأسطول</h3>
    <label>رقم السيارة</label><input id="fl_vehicleNumber" />
    <label>كود اللوحة</label><input id="fl_plateCode" />
    <label>المالك</label><input id="fl_owner" />
    <label>نوع السيارة</label><input id="fl_vehicleType" />
    <label>من المتعهد (اختياري)</label><select id="fl_holderId">${holders}</select>
    <label>تاريخ نهاية الترخيص</label><input id="fl_licenseEnd" type="date" />
    <label>تاريخ نهاية التأمين</label><input id="fl_insuranceEnd" type="date" />
    <label>ملاحظات</label><textarea id="fl_notes"></textarea>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
      <button id="saveFl">حفظ السيارة</button>
    </div>
  `);
  document.getElementById('saveFl').addEventListener('click', async ()=>{
    const vehicleNumber = document.getElementById('fl_vehicleNumber').value.trim();
    const plateCode = document.getElementById('fl_plateCode').value.trim();
    const owner = document.getElementById('fl_owner').value.trim();
    const vehicleType = document.getElementById('fl_vehicleType').value.trim();
    const holderId = document.getElementById('fl_holderId').value || null;
    const licenseDateVal = document.getElementById('fl_licenseEnd').value;
    const insuranceDateVal = document.getElementById('fl_insuranceEnd').value;
    const notes = document.getElementById('fl_notes').value;

    const licenseEnd = licenseDateVal ? Timestamp.fromDate(new Date(licenseDateVal)) : null;
    const insuranceEnd = insuranceDateVal ? Timestamp.fromDate(new Date(insuranceDateVal)) : null;

    try{
      await addDoc(collection(db,'fleet'), {
        vehicleNumber, plateCode, owner, vehicleType, holderId,
        licenseEnd,
        insuranceEnd,
        notes,
        createdAt: serverTimestamp()
      });
      closeModal();
    }catch(e){ alert('خطأ: '+e.message); }
  });
}

// ---------- Edit/Delete ----------
async function openEditMovement(m){
  if (!canEditDoc(m)) return alert('غير مسموح بالتعديل');
  showModal(`
    <h3>تعديل الحركة</h3>
    <label>ملاحظات</label><textarea id="edit_notes">${escapeHtml(m.notes||'')}</textarea>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
      <button id="saveEdit">حفظ التعديل</button>
    </div>
  `);
  document.getElementById('saveEdit').addEventListener('click', async ()=>{
    const notes = document.getElementById('edit_notes').value;
    try{
      await updateDoc(doc(db,'movements', m.id), {
        notes,
        editedBy: currentUser.uid,
        originalText: m.notes || '',
        editedAt: serverTimestamp()
      });
      closeModal();
    }catch(e){ alert('خطأ: '+e.message); }
  });
}

async function deleteMovement(m){
  if (!canDeleteDoc(m)) return alert('غير مسموح بالحذف');
  if (!confirm('هل تريد حذف هذه الحركة؟')) return;
  try{
    await deleteDoc(doc(db,'movements', m.id));
  }catch(e){ alert('خطأ: '+e.message); }
}

// ---------- Share / Print ----------
function shareMovement(m){
  const text = `حركة: ${m.actionType}
سائق: ${getUserName(m.driverId)}
سيارة: ${m.vehicleNumber}
ملاحظات: ${m.notes||''}
${formatCreated(m.createdAt)}`;
  if (navigator.share){
    navigator.share({ title:'حركة سيارة', text }).catch(()=>alert('فشل المشاركة'));
  } else {
    navigator.clipboard.writeText(text).then(()=>alert('تم نسخ النص للمشاركة'));
  }
}
function printMovement(m){
  const html = `<h3>حركة</h3><p>${escapeHtml(m.notes||'')}</p><p>${formatCreated(m.createdAt)}</p>`;
  const w = window.open('','_blank');
  w.document.write(html);
  w.print();
  w.close();
}

// ---------- Search ----------
function rebuildSearch(){
  const list = [
    ...allDataCache.movements.map(m=>({type:'movement', id:m.id, title:`${getUserName(m.driverId)} ${m.vehicleNumber}`, raw:m})),
    ...allDataCache.assets.map(a=>({type:'asset', id:a.id, title:`${getUserName(a.holderId)} ${a.vehicleNumber}`, raw:a})),
    ...allDataCache.fleet.map(f=>({type:'fleet', id:f.id, title:`${f.vehicleNumber} ${f.vehicleType}`, raw:f})),
    ...allDataCache.users.map(u=>({type:'user', id:u.id, title:`${u.displayName||u.username}`, raw:u}))
  ];
  fuse = new Fuse(list, { keys: ['title'], threshold: 0.3 });
}

function doSearch(q){
  if (!q){
    // إعادة بناء الوضع العادي (إظهار التبويب الحالي)
    switchTab(document.querySelector('.tabs button.active').dataset.tab);
    return;
  }
  const results = fuse ? fuse.search(q).map(r=>r.item) : [];
  const container = document.getElementById('contentArea');
  container.innerHTML = '<div class="card"><h3>نتائج البحث</h3></div>';
  results.forEach(r=>{
    if (!canReadDoc(r.raw)) return;
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `<strong>${r.type.toUpperCase()}</strong> — ${r.title}`;
    container.appendChild(el);
  });
}

// ---------- Periodic search rebuild ----------
setInterval(()=>{ if (allDataCache.users.length) rebuildSearch(); }, 2000);

// ---------- License/Insurance notifications (console warning) ----------
setInterval(()=>{
  const now = new Date();
  allDataCache.fleet.forEach(f=>{
    if (!f.licenseEnd || !f.insuranceEnd) return;
    const lic = f.licenseEnd.toDate ? f.licenseEnd.toDate() : new Date(f.licenseEnd.seconds*1000);
    const ins = f.insuranceEnd.toDate ? f.insuranceEnd.toDate() : new Date(f.insuranceEnd.seconds*1000);
    if ((lic - now) <= 15*24*60*60*1000) console.warn('تنبيه: انتهاء الترخيص قريب لسيارة', f.vehicleNumber);
    if ((ins - now) <= 15*24*60*60*1000) console.warn('تنبيه: انتهاء التأمين قريب لسيارة', f.vehicleNumber);
  });
}, 60*60*1000);

// ---------- initial tab ----------
switchTab('movements');
