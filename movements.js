// movements.js
import {
  db,
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "./firebase.js";

import {
  currentUserProfile
} from "./auth.js";

import {
  ROLE_DEVELOPER,
  ROLE_ADMIN,
  ROLE_SUPERVISOR,
  ROLE_MEMBER,
  canSeeAllMovements,
  canAddMovementForOthers
} from "./roles.js";

const movementsList = document.getElementById("movementsList");
const movementFormContainer = document.getElementById("movementFormContainer");
const addMovementBtn = document.getElementById("addMovementBtn");

// الحصول على توقيت GMT+4 وعرضه بصيغة 12 ساعة
function getNowInGmt4() {
  const nowUtc = new Date();
  const utcMs = nowUtc.getTime() + (nowUtc.getTimezoneOffset() * 60000);
  const gmt4Ms = utcMs + (4 * 60 * 60 * 1000);
  return new Date(gmt4Ms);
}

function formatTime12h(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "م" : "ص";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
}

function formatDateTimeGmt4Str(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${d}/${m}/${y} - ${formatTime12h(date)}`;
}

// هل يستطيع التعديل (عضو فقط خلال 24 ساعة)
function canEditMovement(docData, user) {
  if (!user) return false;
  const role = user.role;
  if ([ROLE_DEVELOPER, ROLE_ADMIN, ROLE_SUPERVISOR].includes(role)) return true;

  if (role === ROLE_MEMBER && docData.driverUid === user.uid) {
    const createdMs = new Date(docData.createdAtGmt4).getTime();
    const nowMs = getNowInGmt4().getTime();
    const diffHours = (nowMs - createdMs) / (1000 * 60 * 60);
    return diffHours <= 24;
  }
  return false;
}

function canDeleteMovement(docData, user) {
  if (!user) return false;
  return [ROLE_DEVELOPER, ROLE_ADMIN, ROLE_SUPERVISOR].includes(user.role);
}

// نموذج إضافة / تعديل حركة
function renderMovementForm(existing) {
  movementFormContainer.innerHTML = "";

  const isEdit = !!existing;
  const card = document.createElement("div");
  card.className = "card";

  const title = document.createElement("h3");
  title.textContent = isEdit ? "تعديل حركة" : "إضافة حركة جديدة";
  card.appendChild(title);

  const form = document.createElement("form");
  form.className = "form";

  const currentUser = currentUserProfile;
  const canForOthers = canAddMovementForOthers(currentUser.role);

  // خانات
  form.innerHTML = `
    <div class="form-group">
      <label>رقم السيارة</label>
      <input type="text" name="carNumber" required value="${existing?.carNumber || ""}" />
    </div>
    <div class="form-group">
      <label>كود اللوحة</label>
      <input type="text" name="plateCode" required value="${existing?.plateCode || ""}" />
    </div>
    <div class="form-group">
      <label>نوع السيارة</label>
      <input type="text" name="carType" required value="${existing?.carType || ""}" />
    </div>
    <div class="form-group">
      <label>اسم السائق</label>
      <input type="text" name="driverName" required ${canForOthers ? "" : "readonly"} value="${existing?.driverName || currentUser.fullName}" />
    </div>
    <div class="form-group">
      <label>نوع الحركة</label>
      <select name="movementType" required>
        <option value="">-- اختر --</option>
        <option value="استلام" ${existing?.movementType === "استلام" ? "selected" : ""}>استلام</option>
        <option value="تسليم" ${existing?.movementType === "تسليم" ? "selected" : ""}>تسليم</option>
      </select>
    </div>
    <div class="form-group">
      <label>ملاحظات</label>
      <textarea name="notes">${existing?.notes || ""}</textarea>
    </div>
    <p class="hint-text">
      التاريخ والوقت يتم تسجيلهما تلقائيًا بتوقيت GMT+4 بصيغة 12 ساعة، ولا يمكن التعديل عليهما.
    </p>
    <div class="form-inline" style="margin-top:0.5rem;">
      <button type="submit" class="btn btn-primary">${isEdit ? "حفظ التعديلات" : "حفظ"}</button>
      <button type="button" class="btn btn-secondary" id="cancelMovementForm">إلغاء</button>
    </div>
  `;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    const nowGmt4 = getNowInGmt4();
    const nowStr = formatDateTimeGmt4Str(nowGmt4);

    const movementData = {
      carNumber: data.carNumber.trim(),
      plateCode: data.plateCode.trim(),
      carType: data.carType.trim(),
      driverName: data.driverName.trim(),
      driverUid: canForOthers && existing ? existing.driverUid : currentUser.uid,
      movementType: data.movementType,
      notes: data.notes.trim(),
    };

    try {
      if (isEdit) {
        const docRef = doc(db, "movements", existing.id);
        const updatePayload = {
          ...movementData,
          lastEditedByUid: currentUser.uid,
          lastEditedByName: currentUser.fullName,
          lastEditedAtGmt4: nowStr,
          edited: true,
          originalSnapshot: existing.originalSnapshot || {
            carNumber: existing.carNumber,
            plateCode: existing.plateCode,
            carType: existing.carType,
            driverName: existing.driverName,
            movementType: existing.movementType,
            notes: existing.notes
          }
        };
        await updateDoc(docRef, updatePayload);
      } else {
        const colRef = collection(db, "movements");
        await addDoc(colRef, {
          ...movementData,
          createdAt: serverTimestamp(),
          createdAtGmt4: nowStr,
          edited: false
        });
      }
      movementFormContainer.classList.add("hidden");
      await loadMovements();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ الحركة.");
    }
  });

  card.appendChild(form);
  movementFormContainer.appendChild(card);
  movementFormContainer.classList.remove("hidden");

  const cancelBtn = document.getElementById("cancelMovementForm");
  cancelBtn.addEventListener("click", () => {
    movementFormContainer.classList.add("hidden");
  });
}

addMovementBtn.addEventListener("click", () => {
  renderMovementForm(null);
});

// رسم عنصر أكورديون لحركة واحدة
function renderMovementItem(docId, data) {
  const user = currentUserProfile;
  const canSeeAll = canSeeAllMovements(user.role);

  if (!canSeeAll && data.driverUid !== user.uid) {
    return null;
  }

  const item = document.createElement("div");
  item.className = "accordion-item";

  const header = document.createElement("div");
  header.className = "accordion-header";

  const headerMain = document.createElement("div");
  headerMain.className = "accordion-header-main";

  const title = document.createElement("div");
  title.className = "accordion-title";
  title.textContent = `${data.driverName} - ${data.carNumber}`;

  const subtitle = document.createElement("div");
  subtitle.className = "accordion-subtitle";
  subtitle.textContent = `${data.movementType} | كود اللوحة: ${data.plateCode}`;

  const meta = document.createElement("div");
  meta.className = "accordion-meta";
  meta.textContent = `التوقيت (GMT+4): ${data.createdAtGmt4 || ""}`;

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
    <div class="accordion-body-row">
      <span class="label">رقم السيارة:</span>
      <span class="value">${data.carNumber}</span>
    </div>
    <div class="accordion-body-row">
      <span class="label">كود اللوحة:</span>
      <span class="value">${data.plateCode}</span>
    </div>
    <div class="accordion-body-row">
      <span class="label">نوع السيارة:</span>
      <span class="value">${data.carType}</span>
    </div>
    <div class="accordion-body-row">
      <span class="label">اسم السائق:</span>
      <span class="value">${data.driverName}</span>
    </div>
    <div class="accordion-body-row">
      <span class="label">نوع الحركة:</span>
      <span class="value">${data.movementType}</span>
    </div>
    <div class="accordion-body-row">
      <span class="label">ملاحظات:</span>
      <span class="value">${data.notes || "-"}</span>
    </div>
    ${data.edited ? `
      <div class="accordion-body-row">
        <span class="label">تم التعديل بواسطة:</span>
        <span class="value">${data.lastEditedByName || ""}</span>
      </div>
      <div class="accordion-body-row">
        <span class="label">تاريخ التعديل:</span>
        <span class="value">${data.lastEditedAtGmt4 || ""}</span>
      </div>
      <div class="edited-original">
        النص الأصلي محفوظ:
        رقم السيارة: ${data.originalSnapshot?.carNumber || ""}،
        كود اللوحة: ${data.originalSnapshot?.plateCode || ""}،
        نوع السيارة: ${data.originalSnapshot?.carType || ""}،
        نوع الحركة: ${data.originalSnapshot?.movementType || ""}،
        ملاحظات: ${data.originalSnapshot?.notes || ""}
      </div>
    ` : ""}
  `;

  const actions = document.createElement("div");
  actions.className = "accordion-actions";

  // أزرار: مشاركة، طباعة، تعديل، حذف
  const shareBtn = document.createElement("button");
  shareBtn.className = "btn btn-secondary";
  shareBtn.textContent = "📤 مشاركة";
  shareBtn.addEventListener("click", () => {
    const text = `
حركة سيارة
السائق: ${data.driverName}
رقم السيارة: ${data.carNumber}
كود اللوحة: ${data.plateCode}
نوع السيارة: ${data.carType}
نوع الحركة: ${data.movementType}
التاريخ/الوقت (GMT+4): ${data.createdAtGmt4 || ""}
ملاحظات: ${data.notes || "-"}
    `.trim();
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      alert("تم نسخ البيانات إلى الحافظة.");
    }
  });

  const printBtn = document.createElement("button");
  printBtn.className = "btn btn-secondary";
  printBtn.textContent = "🖨 طباعة";
  printBtn.addEventListener("click", () => {
    const w = window.open("", "_blank");
    w.document.write(`
      <html dir="rtl" lang="ar"><head><title>طباعة حركة سيارة</title></head><body>
      <h2>حركة سيارة</h2>
      <p>السائق: ${data.driverName}</p>
      <p>رقم السيارة: ${data.carNumber}</p>
      <p>كود اللوحة: ${data.plateCode}</p>
      <p>نوع السيارة: ${data.carType}</p>
      <p>نوع الحركة: ${data.movementType}</p>
      <p>التاريخ/الوقت (GMT+4): ${data.createdAtGmt4 || ""}</p>
      <p>ملاحظات: ${data.notes || "-"}</p>
      </body></html>
    `);
    w.document.close();
    w.print();
  });

  actions.appendChild(shareBtn);
  actions.appendChild(printBtn);

  if (canEditMovement(data, user)) {
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-primary";
    editBtn.textContent = "✏ تعديل";
    editBtn.addEventListener("click", () => {
      renderMovementForm({ id: docId, ...data });
    });
    actions.appendChild(editBtn);
  }

  if (canDeleteMovement(data, user)) {
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger";
    deleteBtn.textContent = "🗑 حذف";
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("هل أنت متأكد من حذف هذه الحركة؟")) return;
      try {
        await deleteDoc(doc(db, "movements", docId));
        await loadMovements();
      } catch (err) {
        console.error(err);
        alert("حدث خطأ أثناء الحذف.");
      }
    });
    actions.appendChild(deleteBtn);
  }

  body.appendChild(actions);

  header.addEventListener("click", () => {
    const isHidden = body.classList.contains("hidden");
    body.classList.toggle("hidden", !isHidden);
    toggle.textContent = isHidden ? "▲" : "▼";
  });

  item.appendChild(header);
  item.appendChild(body);

  // علامة تم التعديل
  if (data.edited) {
    const badge = document.createElement("span");
    badge.className = "badge-edited";
    badge.textContent = "تم التعديل";
    title.appendChild(badge);
  }

  return item;
}

// تحميل الحركات
export async function loadMovements() {
  if (!movementsList) return;
  movementsList.innerHTML = "";

  try {
    const colRef = collection(db, "movements");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    snap.forEach(docSnap => {
      const data = docSnap.data();
      const item = renderMovementItem(docSnap.id, data);
      if (item) movementsList.appendChild(item);
    });

    document.dispatchEvent(new CustomEvent("movements-loaded"));
  } catch (err) {
    console.error(err);
    movementsList.innerHTML = "<p>تعذر تحميل الحركات.</p>";
  }
}

// عند جاهزية المستخدم
document.addEventListener("user-ready", () => {
  loadMovements();
});
