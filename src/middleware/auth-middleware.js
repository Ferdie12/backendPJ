import dotenv from "dotenv";
dotenv.config();
import ResponseError from "../error/response-error.js";
import jwt from "jsonwebtoken";
import prisma from "../application/database.js";
const { JWT_SECRET_KEY = "secret" } = process.env;

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new ResponseError(400, "you're not authorized!");
    }

    const data = await jwt.verify(authorization, JWT_SECRET_KEY);

    if (!data) {
      throw new ResponseError(400, "you're not authorized!");
    }

    req.user = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      posisi: data.posisi,
    };

    next();
  } catch (e) {
    next(e);
  }
};

const adminOnly = async (req, res, next) => {
  try {
    const check = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });

    const role = check.role.split(" ")[0];
    if (role !== "PJ") {
      throw new ResponseError(400, "Harus PJ Woiiiii!");
    }
    next();
  } catch (e) {
    next(e);
  }
};

export default { authMiddleware, adminOnly };
