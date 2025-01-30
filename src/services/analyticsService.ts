import { PrismaClient, UrlAnalytics } from "@prisma/client";
const prisma = new PrismaClient();

class AnalyticsService {
  static async createAnalytics(data: Omit<UrlAnalytics, "createdAt" | "id">) {
    const analytics = await prisma.urlAnalytics.create({
      data: {
        ...data,
      },
    });

    return analytics;
  }

  static async getAnalyticsByUrlId(urlId: string, userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [analytics, uniqueUsers, totalClicks, clicksByDate] =
      await Promise.all([
        // Combined OS and Device Analytics with proper counting
        prisma.urlAnalytics.findMany({
          where: {
            urlId,
            url: {
              userId,
            },
          },
          select: {
            ip: true,
            os: true,
            deviceType: true,
            createdAt: true,
          },
        }),

        // Total Unique Users (distinct IPs)
        prisma.urlAnalytics.findMany({
          where: { urlId, url: { userId } },
          distinct: ["ip"],
          select: {
            ip: true,
          },
        }),

        // Total Clicks
        prisma.urlAnalytics.count({
          where: { urlId, url: { userId } },
        }),

        // Clicks by Date (last 7 days)
        prisma.urlAnalytics.groupBy({
          where: {
            urlId,
            url: { userId },
            createdAt: {
              gte: sevenDaysAgo,
            },
          },
          by: ["createdAt"],
          _count: {
            id: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

    // Process OS analytics
    const osStats = analytics.reduce(
      (
        acc: { [key: string]: { clicks: number; users: Set<string> } },
        curr,
      ) => {
        if (!acc[curr.os]) {
          acc[curr.os] = { clicks: 0, users: new Set() };
        }
        acc[curr.os].clicks++;
        acc[curr.os].users.add(curr.ip);
        return acc;
      },
      {},
    );

    // Process Device Type analytics
    const deviceStats = analytics.reduce(
      (
        acc: { [key: string]: { clicks: number; users: Set<string> } },
        curr,
      ) => {
        if (!acc[curr.deviceType]) {
          acc[curr.deviceType] = { clicks: 0, users: new Set() };
        }
        acc[curr.deviceType].clicks++;
        acc[curr.deviceType].users.add(curr.ip);
        return acc;
      },
      {},
    );

    return {
      totalClicks,
      uniqueUsers: uniqueUsers.length,
      clicksByDate: clicksByDate.map((click) => ({
        date: click.createdAt,
        count: click._count.id,
      })),
      osType: Object.entries(osStats).map(([osName, stats]) => ({
        osName,
        uniqueClicks: stats.clicks,
        uniqueUsers: stats.users.size,
      })),
      deviceType: Object.entries(deviceStats).map(([deviceName, stats]) => ({
        deviceName,
        uniqueClicks: stats.clicks,
        uniqueUsers: stats.users.size,
      })),
    };
  }

  static async getAnalyticsByTopic(topic: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // First, get all URLs under the specified topic
    const topicUrls = await prisma.url.findMany({
      where: { topic },
      select: { id: true, shortKey: true },
    });

    const urlIds = topicUrls.map((url) => url.id);

    const [analytics, uniqueUsers, totalClicks, clicksByDate] =
      await Promise.all([
        // Combined analytics for all URLs under the topic
        prisma.urlAnalytics.findMany({
          where: {
            urlId: { in: urlIds },
          },
          select: {
            ip: true,
            urlId: true,
            createdAt: true,
          },
        }),

        // Total Unique Users across all URLs in the topic
        prisma.urlAnalytics.findMany({
          where: {
            urlId: { in: urlIds },
          },
          distinct: ["ip"],
          select: {
            ip: true,
          },
        }),

        // Total Clicks across all URLs in the topic
        prisma.urlAnalytics.count({
          where: {
            urlId: { in: urlIds },
          },
        }),

        // Clicks by Date for all URLs in the topic (last 7 days)
        prisma.urlAnalytics.groupBy({
          where: {
            urlId: { in: urlIds },
            createdAt: {
              gte: sevenDaysAgo,
            },
          },
          by: ["createdAt"],
          _count: {
            id: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

    // Process individual URL statistics
    const urlStats = topicUrls.map((url) => {
      const urlAnalytics = analytics.filter((a) => a.urlId === url.id);
      const uniqueUrlUsers = new Set(urlAnalytics.map((a) => a.ip));

      return {
        shortKey: url.shortKey,
        totalClicks: urlAnalytics.length,
        uniqueUsers: uniqueUrlUsers.size,
      };
    });

    return {
      totalClicks,
      uniqueUsers: uniqueUsers.length,
      clicksByDate: clicksByDate.map((click) => ({
        date: click.createdAt,
        count: click._count.id,
      })),
      urls: urlStats,
    };
  }

  static async getOverallAnalytics(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [analytics, totalUrls, totalClicks, uniqueUsers, clicksByDate] =
      await Promise.all([
        // Get all analytics data for user's URLs
        prisma.urlAnalytics.findMany({
          where: {
            url: {
              userId,
            },
          },
          select: {
            ip: true,
            os: true,
            deviceType: true,
            createdAt: true,
          },
        }),

        // Total URLs created by user
        prisma.url.count({
          where: { userId },
        }),

        // Total clicks across all URLs
        prisma.urlAnalytics.count({
          where: {
            url: {
              userId,
            },
          },
        }),

        // Total unique users across all URLs
        prisma.urlAnalytics.findMany({
          where: {
            url: {
              userId,
            },
          },
          distinct: ["ip"],
          select: {
            ip: true,
          },
        }),

        // Clicks by date for last 7 days
        prisma.urlAnalytics.groupBy({
          where: {
            url: {
              userId,
            },
            createdAt: {
              gte: sevenDaysAgo,
            },
          },
          by: ["createdAt"],
          _count: {
            id: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

    // Process OS analytics
    const osStats = analytics.reduce(
      (
        acc: {
          [key: string]: {
            clicks: number;
            users: Set<string>;
          };
        },
        curr,
      ) => {
        if (!acc[curr.os]) {
          acc[curr.os] = { clicks: 0, users: new Set() };
        }
        acc[curr.os].clicks++;
        acc[curr.os].users.add(curr.ip);
        return acc;
      },
      {},
    );

    // Process Device Type analytics
    const deviceStats = analytics.reduce(
      (
        acc: {
          [key: string]: {
            clicks: number;
            users: Set<string>;
          };
        },
        curr,
      ) => {
        if (!acc[curr.deviceType]) {
          acc[curr.deviceType] = { clicks: 0, users: new Set() };
        }
        acc[curr.deviceType].clicks++;
        acc[curr.deviceType].users.add(curr.ip);
        return acc;
      },
      {},
    );

    return {
      totalUrls,
      totalClicks,
      uniqueUsers: uniqueUsers.length,
      clicksByDate: clicksByDate.map((click) => ({
        date: click.createdAt,
        count: click._count.id,
      })),
      osType: Object.entries(osStats).map(([osName, stats]) => ({
        osName,
        uniqueClicks: stats.clicks,
        uniqueUsers: stats.users.size,
      })),
      deviceType: Object.entries(deviceStats).map(([deviceName, stats]) => ({
        deviceName,
        uniqueClicks: stats.clicks,
        uniqueUsers: stats.users.size,
      })),
    };
  }
}

export default AnalyticsService;
