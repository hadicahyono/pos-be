const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const bearerToken = require("express-bearer-token");
const { checkSequelize } = require("./src/configs/db");
const { usersRoute } = require("./src/routes");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(bearerToken());
app.use("/users", usersRoute);

app.get("/", (req, res) => {
  res.status(200).send("Hello POS");
});

checkSequelize();

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
