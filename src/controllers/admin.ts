import { NextFunction, Request, Response } from "express";
import {
  CustomError,
  registerValidator,
  hashedPassword,
  JWTService,
} from "../utils";
import UserModel from "../model";

export const AdminController = {
  async register(req: Request, res: Response, next: NextFunction) {
    const { error } = registerValidator.validate(req.body);
    if (error) return next(CustomError(422, error.message));
    const { password, confirm_password, email, ...rest } = req.body;
    try {
      const exist = await UserModel.exists({ email });
      if (exist) return next(CustomError(409, "user with email already exist"));
      const hash = hashedPassword(password);
      const user = await UserModel.create({ ...rest, email, password: hash });
      const token = JWTService.sign({ _id: String(user._id), role: user.role });
      const refreshToken = JWTService.refresh({
        _id: String(user._id),
        role: user.role,
      });
      res.cookie("refresh", refreshToken, {
        maxAge: 604800000,
        sameSite: "none",
        secure: true,
        httpOnly: true,
      });
      res.status(201).json({ user: user.first_name, token });
    } catch (err) {
      return next(err);
    }
  },
};
