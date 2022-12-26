import { Router } from "express";
const router = Router();
import { Controller } from "../controllers";

router.post("/register", Controller.register);

/* Login route */
router.post("/login", Controller.login);

export default router;
