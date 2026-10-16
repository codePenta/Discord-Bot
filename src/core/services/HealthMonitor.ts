import { writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export interface IHealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: number;
}

export class HealthMonitor {
  private readonly healthFilePath: string;
  private lastWriteTime: number = 0;
  private lastStatus: IHealthStatus["status"] = "unhealthy";

  constructor(filePath: string = join(tmpdir(), "bot-health")) {
    this.healthFilePath = filePath;
  }

  setHealthy(): void {
    this.updateStatus("healthy");
  }

  setUnhealthy(): void {
    this.updateStatus("unhealthy");
  }

  private updateStatus(status: IHealthStatus["status"]): void {
    const now = Date.now();
    if (now - this.lastWriteTime < 5000 && status === this.lastStatus) {
      return;
    }

    this.lastStatus = status;
    this.lastWriteTime = now;

    try {
      const healthStatus: IHealthStatus = { status, timestamp: now };
      writeFileSync(this.healthFilePath, JSON.stringify(healthStatus));
    } catch (error) {
      console.error("Failed to write health status:", error);
    }
  }
}
