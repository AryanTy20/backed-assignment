import joi from "joi";

export const registerValidator = joi.object({
  first_name: joi.string().min(3).max(20).required(),
  middle_name: joi.string().min(3).max(20),
  last_name: joi.string().min(3).max(20).required(),
  email: joi.string().min(3).email().required(),
  password: joi.string().min(6).max(20).required(),
  confirm_password: joi.string().valid(joi.ref("password")),
  role: joi.string().valid("admin", "user").required(),
  department: joi.string().max(50),
});
