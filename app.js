// نظام إدارة السيارات - مجموعة المسعود
// الملف الرئيسي للتطبيق

// حالات التطبيق
let currentUser = null;
let currentTab = 'movements';
let editMode = false;
let currentEditId = null;
let currentDeleteId = null;
let currentDeleteType = null;
let members = [];
let movements = [];
let custody = [];
let fleet = [];
let searchQuery = '';

// تهيئة Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// تعريف المجموعات (Collections)
const USERS_COLLECTION = "users";
const MOVEMENTS_COLLECTION = "movements";
const CUSTODY_COLLECTION = "custody";
const FLEET_COLLECTION = "fleet";
const SETTINGS_COLLECTION = "settings";

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
    checkAuthState();
});

// تهيئة التطبيق
function initApp() {
    // إضافة المستخدم الافتراضي (المطور) إذا لم يكن موجوداً
    createDefaultUser();
    
    // تحميل البيانات
    loadAllData();
    
    // تهيئة Service Worker لـ PWA
    initServiceWorker();
    
    // تحديث الوقت الحالي
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000); // تحديث كل دقيقة
}

// إنشاء المستخدم الافتراضي
async function createDefaultUser() {
    try {
        const usersQuery = query(collection(db, USERS_COLLECTION), where("username", "==", "Admin"));
        const querySnapshot = await getDocs(usersQuery);
        
        if (querySnapshot.empty) {
            const defaultUser = {
                name: "مطور النظام",
                username: "Admin",
                phone: "0000000000",
                role: "مطور",
                contractor: false,
                createdAt: new Date().toISOString(),
                createdBy: "system"
            };
            
            // في التطبيق الحقيقي، سيتم تخزين كلمة المرور في Firebase Auth
            // هنا نستخدم Firestore فقط لأغراض العرض
            await addDoc(collection(db, USERS_COLLECTION), defaultUser);
            console.log("تم إنشاء المستخدم الافتراضي");
        }
    } catch (error) {
        console.error("خطأ في إنشاء المستخدم الافتراضي:", error);
    }
}

// تهيئة Service Worker
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker مسجل بنجاح:', registration.scope);
            })
            .catch(error => {
                console.log('فشل تسجيل Service Worker:', error);
            });
    }
}

// تحديث الوقت الحالي
function updateCurrentTime() {
    const now = new Date();
    const gmt4Time = new Date(now.getTime() + (4 * 60 * 60 * 1000));
    
    const options = {
        timeZone: 'UTC',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formatted = formatter.format(gmt4Time);
    // سيتم عرض الوقت في المكان المناسب في الواجهة
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تسجيل الدخول
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    // تسجيل الخروج
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // التنقل بين التبويبات
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // تحديث البيانات
    document.getElementById('refreshBtn').addEventListener('click', refreshData);
    
    // البحث
    document.getElementById('searchToggle').addEventListener('click', toggleSearch);
    document.getElementById('globalSearch').addEventListener('input', handleSearch);
    document.getElementById('clearSearch').addEventListener('click', clearSearch);
    
    // إضافة بيانات جديدة
    document.getElementById('addMovementBtn').addEventListener('click', () => openMovementModal());
    document.getElementById('addCustodyBtn').addEventListener('click', () => openCustodyModal());
    document.getElementById('addFleetBtn').addEventListener('click', () => openFleetModal());
    document.getElementById('addMemberBtn').addEventListener('click', () => openMemberModal());
    
    // حفظ النماذج
    document.getElementById('movementForm').addEventListener('submit', saveMovement);
    document.getElementById('custodyForm').addEventListener('submit', saveCustody);
    document.getElementById('fleetForm').addEventListener('submit', saveFleet);
    document.getElementById('memberForm').addEventListener('submit', saveMember);
    
    // إغلاق النوافذ المنبثقة
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // النقر خارج النافذة المنبثقة لإغلاقها
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeAllModals();
        });
    });
    
    // تأكيد الحذف
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // إعدادات النظام (للمطور)
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchSettingsTab(this.dataset.settingsTab);
        });
    });
    
    // إضافة حقول مخصصة
    document.getElementById('addMovementFieldBtn').addEventListener('click', addCustomField.bind(null, 'movement'));
    document.getElementById('addCustodyFieldBtn').addEventListener('click', addCustomField.bind(null, 'custody'));
    document.getElementById('addFleetFieldBtn').addEventListener('click', addCustomField.bind(null, 'fleet'));
}

// التحقق من حالة المصادقة
function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // المستخدم مسجل الدخول
            loadUserData(user.uid);
        } else {
            // المستخدم غير مسجل الدخول
            showLoginScreen();
        }
    });
}

// تحميل بيانات المستخدم
async function loadUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
        if (userDoc.exists()) {
            currentUser = {
                id: userId,
                ...userDoc.data()
            };
            showMainApp();
            updateUIForUserRole();
            loadAllData();
        } else {
            showToast('بيانات المستخدم غير موجودة', 'error');
            handleLogout();
        }
    } catch (error) {
        console.error('خطأ في تحميل بيانات المستخدم:', error);
        showToast('حدث خطأ في تحميل البيانات', 'error');
    }
}

// عرض شاشة تسجيل الدخول
function showLoginScreen() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('mainScreen').classList.remove('active');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').style.display = 'none';
}

// عرض التطبيق الرئيسي
function showMainApp() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    
    // تحديث معلومات المستخدم في الواجهة
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userRole').textContent = currentUser.role;
        
        // تعيين لون الدور
        const roleElement = document.getElementById('userRole');
        roleElement.className = 'role-' + getRoleClass(currentUser.role);
        
        // إخفاء/إظهار العناصر حسب الصلاحية
        updatePermissionsUI();
    }
}

// تسجيل الدخول
async function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorElement = document.getElementById('loginError');
    
    if (!username || !password) {
        errorElement.textContent = 'يرجى إدخال اسم المستخدم وكلمة المرور';
        errorElement.style.display = 'block';
        return;
    }
    
    // في التطبيق الحقيقي، ستتم المصادقة عبر Firebase Auth
    // هنا سنستخدم محاكاة للمصادقة لأغراض العرض
    
    showLoading(true);
    
    try {
        // البحث عن المستخدم في قاعدة البيانات
        const usersQuery = query(collection(db, USERS_COLLECTION), where("username", "==", username));
        const querySnapshot = await getDocs(usersQuery);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            
            // في التطبيق الحقيقي، ستتم المقارنة باستخدام Firebase Auth
            // هنا نتحقق من كلمة المرور مباشرة (لأغراض العرض فقط)
            if (password === 'admin123' || userData.password === password) {
                // نجاح تسجيل الدخول
                currentUser = {
                    id: userDoc.id,
                    ...userData
                };
                
                // محاكاة تسجيل الدخول في Firebase Auth
                // في التطبيق الحقيقي، ستستخدم signInWithEmailAndPassword
                
                showMainApp();
                showToast('تم تسجيل الدخول بنجاح', 'success');
                
                // تحديث السجل
                await updateDoc(doc(db, USERS_COLLECTION, userDoc.id), {
                    lastLogin: new Date().toISOString()
                });
                
            } else {
                errorElement.textContent = 'كلمة المرور غير صحيحة';
                errorElement.style.display = 'block';
            }
        } else {
            errorElement.textContent = 'اسم المستخدم غير موجود';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        errorElement.textContent = 'حدث خطأ أثناء تسجيل الدخول';
        errorElement.style.display = 'block';
    } finally {
        showLoading(false);
    }
}

// تسجيل الخروج
async function handleLogout() {
    try {
        await signOut(auth);
        currentUser = null;
        showLoginScreen();
        showToast('تم تسجيل الخروج بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error);
        showToast('حدث خطأ أثناء تسجيل الخروج', 'error');
    }
}

// التبديل بين التبويبات
function switchTab(tabName) {
    // تحديث الأزرار النشطة
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // تحديث المحتوى النشط
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    currentTab = tabName;
    
    // إخفاء تبويب الإعدادات إذا لم يكن المستخدم مطوراً
    if (tabName === 'settings' && currentUser.role !== 'مطور') {
        switchTab('movements');
        showToast('لا تملك صلاحية الوصول إلى هذا القسم', 'warning');
        return;
    }
    
    // تحديث البيانات المعروضة
    updateDisplayedData();
}

// تحديث واجهة المستخدم حسب الصلاحية
function updatePermissionsUI() {
    const userRole = currentUser?.role;
    
    // إخفاء/إظهار تبويب الإعدادات
    const settingsTab = document.getElementById('settingsTab');
    if (userRole === 'مطور') {
        settingsTab.style.display = 'flex';
    } else {
        settingsTab.style.display = 'none';
    }
    
    // إخفاء/إظهار قسم الأسطول
    const fleetNavBtn = document.querySelector('.nav-btn[data-tab="fleet"]');
    if (userRole === 'عضو') {
        fleetNavBtn.style.display = 'none';
        document.getElementById('statsSection').style.display = 'none';
    } else {
        fleetNavBtn.style.display = 'flex';
        document.getElementById('statsSection').style.display = 'grid';
    }
    
    // تحديث الإحصائيات
    updateStatistics();
}

// تحميل جميع البيانات
async function loadAllData() {
    showLoading(true);
    
    try {
        // تحميل الأعضاء
        const membersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
        members = membersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // تحميل الحركات
        const movementsQuery = query(collection(db, MOVEMENTS_COLLECTION), orderBy('createdAt', 'desc'));
        const movementsSnapshot = await getDocs(movementsQuery);
        movements = movementsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // تحميل العهدة
        const custodySnapshot = await getDocs(collection(db, CUSTODY_COLLECTION));
        custody = custodySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // تحميل الأسطول
        const fleetSnapshot = await getDocs(collection(db, FLEET_COLLECTION));
        fleet = fleetSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // تحديث الواجهة
        updateDisplayedData();
        updateStatistics();
        populateMemberSelects();
        
        showToast('تم تحديث البيانات بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        showToast('حدث خطأ في تحميل البيانات', 'error');
    } finally {
        showLoading(false);
    }
}

// تحديث البيانات المعروضة
function updateDisplayedData() {
    switch (currentTab) {
        case 'movements':
            displayMovements();
            break;
        case 'custody':
            displayCustody();
            break;
        case 'fleet':
            displayFleet();
            break;
        case 'members':
            displayMembers();
            break;
        case 'settings':
            displaySettings();
            break;
    }
}

// عرض الحركات
function displayMovements() {
    const container = document.getElementById('movementsList');
    container.innerHTML = '';
    
    // تصفية الحركات حسب صلاحية المستخدم
    let filteredMovements = movements;
    
    if (currentUser.role === 'عضو') {
        filteredMovements = movements.filter(m => m.driverId === currentUser.id || m.addedBy === currentUser.id);
    }
    
    // تطبيق البحث إذا كان موجوداً
    if (searchQuery) {
        filteredMovements = filteredMovements.filter(m => 
            m.carNumber?.includes(searchQuery) ||
            m.plateCode?.includes(searchQuery) ||
            m.carType?.includes(searchQuery) ||
            m.driverName?.includes(searchQuery) ||
            m.movementType?.includes(searchQuery) ||
            m.notes?.includes(searchQuery)
        );
    }
    
    if (filteredMovements.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exchange-alt"></i>
                <h3>لا توجد حركات</h3>
                <p>${searchQuery ? 'لا توجد نتائج للبحث' : 'لم يتم إضافة أي حركات بعد'}</p>
            </div>
        `;
        return;
    }
    
    filteredMovements.forEach(movement => {
        const canEdit = canUserEditMovement(movement);
        const canDelete = canUserDeleteMovement(movement);
        
        const movementElement = document.createElement('div');
        movementElement.className = 'accordion-item';
        movementElement.innerHTML = `
            <div class="accordion-header">
                <div class="accordion-title">
                    <h4>${movement.driverName} - ${movement.carNumber}</h4>
                    <p>${formatDate(movement.createdAt)} | ${movement.carType}</p>
                </div>
                <div class="accordion-badges">
                    <span class="badge ${movement.movementType === 'استلام' ? 'badge-receive' : 'badge-deliver'}">
                        ${movement.movementType}
                    </span>
                    ${movement.edited ? '<span class="badge" style="background-color: #f39c12;">تم التعديل</span>' : ''}
                </div>
                <div class="accordion-actions">
                    <button class="action-btn share" title="مشاركة" onclick="shareItem('movement', '${movement.id}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="action-btn print" title="طباعة" onclick="printItem('movement', '${movement.id}')">
                        <i class="fas fa-print"></i>
                    </button>
                    ${canEdit ? `
                        <button class="action-btn edit" title="تعديل" onclick="editMovement('${movement.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    ` : ''}
                    ${canDelete ? `
                        <button class="action-btn delete" title="حذف" onclick="confirmDeleteItem('movement', '${movement.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="accordion-content">
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">رقم السيارة:</span>
                        <div class="detail-value">${movement.carNumber || ''}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">كود اللوحة:</span>
                        <div class="detail-value">${movement.plateCode || ''}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">نوع السيارة:</span>
                        <div class="detail-value">${movement.carType || ''}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">اسم السائق:</span>
                        <div class="detail-value">${movement.driverName || ''}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">نوع الحركة:</span>
                        <div class="detail-value">${movement.movementType || ''}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">التاريخ والوقت:</span>
                        <div class="detail-value">${formatDateTime(movement.createdAt)}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">ملاحظات:</span>
                        <div class="detail-value ${movement.edited ? 'edited' : ''}">
                            ${movement.notes || 'لا توجد ملاحظات'}
                            ${movement.originalNotes ? `
                                <div class="original-value">
                                    <strong>النص الأصلي:</strong> ${movement.originalNotes}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">أضيف بواسطة:</span>
                        <div class="detail-value">${movement.addedByName || 'غير معروف'}</div>
                    </div>
                    ${movement.editedBy ? `
                        <div class="detail-item">
                            <span class="detail-label">عدل بواسطة:</span>
                            <div class="detail-value">${movement.editedByName || 'غير معروف'}</div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">تاريخ التعديل:</span>
                            <div class="detail-value">${formatDateTime(movement.editedAt)}</div>
                        </div>
                    ` : ''}
                </div>
                
                ${movement.editHistory && movement.editHistory.length > 0 ? `
                    <div class="edit-history">
                        <button class="edit-history-btn" onclick="showEditHistory('${movement.id}', 'movement')">
                            <i class="fas fa-history"></i> عرض سجل التعديلات
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        container.appendChild(movementElement);
    });
    
    // إضافة مستمعي الأحداث للأكورديون
    initAccordion();
}

// عرض العهدة
function displayCustody() {
    const container = document.getElementById('custodyList');
    container.innerHTML = '';
    
    // تصفية العهدة حسب صلاحية المستخدم
    let filteredCustody = custody;
    
    if (currentUser.role === 'عضو') {
        filteredCustody = custody.filter(c => c.memberId === currentUser.id);
    }
    
    // تطبيق البحث إذا كان موجوداً
    if (searchQuery) {
        filteredCustody = filteredCustody.filter(c => 
            c.carNumber?.includes(searchQuery) ||
            c.plateCode?.includes(searchQuery) ||
            c.memberName?.includes(searchQuery) ||
            c.owner?.includes(searchQuery) ||
            c.carType?.includes(searchQuery) ||
            c.notes?.includes(searchQuery)
        );
    }
    
    // تجميع السيارات حسب المتعهد
    const custodyByMember = {};
    filteredCustody.forEach(item => {
        if (!custodyByMember[item.memberId]) {
            custodyByMember[item.memberId] = {
                memberName: item.memberName,
                items: []
            };
        }
        custodyByMember[item.memberId].items.push(item);
    });
    
    if (Object.keys(custodyByMember).length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>لا توجد عهدة</h3>
                <p>${searchQuery ? 'لا توجد نتائج للبحث' : 'لم يتم إضافة أي عهدة بعد'}</p>
            </div>
        `;
        return;
    }
    
    Object.entries(custodyByMember).forEach(([memberId, data]) => {
        const memberElement = document.createElement('div');
        memberElement.className = 'accordion-item';
        memberElement.innerHTML = `
            <div class="accordion-header">
                <div class="accordion-title">
                    <h4>${data.memberName}</h4>
                    <p>${data.items.length} سيارة في العهدة</p>
                </div>
                <div class="accordion-actions">
                    <button class="action-btn share" title="مشاركة" onclick="shareItem('custody-member', '${memberId}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="action-btn print" title="طباعة" onclick="printItem('custody-member', '${memberId}')">
                        <i class="fas fa-print"></i>
                    </button>
                    ${canUserAddCustody() ? `
                        <button class="action-btn edit" title="تعديل" onclick="editCustodyMember('${memberId}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" title="حذف" onclick="confirmDeleteCustodyMember('${memberId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="accordion-content">
                <div class="custody-cars-list">
                    ${data.items.map(item => `
                        <div class="custody-car-item">
                            <div class="car-info">
                                <h5>${item.carNumber} - ${item.carType}</h5>
                                <p>كود اللوحة: ${item.plateCode} | المالك: ${item.owner}</p>
                                ${item.notes ? `<p class="car-notes">ملاحظات: ${item.notes}</p>` : ''}
                            </div>
                            <div class="car-actions">
                                <button class="action-btn share" title="مشاركة" onclick="shareItem('custody', '${item.id}')">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                                <button class="action-btn print" title="طباعة" onclick="printItem('custody', '${item.id}')">
                                    <i class="fas fa-print"></i>
                                </button>
                                ${canUserEditCustody(item) ? `
                                    <button class="action-btn edit" title="تعديل" onclick="editCustody('${item.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                ` : ''}
                                ${canUserDeleteCustody(item) ? `
                                    <button class="action-btn delete" title="حذف" onclick="confirmDeleteItem('custody', '${item.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.appendChild(memberElement);
    });
    
    initAccordion();
}

// عرض الأسطول
function displayFleet() {
    if (currentUser.role === 'عضو') {
        document.getElementById('fleetTab').innerHTML = `
            <div class="access-denied">
                <i class="fas fa-ban"></i>
                <h3>غير مسموح بالوصول</h3>
                <p>لا تملك صلاحية الوصول إلى قسم الأسطول</p>
            </div>
        `;
        return;
    }
    
    const container = document.getElementById('fleetList');
    container.innerHTML = '';
    
    // تطبيق البحث إذا كان موجوداً
    let filteredFleet = fleet;
    if (searchQuery) {
        filteredFleet = fleet.filter(f => 
            f.carNumber?.includes(searchQuery) ||
            f.plateCode?.includes(searchQuery) ||
            f.owner?.includes(searchQuery) ||
            f.carType?.includes(searchQuery) ||
            f.memberName?.includes(searchQuery) ||
            f.notes?.includes(searchQuery)
        );
    }
    
    if (filteredFleet.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-truck-moving"></i>
                <h3>لا توجد سيارات في الأسطول</h3>
                <p>${searchQuery ? 'لا توجد نتائج للبحث' : 'لم يتم إضافة أي سيارات للأسطول بعد'}</p>
            </div>
        `;
        return;
    }
    
    filteredFleet.forEach(car => {
        // التحقق من انتهاء التواريخ
        const licenseWarning = checkDateWarning(car.licenseEnd);
        const insuranceWarning = checkDateWarning(car.insuranceEnd);
        
        const carElement = document.createElement('div');
        carElement.className = 'accordion-item';
        carElement.innerHTML = `
            <div class="accordion-header">
                <div class="accordion-title">
                    <h4>${car.carNumber} - ${car.carType}</h4>
                    <p>${car.owner} ${car.memberName ? `| المتعهد: ${car.memberName}` : ''}</p>
                </div>
                <div class="accordion-badges">
                    ${licenseWarning ? `<span class="badge" style="background-color: #e74c3c;">${licenseWarning}</span>` : ''}
                    ${insuranceWarning ? `<span class="badge" style="background-color: #e74c3c;">${insuranceWarning}</span>` : ''}
                </div>
                <div class="accordion-actions">
                    <button class="action-btn share" title="مشاركة" onclick="shareItem('fleet', '${car.id}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="action-btn print" title="طباعة" onclick="printItem('fleet', '${car.id}')">
                        <i class="fas fa-print"></i>
                    </button>
                    ${canUserEditFleet() ? `
                        <button class="action-btn edit" title="تعديل" onclick="editFleet('${car.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    ` : ''}
                    ${canUserDeleteFleet() ? `
                        <button class="action-btn delete" title="حذف" onclick="confirmDeleteItem('fleet', '${car.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="accordion-content">
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">رقم السيارة:</span>
                        <div class="detail-value">${car.carNumber || ''}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">كود اللوحة:</span>
                        <div class="detail-value">${car.plateCode || ''}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">المالك:</span>
                        <div class="detail-value">${car.owner || ''}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">نوع السيارة:</span>
                        <div class="detail-value">${car.carType || ''}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">من المتعهد:</span>
                        <div class="detail-value">${car.memberName || 'غير محدد'}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">تاريخ نهاية الترخيص:</span>
                        <div class="detail-value ${licenseWarning ? 'edited' : ''}">
                            ${formatDate(car.licenseEnd)}
                            ${licenseWarning ? `<div class="edited-badge">${licenseWarning}</div>` : ''}
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">تاريخ نهاية التأمين:</span>
                        <div class="detail-value ${insuranceWarning ? 'edited' : ''}">
                            ${formatDate(car.insuranceEnd)}
                            ${insuranceWarning ? `<div class="edited-badge">${insuranceWarning}</div>` : ''}
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">ملاحظات:</span>
                        <div class="detail-value">${car.notes || 'لا توجد ملاحظات'}</div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(carElement);
    });
    
    initAccordion();
}

// عرض الأعضاء
function displayMembers() {
    const container = document.getElementById('membersList');
    container.innerHTML = '';
    
    // تصفية الأعضاء حسب البحث
    let filteredMembers = members;
    if (searchQuery) {
        filteredMembers = members.filter(m => 
            m.name?.includes(searchQuery) ||
            m.username?.includes(searchQuery) ||
            m.phone?.includes(searchQuery) ||
            m.role?.includes(searchQuery)
        );
    }
    
    // إخفاء المستخدم الحالي إذا لم يكن مطوراً
    if (currentUser.role !== 'مطور') {
        filteredMembers = filteredMembers.filter(m => m.id !== currentUser.id);
    }
    
    if (filteredMembers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>لا يوجد أعضاء</h3>
                <p>${searchQuery ? 'لا توجد نتائج للبحث' : 'لم يتم إضافة أي أعضاء بعد'}</p>
            </div>
        `;
        return;
    }
    
    filteredMembers.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.className = 'member-card';
        
        const roleClass = getRoleClass(member.role);
        const roleColor = getRoleColor(member.role);
        
        memberElement.innerHTML = `
            <div class="member-header">
                <div class="member-name">${member.name}</div>
                <div class="member-role-badge" style="background-color: ${roleColor}">
                    ${member.role}
                </div>
            </div>
            <div class="member-details">
                <div class="member-detail">
                    <span class="detail-label">اسم المستخدم:</span>
                    <span class="detail-value">${member.username}</span>
                </div>
                <div class="member-detail">
                    <span class="detail-label">رقم الموبايل:</span>
                    <span class="detail-value">${member.phone}</span>
                </div>
                <div class="member-detail">
                    <span class="detail-label">متعهد:</span>
                    <span class="detail-value">${member.contractor ? 'نعم' : 'لا'}</span>
                </div>
                <div class="member-detail">
                    <span class="detail-label">تاريخ الإضافة:</span>
                    <span class="detail-value">${formatDate(member.createdAt)}</span>
                </div>
            </div>
            <div class="member-actions">
                <button class="action-btn share" title="مشاركة" onclick="shareItem('member', '${member.id}')">
                    <i class="fas fa-share-alt"></i>
                </button>
                <button class="action-btn print" title="طباعة" onclick="printItem('member', '${member.id}')">
                    <i class="fas fa-print"></i>
                </button>
                ${canUserEditMember(member) ? `
                    <button class="action-btn edit" title="تعديل" onclick="editMember('${member.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                ` : ''}
                ${canUserDeleteMember(member) ? `
                    <button class="action-btn delete" title="حذف" onclick="confirmDeleteItem('member', '${member.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        `;
        
        container.appendChild(memberElement);
    });
}

// عرض الإعدادات (للمطور فقط)
function displaySettings() {
    if (currentUser.role !== 'مطور') {
        switchTab('movements');
        return;
    }
    
    // تحميل إعدادات الحقول المخصصة
    loadCustomFields();
}

// تحميل الحقول المخصصة
async function loadCustomFields() {
    try {
        const settingsSnapshot = await getDocs(collection(db, SETTINGS_COLLECTION));
        const settings = {};
        settingsSnapshot.forEach(doc => {
            settings[doc.id] = doc.data();
        });
        
        // عرض الحقول المخصصة لكل قسم
        displayCustomFields('movement', settings.movementFields);
        displayCustomFields('custody', settings.custodyFields);
        displayCustomFields('fleet', settings.fleetFields);
    } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
    }
}

// عرض الحقول المخصصة
function displayCustomFields(section, fields) {
    const container = document.getElementById(section + 'FieldsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!fields || fields.length === 0) {
        container.innerHTML = '<p class="no-fields">لا توجد حقول مخصصة</p>';
        return;
    }
    
    fields.forEach((field, index) => {
        const fieldElement = document.createElement('div');
        fieldElement.className = 'field-item';
        fieldElement.innerHTML = `
            <div class="field-info">
                <h5>${field.name}</h5>
                <span>نوع: ${field.type}</span>
            </div>
            <div class="field-actions">
                <button class="action-btn edit" onclick="editCustomField('${section}', ${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteCustomField('${section}', ${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(fieldElement);
    });
}

// إضافة حقل مخصص
async function addCustomField(section) {
    const nameInput = document.getElementById('new' + capitalizeFirstLetter(section) + 'Field');
    const typeInput = document.getElementById('new' + capitalizeFirstLetter(section) + 'FieldType');
    
    const name = nameInput.value.trim();
    const type = typeInput.value;
    
    if (!name) {
        showToast('يرجى إدخال اسم الحقل', 'warning');
        return;
    }
    
    try {
        const settingsRef = doc(db, SETTINGS_COLLECTION, section + 'Fields');
        const settingsDoc = await getDoc(settingsRef);
        
        let fields = [];
        if (settingsDoc.exists()) {
            fields = settingsDoc.data().fields || [];
        }
        
        fields.push({ name, type });
        
        await setDoc(settingsRef, { fields }, { merge: true });
        
        showToast('تم إضافة الحقل بنجاح', 'success');
        nameInput.value = '';
        
        // تحديث العرض
        displayCustomFields(section, fields);
    } catch (error) {
        console.error('خطأ في إضافة الحقل:', error);
        showToast('حدث خطأ في إضافة الحقل', 'error');
    }
}

// تحديث الإحصائيات
function updateStatistics() {
    // إجمالي الحركات
    let totalMovements = movements.length;
    if (currentUser.role === 'عضو') {
        totalMovements = movements.filter(m => m.driverId === currentUser.id || m.addedBy === currentUser.id).length;
    }
    document.getElementById('totalMovements').textContent = totalMovements;
    
    // إجمالي العهدة
    let totalCustody = custody.length;
    if (currentUser.role === 'عضو') {
        totalCustody = custody.filter(c => c.memberId === currentUser.id).length;
    }
    document.getElementById('totalCustody').textContent = totalCustody;
    
    // إجمالي الأسطول
    document.getElementById('totalFleet').textContent = currentUser.role === 'عضو' ? 0 : fleet.length;
    
    // إجمالي الأعضاء
    document.getElementById('totalMembers').textContent = members.length;
}

// البحث
function handleSearch() {
    searchQuery = document.getElementById('globalSearch').value.trim();
    updateDisplayedData();
}

function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.style.display = searchBar.style.display === 'none' ? 'block' : 'none';
    if (searchBar.style.display === 'block') {
        document.getElementById('globalSearch').focus();
    }
}

function clearSearch() {
    document.getElementById('globalSearch').value = '';
    searchQuery = '';
    updateDisplayedData();
}

// النوافذ المنبثقة
function openMovementModal(movementId = null) {
    const modal = document.getElementById('movementModal');
    const title = document.getElementById('movementModalTitle');
    const form = document.getElementById('movementForm');
    
    editMode = !!movementId;
    currentEditId = movementId;
    
    if (editMode) {
        title.textContent = 'تعديل حركة';
        
        // تحميل بيانات الحركة
        const movement = movements.find(m => m.id === movementId);
        if (movement) {
            document.getElementById('movementCarNumber').value = movement.carNumber || '';
            document.getElementById('movementPlateCode').value = movement.plateCode || '';
            document.getElementById('movementCarType').value = movement.carType || '';
            document.getElementById('movementDriver').value = movement.driverId || '';
            
            // تعيين نوع الحركة
            const movementTypeRadios = document.querySelectorAll('input[name="movementType"]');
            movementTypeRadios.forEach(radio => {
                if (radio.value === movement.movementType) {
                    radio.checked = true;
                }
            });
            
            document.getElementById('movementNotes').value = movement.notes || '';
        }
    } else {
        title.textContent = 'إضافة حركة جديدة';
        form.reset();
    }
    
    modal.classList.add('active');
}

function openCustodyModal(custodyId = null) {
    // نفس المنطق لحركة
}

function openFleetModal(fleetId = null) {
    // نفس المنطق لحركة
}

function openMemberModal(memberId = null) {
    // نفس المنطق لحركة
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    editMode = false;
    currentEditId = null;
}

// حفظ البيانات
async function saveMovement(e) {
    e.preventDefault();
    
    if (!validateMovementForm()) return;
    
    showLoading(true);
    
    try {
        const movementData = {
            carNumber: document.getElementById('movementCarNumber').value.trim(),
            plateCode: document.getElementById('movementPlateCode').value.trim(),
            carType: document.getElementById('movementCarType').value,
            driverId: document.getElementById('movementDriver').value,
            driverName: document.getElementById('movementDriver').selectedOptions[0].text,
            movementType: document.querySelector('input[name="movementType"]:checked').value,
            notes: document.getElementById('movementNotes').value.trim(),
            addedBy: currentUser.id,
            addedByName: currentUser.name,
            createdAt: new Date().toISOString()
        };
        
        if (editMode) {
            // تحديث حركة موجودة
            const originalMovement = movements.find(m => m.id === currentEditId);
            const updateData = {
                ...movementData,
                edited: true,
                editedBy: currentUser.id,
                editedByName: currentUser.name,
                editedAt: new Date().toISOString(),
                originalNotes: originalMovement.notes !== movementData.notes ? originalMovement.notes : null
            };
            
            // حفظ سجل التعديل
            const editHistory = originalMovement.editHistory || [];
            editHistory.push({
                editedBy: currentUser.id,
                editedByName: currentUser.name,
                editedAt: new Date().toISOString(),
                changes: getObjectChanges(originalMovement, movementData)
            });
            
            updateData.editHistory = editHistory;
            
            await updateDoc(doc(db, MOVEMENTS_COLLECTION, currentEditId), updateData);
            showToast('تم تحديث الحركة بنجاح', 'success');
        } else {
            // إضافة حركة جديدة
            await addDoc(collection(db, MOVEMENTS_COLLECTION), movementData);
            showToast('تم إضافة الحركة بنجاح', 'success');
        }
        
        closeAllModals();
        loadAllData();
    } catch (error) {
        console.error('خطأ في حفظ الحركة:', error);
        showToast('حدث خطأ في حفظ الحركة', 'error');
    } finally {
        showLoading(false);
    }
}

// نفس المنطق لحفظ العهدة، الأسطول، الأعضاء

// التحقق من الصلاحيات
function canUserEditMovement(movement) {
    const userRole = currentUser.role;
    
    if (userRole === 'مطور' || userRole === 'مدير' || userRole === 'مشرف') {
        return true;
    }
    
    if (userRole === 'عضو') {
        // يمكن للعضو التعديل في غضون 24 ساعة فقط
        if (movement.addedBy === currentUser.id || movement.driverId === currentUser.id) {
            const movementDate = new Date(movement.createdAt);
            const now = new Date();
            const hoursDiff = (now - movementDate) / (1000 * 60 * 60);
            
            return hoursDiff <= 24;
        }
    }
    
    return false;
}

function canUserDeleteMovement(movement) {
    const userRole = currentUser.role;
    return userRole === 'مطور' || userRole === 'مدير' || userRole === 'مشرف';
}

function canUserAddCustody() {
    const userRole = currentUser.role;
    return userRole === 'مطور' || userRole === 'مدير' || userRole === 'مشرف';
}

function canUserEditCustody(custodyItem) {
    const userRole = currentUser.role;
    return userRole === 'مطور' || userRole === 'مدير' || userRole === 'مشرف';
}

function canUserDeleteCustody(custodyItem) {
    const userRole = currentUser.role;
    return userRole === 'مطور' || userRole === 'مدير' || userRole === 'مشرف';
}

function canUserEditFleet() {
    const userRole = currentUser.role;
    return userRole === 'مطور' || userRole === 'مدير' || userRole === 'مشرف';
}

function canUserDeleteFleet() {
    const userRole = currentUser.role;
    return userRole === 'مطور' || userRole === 'مدير' || userRole === 'مشرف';
}

function canUserEditMember(member) {
    const userRole = currentUser.role;
    
    if (userRole === 'مطور') {
        return true;
    }
    
    if (userRole === 'مدير') {
        return member.role !== 'مطور';
    }
    
    if (userRole === 'مشرف') {
        return member.role === 'عضو';
    }
    
    return false;
}

function canUserDeleteMember(member) {
    const userRole = currentUser.role;
    
    if (userRole === 'مطور') {
        return member.role !== 'مطور' || member.id !== currentUser.id;
    }
    
    if (userRole === 'مدير') {
        return member.role === 'عضو' || member.role === 'مشرف';
    }
    
    return false;
}

// تأكيد الحذف
function confirmDeleteItem(type, id) {
    currentDeleteId = id;
    currentDeleteType = type;
    
    const modal = document.getElementById('confirmModal');
    const message = document.getElementById('confirmMessage');
    
    let itemName = '';
    switch (type) {
        case 'movement':
            itemName = 'الحركة';
            break;
        case 'custody':
            itemName = 'العهدة';
            break;
        case 'fleet':
            itemName = 'سيارة الأسطول';
            break;
        case 'member':
            itemName = 'العضو';
            break;
    }
    
    message.textContent = `هل أنت متأكد من حذف ${itemName}؟ لا يمكن التراجع عن هذا الإجراء.`;
    
    modal.classList.add('active');
}

async function confirmDelete() {
    if (!currentDeleteId || !currentDeleteType) return;
    
    showLoading(true);
    
    try {
        let collectionName;
        switch (currentDeleteType) {
            case 'movement':
                collectionName = MOVEMENTS_COLLECTION;
                break;
            case 'custody':
                collectionName = CUSTODY_COLLECTION;
                break;
            case 'fleet':
                collectionName = FLEET_COLLECTION;
                break;
            case 'member':
                collectionName = USERS_COLLECTION;
                break;
        }
        
        await deleteDoc(doc(db, collectionName, currentDeleteId));
        
        showToast('تم الحذف بنجاح', 'success');
        closeAllModals();
        loadAllData();
    } catch (error) {
        console.error('خطأ في الحذف:', error);
        showToast('حدث خطأ أثناء الحذف', 'error');
    } finally {
        showLoading(false);
        currentDeleteId = null;
        currentDeleteType = null;
    }
}

// دعم الأكورديون
function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // إغلاق جميع العناصر الأخرى
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.classList.remove('active');
            });
            
            // فتح العنصر الحالي إذا لم يكن نشطاً
            if (!isActive) {
                this.classList.add('active');
                content.classList.add('active');
            }
        });
    });
}

// وظائف المساعدة
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        timeZone: 'UTC',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }) + ' (GMT+4)';
}

function getRoleClass(role) {
    switch (role) {
        case 'مطور': return 'developer';
        case 'مدير': return 'manager';
        case 'مشرف': return 'supervisor';
        case 'عضو': return 'member';
        default: return 'member';
    }
}

function getRoleColor(role) {
    switch (role) {
        case 'مطور': return '#e74c3c';
        case 'مدير': return '#e67e22';
        case 'مشرف': return '#2980b9';
        case 'عضو': return '#27ae60';
        default: return '#95a5a6';
    }
}

function checkDateWarning(dateString) {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const daysDiff = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
        return 'منتهي';
    } else if (daysDiff <= 15) {
        return `ينتهي بعد ${daysDiff} يوم`;
    }
    
    return null;
}

function showLoading(show) {
    const loadingScreen = document.getElementById('loadingScreen');
    if (show) {
        loadingScreen.classList.add('active');
    } else {
        loadingScreen.classList.remove('active');
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('alertToast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // تعيين الأيقونة حسب النوع
    let iconClass = '';
    switch (type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            iconClass = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            break;
        case 'info':
            iconClass = 'fas fa-info-circle';
            break;
    }
    
    toastIcon.className = 'toast-icon ' + iconClass;
    toastMessage.textContent = message;
    toast.className = 'toast show ' + type;
    
    // إخفاء الرسالة بعد 5 ثوانٍ
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// تحديث البيانات
function refreshData() {
    loadAllData();
}

// ملء قوائم الاختيار بالأعضاء
function populateMemberSelects() {
    const memberSelects = document.querySelectorAll('select[id$="Member"], select[id$="Driver"]');
    
    memberSelects.forEach(select => {
        // حفظ القيمة المختارة الحالية
        const currentValue = select.value;
        
        // إزالة الخيارات الحالية (باستثناء الخيار الافتراضي الأول)
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // إضافة الأعضاء المتاحة حسب السياق
        members.forEach(member => {
            // لاختيار السائقين، نضيف فقط الأعضاء المتعهدين
            if (select.id === 'movementDriver' && !member.contractor) {
                return;
            }
            
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name + (member.role !== 'عضو' ? ` (${member.role})` : '');
            select.appendChild(option);
        });
        
        // استعادة القيمة المختارة إذا كانت لا تزال موجودة
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

// تصدير الوظائف للاستخدام في الأحداث
window.shareItem = function(type, id) {
    // تنفيذ المشاركة
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?share=${type}:${id}`;
    
    // عرض نافذة المشاركة
    const modal = document.getElementById('shareModal');
    const shareUrlInput = document.getElementById('shareUrl');
    
    shareUrlInput.value = shareUrl;
    modal.classList.add('active');
};

window.printItem = function(type, id) {
    // تنفيذ الطباعة
    window.print();
};

window.editMovement = function(id) {
    openMovementModal(id);
};

window.editCustody = function(id) {
    openCustodyModal(id);
};

window.editFleet = function(id) {
    openFleetModal(id);
};

window.editMember = function(id) {
    openMemberModal(id);
};

window.confirmDeleteItem = function(type, id) {
    confirmDeleteItem(type, id);
};

window.showEditHistory = function(id, type) {
    // عرض سجل التعديلات
    const modal = document.getElementById('editHistoryModal');
    const content = document.getElementById('editHistoryContent');
    
    let item;
    switch (type) {
        case 'movement':
            item = movements.find(m => m.id === id);
            break;
        // حالات أخرى
    }
    
    if (!item || !item.editHistory || item.editHistory.length === 0) {
        content.innerHTML = '<p>لا يوجد سجل تعديلات</p>';
    } else {
        content.innerHTML = `
            <h4>سجل التعديلات</h4>
            <div class="history-list">
                ${item.editHistory.map(edit => `
                    <div class="history-item">
                        <div class="history-info">
                            <strong>${edit.editedByName}</strong>
                            <span>${formatDateTime(edit.editedAt)}</span>
                        </div>
                        <div class="history-changes">
                            ${Object.entries(edit.changes || {}).map(([field, values]) => `
                                <div class="change-item">
                                    <span class="change-field">${field}:</span>
                                    <span class="change-from">${values.old}</span>
                                    <i class="fas fa-arrow-right"></i>
                                    <span class="change-to">${values.new}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    modal.classList.add('active');
};

// عند تحميل الصفحة، تحقق من رابط المشاركة
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get('share');
    
    if (shareParam) {
        const [type, id] = shareParam.split(':');
        window.shareItem(type, id);
        
        // إزالة معلمة المشاركة من الرابط
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});