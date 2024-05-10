import mongoose from "mongoose";
import logger from "../utils/logger.js";
import Config from "../config.js";

export default async function connectToMongoDB() {
  const url = `mongodb://${Config.icon.host}:${Config.icon.port}/${Config.icon.dbName}`;
  try {
    await mongoose.connect(url);
    logger.info(`Connected to MongoDB at ${url}`);
  } catch (err) {
    logger.error(`Error connecting to MongoDB at ${url}: ${err.message}`);
  }
}
