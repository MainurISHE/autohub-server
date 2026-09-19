# AutoHub Server 🚗

Backend API for **AutoHub**, a full-stack car marketplace where users can publish, search, filter, favorite and manage cars, as well as communicate with other users in real time.

## 🌐 Production

- **Backend:** https://autohub-server-2inc.onrender.com
- **Frontend:** https://autohubdma.vercel.app

## ✨ Features

### Authentication & Users

- User registration and login
- JWT access and refresh tokens
- HTTP-only refresh token cookies
- Automatic access token refresh
- Logout
- User profiles and profile editing
- Avatar upload
- Password change
- Role-based access control

### Cars

- Create, edit and delete car listings
- View car details
- Get user's cars
- Car ownership validation
- Multiple car images
- Cloudinary image storage
- Brand management

### Search & Filters

- Search by car title
- Search by brand name
- Multi-word search
- Brand filtering
- Price range filtering
- Fuel type
- Transmission
- Drive type
- Body type
- Color
- Status
- Sorting
- Pagination

### Favorites

- Add cars to favorites
- Remove cars from favorites
- Retrieve user's favorite cars

### Realtime Chat

- Conversations between users
- Realtime messages with Socket.IO
- JWT authentication for WebSocket connections
- Conversation rooms
- Message history
- Read status

## 🛠 Tech Stack

- **NestJS**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Neon**
- **JWT**
- **Passport**
- **Socket.IO**
- **Cloudinary**
- **bcrypt**
- **class-validator**
- **class-transformer**

## 🏗 Architecture

```text
src/
├── auth/
├── cars/
├── brands/
├── users/
├── favorites/
├── messages/
├── conversations/
├── cloudinary/
├── prisma/
├── common/
└── app.module.ts
```

Main layers:

- Controllers — HTTP endpoints
- Services — business logic
- DTOs — request validation
- Guards — authentication and authorization
- Strategies — JWT authentication
- Prisma — database access
- Gateway — realtime communication

## 🔐 Authentication

### Access Token

Used for authenticated API requests:

```http
Authorization: Bearer <access_token>
```

### Refresh Token

Stored in an HTTP-only cookie and used to obtain a new access token when the access token expires.

Refresh tokens are hashed before being stored in the database.

## 🔌 REST API

The API is available under `/api`.

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/auth/profile
PATCH /api/auth/profile
PATCH /api/auth/change-password
PATCH /api/auth/avatar
DELETE /api/auth/avatar
```

### Cars

```http
GET /api/cars
GET /api/cars/:id
GET /api/cars/my
POST /api/cars
PATCH /api/cars/:id
DELETE /api/cars/:id
```

### Brands

```http
GET /api/brands
GET /api/brands/:id
POST /api/brands
PATCH /api/brands/:id
DELETE /api/brands/:id
```

Additional endpoints are available for favorites, conversations, messages and image management.

## 💬 Realtime Communication

The client authenticates the Socket.IO connection using the JWT access token:

```ts
socket.auth = {
  token: accessToken,
};
```

Messages are sent through:

```ts
socket.emit("sendMessage", {
  conversationId,
  content,
});
```

The server validates the user and broadcasts messages to the corresponding conversation room.

## 🗄 Database

The project uses **PostgreSQL** with **Prisma ORM**.

Main entities:

```text
User
Car
Brand
CarImage
Favorite
Conversation
Message
```

Relationships include users owning cars and favorites, cars belonging to brands and owners, car images, and conversations containing messages.

## ☁️ Image Storage

Car and user images are stored using **Cloudinary**.

The backend handles:

- Image upload
- File type validation
- File size validation
- Cloudinary storage
- Image deletion
- Car image relations
- Avatar management

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

FRONTEND_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

PORT=5000
NODE_ENV=development
```

Do not commit real secrets to Git.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MainurISHE/autohub-server.git
cd autohub-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env` and add the required variables.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Apply database migrations

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:5000/api
```

## 🧰 Prisma Commands

```bash
npx prisma generate
npx prisma migrate dev --name <migration-name>
npx prisma studio
```

## 📦 Build

```bash
npm run build
npm run start:prod
```

## 🚀 Deployment

The backend is deployed on **Render**.

The database is hosted on **Neon PostgreSQL**.

Images are stored in **Cloudinary**.

```text
Client
   │
   ▼
Vercel
   │
   │ REST API / WebSocket
   ▼
Render
   │
   ├── NestJS
   ├── Prisma
   └── Socket.IO
        │
        ▼
   Neon PostgreSQL

Images
   │
   ▼
Cloudinary
```

## 🔒 Security

- JWT authentication
- HTTP-only refresh cookies
- Password hashing with bcrypt
- DTO validation
- Role-based authorization
- Ownership checks
- File validation
- Protected WebSocket connections
- CORS configuration

## 📄 License

This project was created as a portfolio and educational project.
