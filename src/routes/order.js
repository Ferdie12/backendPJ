import express from "express";
import Order from "../controller/order.js";
import Middleware from "../middleware/auth-middleware.js";
const router = express.Router();

router.post("/create", Middleware.authMiddleware, Order.create);
router.get("/getAll", Middleware.authMiddleware, Order.getAll);
router.delete(
  "/delete_one/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  Order.delete_one
);
router.delete(
  "/delete_all",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  Order.delete_all
);
router.get(
  "/setBayar/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  Order.setBayar
);

export default router;
