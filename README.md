# Webellian Technical Task API

This repo is a NestJS API for managing catalogs and products with Many to Many relationship, validation, Swagger docs, PostgreSQL & Type ORM, Docker support, test coverage, CI/CD using Github Actions + Dokploy and Deployement on an Amazon EC2 Linux instance.

Built for the **Webellian** technical assessment

## Live Deployment URL :

- Environment: AWS EC2 instance & docker containers
- Deployment server: Amazon EC2 m7i-flex.large Ubuntu 22 LTS 64
- CI/CD : Github Actions & Dokploy
- Live URL: https://api.technical-task.live
- Swagger UI: https://api.technical-task.live
- HTTPS: enabled + Cloudflare CDN Full Strict + Reverse Proxy
- Rate limiting: enabled at the Cloudflare CDN layer

## Project Structure

```text
.
├── src/
│   ├── app.module.ts                              # Root module (Config + TypeORM + feature modules)
│   ├── main.ts                                    # Global Validation, Swagger, Middlewares (CORS, helmet), Filter
│   ├── catalogs/
│   │   ├── catalogs.controller.ts                 # Catalog HTTP endpoints
│   │   ├── catalogs.module.ts                     # Catalog module
│   │   ├── catalogs.service.ts                    # Catalog services and injected repositories
│   │   └── dto/
│   │       ├── pagination-catalog.dto.ts         # Catalog pagination query DTO
│   │       ├── create-catalog.dto.ts             # Create catalog request DTO
│   │       └── update-catalog.dto.ts             # Update catalog request DTO
│   ├── products/
│   │   ├── products.controller.ts                 # Product HTTP endpoints + assignment routes
│   │   ├── products.module.ts                     # Product module
│   │   ├── products.service.ts                    # Product services and injected repositories
│   │   └── dto/
│   │       ├── pagination-product.dto.ts         # Product pagination query DTO
│   │       ├── query-product.dto.ts              # Product query DTO (pagination + optional catalogId filter)
│   │       ├── create-product.dto.ts             # Create product request DTO
│   │       └── update-product.dto.ts             # Update product request DTO
│   ├── database/
│   │   ├── database.config.ts                    # TypeORM config factory (.env injected)
│   │   ├── entities/
│   │   │   ├── catalog.entity.ts                 # Catalog Database schema ( entity )
│   │   │   └── product.entity.ts                 # Product Database schema ( entity )
│   │   └── seeds/
│   │       └── seed.ts                           # Local seed script
│   └── common/
│       └── filters/
│           └── http-exception-filter.ts          # Global exception response formatting
├── test/
│   ├── catalogs.service.spec.ts                   # Catalog service unit tests
│   ├── products.service.spec.ts                   # Product service unit tests
├── docker-compose.yml                             # Local PostgreSQL and Adminer for review
├── docker-compose.prod.yml                        # Production API compose for deployment
└── .env.example                                   # Environment variable template
```

## Stack & Service Overview

- Framework: NestJS 11 + TypeScript 5.7.3
- Runtime: Node.js 20
- Database: PostgreSQL 16
- ORM: TypeORM 0.3.28
- Validation: class-validator on the DTO Level + global ValidationPipe
- Security: helmet + CORS + global exception filter + Cloudflare CDN (Rate Limiting / Full strict 443 https)
- API docs: Swagger OpenAPI (mounted at root path)

## Features

- Catalog CRUD operations
- Product CRUD operations
- Assign product to catalog
- Remove product from catalog
- Retrieve all products in a catalog
- Request validation and validation typed DTOs
- Seed script for local data
- Unit tests

## Quick Start

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment

```bash
cp .env.example .env
```

### 3) Start local database services

```bash
docker compose up -d
```

This starts:

- PostgreSQL on port 5432
- Adminer on port 8080

### 4) Start API in dev mode

```bash
pnpm run start:dev
```

Default local API URL:

- http://localhost:3000

Swagger docs locally:

- http://localhost:3000

### 5) Seed Local Database

```bash
pnpm run seed
```

Seed data includes sample catalogs and products with relationships.

## REST API Endpoints

### Catalogs

- GET /catalogs - Retrieve all catalogs
- GET /catalogs/:id - Retrieve one catalog
- POST /catalogs - Create a catalog
- PUT /catalogs/:id - Update a catalog
- DELETE /catalogs/:id - Delete a catalog
- GET /catalogs/:id/products - Get products in a catalog

### Products

- GET /products - Retrieve all products
- GET /products/:id - Retrieve one product
- POST /products - Create a product
- PUT /products/:id - Update a product
- DELETE /products/:id - Delete a product
- POST /products/:id/catalogs/:catalogId - Assign product to catalog
- DELETE /products/:id/catalogs/:catalogId - Remove product from catalog

## Data Model

**Design Decision:** Many-to-many relationship, a product can belong to multiple catalogs.

```text
┌──────────────┐         ┌──────────────────────┐         ┌──────────────┐
│   catalogs   │         │  productsInCatalogs  │         │   products   │
├──────────────┤         ├──────────────────────┤         ├──────────────┤
│ id (PK)      │─┐       │ catalog_id (FK)      │      ┌──│ id (PK)      │
│ name         │ └────→  │ product_id (FK)      │ ←────┘  │ name         │
│ description? │         └─────────────────────-┘         │ price        │
│ isActive     │                                          │ description? │
└──────────────┘                                          │ isAvailable  │
														  └──────────────┘
```

- `catalogs` table maps to `CatalogEntity`
- `products` table maps to `ProductEntity`
- `productsInCatalogs` is the TypeORM join table used for assignments

## Environment Variables

Use .env.example as a baseline.

- DATABASE_HOST # Postgres HOSTNAME
- DATABASE_PORT # PORT 5432 by default
- DATABASE_USER
- DATABASE_PASSWORD
- DATABASE_NAME # should match Postgres DB name
- DATABASE_SYNC # database synchronisation is true by default
- CLIENT_URL. # for CORS Your domain name or http://localhost:3000 default ( modify on main.ts )
- PORT # Nest JS app deployement PORT Default 3000

## Development Notes

- Swagger is mounted at root path (/), not /api because the api subdomain is used for a professional setting,
- CORS origin is controlled by CLIENT_URL variable in .env file.
- For production safety, synchronize should be set to false in TypeORM configuration but migrations are not implemented yet.
- due to the time constraint on the project unit tests coverage is not very high and e2e & integration will be implemented.
- in Production `docker-compose.prod.yml`, the Postgres Database is not included for security & Performance reasons to be deployed seperately
