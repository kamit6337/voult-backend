import { buildApp } from "./app.js";
import { env } from "./config/env.js";

// Configure DNS for MongoDB Atlas SRV lookups

async function startServer() {
  
  try {
    const app = await buildApp();
    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    app.log.info(`Server running on port ${env.PORT}`);
  } catch (error) {
    // app.log.error(error);
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
