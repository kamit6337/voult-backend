import mongoose from "mongoose";

class HealthRepository {
  async getHealthStatus() {
    const start = performance.now();

    try {
      const db = mongoose.connection.db;

      if (mongoose.connection.readyState !== 1 || !db) {
        return {
          status: "unhealthy",
          database: "disconnected",
        };
      }

      // Execute a lightweight MongoDB command
      const result = await db.admin().command({ ping: 1 });

      return {
        status: "healthy",
        database: "connected",
        uptime: Math.floor(process.uptime()),
        latencyMs: Math.round(performance.now() - start),
        timestamp: new Date().toISOString(),
        result:
          result.ok === 1 ? "MongoDB ping successful" : "MongoDB ping failed",
      };
    } catch (error) {
      return {
        status: "unhealthy",
        database: "unavailable",
      };
    }
  }
}

export const healthRepository = new HealthRepository();
