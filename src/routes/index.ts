import { Router } from "express";
const router = Router();
import { Controller } from "../controllers";
import { Auth } from "../middleware";

router.post("/register", Controller.register);

/* Login route */
router.post("/login", Controller.login);

/* This is a route that will be used to logout a user. */
router.get("/logout", Auth, Controller.logout);

/* This is a route that will be used to refresh a user's token. */
router.get("/refresh", Auth, Controller.refresh);

export default router;
