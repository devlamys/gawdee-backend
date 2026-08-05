import dotenv from "dotenv";
import connectDB from "./db/index.js";
import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import startAmazonCronJobs from "./services/amazon.cron.js";

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;

console.log("1️⃣ Backend starting…");

connectDB()
  .then(async () => {
    console.log("2️⃣ MongoDB connected successfully!");

    const server = http.createServer(app);
    console.log("3️⃣ HTTP server created");

    startAmazonCronJobs();


    console.log("7️⃣ Before server.listen …");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`8️⃣ Server running on port: ${PORT}`);
    });

    server.on("listening", () => {
      console.log("LISTEN event fired");
    });

    server.on("error", (err) => {
      console.error("SERVER ERROR:", err);
    });

    console.log("9️⃣ After server.listen");
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });
