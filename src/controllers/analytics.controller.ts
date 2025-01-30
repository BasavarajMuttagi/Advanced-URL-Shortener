import { Request, Response } from "express";
import AnalyticsService from "../services/analyticsService";
import UrlService from "../services/urlService";

const getAnalyticsByAlias = async (req: Request, res: Response) => {
  try {
    const alias = req.params.alias;
    const result1 = await UrlService.getUrlByAlias(alias);
    if (!result1) {
      res.status(404).json({ message: "URL not found" });
      return;
    }
    const result = await AnalyticsService.getAnalyticsByUrlId(result1?.id);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

export { getAnalyticsByAlias };
