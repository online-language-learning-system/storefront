FROM node:20-alpine

WORKDIR /app

# Copy package.json + package-lock.json để cài dependencies trước
COPY package*.json ./

RUN npm cache clean --force
RUN npm install
RUN npm install axios

# Copy toàn bộ source code
COPY . .

# Expose cổng dev server
EXPOSE 3000

# Chạy vite dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
