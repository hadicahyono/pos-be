const Sequelize = require("sequelize");
const ProductsModel = require("../models/products");

module.exports = {
  getMenus: async (req, res) => {
    try {
      let data = await ProductsModel.findAll();
      console.log(data);
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "An error occured while GET data.",
        error,
      });
    }
  },
  createProduct: async (req, res) => {
    try {
      let data = await ProductsModel.findOne();
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "An error occured while GET data.",
        error,
      });
    }
  },
};
