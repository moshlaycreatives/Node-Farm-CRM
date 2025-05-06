import express from "express";
import morgan from "morgan";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler, routeNotFound } from "./middlewares/index.js";
import { router } from "./routes/index.js";

// ==============================================
// 1. Define "__dirname" manually for ES modules
// ==============================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// 2. Create "Express" Instance
// ============================================
const app = express();

// ============================================
// 3. Middlewares
// ============================================
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(cors("*"));
app.use(morgan("dev"));
app.use(morgan("combined", { stream: logStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

// ============================================
// 4. Testing Route
// ============================================
app.route("/").get((req, res) => {
  return res.send(
    "<h1 style='display: flex; justify-content: center;  align-items: center; font-size:9rem; margin-top:10rem;'>Server is running.</h1>"
  );
});

// ============================================
// 5. All Routes
// ============================================
app.use("/api/v1", router);

// ============================================
// 6. Error Handling Middlewares
// ============================================
app.use(routeNotFound);
app.use(errorHandler);

export { app };
