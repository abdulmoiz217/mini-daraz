# E-commerce Application

Full-stack e-commerce web application like a mini Daraz with authentication, product management, and order processing.

## Deployment

This application is configured for deployment on Vercel.

### Environment Variables

⚠️ **IMPORTANT**: The `.env` file contains placeholder values only. **DO NOT** deploy actual credentials with your code!
For Vercel deployment, configure these environment variables in your Vercel project settings (in the dashboard):

- `DATABASE_URL`: PostgreSQL connection string (Note: If using NeonDB on Vercel, remove "&channel_binding=require" from connection string as some Node.js versions on Vercel don't support it)
- `JWT_SECRET`: **REQUIRED** - Secret for JWT token generation (using "moiz_super_secret_key_123_@#$" for local development)
- `NODE_ENV`: Set to "production" for production deployment
- `USE_NEON_REST_API`: Set to "false" to use direct DB connection or "true" for REST API
- `EMAIL_USER`: **OPTIONAL** - Email address for sending emails (if using email features)
- `EMAIL_PASS`: **OPTIONAL** - App password for email account (if using email features)
- `SMTP_HOST`: **OPTIONAL** - SMTP server host (if using email features)
- `SMTP_PORT`: **OPTIONAL** - SMTP server port (if using email features)

### Security Notes

- The `.env` file in this repository contains only placeholder values
- Actual credentials should be configured in Vercel's environment variables settings
- The `.env` file is included in `.gitignore` to prevent accidental commits of sensitive data

### Deployment Steps

1. Fork or clone this repository
2. Import the project into Vercel
3. Add the required environment variables in Vercel dashboard
4. Deploy!

## Local Development

For local development:

```bash
npm install
npm run dev
```

## Tech Stack

- Node.js
- Express.js
- PostgreSQL (with Sequelize ORM)
- JWT for authentication
- Bcrypt for password hashing
- Cors for cross-origin requests
- Nodemailer for email functionality

## Features

- User authentication (register/login)
- Product management
- Order processing
- JWT-based secure authentication
- Database integration with PostgreSQL
- Email notifications