const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const { MONGODB_USERNAME, MONGODB_PASSWORD, DB_NAME } = process.env;

const connectDB = async () => {
  try {
    let uri;
    if (MONGODB_USERNAME && MONGODB_PASSWORD) {
      uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.c4xckpc.mongodb.net/?appName=Cluster0`;
      console.log("Connecting to MongoDB Atlas...");
    } else {
      console.log("No MongoDB credentials found. Starting in-memory MongoDB...");
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log("In-memory MongoDB started at:", uri);
    }

    await mongoose.connect(uri, { dbName: DB_NAME || "hakathon" });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = { connectDB };
