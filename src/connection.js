import mongoose from "mongoose";

async function connectMongoDB(url) {
  return mongoose
    .connect(url)
    .then(() => console.log("Mongoose connected"))
    .catch((err) => console.log("Mongoose error:", err));
}

export { connectMongoDB };
export default connectMongoDB;
