FROM node:20-alpine as builder
WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Install only production dependencies
RUN npm ci --only=production

FROM node:20-alpine as runner
WORKDIR /app

# Copy production node_modules and built assets
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]