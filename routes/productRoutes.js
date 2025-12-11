const express = require('express');
const router = express.Router();
const { Product, SubCategory, Category } = require('../models');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const products = await Product.findAll({
        include: { model: SubCategory, include: Category }
    });
    res.json(products);
});

router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const product = await Product.create({
            ...req.body,
            SubCategoryId: req.body.subCategoryId,
            image
        });
        res.json(product);
    } catch (err) { res.status(400).json({ error: err.message }); }
});
// PUT: تعديل منتج
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // تجهيز البيانات الجديدة
        const updateData = { ...req.body };

        // إذا تم رفع صورة جديدة، نحدث المسار. وإلا نترك الصورة القديمة كما هي
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        } else {
            // حذف حقل الصورة من التحديث لكي لا يتم مسح القديمة
            delete updateData.image; 
        }

        // تحديث البيانات
        await product.update(updateData);
        res.json({ message: "Product updated successfully", product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.delete('/:id', auth, async (req, res) => {
    try { await Product.destroy({ where: { id: req.params.id } }); res.json({ msg: "Deleted" }); } 
    catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
