# ---- Stage 1: Base Node image ----
FROM node:18

# ---- Stage 2: Set working directory ----
WORKDIR /app

# ---- Stage 3: Copy package files and install dependencies ----
COPY package*.json ./
RUN npm install --legacy-peer-deps

# ---- Stage 4: Copy all project files ----
COPY . .

# ---- Stage 5: Expose backend port ----
EXPOSE 3000

# ---- Stage 6: Start the app ----
CMD ["npm", "start"]
