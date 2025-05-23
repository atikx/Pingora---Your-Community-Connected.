import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pool } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import generalRoutes from "./routes/general.routes.js";
import verifiedUserRoutes from "./routes/verifiedUser.routes.js";
import { sendOtpMail } from "./functions/mailer.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/general", generalRoutes);
app.use("/verifiedUser", verifiedUserRoutes);

app.get("/", (req, res) => res.send("Pingora API is running"));

// sendOtpMail("atikshgupta6373@gmail.com", 698745);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
