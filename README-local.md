# Local Server Setup

This project is configured to run on localhost:5000.

## Quick Start

### Method 1: Using the batch file (Windows)
```
double-click start-local.bat
```

### Method 2: Using npm scripts
```
npm install
npm run dev
```

### Method 3: Direct node command
```
set PORT=5000
node server.js
```

## Configuration

- Port: 5000 (can be changed in `.env` file)
- Environment: development (set in `.env` file)
- Database: PostgreSQL connection (configured in `.env` file)

## Environment Variables

The application uses the following environment variables (defined in `.env`):

- `PORT`: Server port (currently set to 5000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token generation
- Various email configuration variables

## Troubleshooting

1. If the server doesn't start on port 5000:
   - Check that the port is not already in use by another application
   - Verify the PORT variable in `.env` file is set to 5000

2. If you get database connection errors:
   - Make sure your PostgreSQL server is running
   - Verify the DATABASE_URL in your `.env` file is correct