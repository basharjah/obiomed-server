const express = require('express');
const router = express.Router();
const { SubCategory, Category } = require('../models');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// GET (Optional if you want separate list)
router.get('/', async (req, res) => {
    const subs = await SubCategory.findAll({ include: Category });
    res.json(subs);
});

// POST
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const sub = await SubCategory.create({ 
            name: req.body.name, 
            CategoryId: req.body.categoryId, 
            image 
        });
        res.json(sub);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const sub = await SubCategory.findByPk(req.params.id);
        if (!sub) return res.status(404).json({ message: "Not found" });

        const updateData = { name: req.body.name, CategoryId: req.body.categoryId };
        if (req.file) updateData.image = `/uploads/${req.file.filename}`;

        await sub.update(updateData);
        res.json(sub);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
    try {
        await SubCategory.destroy({ where: { id: req.params.id } });
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;