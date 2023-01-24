const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../configs/db");
const { DataTypes } = Sequelize;

const UsersModel = dbSequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "unverified",
    },
  },
  {
    timestamps: false,
  }
);

module.exports = UsersModel;
