import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import AnalyticsRouter from "./src/routes/analytics.route";
import AuthRouter from "./src/routes/auth.route";
import UrlRouter from "./src/routes/url.route";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FE_BASE_URL,
    credentials: true,
  }),
);

export const client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  `${process.env.BE_BASE_URL}/auth/google/callback`,
);

app.use("/auth", AuthRouter);
app.use("/api/shorten", UrlRouter);
app.use("/api/analytics", AnalyticsRouter);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
