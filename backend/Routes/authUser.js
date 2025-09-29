import express from "express";
import { userRegister, userLogin, userLogOut } from "../routesController/userroutController.js";

const router = express.Router();

// Register
router.post("/register", userRegister);

// Login
router.post("/login", userLogin);

// Logout (GET is more common, but POST works if you're invalidating tokens in DB)
router.get("/logout", userLogOut);

export default router;
