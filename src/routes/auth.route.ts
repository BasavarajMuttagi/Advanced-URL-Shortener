import express from "express";
import { callbackGoogle, initGoogle } from "../controllers/auth.controller";
const AuthRouter = express.Router();

AuthRouter.get("/google", initGoogle);
AuthRouter.get("/google/callback", callbackGoogle);
export default AuthRouter;
