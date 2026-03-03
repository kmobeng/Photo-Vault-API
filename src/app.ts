import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.middleware";
import userRoute from "./router/user.route";
import photoRoute from "./router/photo.route";
import albumRoute from "./router/album.route";
import authRoute from "./router/auth.route";
import "./config/passport.config"

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/auth", authRoute);

app.use("/api/user", userRoute);
app.use("/api/", albumRoute, photoRoute);

app.use(errorHandler);

export default app;
