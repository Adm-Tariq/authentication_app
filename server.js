import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import path from "path";
import { fileURLToPath } from "url";

/*-----------------------------------------------*/
import connectDB from "./config/connectDB.js";
import corsOptions from "./config/corsOptions.js";
import rootRoutes from "./routes/root.js";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", rootRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("text").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to DB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
