import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";

const create = async (req) => {
  if (!req.body) {
    throw new ResponseError(400, "body tidak boleh kosong");
  }

  const { name, order, price, pay, status, category } = req.body;

  if (!name || !order || !price || !pay || !status || !category) {
    throw new ResponseError(400, "body tidak boleh kosong");
  }

  return prisma.makanan.create({
    data: {
      name,
      order,
      status,
      category,
      price: +price,
      pay: +pay,
      payback: +price - +pay,
      user_id: req.user.id,
    },
  });
};

const getAll = async () => {
  const data = await prisma.makanan.findMany();
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
  return prisma.makanan.delete({
    where: {
      AND: [{ id: +id }, { user_id: req.user.id }],
    },
  });
};

const delete_all = async () => {
  return prisma.makanan.deleteMany();
};

const setBayar = async (req) => {
  if (req.user.role !== "PJ") {
    throw new ResponseError(400, "you're not authorized!");
  }
  const { id } = req.params;
  return prisma.makanan.update({
    where: {
      AND: [{ id: +id }, { user_id: req.user.id }],
    },
    data: {
      status: "bayar",
    },
  });
};

export default { create, getAll, delete_one, delete_all, setBayar };
