import { Router } from "express";
import { login, signUp } from "../controller/auth.controller";
import { loginLimiter } from "../middleware/limiter.middleware";

const router = Router();

router.post("/signup", loginLimiter, signUp);
router.post("/login", loginLimiter, login);

export default router;
