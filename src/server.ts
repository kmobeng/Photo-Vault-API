import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB } from "./config/db.config";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error starting server", error);
  }
};

startServer();
