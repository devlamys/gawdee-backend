import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import compression from "compression";
import path from "path";

import routes from "./routes/index.routes.js";
import { errorHandler } from "./utils/ApiError.js";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      callback(null, origin);
    },
  })
);

app.options("*", cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());

app.use(
  compression({
    level: 6,
    threshold: 1024,
  })
);

// ✅ Cache all public static files
app.use(
  express.static("public", {
    maxAge: "30d",
    immutable: true,
    etag: true,
    lastModified: true,
  })
);

// ✅ Cache uploaded images from /uploads folder
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    maxAge: "30d",
    immutable: true,
    etag: true,
    lastModified: true,
  })
);

// routes declaration
app.use("/api/v2", routes);

app.get("/", (req, res) => {
  res.status(httpStatus.OK).send({
    status: "Health Check :) Server is up and running",
  });
});

app.use(errorHandler);

export { app };