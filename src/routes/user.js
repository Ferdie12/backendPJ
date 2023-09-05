import express from "express";
import User from "../controller/user.js";
import Middleware from "../middleware/auth-middleware.js";
const router = express.Router();

// api user
router.post("/register", User.register);
router.post("/login", User.login);
router.get("/getAll", User.getAll);
router.get(
  "/setPJ",
  Middleware.authMiddleware,
  Middleware.superAdmin,
  User.setPJ
);

export default router;
