const mongoose = require("mongoose");

const { MONGODB_USERNAME, MONGODB_PASSWORD, DB_NAME, MONGODB_URI } = process.env;

const connectDB = async () => {
  try {
    let uri = MONGODB_URI;

    if (!uri && MONGODB_USERNAME && MONGODB_PASSWORD) {
      uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.c4xckpc.mongodb.net/?appName=Cluster0`;
    }

    if (!uri) {
      if (process.env.VERCEL) {
        throw new Error("Missing MONGODB_URI environment variable on Vercel.");
      }
      console.log("No MongoDB credentials found. Starting in-memory MongoDB...");
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log("In-memory MongoDB started at:", uri);
    } else {
      console.log("Connecting to MongoDB...");
    }

    await mongoose.connect(uri, { dbName: DB_NAME || "hakathon" });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};


module.exports = { connectDB };
