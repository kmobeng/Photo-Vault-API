import { Router } from "express";
import { protect } from "../controller/auth.controller";
import {
  deletePhoto,
  getAllPhotos,
  getSinglePhoto,
  updatePhoto,
  uploadPhoto,
} from "../controller/photo.controller";
import multer from "multer";
import { apiLimiter } from "../middleware/limiter.middleware";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
router.use(protect);
router.use(apiLimiter);

router
  .route("/photo")
  .post(upload.single("photo"), uploadPhoto)
  .get(getAllPhotos);

router
  .route("/photo/:photoId")
  .get(getSinglePhoto)
  .patch(updatePhoto)
  .delete(deletePhoto);

router.route("/:userId/photo").get(getAllPhotos);

router.route("/:userId/photo/:photoId").get(getSinglePhoto);
export default router;
