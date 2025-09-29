import express from "express";
import dotenv from "dotenv";
import dbConnect from "./Database/dbConnect.js";
import authRouter from "./Routes/authUser.js";
import messageRouter from "./Routes/messageRoute.js";
import cookieParser from "cookie-parser";

dotenv.config(); // load .env variable
const app = express();

app.use(express.json());
app.use(cookieParser()); // <-- FIXED: call the function
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',authRouter);
app.use('/api/message',messageRouter);

// Define a simple route
app.get('/', (req, res) => {
    res.send("Server is working");
});


// Use PORT from environment or fallback to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    dbConnect();
    console.log(`Server is running on port ${PORT}`);
});
