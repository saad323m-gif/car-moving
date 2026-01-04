// Service Worker لتطبيق PWA
const CACHE_NAME = 'car-management-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './firebase-config.js',
    './logo.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
];

// التثبيت
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('تم فتح الكاش');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// التنشيط
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('حذف الكاش القديم:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// اعتراض الطلبات
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إرجاع الملف المخبأ إذا وجد
                if (response) {
                    return response;
                }
                
                // استرجاع من الشبكة
                return fetch(event.request)
                    .then(response => {
                        // التحقق من أن الاستجابة صالحة
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // نسخ الاستجابة إلى الكاش
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    });
            }).catch(() => {
                // في حالة عدم الاتصال، يمكن عرض صفحة خاصة
                return caches.match('./index.html');
            })
    );
});

// استقبال الرسائل من الصفحة الرئيسية
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});