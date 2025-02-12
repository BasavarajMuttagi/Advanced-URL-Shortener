import { Prisma, Url } from "@prisma/client";
import prisma from "../../prisma/db";

class UrlService {
  static async createShortUrl(
    data: Pick<
      Url,
      "longUrl" | "shortKey" | "topic" | "customAlias" | "userId"
    >,
  ): Promise<Url> {
    const result = await prisma.url.create({
      data: {
        longUrl: data.longUrl,
        shortKey: data.shortKey,
        customAlias: data.customAlias,
        topic: data.topic,
        userId: data.userId,
      },
    });

    return result;
  }
  static async listShortUrl(userId: string) {
    const result = await prisma.url.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return result;
  }

  static async getUrlByAlias(alias: string, userId?: string) {
    const whereClause: Prisma.UrlWhereInput = {
      OR: [{ shortKey: alias }, { customAlias: alias }],
    };
    if (userId) {
      whereClause.userId = userId;
    }
    const result = await prisma.url.findFirst({
      where: whereClause,
    });

    return result;
  }
  static async isAliasExist(alias: string): Promise<boolean> {
    const url = await prisma.url.findUnique({
      where: {
        customAlias: alias,
      },
    });
    return !!url;
  }
  static async isUrlExist(url: string, userId: string) {
    const result = await prisma.url.findFirst({
      where: {
        longUrl: url,
        userId: userId,
      },
    });
    return !!result;
  }
}
export default UrlService;
