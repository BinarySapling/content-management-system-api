# Content Management System API

A robust Node.js-based RESTful API for managing digital content artifacts with real-time chat functionality, role-based access control, and automated content lifecycle management.

## 🚀 Features

### Core Functionality
- **Artifact Management**: Create, read, and manage digital content artifacts (DRAFT, PUBLISHED, ARCHIVED statuses)
- **User Authentication**: Secure OTP-based signup and JWT authentication with cookie-based sessions
- **Role-Based Access Control**: Three-tier authorization system (ADMIN, EDITOR, VIEWER)
- **Real-time Chat**: WebSocket-powered messaging using Socket.IO
- **Media Upload**: Cloudinary integration for file uploads
- **Social Features**: Like and comment functionality for artifacts
- **Automated Archiving**: Cron job to archive draft artifacts inactive for 30+ days

### Security & Performance
- Rate limiting on API endpoints
- Password hashing with bcrypt
- HTTP-only cookies for JWT tokens
- CORS-enabled for cross-origin requests
- Request logging with Morgan
- Input validation and error handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account (for media uploads)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Parvaggarwal01/content-management-system-api.git
   cd content-management-system-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000` (or your configured PORT)

## 📚 API Documentation

### Authentication Routes (`/auth`)

#### Initiate Signup
```http
POST /auth/signup/initiate
Content-Type: application/json

{
  "email": "user@example.com"
}
```
**Response**: Generates and sends OTP to the provided email

#### Verify Signup OTP
```http
POST /auth/signup/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "name": "John Doe",
  "password": "securepassword",
  "role": "VIEWER"
}
```
**Response**: Creates user account and returns user details

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```
**Response**: Returns JWT token in HTTP-only cookie and user details

### Artifact Routes (`/artifacts`)

#### Create Artifact
```http
POST /artifacts
Authorization: Required (ADMIN or EDITOR role)
Content-Type: multipart/form-data

{
  "title": "Article Title",
  "content": "Article content...",
  "status": "DRAFT",
  "file": [media file]
}
```

#### Get All Artifacts
```http
GET /artifacts
Authorization: Required
```
**Note**: Rate limited endpoint

#### Toggle Like on Artifact
```http
POST /artifacts/:id/like
Authorization: Required
```

#### Get Artifact Likes
```http
GET /artifacts/:id/likes
```

#### Add Comment to Artifact
```http
POST /artifacts/:id/comments
Authorization: Required
Content-Type: application/json

{
  "text": "Comment text..."
}
```

#### Get Artifact Comments
```http
GET /artifacts/:id/comments
```

### Chat Routes (`/chat`)

Real-time chat functionality via Socket.IO WebSocket connection.

### Webhook Routes (`/webhook`)

Custom webhook endpoints for external integrations.

## 👥 User Roles

| Role       | Permissions                                  |
| ---------- | -------------------------------------------- |
| **ADMIN**  | Full access - Create, edit, delete artifacts |
| **EDITOR** | Create and edit artifacts                    |
| **VIEWER** | Read-only access to published content        |

## 🗄️ Database Models

### User Schema
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (hashed, min 8 characters)
- `role`: Enum (ADMIN, EDITOR, VIEWER)
- `timestamps`: createdAt, updatedAt

### Artifact Schema
- `title`: String (required)
- `content`: String (required)
- `status`: Enum (DRAFT, PUBLISHED, ARCHIVED)
- `media`: String (Cloudinary URL)
- `author`: ObjectId ref User
- `timestamps`: createdAt, updatedAt

### Like Schema
- `user`: ObjectId ref User
- `artifact`: ObjectId ref Artifact
- `timestamps`: createdAt, updatedAt

### Comment Schema
- `text`: String (required)
- `user`: ObjectId ref User
- `artifact`: ObjectId ref Artifact
- `timestamps`: createdAt, updatedAt

## ⏰ Automated Tasks

### Archive Old Drafts Cron Job
**Schedule**: Every 12 hours (`0 */12 * * *`)

**Function**: Automatically archives draft artifacts that haven't been updated in 30+ days

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **Password Hashing**: Bcrypt with 10 salt rounds
- **Rate Limiting**: Prevents API abuse
- **Role-based Authorization**: Granular access control
- **CORS Protection**: Configured cross-origin resource sharing

## 🌐 WebSocket Events (Socket.IO)

Real-time bidirectional communication for chat functionality. Custom socket handlers are registered in `/sockets/socket.js`.

## 📁 Project Structure

```
content-management-system-api/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── cloudinary.js         # Cloudinary configuration
├── controllers/
│   ├── auth.controller.js
│   ├── artifact.controller.js
│   ├── chat.controller.js
│   ├── comment.controller.js
│   └── likes.controller.js
├── cron/
│   └── archiveArtifacts.js   # Automated archiving
├── middleware/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── uploads.middleware.js
│   └── ratelimiter.middleware.js
├── models/
│   ├── users.js
│   ├── artifact.js
│   ├── chat.js
│   ├── comment.js
│   ├── like.js
│   ├── otp.js
│   └── thread.js
├── routes/
│   ├── auth.route.js
│   ├── artifacts.route.js
│   └── chat.route.js
├── services/
│   ├── auth.service.js
│   ├── artifact.service.js
│   ├── chat.service.js
│   ├── comment.service.js
│   └── like.service.js
├── sockets/
│   └── socket.js             # WebSocket handlers
├── utils/
│   └── generateOtp.js
├── webhook/
│   └── webhook.js
├── uploads/                  # Local file storage
├── app.js                    # Express app configuration
├── server.js                 # Server entry point
└── package.json
```

## 🚀 Deployment

### Environment Variables Required
Ensure all environment variables are properly configured in your deployment platform:
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Recommended Platforms
- **Heroku**: Add MongoDB Atlas and Cloudinary add-ons
- **Render**: Configure environment groups
- **Railway**: Auto-deployment from GitHub
- **AWS EC2**: Full control deployment
- **DigitalOcean**: App Platform or Droplets

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

```json
{
  "start": "node server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## 🛡️ Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Real-time**: Socket.IO
- **File Upload**: Multer + Cloudinary
- **Security**: express-rate-limit, cookie-parser, CORS
- **Logging**: Morgan
- **Task Scheduling**: node-cron
- **Environment**: dotenv

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Parv Aggarwal**
- GitHub: [@Parvaggarwal01](https://github.com/Parvaggarwal01)

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/Parvaggarwal01/content-management-system-api/issues) page to report bugs or request features.

## 📞 Support

For support, email your queries or open an issue in the repository.

---

**Built with ❤️ using Node.js and Express**
