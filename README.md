# Earthquake Tracker (REST API + Frontend)

This project provides a REST API and a simple frontend UI for fetching, filtering, storing, and visualizing recent earthquake data from the USGS GeoJSON feed.

## Project setup instructions

### Prerequisites

- **Java 17**
- **Maven** (or use the included `mvnw` / `mvnw.cmd`)
- **Node.js + npm**
- **PostgreSQL** (local)

### Repo structure

- **Backend (Spring Boot)**: `src/main/java/...`
- **Backend config**: `src/main/resources/application.properties`
- **Frontend (React)**: `earthquake-frontend/`

## How to run backend and frontend

### 1) Run the backend (Spring Boot)

From the repository root:

```bash
./mvnw spring-boot:run
```

The backend runs on **`http://localhost:8080`**.

### 2) Run the frontend (React)

In a second terminal:

```bash
cd earthquake-frontend
npm install
npm start
```

The frontend runs on **`http://localhost:3000`** and calls the backend at **`http://localhost:8080/api/earthquakes`**.

## Database configuration steps

The backend is configured to use PostgreSQL:

`src/main/resources/application.properties`:

- `spring.datasource.url=jdbc:postgresql://localhost:5432/earthquakedb`
- `spring.datasource.username=postgres`
- `spring.datasource.password=` (empty by default)
- `spring.jpa.hibernate.ddl-auto=update`

### Create the database

1. Ensure PostgreSQL is running locally.
2. Create the database:

```sql
CREATE DATABASE earthquakedb;
```

### Configure credentials (if needed)

If your local Postgres user/password differs, update:

- `spring.datasource.username`
- `spring.datasource.password`

## API usage (main endpoints)

Base path: **`/api/earthquakes`**

- **Fetch latest from USGS and store**
  - `POST /api/earthquakes/fetch`
- **List all stored earthquakes**
  - `GET /api/earthquakes`
- **Filter by minimum magnitude**
  - `GET /api/earthquakes/filter/magnitude?minMag=2.0`
- **Filter by time (epoch milliseconds)**
  - `GET /api/earthquakes/filter/time?timestamp=1710000000000`
- **Delete a stored record (optional requirement)**
  - `DELETE /api/earthquakes/{id}`

## Testing (H2 in-memory)

Tests run with the Spring profile **`test`** (see `@ActiveProfiles("test")`) and use the H2 configuration in:

- `src/test/resources/application-test.properties`

Run tests from the repository root:

```bash
./mvnw test
```

Note: `EarthquakeServiceIntegrationTest.fetchAndStore_shouldPopulateDatabase()` calls the live USGS endpoint, so it requires network access and may fail if the external API is unavailable.

## Assumptions made

- **Time format**: timestamps are handled as **epoch milliseconds** (as returned by USGS).
- **Deduplication strategy**: on every fetch, the backend **deletes all existing records** and then inserts the newly fetched parsed records to avoid duplicates.
- **Null/missing GeoJSON fields**:
  - entries missing critical fields (`mag`, `time`) are **skipped**
  - `place`, `title`, and `magType` are defaulted to `"Unknown"` if missing
  - `latitude` / `longitude` may be `null` and are skipped in the map visualization
- **Ports**: backend runs on **8080**, frontend on **3000**.
- **CORS**: backend allows cross-origin requests (`@CrossOrigin(origins = "*")`) for local development.

## Optional improvements implemented

- Added support for deleting a specific earthquake record (`DELETE /api/earthquakes/{id}`)
- Implemented map visualization of earthquake locations using Leaflet
- Formatted earthquake time for cleaner display in the frontend
- Improved the user interface with custom styling and better visual consistency
- Configured H2 in-memory database for isolated testing (`src/test/resources/application-test.properties`)

