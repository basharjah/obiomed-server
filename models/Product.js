const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = sequelize.define('Product', {
    item: { type: DataTypes.STRING, allowNull: false },
    supplier: DataTypes.STRING,
    origin: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    sizes: DataTypes.STRING,
    catalog: DataTypes.STRING,
    website: DataTypes.STRING,
    sm_profile: DataTypes.STRING,
    available_content: DataTypes.STRING
});
module.exports = Product;
