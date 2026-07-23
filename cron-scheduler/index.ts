import cron from "node-cron";

console.log("Cron Scheduler starting in passive mode...");

// Nightly Sync: Pull latest stats from Etsy
cron.schedule("0 0 * * *", () => {
    console.log("[CRON] Running nightly Etsy sync (Passive)");
});

// Weekly Report Generation (Monday 8AM)
cron.schedule("0 8 * * 1", () => {
    console.log("[CRON] Triggering weekly AI audio-visual report (Passive)");
});

console.log("Cron Scheduler running.");
