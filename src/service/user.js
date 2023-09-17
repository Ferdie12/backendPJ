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

  user.role = "USER";
  user.count_siang = 0;
  user.count_sarapan = 0;

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

  const user = await prisma.user.findFirst({
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
    posisi: user.posisi,
  };

  const token = await jwt.sign(payload, JWT_SECRET_KEY);

  return token;
};

const getAll = async () => {
  const data = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      posisi: true,
      email: true,
      posisi: true,
      role: true,
      exp: true,
    },
  });

  return data;
};

const getAllPJ = async () => {
  const data = await prisma.user.findMany({
    where: { role: { startsWith: "PJ" } },
    select: {
      id: true,
      name: true,
      posisi: true,
      role: true,
    },
  });

  const pjSiang = [];
  const pjSarapan = [];

  data.forEach((item) => {
    if (item.role === "PJ siang") {
      pjSiang.push(item);
    } else if (item.role === "PJ sarapan") {
      pjSarapan.push(item);
    }
  });

  return {
    siang: pjSiang,
    sarapan: pjSarapan,
  };
};

const getAllSetPJ = async (req) => {
  const check = await prisma.user.findFirst({
    where: { id: req.user.id },
    select: { exp: true, role: true, count_sarapan: true, count_siang: true },
  });

  const category = check.role.split(" ")[1];

  const data = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      posisi: true,
      role: true,
      count_sarapan: true,
      count_siang: true,
    },
  });

  const tes_sarapan = await prisma.user.findFirst({
    where: {
      count_sarapan: { lt: check.count_sarapan },
    },
  });

  const tes_siang = await prisma.user.findFirst({
    where: {
      count_siang: { lt: check.count_siang },
    },
  });

  let value = [];

  data.forEach((item) => {
    if (
      category == "siang" &&
      check.count_siang > item.count_siang &&
      tes_siang
    ) {
      value.push(item);
    } else if (
      category == "siang" &&
      check.count_siang == item.count_siang &&
      !tes_siang
    ) {
      value.push(item);
    } else if (
      category == "sarapan" &&
      check.count_sarapan > item.count_sarapan &&
      tes_sarapan
    ) {
      value.push(item);
    } else if (
      category == "sarapan" &&
      check.count_sarapan == item.count_sarapan &&
      !tes_sarapan
    ) {
      value.push(item);
    }
  });

  return value;
};

const setPJ = async (req) => {
  const { id } = req.params;

  const check = await prisma.user.findFirst({
    where: { id: req.user.id },
    select: { exp: true, role: true },
  });

  const category = check.role.split(" ")[1];

  const richek = await prisma.user.findFirst({
    where: {
      AND: [
        { id: +id },
        {
          role: {
            startsWith: "PJ",
          },
        },
      ],
    },
    select: { name: true },
  });

  const total = await prisma.user.findUnique({
    where: { id: +id },
    select: { count_siang: true, count_sarapan: true },
  });

  let result;
  if (category == "siang") {
    result = {
      role: `PJ ${category}`,
      exp: 0,
      count_siang: total.count_siang + 1,
    };
  } else if (category == "sarapan") {
    result = {
      role: `PJ ${category}`,
      exp: 0,
      count_sarapan: total.count_sarapan + 1,
    };
  }

  const tanggal = new Date();
  const angkaHari = tanggal.getDay();

  if (angkaHari > check.exp) {
    throw new ResponseError(
      400,
      "kamu bisa menukar status pj hanya pada hari minggu "
    );
  }

  if (richek) {
    throw new ResponseError(400, "pj sudah terdaftar");
  }
  const [updatePJ, resetPJ] = await prisma.$transaction(async (prisma) => {
    const updatePJ = await prisma.user.update({
      where: { id: +id },
      data: result,
    });

    const resetPJ = await prisma.user.update({
      where: { id: req.user.id },
      data: { role: "USER", exp: null },
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
  getAllPJ,
  getAllSetPJ,
};
