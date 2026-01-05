// movements.js
// ===============================
// إدارة حركة السيارات (استلام / تسليم)
// ===============================

import {
  db,
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "./firebase.js";

import { currentUserProfile } from "./auth.js";
import {
  canSeeAllMovements,
  canAddMovementForOthers
} from "./roles.js";

// عناصر الواجهة
const movementsTab = document.getElementById("movementsTab");

// ===============================
// دالة الوقت GMT+4
// ===============================

function getNowGmt4Iso() {
  const nowUtc = new Date();
  const utcMs = nowUtc.getTime() + nowUtc.getTimezoneOffset() * 60000;
  const gmt4Ms = utcMs + 4 * 60 * 60 * 1000;
  return new Date(gmt4Ms).toISOString();
}

// ===============================
// بناء واجهة التبويب
// ===============================

function renderMovementsUI() {
  movementsTab.innerHTML = `
    <div class="tab-inner-header">
      <h3>حركة السيارات</h3>
      <button id="addMovementBtn" class="btn-primary">+ إضافة حركة</button>
    </div>

    <div id="movementsList" class="accordion-list"></div>

    <div id="movementFormContainer" class="hidden"></div>
  `;

  document.getElementById("addMovementBtn").addEventListener("click", () => {
    renderMovementForm(null);
  });
}

// ===============================
// نموذج إضافة / تعديل حركة
// ===============================

function renderMovementForm(existing) {
  const container = document.getElementById("movementFormContainer");
  container.innerHTML = "";
  container.classList.remove("hidden");

  const isEdit = !!existing;
  const user = currentUserProfile;

  const card = document.createElement("div");
  card.className = "tab-content";

  card.innerHTML = `
    <h3>${isEdit ? "تعديل حركة" : "إضافة حركة جديدة"}</h3>

    <form id="movementForm" class="auth-form">

      <label>نوع الحركة</label>
      <select name="movementType" required>
        <option value="استلام" ${existing?.movementType === "استلام" ? "selected" : ""}>استلام</option>
        <option value="تسليم" ${existing?.movementType === "تسليم" ? "selected" : ""}>تسليم</option>
      </select>

      <label>رقم السيارة</label>
      <input type="text" name="carNumber" required value="${existing?.carNumber || ""}" />

      <label>اسم المتعهد</label>
      <input type="text" name="custodianName" required value="${existing?.custodianName || user.fullName}" />

      <label>ملاحظات</label>
      <textarea name="notes">${existing?.notes || ""}</textarea>

      <div style="margin-top:0.5rem; display:flex; gap:0.5rem;">
        <button type="submit" class="btn-primary">${isEdit ? "حفظ التعديلات" : "حفظ"}</button>
        <button type="button" id="cancelMovementForm" class="btn-secondary">إلغاء</button>
      </div>

      ${
        isEdit && existing.originalText
          ? `<p class="edited-original">النص الأصلي: ${existing.originalText}</p>`
          : ""
      }
    </form>
  `;

  container.appendChild(card);

  document.getElementById("cancelMovementForm").addEventListener("click", () => {
    container.classList.add("hidden");
  });

  document.getElementById("movementForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target).entries());

    const payload = {
      movementType: data.movementType,
      carNumber: data.carNumber.trim(),
      custodianName: data.custodianName.trim(),
      notes: data.notes.trim(),
      createdByUid: existing?.createdByUid || user.uid,
      createdByName: existing?.createdByName || user.fullName
    };

    try {
      if (isEdit) {
        // تحقق من 24 ساعة
        const createdAt = new Date(existing.createdAtGmt4Iso);
        const now = new Date(getNowGmt4Iso());
        const diffHours = (now - createdAt) / (1000 * 60 * 60);

        if (existing.createdByUid === user.uid && diffHours > 24) {
          alert("لا يمكنك تعديل الحركة بعد مرور 24 ساعة.");
          return;
        }

        await updateDoc(doc(db, "movements", existing.id), {
          ...payload,
          editedAt: getNowGmt4Iso(),
          originalText: existing.originalText || existing.notes
        });
      } else {
        await addDoc(collection(db, "movements"), {
          ...payload,
          createdAt: serverTimestamp(),
          createdAtGmt4Iso: getNowGmt4Iso()
        });
      }

      container.classList.add("hidden");
      await loadMovements();

    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ الحركة.");
    }
  });
}

// ===============================
// عرض الحركة داخل أكورديون
// ===============================

function renderMovementItem(docId, data) {
  const user = currentUserProfile;
  const canSeeAll = canSeeAllMovements(user.role);

  if (!canSeeAll && data.createdByUid !== user.uid) return null;

  const item = document.createElement("div");
  item.className = "accordion-item";

  const header = document.createElement("div");
  header.className = "accordion-header";

  const headerMain = document.createElement("div");
  headerMain.className = "accordion-header-main";

  const title = document.createElement("div");
  title.className = "accordion-title";
  title.textContent = `${data.movementType} - ${data.carNumber}`;

  const subtitle = document.createElement("div");
  subtitle.className = "accordion-subtitle";
  subtitle.textContent = `بواسطة: ${data.createdByName}`;

  const meta = document.createElement("div");
  meta.className = "accordion-meta";
  meta.textContent = data.createdAtGmt4Iso || "-";

  headerMain.appendChild(title);
  headerMain.appendChild(subtitle);
  headerMain.appendChild(meta);

  const toggle = document.createElement("div");
  toggle.className = "accordion-toggle";
  toggle.textContent = "▼";

  header.appendChild(headerMain);
  header.appendChild(toggle);

  const body = document.createElement("div");
  body.className = "accordion-body hidden";

  body.innerHTML = `
    <div class="accordion-row">
      <span class="label">نوع الحركة:</span>
      <span class="value">${data.movementType}</span>
    </div>

    <div class="accordion-row">
      <span class="label">رقم السيارة:</span>
      <span class="value">${data.carNumber}</span>
    </div>

    <div class="accordion-row">
      <span class="label">المتعهد:</span>
      <span class="value">${data.custodianName}</span>
    </div>

    <div class="accordion-row">
      <span class="label">ملاحظات:</span>
      <span class="value">${data.notes || "-"}</span>
    </div>

    ${
      data.originalText
        ? `<span class="badge-edited">تم التعديل</span>`
        : ""
    }
  `;

  // أزرار
  const actions = document.createElement("div");
  actions.className = "accordion-actions";

  // مشاركة
  const shareBtn = document.createElement("button");
  shareBtn.className = "btn-secondary";
  shareBtn.textContent = "📤 مشاركة";
  shareBtn.addEventListener("click", () => {
    const text = `
${data.movementType}
رقم السيارة: ${data.carNumber}
المتعهد: ${data.custodianName}
ملاحظات: ${data.notes || "-"}
بواسطة: ${data.createdByName}
${data.createdAtGmt4Iso}
    `.trim();

    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert("تم نسخ بيانات الحركة.");
    }
  });

  // طباعة
  const printBtn = document.createElement("button");
  printBtn.className = "btn-secondary";
  printBtn.textContent = "🖨 طباعة";
  printBtn.addEventListener("click", () => {
    const w = window.open("", "_blank");
    w.document.write(`
      <html dir="rtl"><body>
      <h2>بيان حركة سيارة</h2>
      <p>نوع الحركة: ${data.movementType}</p>
      <p>رقم السيارة: ${data.carNumber}</p>
      <p>المتعهد: ${data.custodianName}</p>
      <p>ملاحظات: ${data.notes || "-"}</p>
      <p>بواسطة: ${data.createdByName}</p>
      <p>${data.createdAtGmt4Iso}</p>
      </body></html>
    `);
    w.document.close();
    w.print();
  });

  actions.appendChild(shareBtn);
  actions.appendChild(printBtn);

  // تعديل
  const canEdit =
    data.createdByUid === user.uid ||
    canAddMovementForOthers(user.role);

  if (canEdit) {
    const editBtn = document.createElement("button");
    editBtn.className = "btn-primary";
    editBtn.textContent = "✏ تعديل";
    editBtn.addEventListener("click", () => {
      renderMovementForm({ id: docId, ...data });
    });
    actions.appendChild(editBtn);
  }

  // حذف
  if (canAddMovementForOthers(user.role)) {
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-danger";
    deleteBtn.textContent = "🗑 حذف";
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("هل أنت متأكد من حذف الحركة؟")) return;
      await deleteDoc(doc(db, "movements", docId));
      await loadMovements();
    });
    actions.appendChild(deleteBtn);
  }

  body.appendChild(actions);

  // فتح/إغلاق
  header.addEventListener("click", () => {
    const isHidden = body.classList.contains("hidden");
    body.classList.toggle("hidden", !isHidden);
    toggle.textContent = isHidden ? "▲" : "▼";
  });

  item.appendChild(header);
  item.appendChild(body);

  return item;
}

// ===============================
// تحميل الحركات
// ===============================

export async function loadMovements() {
  const list = document.getElementById("movementsList");
  if (!list) return;

  list.innerHTML = "";

  try {
    const q = query(collection(db, "movements"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const item = renderMovementItem(docSnap.id, data);
      if (item) list.appendChild(item);
    });

    if (!list.children.length) {
      list.innerHTML = "<p>لا توجد حركات مسجلة.</p>";
    }

    document.dispatchEvent(new CustomEvent("movements-loaded"));

  } catch (err) {
    console.error(err);
    list.innerHTML = "<p>تعذر تحميل الحركات.</p>";
  }
}

// ===============================
// عند جاهزية المستخدم
// ===============================

document.addEventListener("user-ready", () => {
  renderMovementsUI();
  loadMovements();
});
