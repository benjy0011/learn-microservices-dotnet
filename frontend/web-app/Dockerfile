# -----------------------------------------------------------------------------
# STAGE 1: Install Dependencies
# -----------------------------------------------------------------------------
# Use Node.js 22 on Alpine Linux as a lightweight base image for dependencies
FROM node:22-alpine AS deps

# Install libc6-compat, which is required for certain native Node modules on Alpine Linux
RUN apk add --no-cache libc6-compat

# Set the working directory inside the container
WORKDIR /app

# Copy lock files first to leverage Docker's layer caching mechanism
COPY frontend/web-app/package*.json ./

# Install production-only dependencies (ignores devDependencies like TypeScript, ESLint, etc.)
RUN npm install --omit-dev

# -----------------------------------------------------------------------------
# STAGE 2: Build the Application
# -----------------------------------------------------------------------------
# Start a fresh build stage to keep the environment isolated
FROM node:22-alpine AS builder

# Set the working directory for the build process
WORKDIR /app

# Copy installed dependencies from the 'deps' stage to save re-installing
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the Next.js source code into the container
COPY frontend/web-app ./

# Disable Next.js anonymous telemetry data collection during the build
ENV NEXT_TELEMETRY_DISABLED 1

# Execute the Next.js build command to compile the application
RUN npm run build

# -----------------------------------------------------------------------------
# STAGE 3: Production Runner Image
# -----------------------------------------------------------------------------
# Create the final lean production image
FROM node:22-alpine AS runner

# Set working directory for the runtime container
WORKDIR /app

# Set environment variable to indicate a production runtime environment
ENV NODE_ENV production

# Disable Next.js anonymous telemetry in runtime as well
ENV NEXT_TELEMETRY_DISABLED 1

# Create a system user group with GID 1001 named 'nodejs' for security
RUN addgroup --system --gid 1001 nodejs

# Create a non-root system user with UID 1001 named 'nextjs' assigned to group 'nodejs'
RUN adduser --system --uid 1001 nextjs

# Copy static assets from the build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Copy standalone build output and static files, setting ownership to the non-root user
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user to adhere to security best practices
USER nextjs

# Expose port 3000 (documentation metadata for the container runtime)
EXPOSE 3000

# Set the port environment variable used by Next.js server
ENV PORT 3000

# Start the standalone Node server
CMD ["node", "server.js"]