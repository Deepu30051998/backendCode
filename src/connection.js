const mongoose = require("mongoose");

async function connectMongoDB(url) {
    return mongoose
        .connect(url)
        .then(() => console.log("Mongoose connected"))
        .catch(() => console.log("Mongoose error"));
}

module.exports = { connectMongoDB }