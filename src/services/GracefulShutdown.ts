import type { IClientWithHealth } from "../client";

export class GracefulShutdown {
  constructor(private client: IClientWithHealth) {}

  setup(): void {
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully...");
      await this.client.destroy();
      process.exit(0);
    });
  }
}
