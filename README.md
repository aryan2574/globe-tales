<!-- Improved README.md for Globe Tales -->
<div align="center">
  <h1 align="center">Globe Tales</h1>
  <p align="center">
    Every place has a story.<br />
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

GlobeTales is a travel platform that allows users to discover new places, plan their trips, and share their travel experiences with a community of fellow adventurers. The application provides recommendations, route planning, and a gamified system of achievements to make travel more engaging.

### Built With

- **Backend:** Java, Spring Boot, Spring Security & JWT, Spring Data JPA / Hibernate, PostgreSQL, Flyway, Maven, OpenAI API, OpenRouteService
- **Frontend:** Angular, TypeScript, SCSS, Leaflet.js
- **Deployment:** Docker & Docker Compose, Nginx

## Features

- User Authentication (JWT)
- Interactive Map (Leaflet)
- Place Reviews & Ratings
- Trip Planning & Route Calculation
- Personalized Recommendations
- AI-Powered Chatbot
- User Stories & Achievements (Gamification)
- Favorites & Visited Lists
- Weather Forecast Widget

## Getting Started

### Prerequisites

- Docker & Docker Compose (recommended)
- Java 17+ & Maven (for manual backend setup)
- Node.js & npm (for manual frontend setup)
- PostgreSQL (if running DB manually)

### Installation

#### 1. Using Docker (Recommended)

```bash
git clone https://github.com/aryan2574/GlobeTales.git
cd GlobeTales
cp backend/src/main/resources/application.properties.template backend/src/main/resources/application.properties
# Edit backend/src/main/resources/application.properties with your DB credentials, OpenAI, OpenRouteService keys, and JWT secret
# (see comments in the file for details)
docker-compose up --build
```

- The backend, frontend, and PostgreSQL database will all run in containers.
- Flyway will automatically run DB migrations.

#### 2. Manual Setup

##### Backend

```bash
cd backend
cp src/main/resources/application.properties.template src/main/resources/application.properties
# Edit application.properties as above
./mvnw clean install
./mvnw spring-boot:run
```

- Make sure PostgreSQL is running and accessible with the credentials you set.
- Flyway will run DB migrations on startup.

##### Frontend

```bash
cd frontend
npm install
npm start
```

- The app will be available at http://localhost:4200

##### Database Setup (Manual)

- Ensure PostgreSQL is running (default port 5432).
- Create a database (e.g., `globetales`).
- Set DB credentials in `application.properties`.
- Flyway will handle schema migrations automatically.

## Usage

- **Backend API:** http://localhost:8080
- **Frontend:** http://localhost:4200
- Use Postman or similar tools to test API endpoints, or use the web UI.

## Project Structure

```
GlobeTales/
  backend/           # Spring Boot backend (Java)
    src/main/java/com/globetales/
      common/        # Centralized Constants.java for all backend constants
      controller/    # REST API controllers (use DTOs, response wrappers)
      service/       # Business logic
      entity/        # JPA entities
      dto/           # Data Transfer Objects
      ...
    src/main/resources/
      application.properties.template
      db/migration/  # Flyway SQL migrations
    ...
  frontend/          # Angular frontend
    src/app/
      shared/constants/  # All frontend constants (UI, config, etc.)
      components/    # Angular components (each with .ts, .html, .scss)
      features/      # Feature modules
      services/      # API and business logic
      ...
    ...
  docker-compose.yml # Multi-service orchestration
  README.md
```

## Troubleshooting

- **Ports in use:** Make sure ports 8080 (backend), 4200 (frontend), and 5432 (PostgreSQL) are free or update configs.
- **Missing environment variables:** Ensure all required keys/secrets are set in `application.properties`.
- **Database connection issues:** Check DB credentials and that the DB is running.
- **Flyway migration errors:** Drop/recreate the DB if schema is out of sync.

## License

Distributed under the MIT License.

## Contact

Project Link: [Globe Tales](https://github.com/aryan2574/globe-tales)
