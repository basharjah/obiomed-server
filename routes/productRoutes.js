const express = require('express');
const router = express.Router();
const { Product, SubCategory, Category } = require('../models');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// GET: جلب كل المنتجات
router.get('/', async (req, res) => {
    const products = await Product.findAll({
        include: { model: SubCategory, include: Category }
    });
    res.json(products);
});

// POST: إضافة منتج جديد (صورة + كتالوج)
router.post('/', auth, 
    // التعديل 1: السماح باستقبال حقلين للملفات
    upload.fields([
        { name: 'image', maxCount: 1 }, 
        { name: 'catalog', maxCount: 1 }
    ]), 
    async (req, res) => {
    try {
        // التعديل 2: التعامل مع req.files بدلاً من req.file
        // استخراج مسار الصورة
        const image = (req.files && req.files['image']) 
            ? `/uploads/${req.files['image'][0].filename}` 
            : null;

        // استخراج مسار الكتالوج
        const catalog = (req.files && req.files['catalog']) 
            ? `/uploads/${req.files['catalog'][0].filename}` 
            : null;

        const product = await Product.create({
            ...req.body,
            SubCategoryId: req.body.subCategoryId,
            image: image,
            catalog: catalog // حفظ مسار الكتالوج
        });
        res.json(product);
    } catch (err) { 
        console.error(err);
        res.status(400).json({ error: err.message }); 
    }
});

// PUT: تعديل منتج
router.put('/:id', auth, 
    // التعديل 3: تحديث Middleware هنا أيضاً
    upload.fields([
        { name: 'image', maxCount: 1 }, 
        { name: 'catalog', maxCount: 1 }
    ]), 
    async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // تجهيز البيانات الجديدة
        const updateData = { ...req.body };

        // التعديل 4: تحديث الصورة إذا وجدت
        if (req.files && req.files['image']) {
            updateData.image = `/uploads/${req.files['image'][0].filename}`;
        } else {
            delete updateData.image; // إبقاء القديمة
        }

        // التعديل 5: تحديث الكتالوج إذا وجد
        if (req.files && req.files['catalog']) {
            updateData.catalog = `/uploads/${req.files['catalog'][0].filename}`;
        } else {
            delete updateData.catalog; // إبقاء القديم
        }

        // تحديث البيانات
        await product.update(updateData);
        res.json({ message: "Product updated successfully", product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE: حذف منتج
router.delete('/:id', auth, async (req, res) => {
    try { await Product.destroy({ where: { id: req.params.id } }); res.json({ msg: "Deleted" }); } 
    catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;