import dotenv from "dotenv";
dotenv.config();
import ResponseError from "../error/response-error.js";
import jwt from "jsonwebtoken";
const { JWT_SECRET_KEY = "secret" } = process.env;

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new ResponseError(400, "you're not authorized!");
    }
    console.log(JWT_SECRET_KEY);
    const data = await jwt.verify(authorization, JWT_SECRET_KEY);

    if (!data) {
      throw new ResponseError(400, "you're not authorized!");
    }

    req.user = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    next();
  } catch (e) {
    next(e);
  }
};

const adminOnly = async (req, res, next) => {
  if (req.user.role !== "PJ") {
    throw new ResponseError(400, "you're not authorized!");
  }
  next();
};

const superAdmin = async (req, res, next) => {
  if (req.user.role !== "SUPER ADMIN" || req.user.role !== "PJ") {
    throw new ResponseError(400, "you're not authorized!");
  }
  next();
};

export default { authMiddleware, adminOnly, superAdmin };
