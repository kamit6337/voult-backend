// modules/health/service.ts

import { healthRepository } from "./health.repository.js";

class HealthService {
  async getHealthStatus() {
    const status = await healthRepository.getHealthStatus();
    return status;
  }
}

export const healthService = new HealthService();
