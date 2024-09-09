import { Router } from "express";
import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/authController.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").get(refresh);
router.route("/logout").post(logout);

export default router;
