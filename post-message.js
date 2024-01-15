const express = require("express");
const routesProf = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/usermodels");

routesProf.get("/", (req, res) => {
  res.send("Message Posted!!");
});

module.exports = routesProf;
