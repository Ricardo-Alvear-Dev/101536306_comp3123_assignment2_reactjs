import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";

const uploadDir = path.resolve(process.cwd(), "uploads");

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

const invalidImage = () => {
  const error = new Error("Invalid image file") as Error & {
    status: number;
  };
  error.status = 400;
  return error;
};

export const saveImage = async (file: Express.Multer.File) => {
  const detectedType = await fileTypeFromBuffer(file.buffer);

  if (
    !detectedType ||
    !Object.hasOwn(allowedTypes, detectedType.mime) ||
    detectedType.mime !== file.mimetype
  ) {
    throw invalidImage();
  }

  const format = allowedTypes[detectedType.mime];

  let processedImage: Buffer;

  try {
    const image = sharp(file.buffer, {
      limitInputPixels: 20_000_000,
      failOn: "error",
    });

    const metadata = await image.metadata();

    if (
      metadata.format !== format ||
      !metadata.width ||
      !metadata.height ||
      metadata.width > 5000 ||
      metadata.height > 5000 ||
      (metadata.pages ?? 1) !== 1
    ) {
      throw invalidImage();
    }

    processedImage = await image
      .rotate()
      .toFormat(format as "jpeg" | "png" | "webp")
      .toBuffer();
  } catch {
    throw invalidImage();
  }

  const extension = format === "jpeg" ? "jpg" : format;
  const filename = `${randomUUID()}.${extension}`;

  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);

  await writeFile(filePath, processedImage, {
    flag: "wx",
  });

  return {
    filename,
    imageUrl: `/uploads/${filename}`,
  };
};
