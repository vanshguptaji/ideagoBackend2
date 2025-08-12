import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import fileUpload  from "express-fileupload";
import projectRouter from "./routes/project.routes";
import blogRouter from "./routes/blog.routes";
import userRouter from "./routes/user.routes"
const app = express();
const httpServer = createServer(app);

app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
}));
app.use(urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://symphonious-moonbeam-5e70cc.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
    ],
    credentials: true,
  })
);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/project", projectRouter);


export { app, httpServer };