import { Url, UrlAnalytics } from "@prisma/client";
import { Request, Response } from "express";
import { UAParser } from "ua-parser-js";
import { tokenType } from "../middlewares/validateToken";
import AnalyticsService from "../services/analyticsService";
import UrlService from "../services/urlService";
import { generateRandomString } from "../utils";
const parser = new UAParser();
type formType = Pick<
  Url,
  "longUrl" | "shortKey" | "topic" | "customAlias" | "userId"
>;
const createShortUrl = async (req: Request, res: Response) => {
  try {
    const user = req.body.user as tokenType;
    const data = req.body as formType;
    data.userId = user.userId;
    data.shortKey = generateRandomString(user.userId);
    const result = await UrlService.createShortUrl(data);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

const redirectShortUrl = async (req: Request, res: Response) => {
  try {
    const alias = req.params.alias;
    const result = await UrlService.getUrlByAlias(alias);
    if (!result) {
      res.status(404).json({ message: "URL not found" });
      return;
    }
    const userAgent = req.headers["user-agent"];
    parser.setUA(userAgent!);
    const data = parser.getResult();
    const ip = getClientIp(req) as string;
    const countryJSON = await fetch(
      `https://web-api.nordvpn.com/v1/ips/lookup/${ip}`,
    ).then((res) => res.json());
    const body: Partial<UrlAnalytics> = {
      browserName: data.browser.name || "",
      deviceType: data.device.type || "",
      ip: ip || "",
      country: countryJSON.country,
      os: data.os.name || "",
      userAgent: userAgent || "",
      urlId: result.id,
    };

    await AnalyticsService.createAnalytics(body);
    res.json({ url: result.longUrl });
  } catch (error) {
    console.log(error);
  }
};

const listShortUrl = async (req: Request, res: Response) => {
  try {
    const user = req.body.user as tokenType;
    const result = await UrlService.listShortUrl(user.userId);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

export { createShortUrl, listShortUrl, redirectShortUrl };

const getClientIp = (req: Request) => {
  return (
    req.headers["x-vercel-forwarded-for"] ||
    req.headers["x-forwarded-for"] ||
    req.ip ||
    req.socket.remoteAddress ||
    null
  );
};
