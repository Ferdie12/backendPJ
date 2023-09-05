import Joi from "joi";

const registerUserValidation = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  posisi: Joi.string().required(),
  password: Joi.string().required(),
  confirmpassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Konfirmasi password harus sesuai dengan password",
  }),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export { registerUserValidation, loginUserValidation };
