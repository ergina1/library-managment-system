import mongoose from "mongoose";



export const connectDB = () => {
    mongoose
    .connect(process.env.MONGO_URL, {  
        dbName: "Library_Management_System"
    })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });
};