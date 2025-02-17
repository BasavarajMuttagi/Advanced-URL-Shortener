import { Request, Response } from "express";
import { tokenType } from "../middlewares/validateToken";
import AnalyticsService from "../services/analyticsService";
import UrlService from "../services/urlService";

const getAnalyticsByAlias = async (req: Request, res: Response) => {
  try {
    const user = req.body.user as tokenType;
    const alias = req.params.alias;
    const result1 = await UrlService.getUrlByAlias(alias, user.userId);
    if (!result1) {
      res.status(404).json({ message: "Alias not found" });
      return;
    }
    const result = await AnalyticsService.getAnalyticsByUrlId(
      result1?.id,
      user.userId,
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getOverallAnalytics = async (req: Request, res: Response) => {
  try {
    const user = req.body.user as tokenType;
    const result = await AnalyticsService.getOverallAnalytics(user.userId);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAnalyticsByTopic = async (req: Request, res: Response) => {
  try {
    const user = req.body.user as tokenType;
    const topic = req.params.topic;
    const result = await AnalyticsService.getAnalyticsByTopic(
      topic,
      user.userId,
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getAnalyticsByAlias, getAnalyticsByTopic, getOverallAnalytics };
