import express from "express";
import { getAnalyticsByAlias } from "../controllers/analytics.controller";
const AnalyticsRouter = express.Router();

AnalyticsRouter.get("/:alias", getAnalyticsByAlias);
AnalyticsRouter.get("/topic/:topic");
AnalyticsRouter.get("/overall");
export default AnalyticsRouter;
