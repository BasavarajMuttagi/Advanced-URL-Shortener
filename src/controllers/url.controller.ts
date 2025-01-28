import { Url } from "@prisma/client";
import { Request, Response } from "express";
import { tokenType } from "../middlewares/validateToken";
import UrlService from "../services/urlService";
import { generateRandomString } from "../utils";
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
