import express from "express";
import User from "../controller/user.js";
import Middleware from "../middleware/auth-middleware.js";
const router = express.Router();

// api user
router.post("/register", User.register);
router.post("/login", User.login);
router.get("/getAll", User.getAll);
router.get(
  "/set-pj/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  User.setPJ
);
router.get("/getAllPJ", Middleware.authMiddleware, User.getAllPJ);
router.get("/getAllSetPJ", Middleware.authMiddleware, User.getAllSetPJ);

export default router;
