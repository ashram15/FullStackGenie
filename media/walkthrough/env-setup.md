# Configure Environment Variables

Your project needs some environment variables to run properly.

## What to do:

1. Open the `.env` file in both `frontend/` and `backend/` folders
2. Copy the values from `.env.example` files
3. Fill in any required API keys or secrets

### Important Variables:

**Backend (.env):**
- `PORT`: The port your backend runs on (default: 8000)
- `DATABASE_URL`: Your database connection string (if using a database)
- `AUTH0_DOMAIN`: Your Auth0 domain (if using authentication)

**Frontend (.env):**
- `VITE_API_URL`: Your backend API URL (default: http://localhost:8000)
- `VITE_AUTH0_CLIENT_ID`: Your Auth0 client ID (if using authentication)

💡 **Tip:** Use the `.env.example` files as templates!
