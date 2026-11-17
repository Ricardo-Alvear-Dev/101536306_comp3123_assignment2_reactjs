import cors from "cors";
import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import multer from "multer";

import upload from "./middlewares/imageUpload";
import employeeRouter from "./routes/employee/employee.routes";
import healthRouter from "./routes/health/health.routes";
import userRouter from "./routes/user/user.routes";

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: "Too many requests received",
});

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(helmet() as unknown as express.RequestHandler);
app.use(limiter);

// Existing routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/emp", employeeRouter);
app.use("/health", healthRouter);

// Image upload route
app.post("/api/v1/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No image uploaded",
    });
  }

  return res.status(200).json({
    message: "Image received successfully",
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// Upload error handling
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          message: "Image exceeds the 2 MiB limit",
        });
      }

      return res.status(400).json({
        message: "Invalid upload",
      });
    }

    const status =
      "status" in err && typeof err.status === "number" ? err.status : 500;

    return res.status(status).json({
      message: status === 500 ? "Internal server error" : err.message,
    });
  },
);

const setUpServer = async () => {
  try {
    const dbConnection = await mongoose.connect(
      process.env.MONGODB_URI as string,
    );

    const serverConnection = app.listen(process.env.PORT || 3000);

    dbConnection
      ? console.log("Connected to mongodb")
      : new Error("Something went wrong with the database connection");

    serverConnection
      ? console.log(
          `The server has connected to PORT: ${process.env.PORT || 3000}`,
        )
      : new Error("Something went wrong with the server connection");
  } catch (error) {
    if (error instanceof Error) return console.error(error);
  }
};

setUpServer();
