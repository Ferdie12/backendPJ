import express from "express";
import User from "./user.js";
import Order from "./order.js";
const router = express.Router();

// list api
router.use("/user", User);
router.use("/order", Order);

router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "deploy succes",
  });
});

export default router;
