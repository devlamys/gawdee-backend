import sharp from "sharp";
import path from "path";
import fs from "fs";

export const optimizeImage = async (file, folder = "uploads") => {
  const uploadDir = path.join(process.cwd(), folder);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const baseName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  const sizes = [
    { key: "thumb", width: 300 },
    { key: "medium", width: 800 },
    { key: "large", width: 1400 },
  ];

  const urls = {};

  for (const size of sizes) {
    const fileName = `${baseName}-${size.key}.webp`;
    const outputPath = path.join(uploadDir, fileName);

    await sharp(file.path)
      .resize({
        width: size.width,
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
        effort: 4,
      })
      .toFile(outputPath);

    urls[size.key] = `${process.env.MEDIA_BASE_URL}/${folder}/${fileName}`;
  }

  fs.unlinkSync(file.path);

  return urls;
};