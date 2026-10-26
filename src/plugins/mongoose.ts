// plugins/mongoose.ts

import { env } from "@/config/env.js";
import fp from "fastify-plugin";
import mongoose from "mongoose";

export default fp(async (app) => {
  app.log.info("Connecting to MongoDB...");

  try {
    await mongoose.connect(env.MONGODB_URI);

    app.log.info("MongoDB connected.");
  } catch (error) {
    app.log.error("Issue in connecting MongoDB");
    console.log(error);
    throw error;
    // process.exit(1);
  }

  app.addHook("onClose", async () => {
    app.log.info("Disconnecting MongoDB...");

    await mongoose.disconnect();

    app.log.info("MongoDB disconnected.");
  });
});
