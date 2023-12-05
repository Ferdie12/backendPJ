import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import orderValidate from "../validation/order-validation.js";
import { validate } from "../validation/validation.js";

const create = async (req) => {
  const result = validate(orderValidate, req.body);
  const now = new Date();
  const targetTimeMorningStart = new Date();
  targetTimeMorningStart.setHours(7, 40, 0, 0); // Set waktu mulai rentang pagi

  const targetTimeMorningEnd = new Date();
  targetTimeMorningEnd.setHours(10, 0, 0, 0); // Set waktu akhir rentang pagi

  const targetTimeAfternoonStart = new Date();
  targetTimeAfternoonStart.setHours(11, 0, 0, 0); // Set waktu mulai rentang siang

  const targetTimeAfternoonEnd = new Date();
  targetTimeAfternoonEnd.setHours(13, 0, 0, 0); // Set waktu akhir rentang siang

  if (
    (now >= targetTimeMorningStart && now <= targetTimeMorningEnd) ||
    (now >= targetTimeAfternoonStart && now <= targetTimeAfternoonEnd)
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
