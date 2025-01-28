import express from "express";
import {
  createShortUrl,
  listShortUrl,
  redirectShortUrl,
} from "../controllers/url.controller";
import { validate } from "../middlewares/vaildate";
import { validateToken } from "../middlewares/validateToken";
import { formSchema } from "../utils";
const UrlRouter = express.Router();

UrlRouter.post("/", validateToken, validate(formSchema), createShortUrl);
UrlRouter.get("/list", validateToken, listShortUrl);
UrlRouter.get("/:alias", redirectShortUrl);
export default UrlRouter;
