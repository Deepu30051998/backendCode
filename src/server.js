const path = require("path");
const express = require("express");
const app = express();
const mainRouter = require("./routes/routes");
const { connectMongoDB } = require("./connection");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

connectMongoDB("mongodb://127.0.0.1:27017/task15");
app.use(mainRouter);

const PORT = process.env.PORT || 7500;

app.listen(PORT, () => {
  console.log(`Listening at PORT ${PORT}`);
});

