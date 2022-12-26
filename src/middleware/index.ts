import { NextFunction, Request, Response } from "express";
import { CustomError, JWTService } from "../utils";

type UserType = {
  _id: string;
  role: string;
};

declare global {
  namespace Express {
    export interface Request {
      user: UserType;
    }
  }
}

/* Auth check by access token  middleware*/
export const Auth = (req: Request, res: Response, next: NextFunction) => {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(CustomError(401, "unauthorized"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const { _id, role } = JWTService.sign_v(token) as UserType;
    req.user = {
      _id,
      role,
    };
    next();
  } catch (error) {
    return next(CustomError(401, "unauthorized"));
  }
};

export default Auth;
