import express from "express";
import Order from "../controller/order.js";
import Middleware from "../middleware/auth-middleware.js";
const router = express.Router();

router.post("/create/:category", Middleware.authMiddleware, Order.create);
router.get("/getAll/:category", Middleware.authMiddleware, Order.getAll);
router.delete(
  "/delete-one/:id",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  Order.delete_one
);
router.delete(
  "/delete-all",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  Order.delete_all
);
router.put(
  "/set-bayar",
  Middleware.authMiddleware,
  Middleware.adminOnly,
  Order.setBayar
);

export default router;
