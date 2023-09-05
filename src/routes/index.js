import express from "express";
import User from "./user.js";
import Order from "./order.js";
const router = express.Router();

// list api
router.use("/user", User);
router.use("/order", Order);

export default router;
