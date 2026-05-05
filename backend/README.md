# Inventory Management System - Backend

## Tech Stack
- Spring Boot 3.x
- Java 17
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Flyway Migration
- Apache POI (Excel Export)
- MapStruct & Lombok

## Setup
1. Ensure PostgreSQL is running locally on port `5432` with a database named `ims_db`.
2. (Optional) Configure environment variables if not using defaults (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `MAIL_HOST`, etc.).
3. Build the project:
   ```bash
   mvn clean install
   ```
4. Run the project:
   ```bash
   mvn spring-boot:run
   ```
