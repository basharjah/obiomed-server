const XLSX = require('xlsx');
const path = require('path');
const { sequelize, Category, SubCategory, Product } = require('./models');

// اسم ملف الإكسل
const EXCEL_FILE = 'products.xlsx';

const importData = async () => {
    try {
        console.log('🚀 Starting Import Process...');
        
        // 1. قراءة الملف
        const workbook = XLSX.readFile(path.join(__dirname, EXCEL_FILE));
        const sheetName = workbook.SheetNames[0]; 
        const sheet = workbook.Sheets[sheetName];
        
        // تحويل البيانات إلى JSON (بدون range: 1 لأنك حذفت العنوان الرئيسي يدوياً)
        const data = XLSX.utils.sheet_to_json(sheet);
        console.log(`📊 Found ${data.length} rows.`);

        // 2. الاتصال بقاعدة البيانات وتصفيرها
        await sequelize.authenticate();
        console.log('🗑️ Clearing old database content...');
        await sequelize.sync({ force: true }); 
        console.log('✅ Database is ready.');

        // 3. التكرار وإدخال البيانات
        for (const row of data) {
            
            // --- تعديل هام: استخدام الأسماء مع المسافات كما ظهرت في الـ Debug ---
            
            // تنظيف البيانات (Trim) لإزالة المسافات من القيم نفسها
            const categoryName = row['category '] ? row['category '].toString().trim() : null;
            const subCatName = row['sub-cat'] ? row['sub-cat'].toString().trim() : null;
            const itemName = row['Items '] ? row['Items '].toString().trim() : null;

            // تخطي الصفوف الناقصة
            if (!categoryName || !subCatName || !itemName) {
                continue;
            }

            // أ) إنشاء الكاتيغوري
            const [category] = await Category.findOrCreate({
                where: { name: categoryName },
                defaults: { image: '/assets/images/hero-medical-equipment.webp' }
            });

            // ب) إنشاء الصب-كاتيغوري
            const [subCategory] = await SubCategory.findOrCreate({
                where: { 
                    name: subCatName,
                    CategoryId: category.id 
                },
                defaults: { image: '/assets/images/hero-medical-equipment.webp' }
            });

            // ج) إنشاء المنتج
            const existingProduct = await Product.findOne({ where: { item: itemName } });
            
            if (!existingProduct) {
                await Product.create({
                    item: itemName,
                    // استخدام مفاتيح الأعمدة مع المسافات كما ظهرت في الديباج
                    supplier: row['Supplier '] ? row['Supplier '].toString().trim() : null,
                    origin: row['Origin '] ? row['Origin '].toString().trim() : null,
                    website: row['Website '] ? row['Website '].toString().trim() : null,
                    sm_profile: row['SM profile '] ? row['SM profile '].toString().trim() : null,
                    sizes: row['Sizes'] ? row['Sizes'].toString().trim() : null,
                    catalog: row['Catalog'] ? row['Catalog'].toString().trim() : null,
                    description: row['Description '] ? row['Description '].toString().trim() : null,
                    available_content: row['available content '] ? row['available content '].toString().trim() : null,
                    
                    SubCategoryId: subCategory.id,
                    image: '/assets/images/hero-medical-equipment.webp'
                });
                console.log(`✅ Added: ${itemName}`);
            }
        }

        console.log('🎉 Import Completed Successfully!');
        process.exit();

    } catch (error) {
        console.error('❌ Error importing data:', error);
        process.exit(1);
    }
};

importData();