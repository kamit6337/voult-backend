// modules/health/service.ts

export async function getHealthStatus() {
  return {
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  };
}
