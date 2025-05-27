import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import generalRoutes from "./routes/general.routes.js";
import verifiedUserRoutes from "./routes/verifiedUser.routes.js";
import { sendNewPostMail } from "./functions/mailer.js";
import cron from "node-cron";
import { scheduledPostUploader } from "./functions/scheduledPostUploader.js";



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

app.get("/", async (req, res) => {
  await sendNewPostMail(["atikshgupta6373@gmail.com", "atikshg69.com"], {
    author_name: "Atiksh Gupta",
    author_avatar: "https://example.com/avatar.jpg",
    post_link: "https://your-site.com/post/abc123",
    post_image: "https://your-site.com/images/post-cover.jpg",
    post_title: "Understanding Async/Await in JavaScript",
    post_description: "A deep dive into async programming in JS...",
    post_created_at: new Date().toDateString(),
  });
  res.status(200).json({ message: "Welcome to the server!" });
  console.log("Welcome to the server!");
});

cron.schedule("* * * * *", () => {
  scheduledPostUploader();
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
