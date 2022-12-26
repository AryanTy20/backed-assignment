import { Router } from "express";
const router = Router();
import { Controller } from "../controllers";

router.post("/register", Controller.register);

/* Login route */
router.post("/login", Controller.login);

/* This is a route that will be used to logout a user. */
router.get("/logout", Controller.logout);

/* This is a route that will be used to refresh a user's token. */
router.get("/refresh", Controller.refresh);

export default router;
