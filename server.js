const express = require("express");
const app = new express();
const mainRouter = require("./routes/routes");
const { connectMongoDB } = require("./connection");

app.set("view engine", "ejs");

connectMongoDB("mongodb://127.0.0.1:27017/task15");

app.use(mainRouter);

const PORT = process.argv.PORT || 7500;

app.listen(PORT, () => {
  console.log(`Listening at PORT ${PORT}`);
});
