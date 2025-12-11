const sequelize = require('../config/database');
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const Product = require('./Product');
const User = require('./User');

// العلاقات
Category.hasMany(SubCategory, { onDelete: 'CASCADE' });
SubCategory.belongsTo(Category);

SubCategory.hasMany(Product, { onDelete: 'CASCADE' });
Product.belongsTo(SubCategory);

module.exports = { sequelize, Category, SubCategory, Product, User };
