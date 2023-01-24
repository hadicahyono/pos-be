const UsersModel = require("../models/users");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const { createToken, hashPassword } = require("../configs/encrypt");

module.exports = {
  getData: async (req, res) => {
    try {
      let data = await UsersModel.findAll();
      console.log(data);
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
    }
  },
  register: async (req, res) => {
    const { email, password, passwordAgain } = req.body;
    try {
      const user = await UsersModel.findOne({
        where: {
          [Sequelize.Op.or]: [{ email }],
        },
      });

      if (user) {
        return res.status(401).send({
          success: false,
          message: "Account is already exists.",
        });
      }

      if (password != passwordAgain) {
        return res.status(401).send({
          success: false,
          message: "Passwords do not match.",
        });
      }

      if (password.length < 8) {
        return res.status(401).send({
          success: false,
          message: "Password must be at least 8 characters",
        });
      }

      const newPass = hashPassword(password);

      const newUser = await UsersModel.create({ email, password: newPass });

      return res.status(200).send({
        success: true,
        message: "Account successfully registered.",
        user: newUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "An error occured while registering.",
      });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await UsersModel.findOne({ where: { email } });

      if (!user) {
        return res.status(401).send({
          success: false,
          message: "Credential did not match.",
        });
      }

      const checkPass = bcrypt.compareSync(password, user.password);
      if (!checkPass) {
        return res.status(401).send({
          success: false,
          message: "Credential did not match.",
        });
      }

      if (checkPass) {
        let token = createToken({ ...user });
        console.log(user);
        return res.status(200).send({
          success: true,
          message: "You have successfully logged in.",
          token,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "An error occured while login.",
        error,
      });
    }
  },
};
