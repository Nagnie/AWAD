# React Email Client with Gmail Integration

## Deployed public URLs
Frontend: https://awad-navy.vercel.app/
Backend: 

## Setup & Run Locally

### 1. Clone the repository
```
git clone https://github.com/Nagnie/AWAD.git
cd AWAD
```

### 2. Frontend setup
```
cd ./frontend
npm install
npm run dev
```

### 3. Backend setup
1. Start PostgreSQL
You can connect your own DB or run using Docker:
```
docker run --name my-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -d postgres:15

```
2. Install backend dependencies & start server
```
cd ./backend
npm install
npm run dev:start
```
⚠️ Note: Ensure your .env file is properly configured with:
- Database connection string
- Google OAuth credentials
- Redirect URIs
- JWT secrets

## How to create Google OAuth credentials and set allowed redirect URIs

## Explanation of token storage choices & security considerations

## How to simulate token expiry 
