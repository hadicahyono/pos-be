const Sequelize = require("sequelize");
const ProductsModel = require("../models/products");

module.exports = {
  getProducts: async (req, res) => {
    try {
      let query = {};
      if (req.query.filter) {
        const filters = req.query.filter.split(",").map((f) => f.split(":"));
        filters.forEach((filter) => {
          query[filter[0]] = filter[1];
        });
      }

      let order = [];
      if (req.query.sort) {
        const sortOption = req.query.sort.split(":");
        order.push([sortOption[0], sortOption[1] === "asc" ? "ASC" : "DESC"]);
      }
      console.log("query ->", query);
      console.log("order ->", order);
      let data = await ProductsModel.findAll({ where: query, order: order });
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
  addProduct: async (req, res) => {
    const { name, price, quantity, category } = req.body;
    try {
      if (await ProductsModel.findOne({ where: { name } })) {
        return res.status(401).send({
          success: false,
          message: "Product already exists.",
        });
      }

      if (quantity < 1) {
        return res.status(401).send({
          success: false,
          message:
            "Invalid quantity value. Must be greater than or equal to 1.",
        });
      }

      const allowedCategories = ["Coffee", "Tea", "Beverages", "Food"];
      if (!allowedCategories.includes(category)) {
        return res.status(400).send({
          success: false,
          message: `Invalid category value. The category must be one of ${allowedCategories.join(
            ", "
          )}.`,
        });
      }

      if (price < 1000) {
        return res.status(400).send({
          success: false,
          message: `Invalid price value. The price must be more than 1000. Please enter a valid price.`,
        });
      }

      if (name.length < 3) {
        return res.status(400).send({
          success: false,
          message: `Invalid name length. The name length must be more than 3 characters. Please enter a valid name.`,
        });
      }

      let newProduct = await ProductsModel.create({
        name,
        price,
        quantity,
        category,
      });
      return res.status(200).send({
        success: true,
        message: "Product added successfully",
        data: newProduct,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "An error occured while GET data.",
        error,
      });
    }
  },
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, price, quantity, category } = req.body;
    try {
      if (
        !(await ProductsModel.findOne({
          where: { product_id: id },
        }))
      ) {
        return res.status(404).send({
          success: false,
          message: "Product not found.",
        });
      }

      if (name && name.length < 3) {
        return res.status(400).send({
          success: false,
          message: `Invalid name length. The name length must be more than 3 characters. Please enter a valid name.`,
        });
      }

      if (quantity && quantity < 1) {
        return res.status(401).send({
          success: false,
          message:
            "Invalid quantity value. Must be greater than or equal to 1.",
        });
      }

      const allowedCategories = ["Coffee", "Tea", "Beverages", "Food"];
      if (category && !allowedCategories.includes(category)) {
        return res.status(400).send({
          success: false,
          message: `Invalid category value. The category must be one of ${allowedCategories.join(
            ", "
          )}.`,
        });
      }

      if (price && price < 1000) {
        return res.status(400).send({
          success: false,
          message: `Invalid price value. The price must be more than 1000. Please enter a valid price.`,
        });
      }
      const update = await productToUpdate.update({
        name,
        price,
        quantity,
        category,
      });
      return res.status(200).send({
        success: true,
        message: "Product updated successfully",
        data: update,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "An error occured while updating product.",
        error,
      });
    }
  },
  searchProduct: async (req, res) => {
    const { q } = req.query;
    try {
      let search = await ProductsModel.findAll({
        where: {
          [Sequelize.Op.or]: [
            { name: { [Sequelize.Op.like]: `%${q}%` } },
            { category: { [Sequelize.Op.like]: `%${q}%` } },
          ],
        },
      });

      if (!search) {
        res.status(400).send({
          message: "Products not found",
        });
      }

      res.status(200).send(search);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "An error occured while updating product.",
        error,
      });
    }
  },
  filterProduct: async (req, res) => {
    const { q } = req.query;
  },
};
