import mongoose from "mongoose";
import logger from "../utils/logger.js";
import Config from "../config.js";

export default async function connectToMongoDB() {
  const url = `mongodb+srv://${Config.icon.user}:${Config.icon.password}@cluster0.qs1f08w.mongodb.net/`;
  try {
    await mongoose.connect(url);
    logger.info(`Connected to MongoDB at ${url}`);
  } catch (err) {
    logger.error(`Error connecting to MongoDB at ${url}: ${err.message}`);
  }
}
