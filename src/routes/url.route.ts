import express from "express";
import {
  createShortUrl,
  listShortUrl,
  redirectShortUrl,
} from "../controllers/url.controller";
import { validate } from "../middlewares/vaildate";
import { validateToken } from "../middlewares/validateToken";
import { formSchema } from "../utils";
import { basicRateLimiter, urlRateLimiter } from "../utils/rateLimit";
const UrlRouter = express.Router();

UrlRouter.post(
  "/",
  urlRateLimiter,
  validateToken,
  validate(formSchema),
  createShortUrl,
);
UrlRouter.get("/list", basicRateLimiter, validateToken, listShortUrl);
UrlRouter.get("/:alias", basicRateLimiter, redirectShortUrl);
export default UrlRouter;
