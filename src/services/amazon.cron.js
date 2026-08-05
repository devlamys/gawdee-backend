import cron from "node-cron";
import { syncAmazonOrdersService } from "./amazon.service.js";

const startAmazonCronJobs = () => {
  if (process.env.AMAZON_CRON_ENABLED !== "true") {
    console.log("Amazon cron disabled. Set AMAZON_CRON_ENABLED=true to enable it.");
    return;
  }

  cron.schedule("*/15 * * * *", async () => {
    try {
      console.log("Amazon order sync cron started");
      const result = await syncAmazonOrdersService({ days: 2 });
      console.log("Amazon order sync cron completed", {
        totalFetched: result.totalFetched,
        totalSaved: result.totalSaved,
      });
    } catch (error) {
      console.error("Amazon order sync cron error:", error.response?.data || error.message);
    }
  });
};

export default startAmazonCronJobs;
