# From node:18

# WORKDIR /app/frontend

# COPY package*.json ./
# RUN npm ci

# COPY . .

# RUN npm run build

# EXPOSE 3000

# CMD ["npm", "start"]


# frontend/Dockerfile
FROM node:18

WORKDIR /app/frontend

# Copy package files first
COPY package*.json ./

# Add missing babel dependency and firebase
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object
RUN npm install firebase

# Clean install other dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY . .

# Build the React app with Firebase config
ARG REACT_APP_FIREBASE_API_KEY
ARG REACT_APP_FIREBASE_AUTH_DOMAIN
ARG REACT_APP_FIREBASE_PROJECT_ID
ARG REACT_APP_FIREBASE_STORAGE_BUCKET
ARG REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ARG REACT_APP_FIREBASE_APP_ID

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]