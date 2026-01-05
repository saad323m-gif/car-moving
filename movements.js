import { db, ref, push, onValue, update, remove } from "./firebase.js";

let currentUserRole = '';
let currentUserUid = '';

export function loadMovements(role, uid) {
  currentUserRole = role;
  currentUserUid = uid;

  const content = document.getElementById('content');
  content.innerHTML = `
    <h2>تحركات السيارات</h2>
    ${['مطور','مدير','مشرف'].includes(role) ? `<button class="action-btn" id="add-movement">+ إضافة حركة جديدة</button>` : ''}
    <div id="movements-list"></div>
  `;

  // عرض القائمة
  const movementsRef = ref(db, 'movements');
  onValue(movementsRef, (snapshot) => {
    const list = document.getElementById('movements-list');
    list.innerHTML = '';
    const data = snapshot.val();
    if (!data) return;

    Object.keys(data).reverse().forEach(key => {
      const m = data[key];
      if (role === 'عضو' && m.driverUid !== uid) return; // العضو يرى حركاته فقط

      const date = new Date(m.timestamp);
      const formattedDate = date.toLocaleString('en-GB', {
        timeZone: 'Asia/Dubai',
        hour12: true,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).replace(',', '');

      const accordion = document.createElement('div');
      accordion.className = 'accordion';
      accordion.innerHTML = `
        <strong>${m.driverName} | ${m.carNumber} | ${m.type === 'receive' ? 'استلام' : 'تسليم'}</strong>
        <span>${formattedDate}</span>
        ${m.edited ? '<span style="color:red; font-weight:bold;"> (تم التعديل)</span>' : ''}
      `;

      const panel = document.createElement('div');
      panel.className = 'panel';
      panel.innerHTML = `
        <p><strong>كود اللوحة:</strong> ${m.plateCode}</p>
        <p><strong>نوع السيارة:</strong> ${m.carType}</p>
        <p><strong>نوع الحركة:</strong> ${m.type === 'receive' ? 'استلام' : 'تسليم'}</p>
        <p><strong>ملاحظات:</strong> ${m.notes || '-'}</p>
        ${m.edited ? `<p style="color:red;"><strong>تم التعديل بواسطة:</strong> ${m.editedBy} | <strong>النص الأصلي:</strong> ${m.originalNotes || m.notes}</p>` : ''}
        <div>
          <button class="action-btn" onclick="printMovement('${key}')">🖨 طباعة</button>
          <button class="action-btn" onclick="shareMovement('${key}')">📤 مشاركة</button>
          ${canEditDelete(m, role, uid, m.timestamp) ? `<button class="action-btn" onclick="editMovement('${key}')">✏ تعديل</button>` : ''}
          ${['مطور','مدير','مشرف'].includes(role) ? `<button class="action-btn" style="background:red;" onclick="deleteMovement('${key}')">🗑 حذف</button>` : ''}
        </div>
      `;

      accordion.onclick = () => panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
      list.appendChild(accordion);
      list.appendChild(panel);
    });
  });

  // إضافة حركة جديدة
  if (document.getElementById('add-movement')) {
    document.getElementById('add-movement').onclick = () => openMovementForm();
  }
}

function canEditDelete(m, role, uid, timestamp) {
  if (['مطور','مدير','مشرف'].includes(role)) return true;
  if (role === 'عضو' && m.driverUid === uid) {
    const hours = (Date.now() - timestamp) / (1000 * 60 * 60);
    return hours <= 24;
  }
  return false;
}

function openMovementForm(editKey = null) {
  const membersRef = ref(db, 'members');
  onValue(membersRef, (snap) => {
    let options = '';
    snap.forEach(child => {
      const m = child.val();
      options += `<option value="${child.key}">${m.username}</option>`;
    });

    const content = document.getElementById('content');
    const oldContent = content.innerHTML;
    content.innerHTML = `
      <h2>${editKey ? 'تعديل' : 'إضافة'} حركة</h2>
      <label>اسم السائق:</label>
      <select id="driverUid">${options}</select>
      <label>رقم السيارة:</label>
      <input type="text" id="carNumber">
      <label>كود اللوحة:</label>
      <input type="text" id="plateCode">
      <label>نوع السيارة:</label>
      <input type="text" id="carType">
      <label>نوع الحركة:</label>
      <select id="type"><option value="receive">استلام</option><option value="deliver">تسليم</option></select>
      <label>ملاحظات:</label>
      <textarea id="notes"></textarea>
      <button class="action-btn" id="save-movement">حفظ</button>
      <button class="action-btn" onclick="loadMovements('${currentUserRole}', '${currentUserUid}')">إلغاء</button>
    `;

    if (editKey) {
      const mRef = ref(db, 'movements/' + editKey);
      onValue(mRef, (snap) => {
        const m = snap.val();
        document.getElementById('driverUid').value = m.driverUid;
        document.getElementById('carNumber').value = m.carNumber;
        document.getElementById('plateCode').value = m.plateCode;
        document.getElementById('carType').value = m.carType;
        document.getElementById('type').value = m.type;
        document.getElementById('notes').value = m.notes;
      }, { onlyOnce: true });
    } else {
      document.getElementById('driverUid').value = currentUserUid;
      if (currentUserRole === 'عضو') document.getElementById('driverUid').disabled = true;
    }

    document.getElementById('save-movement').onclick = () => {
      const driverUid = document.getElementById('driverUid').value;
      const driverName = document.querySelector(`#driverUid option[value="${driverUid}"]`).textContent;

      const movement = {
        driverUid,
        driverName,
        carNumber: document.getElementById('carNumber').value,
        plateCode: document.getElementById('plateCode').value,
        carType: document.getElementById('carType').value,
        type: document.getElementById('type').value,
        notes: document.getElementById('notes').value,
        timestamp: Date.now()  // ثابت UTC+4 من السيرفر
      };

      if (editKey) {
        const updates = {
          ...movement,
          edited: true,
          editedBy: currentUserRole,
          originalNotes: movement.notes !== snap.val().notes ? snap.val().notes : undefined
        };
        update(ref(db, 'movements/' + editKey), updates);
      } else {
        push(ref(db, 'movements'), movement);
      }
      loadMovements(currentUserRole, currentUserUid);
    };
  }, { onlyOnce: true });
}

// دوال الطباعة والمشاركة
window.printMovement = (key) => {
  const mRef = ref(db, 'movements/' + key);
  onValue(mRef, (snap) => {
    const m = snap.val();
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html dir="rtl"><head><title>حركة سيارة</title></head><body>
        <h1>تحركات السيارات - المسعود</h1>
        <p><strong>السائق:</strong> ${m.driverName}</p>
        <p><strong>رقم السيارة:</strong> ${m.carNumber}</p>
        <p><strong>كود اللوحة:</strong> ${m.plateCode}</p>
        <p><strong>نوع السيارة:</strong> ${m.carType}</p>
        <p><strong>النوع:</strong> ${m.type === 'receive' ? 'استلام' : 'تسليم'}</p>
        <p><strong>التاريخ والوقت:</strong> ${new Date(m.timestamp).toLocaleString('en-GB', {timeZone: 'Asia/Dubai', hour12: true})}</p>
        <p><strong>ملاحظات:</strong> ${m.notes || '-'}</p>
      </body></html>
    `);
    printWin.document.close();
    printWin.print();
  }, { onlyOnce: true });
};

window.shareMovement = async (key) => {
  const url = location.href;
  if (navigator.share) {
    navigator.share({ title: 'حركة سيارة', url });
  } else {
    prompt('انسخ الرابط:', url + '?movement=' + key);
  }
};

window.editMovement = (key) => openMovementForm(key);
window.deleteMovement = (key) => { if (confirm('حذف نهائي؟')) remove(ref(db, 'movements/' + key)); };