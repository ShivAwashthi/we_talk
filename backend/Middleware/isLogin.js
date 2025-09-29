import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("JWT Token:", token);

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

    // Find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    // Attach user to request
    req.user = user;

    // Pass control to next middleware/controller
    next();
  } catch (error) {
    console.error("JWT Auth Error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};

export default isLogin;
