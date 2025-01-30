import { config } from "dotenv";
import { Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { sign } from "jsonwebtoken";
import { client } from "../..";
import prisma from "../../prisma/db";
config();
const initGoogle = async (req: Request, res: Response) => {
  try {
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });

    res.json({ url });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error Occurred, Please Try Again!" });
  }
};

const callbackGoogle = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code) {
      res.status(400).send({ message: "Code is required" });
      return;
    }

    const { tokens } = await client.getToken(code as string);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.CLIENT_ID,
    });

    const data = ticket.getPayload() as TokenPayload;
    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.email!,
          name: data.name,
          googleId: data.sub,
          profileImage: data.picture,
        },
      });
    }

    const token = sign(
      {
        userId: user.id,
        email: user.email,
        displayName: user.name,
      },
      process.env.SECRET_SALT!,
      { expiresIn: "1h" },
    );
    res.redirect(`${process.env.FE_BASE_URL}/callback?token=${token}`);
    return;
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      message: "Authentication failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { callbackGoogle, initGoogle };
