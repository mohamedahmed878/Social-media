# جيرة (Jeera) — Chat & Connect

منصة تواصل ومحادثات فورية، متجهزة للنشر على Vercel. الاتصال اللحظي شغال
عن طريق **Pusher** بدل **Socket.io**، عشان Socket.io محتاج اتصال WebSocket
دايم وده مش متاح في serverless functions زي اللي Vercel بيشغلها، بعكس Pusher
اللي بيدير الاتصالات دي بره سيرفرك.

## البنية

```
jeera/
├── backend/     Express API + MongoDB (Mongoose) + Pusher
└── frontend/    React + Vite + React Router + pusher-js
```

نفس الهيكلة اللي اتفقنا عليها بالظبط، غير إن socket.io اتشال، ومكانه Pusher
(الملفات لسه بأسمائها القديمة زي `SocketContext.jsx` و `useSocket.js` عشان
تفضل متوافقة مع بنية المشروع، بس جوايها دلوقتي بتستخدم Pusher).

## التشغيل محليًا

### 1) الباك اند
```bash
cd backend
cp .env.example .env   # املأ MONGO_URI و JWT_SECRET وبيانات Pusher
npm install
npm run dev             # http://localhost:5000
```

### 2) الفرونت اند
```bash
cd frontend
cp .env.example .env   # حط رابط الـ API ومفتاح Pusher
npm install
npm run dev              # http://localhost:5173
```

## إعداد Pusher (بديل Socket.io)

1. اعمل حساب مجاني على https://pusher.com
2. اعمل App جديد، وهياديك: `app_id`, `key`, `secret`, `cluster`
3. حط القيم دي في `backend/.env`
4. حط `key` و `cluster` بس في `frontend/.env` (الـ `VITE_PUSHER_KEY` و `VITE_PUSHER_CLUSTER`)

الـ authentication للقنوات الخاصة (`private-conversation-*` و `private-user-*`)
بيحصل عن طريق endpoint عادي: `POST /api/pusher/auth`، وده اللي بيتأكد إن
المستخدم عضو فعلاً في المحادثة قبل ما يسمحله يسمع الرسايل.

## النشر على Vercel

- **الباك اند**: انشره كـ Vercel Project منفصل (فيه `backend/vercel.json` جاهز).
  محتاج تضيف الـ Environment Variables (MONGO_URI, JWT_SECRET, PUSHER_*) من
  إعدادات المشروع على Vercel.
- **الفرونت اند**: انشره كـ Vercel Project تاني (فيه `frontend/vercel.json`
  لدعم React Router). حط `VITE_API_URL` على رابط الباك اند بعد ما تنشره.

> ملحوظة: MongoDB لازم يكون Atlas (سحابي) مش سيرفر محلي، عشان Vercel نفسه
> مالوش تخزين دائم.

## المميزات المتاحة

- تسجيل / دخول بـ JWT
- بحث عن مستخدمين وبدء محادثة فردية
- محادثات لحظية (realtime) عن طريق Pusher
- إنشاء جروبات وإضافة أعضاء
- إشعارات عند وصول رسالة أو إضافة لجروب
- تعديل الملف الشخصي (الاسم، النبذة، الصورة)

## للتوسيع لاحقًا

- رفع الصور فعليًا (حاليًا `avatar`/`attachment` بياخدوا رابط نصي مباشرة —
  ينفع تضيف تكامل مع Cloudinary أو S3)
- مؤشر "بيكتب دلوقتي..." (الكود جاهز جزئيًا في `pusherService.js` بدالة
  `triggerTyping`، محتاج بس تربطه من الـ frontend)
- صفحة إشعارات كاملة (الـ backend بيولد الإشعارات فعلاً، محتاجة واجهة تعرضها)
