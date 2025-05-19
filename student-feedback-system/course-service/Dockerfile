# Use the official Node.js 18 image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables for build
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# Create app directory if it doesn't exist
RUN mkdir -p /app/app

# Create root layout if it doesn't exist
RUN if [ ! -f "/app/app/layout.tsx" ]; then \
    echo 'export default function RootLayout({ children }: { children: React.ReactNode }) {\n      return (\n        <html lang="en">\n          <body>{children}</body>\n        </html>\n      )\n    }' > /app/app/layout.tsx; \
    fi

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Expose the port the app runs on
EXPOSE 3002

# Start the application
CMD ["npm", "start"]
