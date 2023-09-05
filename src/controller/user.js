import userService from "../service/user.js";

export default class User {
  static register = async (req, res, next) => {
    try {
      const result = await userService.register(req.body);
      res.status(200).json({
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
      res.status(200).json({
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
      res.status(200).json({
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

      res.status(200).json({
        status: true,
        message: "update pj succes",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
}
