import cors from "cors";
import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import multer from "multer";

import { unlink } from "node:fs/promises";
import path from "node:path";
import upload from "./middlewares/imageUpload";
import Image from "./models/image.mode";
import employeeRouter from "./routes/employee/employee.routes";
import healthRouter from "./routes/health/health.routes";
import userRouter from "./routes/user/user.routes";
import { saveImage } from "./utils/saveImage";

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

app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"), {
    dotfiles: "deny",
    index: false,
    fallthrough: false,
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Disposition", "inline");
    },
  }),
);

app.post("/api/v1/upload", upload.single("image"), async (req, res, next) => {
  let savedFilename: string | undefined;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const image = await saveImage(req.file);
    savedFilename = image.filename;

    const savedImage = await Image.create({
      filename: image.filename,
      imageUrl: image.imageUrl,
    });

    return res.status(201).json({
      message: "Image uploaded successfully",
      image: savedImage,
    });
  } catch (error) {
    if (savedFilename) {
      try {
        await unlink(path.resolve(process.cwd(), "uploads", savedFilename));
      } catch (cleanupError) {
        console.error("Failed to clean up image:", cleanupError);
      }
    }

    next(error);
  }
});

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
