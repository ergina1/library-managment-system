import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/userModel.js";

export const notifyUsers = () => {
    
    cron.schedule("*/30 * * * *", async () => {
        console.log("Cron job running at:", new Date().toISOString());
        
        try {
            
            const now = new Date();
            const borrowers = await Borrow.find({
                dueDate: {
                    $lt: now,  
                },
                returnDate: null,  
                notified: false,   
            });

            console.log(`Found ${borrowers.length} overdue books to notify`);

            for (const borrow of borrowers) {
                if (borrow.user && borrow.user.email) {
                    try {
                        await sendEmail({
                            email: borrow.user.email,
                            subject: "Book Return Reminder - Overdue",
                            message: `Hello ${borrow.user.name},\n\nThis is a reminder that the book you borrowed is overdue for return.\n\nDue Date: ${borrow.dueDate.toLocaleDateString()}\n\nPlease return the book as soon as possible to avoid additional fines.\n\nThank you!`,
                        });
                        
                        borrow.notified = true;
                        await borrow.save();
                        
                        console.log(`Email sent to ${borrow.user.name} (${borrow.user.email})`);
                    } catch (emailError) {
                        console.error(`Failed to send email to ${borrow.user.email}:`, emailError);
                    }
                }
            }
        } catch (error) {
            console.error("Error occurred when notifying users:", error);
        }
    });
    
    
};