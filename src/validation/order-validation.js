import Joi from "joi";

const createOrderValidation = Joi.object({
  name: Joi.string().required(),
  order: Joi.string().required(),
  price: Joi.number().required(),
  pay: Joi.number().required(),
  status: Joi.string().required(),
  category: Joi.string().required(),
});

export default createOrderValidation;
