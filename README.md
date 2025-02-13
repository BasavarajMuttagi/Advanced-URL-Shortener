# Advanced URL Shortener

This project implements a robust URL shortening service with advanced analytics capabilities. It leverages Prisma for database interactions, Redis for caching, and integrates with external services for IP geolocation.

## Getting Started

### Prerequisites

- Node.js (v22.x or higher)
- npm or yarn
- A PostgreSQL database (configured with `DATABASE_URL` in `.env`)
- A Redis instance (configured with `REDIS_CACHE_URL` in `.env`)
- A Google Cloud Platform project with OAuth 2.0 credentials (configured with `CLIENT_ID`, `CLIENT_SECRET` in `.env`)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure environment variables:
    Create a `.env` file in the project root and populate it with the necessary environment variables, including database connection string, Redis connection string, API keys, and OAuth credentials. Example:

    ```
    DATABASE_URL="your_database_url"
    REDIS_CACHE_URL="your_redis_url"
    PULSE_API_KEY="your_pulse_api_key"
    CLIENT_ID="your_client_id"
    CLIENT_SECRET="your_client_secret"
    SECRET_SALT="your_secret_salt"
    PORT=3000
    FE_BASE_URL="http://localhost:5173"
    BE_BASE_URL="http://localhost:3000"
    NORD="https://web-api.nordvpn.com/v1/ips/lookup"
    ```

### Running the Application

1.  Run the development server:

    ```bash
    npm run dev
    ```

2.  Run the production server:
    ```bash
    npm run start
    ```

## API Endpoints

The application exposes the following API endpoints:

- **`/api/shorten` (POST):** Creates a shortened URL. Requires authentication and a valid `longUrl`.
- **`/api/shorten/list` (GET):** Retrieves a list of shortened URLs for the authenticated user. Requires authentication.
- **`/api/shorten/:alias` (GET):** Redirects to the long URL associated with the given alias. This endpoint is also cached in Redis for performance.
- **`/api/analytics/overall` (GET):** Retrieves overall analytics data for the authenticated user. Requires authentication.
- **`/api/analytics/:alias` (GET):** Retrieves analytics data for a specific shortened URL. Requires authentication.
- **`/api/analytics/topic/:topic` (GET):** Retrieves analytics data for URLs with a specific topic. Requires authentication.
- **`/api/auth/google` (GET):** Initializes the Google OAuth2 flow.
- **`/api/auth/google/callback` (GET):** Handles the Google OAuth2 callback and redirects to the frontend.

## Authentication

The application uses JSON Web Tokens (JWT) for authentication. The `validateToken` middleware verifies the JWTs and extracts user information.

## Analytics

The `analyticsService` provides methods for retrieving various analytics data, including:

- Clicks by date
- Unique users
- Device type statistics
- OS statistics
- Country statistics

## Error Handling

The application includes robust error handling, returning appropriate HTTP status codes (e.g., 404 for not found, 400 for bad request, 500 for internal server error) with informative error messages.

## Contributing

Contributions are welcome! Please follow the standard contribution guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
