import express from "express";
import { sendMessage } from "../routesController/messageroutController.js";
import isLogin from '../Middleware/isLogin.js';

const router=express.Router();

router.post('/send/:id', isLogin, sendMessage);

export default router;