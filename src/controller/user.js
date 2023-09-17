import userService from "../service/user.js";

export default class User {
  static register = async (req, res, next) => {
    try {
      const result = await userService.register(req.body);
      return res.status(200).json({
        status: true,
        message: "register succes",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  static login = async (req, res, next) => {
    try {
      const result = await userService.login(req.body);
      return res.status(200).json({
        status: true,
        message: "login succes",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  static getAll = async (req, res, next) => {
    try {
      const result = await userService.getAll();
      return res.status(200).json({
        status: true,
        message: "get all succes",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  static setPJ = async (req, res, next) => {
    try {
      const result = await userService.setPJ(req);

      return res.status(200).json({
        status: true,
        message: "update pj succes",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  static getAllPJ = async (req, res, next) => {
    try {
      const result = await userService.getAllPJ();
      return res.status(200).json({
        status: true,
        message: "get all pj succes",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllSetPJ = async (req, res, next) => {
    try {
      const result = await userService.getAllSetPJ(req);
      return res.status(200).json({
        status: true,
        message: "get all set pj succes",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
}
