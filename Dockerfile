# ==============================
# 🧱 Base stage (common setup)
# ==============================
FROM node:24.11.0-alpine AS base

# Set working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies (in CI-safe way)
RUN npm ci

# Copy app source
COPY . .

# Non-root user for security
RUN addgroup --system app && adduser --system --ingroup app app
USER app


# ==============================
# 🔧 Development stage (with hot reload)
# ==============================
FROM base AS dev

# Expose app port
EXPOSE 3000

# Command runs your existing hot-reload workflow
CMD ["npm", "run", "dev"]


# ==============================
# 🚀 Build stage (for production)
# ==============================
FROM base AS build
RUN npm run build


# ==============================
# 🏗️ Production stage (minimal runtime)
# ==============================
FROM node:24.11.0-alpine AS prod

WORKDIR /usr/src/app

# Copy only what’s needed from build stage
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

# Install only production deps
RUN npm ci --omit=dev

USER node
EXPOSE 3000

# Start the compiled app
CMD ["node", "dist/index.js"]
