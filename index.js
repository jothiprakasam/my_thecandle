const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const bodyparser = require("body-parser");
const session = require("express-session");
const connectDB = require("./database/db");
const middleware = require("./middleware/middleware");
const staticUri = path.join(__dirname, "public");
const usermessage = require("./models/messagemodel");
app.use(express.static(staticUri));
app.use(
  session({
    secret: "jothirameshsai",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(bodyparser.urlencoded({ extended: false }));

const userregisterroute = require("./routes/registerRoute");
const usersignroute = require("./routes/signuproutes");
const usersignoutroute = require("./routes/logoutRoute");
const profieRoute = require("./routes/post-message");
app.set("view engine", "pug");
app.set("views", "views");
app.use("/login", middleware.isLogin, userregisterroute);
app.use("/register", middleware.isLogin, usersignroute);
app.use("/logout", userregisterroute);
app.use("/post-message", middleware.isAlreadyLogin, profieRoute);
app.get(["/", "/home"], middleware.isAlreadyLogin, (req, res) => {
  const pagedata = {
    userDetail: req.session.jpr,
  };
  res.status(200).render("home", pagedata);
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/post-message", async (req, res) => {
  const { email, message } = req.body;

  try {
    const newMessage = new usermessage({ email, message });
    await newMessage.save();
    console.log("Message saved successfully");
    res.redirect("/");
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/about", (req, res) => {
  res.send("About page");
});
app.get(["/profile"], middleware.isAlreadyLogin, (req, res) => {
  const pagedata = {
    userDetail: req.session.jpr,
  };
  res.status(200).render("profile", pagedata);
});
app.listen(port, () => {
  console.log(`server running in ${port} port`);
});
