const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../configs/db");
const { DataTypes } = Sequelize;

const ProductsModel = dbSequelize.define(
  "products",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    image: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.ENUM,
      values: ["Coffee", "Tea", "Beverages", "Food"],
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ProductsModel;
