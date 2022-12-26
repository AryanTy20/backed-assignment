import jwt from "jsonwebtoken";
import { SIGN_TOKEN, REFRESH_TOKEN } from "../config";

type PayloadType = {
  role: string;
  _id: string;
};

/* It's a class that has static methods that sign and verify JWT tokens */
export class JWTService {
  static sign(
    payload: PayloadType,
    expires = "300s",
    secretkey = SIGN_TOKEN as string
  ) {
    return jwt.sign(payload, secretkey, {
      expiresIn: expires,
    });
  }
  static sign_v(payload: string, secretkey = SIGN_TOKEN as string) {
    return jwt.verify(payload, secretkey);
  }
  static refresh(
    payload: PayloadType,
    expires = "7d",
    secretkey = REFRESH_TOKEN as string
  ) {
    return jwt.sign(payload, secretkey, { expiresIn: expires });
  }
  static refresh_v(payload: string, secretkey = REFRESH_TOKEN as string) {
    return jwt.verify(payload, secretkey);
  }
}
