# GlobeTales

Every place has a story.

A travel blog platform where users can share their travel experiences and stories.

## Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Copy the application properties template:

   ```bash
   cp src/main/resources/application.properties.template src/main/resources/application.properties
   ```

3. Update the `application.properties` file with your configuration:

   - Set your database credentials
   - Generate a secure JWT secret key
   - Adjust other settings as needed

4. Build and run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

## Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Development

- Backend runs on: http://localhost:8080
- Frontend runs on: http://localhost:4200
