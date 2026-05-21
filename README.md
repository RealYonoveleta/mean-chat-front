# Mean Chat Frontend

Frontend client for the Mean Chat application.

Stack:

- Angular 21
- Ionic UI components
- Socket.IO client
- Reactive forms

## Features

- Login and signup flows
- Chat list with realtime updates
- Chat view with paginated history
- Realtime message streaming
- Emoji picker
- Location message support (Geo API)
- System-aware light/dark theme behavior

## Scripts

```bash
npm run start
npm run build
npm run test
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run start
```

3. Open:

- http://localhost:4200

## Environment Configuration

Local dev uses src/environments/environment.development.ts.

Production build uses src/environments/environment.ts.

Current expected values:

- apiUrl: backend base URL
- wsUrl: backend Socket.IO URL
- geoapifyKey: location API key
- emojiApiKey: emoji API key

## Docker Behavior

Frontend Docker build injects API keys into environment.ts at build time using build args:

- GEOAPIFY_API_KEY
- EMOJI_API_KEY

In docker-compose.yml these values come from root .env.

## Routing Overview

- /auth/login
- /auth/signup
- /home/create-chat
- /home/:chatId

## Project Structure

- src/app/auth: auth pages
- src/app/chat: chat views, list, input, services
- src/app/message: message rendering and handlers
- src/app/core: auth/socket/guards/interceptors/shared core services
- src/app/shared: reusable UI components and utilities
- src/environments: runtime config files
- src/theme: Ionic and app theme variables

## Build Notes

- Angular build currently reports bundle budget warnings in production mode.
- This does not block app startup, but should be optimized over time.

