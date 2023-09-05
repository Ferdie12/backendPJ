import { validate } from "../validation/validation.js";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { JWT_SECRET_KEY, SUPER_ADMIN } = process.env;

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prisma.user.count({
    where: {
      email: user.email,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "email sudah terdaftar!");
  }

  user.password = await bcrypt.hash(user.password, 10);

  delete user.confirmpassword;

  if (user.email === SUPER_ADMIN) {
    user.role = "SUPER ADMIN";
  } else {
    user.role = "USER";
  }

  return prisma.user.create({
    data: user,
    select: {
      email: true,
      name: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prisma.user.findUnique({
    where: {
      email: loginRequest.email,
    },
  });

  if (!user) {
    throw new ResponseError(401, "email atau password anda salah!");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new ResponseError(401, "email atau password anda salah!");
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = await jwt.sign(payload, JWT_SECRET_KEY);

  return token;
};

const getAll = async () => {
  const data = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, posisi: true },
  });

  return data;
};

const setPJ = async (request) => {
  const { id } = req.params;
  if (req.user.role !== "SUPER ADMIN" || req.user.role !== "PJ") {
    throw new ResponseError(400, "you're not authorized!");
  }

  const [updatePJ, resetPJ] = await prisma.$transaction(async (prisma) => {
    const updatePJ = await prisma.user.update({
      where: { id: id },
      data: { role: "PJ" },
    });

    const resetPJ = await prisma.user.update({
      where: { id: req.user.id },
      data: { role: "USER" },
    });

    return [updatePJ, resetPJ];
  });

  if (!updatePJ && !resetPJ) {
    throw new ResponseError(400, "update pj gagal");
  }

  return true;
};

export default {
  register,
  login,
  setPJ,
  getAll,
};
