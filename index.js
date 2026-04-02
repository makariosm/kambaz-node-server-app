import "dotenv/config";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import express from "express";
import cors from "cors";
import db from "./kambaz/database/index.js";
import UserRoutes from "./kambaz/users/routes.js";
import CourseRoutes from "./kambaz/courses/routes.js";
import AssignmentRoutes from "./kambaz/assignments/routes.js";
import EnrollmentsRoutes from "./kambaz/enrollments/routes.js";
import session from "express-session";
import mongoose from "mongoose";

const isDevelopment = process.env.SERVER_ENV === "development";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);
const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  }),
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: !isDevelopment,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
UserRoutes(app);
CourseRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentsRoutes(app, db);
Lab5(app);
Hello(app);
app.listen(process.env.PORT || 4000);
