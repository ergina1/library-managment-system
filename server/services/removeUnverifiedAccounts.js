import cron from "node-cron";
import { User } from "../models/userModel.js";

export const removeUnverifiedAccounts = () => {
    cron.schedule("*/5 * * * *", async () => {
        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
        await User.deleteMany({
            accountVerified: false,
            createdAt: { $lt: fiveDaysAgo },
        });
    });
};