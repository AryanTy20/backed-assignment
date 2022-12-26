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

/* This is a route that will be used to update a user's information. */
router.patch("/update/:id", Auth, Controller.update);

/* This is a route that will be used to view a user's information. */
router.get("/view/:id?", Auth, Controller.view);

/* This is a route that will be used to add a user's information. By Super admin and user */
router.post("/add", Auth, Controller.add);

export default router;
