const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  hashPassword: (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },
  createToken: (payload, expired = "24h") => {
    // console.log(`jwt payload ->`, payload);
    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: expired,
    });
    return token;
  },
  readToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).send;

    jwt.verify(token, process.env.JWT_SECRET, (error, decrypt) => {
      if (error) {
        res.status(401).send({
          success: false,
          message: "Token auth failed.",
        });
      }
      console.log(`decrypt readToken ->`, decrypt);
      req.decrypt = decrypt;
      next();
    });
  },
};
