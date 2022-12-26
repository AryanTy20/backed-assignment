import { Router } from "express";
const router = Router();
import { AdminController as AC } from "../controllers";

router.post("/register", AC.register);

/* Login route */
router.post("/login", AC.login);

export default router;
