import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT), 
        console.log("DB is connected successfully ✅");
    } catch (error) {
        console.error("DB connection failed:", error);
    }
};

export default dbConnect;
