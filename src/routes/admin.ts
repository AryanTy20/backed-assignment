import { Router } from "express";
const router = Router();
import { AdminController as AC } from "../controllers";

router.post("/register", AC.register);

export default router;
