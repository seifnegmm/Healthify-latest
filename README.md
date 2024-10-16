# Healthify Project

This project contains:

- A **frontend** built with JavaScript using Parcel.
- A **backend** built with Node.js.
- A **MongoDB** database.

The project is dockerized and can be run using Docker Compose.

---

## Prerequisites

Before running the project, ensure you have the following installed:

- **Docker**: [Download here](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install instructions](https://docs.docker.com/compose/install/)

---

## Project Structure

The project structure is organized as follows:

/healthify
│
├── frontend
│ ├── Dockerfile
│ ├── package.json
│ ├── .env # Environment variables for the frontend
│ └── (other frontend files)
│
├── backend
│ ├── Dockerfile
│ ├── package.json
│ ├── config.env # Environment variables for the backend
│ └── (other backend files)
│
├── docker-compose.yml
└── (other project files)

- The **frontend** contains all the UI files and Parcel configurations.
- The **backend** contains the API logic and MongoDB connection settings.
- The **docker-compose.yml** handles the multi-service setup with frontend, backend, and MongoDB services.

---

## Running the Project

Follow these steps to run the project locally using Docker Compose.

### 1. Clone the repository:

```bash
git clone <your-repo-url>
cd healthify

```

## 2. Run the application using Docker Compose:

To build and start all services (frontend, backend, and MongoDB), use:

```bash
docker-compose up --build
```

This will:

Build the frontend and backend Docker images.
Start the MongoDB database.
Bind the frontend to port 80 and the backend to port 8000.

## 3. Access the services:

Frontend: Open http://localhost in your browser.
MongoDB: Accessible at mongodb://localhost:27017 (you can connect with a MongoDB client if needed).

## 4.Stop the containers

```bash
docker-compose down
```

## Environment Variables (Backend)

The backend service requires a MongoDB connection string, which is provided in the `docker-compose.yml` file.

The backend uses the following environment variable for the MongoDB connection:

```yaml
environment:
  - MONGODB_URI=mongodb://mongo:27017/mydatabase
```

## Volumes

The MongoDB service uses a named volume to persist the database data:

```yaml
volumes:
  mongo-data: /data/db
```

---

## Note

Please create your own `.env` files based on the examples provided. For the frontend, create a file named `.env` in the `/frontend` directory, and for the backend, create a file named `config.env` in the `/backend` directory. These files should follow the structure defined in the `.env.example` and `config.env.example` files included in the repository.

---

## Author

**Seifeldin Negm**
