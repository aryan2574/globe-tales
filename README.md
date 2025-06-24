<!-- Improved README.md for GlobeTales -->
<div align="center">
  <h1 align="center">GlobeTales</h1>
  <p align="center">
    Every place has a story.
    <br />
    <a href="https://github.com/your_username/GlobeTales"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/your_username/GlobeTales/issues">Report Bug</a>
    ·
    <a href="https://github.com/your_username/GlobeTales/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

GlobeTales is a full-featured travel platform that allows users to discover new places, plan their trips, and share their travel experiences with a community of fellow adventurers. The application provides intelligent recommendations, route planning, and even a gamified system of achievements to make travel more engaging.

### Built With

This project is built with a modern technology stack, including:

- **Backend:**
  - Java
  - Spring Boot
  - Spring Security & JWT
  - Spring Data JPA / Hibernate
  - PostgreSQL with Flyway
  - Maven
  - OpenAI API
  - OpenRouteService
- **Frontend:**
  - Angular
  - TypeScript
  - SCSS
  - Leaflet.js for maps
- **Deployment:**
  - Docker & Docker Compose
  - Nginx

<!-- FEATURES -->

## Features

- **User Authentication:** Secure user registration and login functionality.
- **Interactive Map:** Explore places of interest on a dynamic map.
- **Place Reviews:** Read and write reviews for various locations.
- **Trip Planning:** Plan your routes with an integrated service.
- **Personalized Recommendations:** Get travel suggestions based on your preferences.
- **AI-Powered Chatbot:** Ask questions and get travel advice from an intelligent chatbot.
- **User Stories:** Share your travel stories and experiences with the community.
- **Gamification:** Earn achievements and points for your travel activities.
- **Favorites & Visited Lists:** Keep track of places you love and places you've been.
- **Weather Forecast:** Check the weather for any location.

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your system:

- Docker and Docker Compose
- Java 17+ & Maven (for manual backend setup)
- Node.js & npm (for manual frontend setup)

### Installation

There are two ways to set up the project:

**1. Using Docker (Recommended)**

This is the easiest way to get the entire application running.

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/GlobeTales.git
    cd GlobeTales
    ```
2.  Create your backend configuration file.
    ```sh
    cp backend/src/main/resources/application.properties.template backend/src/main/resources/application.properties
    ```
3.  Add your API keys and secrets to `backend/src/main/resources/application.properties`:
    - `OPENAI_API_KEY`: Your OpenAI API key.
    - `OPENROUTESERVICE_API_KEY`: Your OpenRouteService API key.
    - `jwt.secret`: A strong, unique secret for JWT.
4.  Launch the application with Docker Compose.
    ```sh
    docker-compose up --build
    ```

**2. Manual Setup**

#### Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Copy the application properties template:
    ```bash
    cp src/main/resources/application.properties.template src/main/resources/application.properties
    ```
3.  Update the `application.properties` file with your configuration:
    - Set your database credentials
    - Add your API keys for OpenAI and OpenRouteService
    - Generate a secure JWT secret key
4.  Build and run the application:
    ```bash
    ./mvnw spring-boot:run
    ```

#### Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```

## Usage

Once the application is running:

- **Backend API** is available at `http://localhost:8080`
- **Frontend Application** is available at `http://localhost:4200`

You can use a tool like Postman or `curl` to interact with the backend API endpoints. The frontend provides a user-friendly interface to access all the features.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->

## Contact

Project Link: [https://github.com/aryan2574/GlobeTales](https://github.com/aryan2574/GlobeTales)
