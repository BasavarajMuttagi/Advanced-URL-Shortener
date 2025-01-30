import express from "express";
import {
  getAnalyticsByAlias,
  getOverallAnalytics,
} from "../controllers/analytics.controller";
import { validateToken } from "../middlewares/validateToken";
const AnalyticsRouter = express.Router();

AnalyticsRouter.get("/topic/:topic");
AnalyticsRouter.get("/overall", validateToken, getOverallAnalytics);
AnalyticsRouter.get("/:alias", validateToken, getAnalyticsByAlias);

export default AnalyticsRouter;
