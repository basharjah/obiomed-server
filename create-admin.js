const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

// بيانات الأدمن الذي تريد إنشاءه
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123"; // غيرها لكلمة مرور قوية لاحقاً

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to Database.');

        // التحقق هل المستخدم موجود مسبقاً؟
        const existingUser = await User.findOne({ where: { username: ADMIN_USERNAME } });
        if (existingUser) {
            console.log('⚠️ Admin user already exists.');
            process.exit();
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // إنشاء المستخدم
        await User.create({
            username: ADMIN_USERNAME,
            password: hashedPassword
        });

        console.log(`🎉 Admin created successfully!`);
        console.log(`👤 Username: ${ADMIN_USERNAME}`);
        console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
        
        process.exit();

    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();