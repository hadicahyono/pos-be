const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  hashPassword: (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },
  createToken: (payload, expired = "24h") => {
    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: expired,
    });
    return token;
  },
};
