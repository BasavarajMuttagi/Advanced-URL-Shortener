-- CreateIndex
CREATE INDEX "Url_userId_idx" ON "Url"("userId");

-- CreateIndex
CREATE INDEX "Url_createdAt_idx" ON "Url"("createdAt");

-- CreateIndex
CREATE INDEX "Url_userId_createdAt_idx" ON "Url"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UrlAnalytics_ip_idx" ON "UrlAnalytics"("ip");

-- CreateIndex
CREATE INDEX "UrlAnalytics_country_idx" ON "UrlAnalytics"("country");

-- CreateIndex
CREATE INDEX "UrlAnalytics_createdAt_idx" ON "UrlAnalytics"("createdAt");

-- CreateIndex
CREATE INDEX "UrlAnalytics_deviceType_idx" ON "UrlAnalytics"("deviceType");

-- CreateIndex
CREATE INDEX "UrlAnalytics_country_deviceType_idx" ON "UrlAnalytics"("country", "deviceType");

-- CreateIndex
CREATE INDEX "UrlAnalytics_ip_createdAt_idx" ON "UrlAnalytics"("ip", "createdAt");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_googleId_idx" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_createdAt_email_idx" ON "User"("createdAt", "email");
