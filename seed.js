const { sequelize, Category, SubCategory, Product } = require('./models');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true });
        
        // 1. Categories
        const medDev = await Category.create({ name: "Medical Devices", image: "" });
        const consum = await Category.create({ name: "Consumables", image: "" });

        // 2. SubCategories
        const imaging = await SubCategory.create({ name: "Imaging Systems", CategoryId: medDev.id });
        const surgical = await SubCategory.create({ name: "Surgical", CategoryId: consum.id });

        // 3. Products
        await Product.create({
            item: "MRI Scanner Pro",
            supplier: "Siemens",
            SubCategoryId: imaging.id,
            description: "High quality MRI",
            image: "/assets/images/hero-medical-equipment.webp"
        });

        console.log("✅ Data Seeded!");
        process.exit();
    } catch (err) { console.error(err); process.exit(1); }
};
seedData();
