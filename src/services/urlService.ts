import { Url } from "@prisma/client";
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
  static async getUrlByAlias(alias: string) {
    const result = await prisma.url.findFirst({
      where: {
        OR: [{ shortKey: alias }, { customAlias: alias }],
      },
    });

    return result;
  }
}
export default UrlService;
