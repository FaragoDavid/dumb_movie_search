# Dumb Movie Search

## Local setup
Make sure to use the Node version in `.nvmrc` (e.g. with `nvm use`)

### Server
- `cd server`
- Copy env vars: `cp .env.example .env`
- Start cache: `docker-compose up -d`
- Install dependencies: `npm i`
- Start server: `npm run build && npm run start`

### Client
- `cd client`
- Install dependencies: `npm i`
- Start client: `npm run dev`