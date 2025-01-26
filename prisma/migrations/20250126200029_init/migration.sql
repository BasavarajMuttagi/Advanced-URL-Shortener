-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "googleId" TEXT,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "shortKey" TEXT NOT NULL,
    "customAlias" TEXT,
    "topic" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UrlAnalytics" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL DEFAULT 'unknown',
    "userAgent" TEXT NOT NULL DEFAULT 'unknown',
    "country" TEXT NOT NULL DEFAULT 'unknown',
    "os" TEXT NOT NULL DEFAULT 'unknown',
    "deviceType" TEXT NOT NULL DEFAULT 'unknown',
    "browserName" TEXT NOT NULL DEFAULT 'unknown',
    "urlId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UrlAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortKey_key" ON "Url"("shortKey");

-- CreateIndex
CREATE UNIQUE INDEX "Url_customAlias_key" ON "Url"("customAlias");

-- CreateIndex
CREATE INDEX "Url_shortKey_idx" ON "Url"("shortKey");

-- CreateIndex
CREATE INDEX "Url_customAlias_idx" ON "Url"("customAlias");

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlAnalytics" ADD CONSTRAINT "UrlAnalytics_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
