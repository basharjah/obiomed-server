const express = require('express');
const router = express.Router();
const { Category, SubCategory } = require('../models');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// GET
router.get('/', async (req, res) => {
    const cats = await Category.findAll({ include: SubCategory });
    res.json(cats);
});

// POST (Add)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const cat = await Category.create({ name: req.body.name, image });
        res.json(cat);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT (Update)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const cat = await Category.findByPk(req.params.id);
        if (!cat) return res.status(404).json({ message: "Not found" });

        const updateData = { name: req.body.name };
        if (req.file) updateData.image = `/uploads/${req.file.filename}`;

        await cat.update(updateData);
        res.json(cat);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
    try {
        await Category.destroy({ where: { id: req.params.id } });
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;