import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import orderValidate from "../validation/order-validation.js";
import { validate } from "../validation/validation.js";

const create = async (req) => {
  const result = validate(orderValidate, req.body);
  // Dapatkan waktu UTC saat ini
  const now = new Date();
  const nowUTC = new Date(now.toISOString());

  // Tetapkan waktu UTC untuk rentang pagi dan siang
  const targetTimeMorningStartUTC = new Date("1970-01-01T07:40:00Z");
  const targetTimeMorningEndUTC = new Date("1970-01-01T10:00:00Z");
  const targetTimeAfternoonStartUTC = new Date("1970-01-01T11:00:00Z");
  const targetTimeAfternoonEndUTC = new Date("1970-01-01T13:00:00Z");

  // Lakukan pengecekan rentang waktu menggunakan waktu UTC
  if (
    (nowUTC >= targetTimeMorningStartUTC &&
      nowUTC <= targetTimeMorningEndUTC) ||
    (nowUTC >= targetTimeAfternoonStartUTC &&
      nowUTC <= targetTimeAfternoonEndUTC)
  ) {
    throw new ResponseError(
      400,
      "Operasi terlarang pada rentang waktu tertentu. Silakan coba lagi di luar rentang waktu 7:40 - 10 atau 11 - 13."
    );
  }

  return prisma.makanan.create({
    data: {
      name: result.name,
      order: result.order,
      status: result.status,
      category: result.category,
      price: result.price,
      pay: result.pay,
      payback: result.pay - result.price,
      user_id: req.user.id,
    },
  });
};

const getAll = async (req) => {
  const { category } = req.params;
  const data = await prisma.makanan.findMany({ where: { category } });
  if (!data) {
    throw new ResponseError(500, "data tidak ada");
  }
  const total_uang = data.reduce((total, item) => {
    return total + item.pay;
  }, 0);
  const total_kembalian = data.reduce((total, item) => {
    return total + item.payback;
  }, 0);

  return { data, total_uang, total_kembalian };
};

const delete_one = async (req) => {
  const { id } = req.params;
  const check = await prisma.makanan.findFirst({
    where: {
      id: +id,
    },
  });

  if (!check) {
    throw new ResponseError(404, "Makanan not found");
  }
  return prisma.makanan.delete({
    where: {
      id: +id,
    },
  });
};

const delete_all = async (req) => {
  const data = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { role: true },
  });
  const category = data.role.split(" ")[1];
  return prisma.makanan.deleteMany({ where: { category } });
};

const setBayar = async (req) => {
  const { id, status } = req.body;
  const makanan = await prisma.makanan.findFirst({
    where: {
      id: id,
    },
  });

  if (!makanan) {
    throw new ResponseError(404, "Makanan not found");
  }

  return prisma.makanan.update({
    where: {
      id: makanan.id,
    },
    data: {
      status,
    },
  });
};

export default {
  create,
  getAll,
  delete_one,
  delete_all,
  setBayar,
};
