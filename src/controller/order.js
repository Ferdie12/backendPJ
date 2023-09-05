import orderService from "../service/order.js";

const create = async (req, res, next) => {
  try {
    const result = await orderService.create(req);

    res.status(200).json({
      status: true,
      message: "create succes",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await orderService.getAll();

    res.status(200).json({
      status: true,
      message: "get all succes",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const delete_one = async (req, res, next) => {
  try {
    const result = await orderService.delete_one(req);

    res.status(200).json({
      status: true,
      message: "delete succes",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const delete_all = async (req, res, next) => {
  try {
    const result = await orderService.delete_all();

    res.status(200).json({
      status: true,
      message: "delete all succes",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const setBayar = async (req, res, next) => {
  try {
    const result = await orderService.setBayar(req);

    res.status(200).json({
      status: true,
      message: "set bayar succes",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, getAll, delete_one, delete_all, setBayar };
