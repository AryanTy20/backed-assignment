import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  CustomError,
  registerValidator,
  hashedPassword,
  JWTService,
  loginValidator,
} from "../utils";
import UserModel from "../model";
import Refreshtoken from "../model/refreshtoken";

export const Controller = {
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
      res.status(201).json({ user: user.first_name, role: user.role, token });
    } catch (err) {
      return next(err);
    }
  },
  async login(req: Request, res: Response, next: NextFunction) {
    const { error } = loginValidator.validate(req.body);
    if (error) return next(CustomError(422, error.message));
    const { remember, email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return next(CustomError(401, "wrong credential"));
      const invalidPassword = bcrypt.compareSync(password, user.password);
      if (invalidPassword) return next(CustomError(401, "wrong credential"));
      const token = JWTService.sign({ _id: String(user._id), role: user.role });
      const refreshToken = JWTService.refresh({
        _id: String(user._id),
        role: user.role,
      });
      res.cookie("refresh", refreshToken, {
        ...(remember === true && {
          maxAge: remember ? 604800000 : 86400000,
        }),
        sameSite: "none",
        secure: true,
        httpOnly: true,
      });
      res.json({
        user: user.first_name,
        role: user.role,
        token,
      });
    } catch (err) {
      return next(err);
    }
  },
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh } = req.cookies;
      if (!refresh) return res.sendStatus(204);
      const userfound = await Refreshtoken.exists({ token: refresh });
      if (!userfound) {
        res.clearCookie("refresh", {
          maxAge: 0,
          sameSite: "none",
          secure: true,
          httpOnly: true,
        });
        return res.sendStatus(403);
      }
      await Refreshtoken.findOneAndDelete({ token: refresh });
      res.clearCookie("refresh", {
        maxAge: 0,
        sameSite: "none",
        secure: true,
        httpOnly: true,
      });
      res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  },
};
