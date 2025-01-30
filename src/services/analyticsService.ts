import { PrismaClient, UrlAnalytics } from "@prisma/client";
const prisma = new PrismaClient();

class AnalyticsService {
  static async createAnalytics(data: Partial<UrlAnalytics>) {
    const analytics = await prisma.urlAnalytics.create({
      data: {
        urlId: data.urlId!,
        ...data,
      },
    });

    return analytics;
  }

  static async getAnalyticsByUrlId(urlId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [analytics, uniqueUsers, totalClicks, clicksByDate] =
      await Promise.all([
        // Combined OS and Device Analytics with proper counting
        prisma.urlAnalytics.findMany({
          where: { urlId },
          select: {
            ip: true,
            os: true,
            deviceType: true,
            createdAt: true,
          },
        }),

        // Total Unique Users (distinct IPs)
        prisma.urlAnalytics.findMany({
          where: { urlId },
          distinct: ["ip"],
          select: {
            ip: true,
          },
        }),

        // Total Clicks
        prisma.urlAnalytics.count({
          where: { urlId },
        }),

        // Clicks by Date (last 7 days)
        prisma.urlAnalytics.groupBy({
          where: {
            urlId,
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
    const topicAnalytics = await prisma.url.findMany({
      where: {
        topic: topic,
      },
      include: {
        UrlAnalytics: {
          select: {
            country: true,
            os: true,
            deviceType: true,
            browserName: true,
            createdAt: true,
          },
        },
      },
    });

    return topicAnalytics;
  }

  static async getOverAllAnalytics() {
    const analytics = await prisma.urlAnalytics.groupBy({
      by: ["country", "os", "deviceType", "browserName"],
      _count: {
        id: true,
      },
    });

    return analytics;
  }
}

export default AnalyticsService;
