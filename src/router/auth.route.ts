import { Router } from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signUp,
} from "../controller/auth.controller";
import { loginLimiter } from "../middleware/limiter.middleware";

const router = Router();

router.post("/signup", loginLimiter, signUp);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", loginLimiter, forgotPassword);
router.post("/reset-password/:token", loginLimiter, resetPassword);

export default router;
