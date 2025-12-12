const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. استخدام مسار مطلق (Absolute Path) لضمان الوصول للمجلد في السيرفر
// هذا يضمن أن المجلد هو نفسه دائماً بغض النظر عن طريقة تشغيل PM2
const uploadDir = path.join(__dirname, '../uploads');

// التأكد من وجود المجلد
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // 2. حل مشكلة التسمية: إضافة رقم عشوائي مع التاريخ
        // هذا يمنع خطأ تضارب الأسماء عند رفع ملفين في نفس اللحظة
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// تصدير الميدل وير
module.exports = multer({ storage: storage });