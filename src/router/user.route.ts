import { Router } from "express";
import { protect, restrictTo } from "../controller/auth.controller";
import {
  deleteUser,
  getAllUsers,
  getMe,
  getSingleUser,
  updateMe,
} from "../controller/user.controller";
import { apiLimiter } from "../middleware/limiter.middleware";

const router = Router();

router.use(protect);
router.use(apiLimiter);

router.get("/me", getMe, getSingleUser);
router.patch("/update-me", updateMe);

router.use(restrictTo("admin"));
router.route("/").get(getAllUsers);

router.route("/:userId").get(getSingleUser).delete(deleteUser);

export default router;
