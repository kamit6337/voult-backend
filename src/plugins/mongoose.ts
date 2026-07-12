// plugins/mongoose.ts

import { env } from "@/config/env.js";
import fp from "fastify-plugin";
import mongoose from "mongoose";

export default fp(async (app) => {
  try {
    app.log.info("Connecting to MongoDB...");

    await mongoose.connect(env.MONGODB_URI);

    app.log.info("MongoDB connected.");

    app.addHook("onClose", async () => {
      app.log.info("Disconnecting MongoDB...");

      await mongoose.disconnect();

      app.log.info("MongoDB disconnected.");
    });
  } catch (error) {
    app.log.error("Issue in connecting MongoDB");
    console.log(error);
    process.exit(1);
  }
});
