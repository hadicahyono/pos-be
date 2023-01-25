const UsersModel = require("../models/users");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const { createToken, hashPassword } = require("../configs/encrypt");
const { transport } = require("../configs/nodemailer");

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
    const { id, email, password, passwordAgain } = req.body;
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
      let token = createToken({ id: newUser.id, email });

      transport.sendMail(
        {
          from: "POS Admin",
          to: email,
          subject: "Account verification",
          html: `<div>
        <h3>Clink link below to verify your account</h3>
        <a href="http://localhost:3000/verification?t=${token}">Verify</a>
        </div>`,
        },
        (error, info) => {
          if (error) {
            return res.status(401).send(error);
          }
          return res.status(200).send({
            success: true,
            message: "Account successfully registered.",
            user: newUser,
          });
        }
      );
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
  keepLogin: async (req, res) => {
    try {
      let user = await UsersModel.findOne({
        where: { id: req.decrypt.dataValues.id },
      });
      if (!user) {
        return res
          .status(401)
          .send({ success: false, message: "User not found." });
      }

      let token = createToken({ ...user });
      console.log(`keepLogin dataValues.id ->`, req.decrypt.dataValues.id);
      return res.status(200).send({ ...user, token });
    } catch (error) {
      console.log(error);
    }
  },
  verifyAccount: async (req, res) => {
    try {
      console.log(`verify req.decrypt ->`, req.decrypt);
      let user = await UsersModel.update(
        { status: "verified" },
        { where: { id: req.decrypt.id } }
      );
      return res.status(200).send({
        success: true,
        message: "Account status successfully updated.",
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "An error occured while verifying.",
        error,
      });
    }
  },
};
