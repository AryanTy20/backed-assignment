import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  CustomError,
  userValidator,
  hashedPassword,
  JWTService,
  loginValidator,
  updateValidator,
} from "../utils";
import UserModel from "../model";
import Refreshtoken from "../model/refreshtoken";
import mongoose from "mongoose";

export const Controller = {
  /* register Super Admin and User */
  async register(req: Request, res: Response, next: NextFunction) {
    const { error } = userValidator.validate(req.body);
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
      const existToken = await Refreshtoken.exists({ token: refreshToken });
      if (!existToken) await Refreshtoken.create({ token: refreshToken });
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
  /* login user */
  async login(req: Request, res: Response, next: NextFunction) {
    const { error } = loginValidator.validate(req.body);
    if (error) return next(CustomError(422, error.message));
    const { remember, email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return next(CustomError(401, "wrong credential"));
      const invalidPassword = bcrypt.compareSync(password, user.password);
      if (!invalidPassword) return next(CustomError(401, "wrong credential"));
      const token = JWTService.sign({ _id: String(user._id), role: user.role });
      const refreshToken = JWTService.refresh({
        _id: String(user._id),
        role: user.role,
      });
      const existToken = await Refreshtoken.exists({ token: refreshToken });
      if (!existToken) await Refreshtoken.create({ token: refreshToken });
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
  /* refresh accesstoken with help of refreshtoken  from cookie */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh } = req.cookies;
      if (!refresh) return next(CustomError(401, "unauthorized"));
      const tokenExist = await Refreshtoken.exists({ token: refresh });
      if (!tokenExist) return next(CustomError(401, "unauthorized"));
      const { _id, role } = JWTService.refresh_v(refresh) as {
        _id: string;
        role: string;
      };
      const user = await UserModel.findById({ _id });
      const token = JWTService.sign({
        _id,
        role,
      });
      res.json({ token, user: user?.first_name, role });
    } catch (error) {
      return next(error);
    }
  },

  /* Admin and user can update data */
  async update(req: Request, res: Response, next: NextFunction) {
    /* Checking if the id is present in the request params. */
    const { id } = req.params;
    if (!id) return next(CustomError(400, "id is rqeuired"));

    /* validating req.body */
    const { error } = updateValidator.validate(req.body);
    if (error) return next(CustomError(422, error.message));

    /* auth role */
    const { role } = req.user;
    try {
      /* validating user id */
      const validId = mongoose.Types.ObjectId.isValid(id);
      if (!validId) return next(CustomError(400, "invalid id"));

      /* user data for role check */
      const user = await UserModel.findById({ _id: id });
      if (!user) return next(CustomError(404, "user not found"));
      const dataRoleType = user?.role === "admin" ? "admin" : "user";

      /* check proper access for update */
      if (dataRoleType === "admin" && role === "user")
        return next(CustomError(403, "not proper access"));

      const updatedData = await UserModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...req.body,
          },
        },
        { new: true }
      ).select("-__v -createdAt -updatedAt -password -_id");

      res.json(updatedData);
    } catch (err) {
      return next(err);
    }
  },
};
