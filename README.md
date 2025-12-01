# Product Management API

A RESTful API with gRPC support, built following Clean Architecture principles, Clean Code practices, and TypeScript.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [gRPC Services](#grpc-services)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Best Practices](#best-practices)
- [Configuration](#configuration)
- [Docker](#docker)
- [Development](#development)

## 🎯 Overview

This API provides a complete CRUD (Create, Read, Update, Delete) system for product management, with both REST and gRPC interfaces. The application is designed with Clean Architecture principles, ensuring maintainability, testability, and scalability.

### Features

- ✅ Full CRUD operations for products
- ✅ RESTful API with Express
- ✅ gRPC services (Health & Echo)
- ✅ Request filtering and sorting
- ✅ Data validation
- ✅ Centralized error handling
- ✅ Structured logging
- ✅ TypeScript for type safety

## 🏗️ Architecture

The application follows **Clean Architecture** principles, organized in distinct layers:

```
src/
├── domain/           # Domain Layer (entities, interfaces, errors)
│   ├── entities/     # Business entities
│   ├── repositories/ # Repository interfaces
│   ├── services/     # Service interfaces
│   └── errors/       # Custom error classes
├── application/      # Application Layer (use cases)
│   └── use-cases/    # Business logic orchestration
├── infrastructure/   # Infrastructure Layer (concrete implementations)
│   ├── repositories/ # Repository implementations
│   ├── services/      # Service implementations
│   └── grpc/          # gRPC server and services
├── presentation/     # Presentation Layer (controllers, routes, middlewares)
│   ├── controllers/   # Request handlers
│   ├── routes/        # Route definitions
│   └── middlewares/   # Express middlewares
└── config/           # Application configuration
```

### Layer Responsibilities

- **Domain**: Core business logic, entities, and interfaces. No dependencies on external frameworks.
- **Application**: Use cases that orchestrate business logic. Depends only on domain layer.
- **Infrastructure**: Concrete implementations (database, external services, gRPC). Implements domain interfaces.
- **Presentation**: Controllers, routes, and middlewares. Handles HTTP requests and responses.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (or use Docker)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:leozw/crud-api.git
cd crud-api

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

The API will be available at:
- **REST API**: http://localhost:3000
- **gRPC Server**: localhost:50051

### Development Mode

For development with hot reload:

```bash
npm run dev
```

## 📡 API Documentation

### Base URL

```
http://localhost:3000
```

### Endpoints

#### `GET /`

Returns API information and endpoint documentation.

**Response:**
```json
{
  "message": "Product Management API",
  "version": "1.0.0",
  "endpoints": { ... },
  "queryParams": { ... }
}
```

#### `GET /products`

Retrieves all products with optional filtering and sorting.

**Query Parameters:**
- `minPrice` (number): Filter products by minimum price
- `maxPrice` (number): Filter products by maximum price
- `sortBy` (string): Sort by field (`name`, `price`, `stock`, `category`)

**Example:**
```bash
GET /products?minPrice=50&maxPrice=100&sortBy=price
```

**Response:**
```json
{
  "total": 2,
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 999.99,
      "stock": 15,
      "category": "Electronics",
      "description": "High-performance laptop"
    }
  ]
}
```

#### `GET /products/:id`

Retrieves a specific product by ID.

**Parameters:**
- `id` (number): Product ID

**Response:**
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 999.99,
  "stock": 15,
  "category": "Electronics",
  "description": "High-performance laptop"
}
```

**Error Response (404):**
```json
{
  "error": "Not found",
  "message": "Product with ID 999 not found"
}
```

#### `GET /products/category/:category`

Retrieves all products in a specific category.

**Parameters:**
- `category` (string): Product category

**Response:**
```json
{
  "category": "Electronics",
  "total": 1,
  "products": [...]
}
```

#### `POST /products`

Creates a new product.

**Request Body:**
```json
{
  "name": "Wireless Headphones",
  "price": 79.99,
  "stock": 25,
  "category": "Electronics",
  "description": "Premium wireless headphones with noise cancellation"
}
```

**Response (201):**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": 5,
    "name": "Wireless Headphones",
    "price": 79.99,
    "stock": 25,
    "category": "Electronics",
    "description": "Premium wireless headphones"
  }
}
```

**Validation Error (400):**
```json
{
  "error": "Validation failed",
  "details": [
    "price must be greater than zero",
    "stock cannot be negative"
  ]
}
```

#### `PUT /products/:id`

Updates a product completely (full replacement). All fields are required.

**Parameters:**
- `id` (number): Product ID

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 89.99,
  "stock": 30,
  "category": "Accessories",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "message": "Product updated successfully",
  "product": { ... }
}
```

#### `PATCH /products/:id`

Updates a product partially (only provided fields).

**Parameters:**
- `id` (number): Product ID

**Request Body:**
```json
{
  "price": 69.99,
  "stock": 20
}
```

**Response:**
```json
{
  "message": "Product updated successfully",
  "product": { ... }
}
```

#### `DELETE /products/:id`

Deletes a product.

**Parameters:**
- `id` (number): Product ID

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

## 🔌 gRPC Services

The API also exposes gRPC services for inter-service communication.

### Health Service

Implements the gRPC Health Checking Protocol.

**Service:** `grpc.health.v1.Health`

**Methods:**
- `Check`: Returns the health status of a service
- `Watch`: Streams health status updates

**Example Request:**
```protobuf
service: ""  // Empty string for overall health
// or
service: "echo.EchoService"  // Specific service health
```

**Response:**
```protobuf
status: SERVING  // or UNKNOWN, NOT_SERVING, SERVICE_UNKNOWN
```

### Echo Service

Simple echo service for testing gRPC communication.

**Service:** `echo.EchoService`

**Methods:**
- `Echo`: Echoes back the message with a timestamp

**Example Request:**
```protobuf
message: "Hello, gRPC!"
```

**Response:**
```protobuf
message: "Hello, gRPC!"
timestamp_unix_ms: 1701432000000
```

## 📁 Project Structure

```
crud-api/
├── src/
│   ├── domain/                    # Domain layer
│   │   ├── entities/
│   │   │   └── Product.ts          # Product entity and DTOs
│   │   ├── repositories/
│   │   │   └── IProductRepository.ts
│   │   ├── services/
│   │   │   └── IProductValidationService.ts
│   │   └── errors/
│   │       ├── NotFoundError.ts
│   │       └── ValidationError.ts
│   ├── application/                # Application layer
│   │   └── use-cases/
│   │       └── product/
│   │           ├── CreateProductUseCase.ts
│   │           ├── DeleteProductUseCase.ts
│   │           ├── GetAllProductsUseCase.ts
│   │           ├── GetProductByIdUseCase.ts
│   │           ├── GetProductsByCategoryUseCase.ts
│   │           └── UpdateProductUseCase.ts
│   ├── infrastructure/             # Infrastructure layer
│   │   ├── repositories/
│   │   │   └── InMemoryProductRepository.ts
│   │   ├── services/
│   │   │   └── ProductValidationService.ts
│   │   └── grpc/
│   │       ├── GrpcServer.ts
│   │       └── services/
│   │           ├── EchoService.ts
│   │           └── HealthService.ts
│   ├── presentation/               # Presentation layer
│   │   ├── controllers/
│   │   │   └── ProductController.ts
│   │   ├── routes/
│   │   │   └── ProductRoutes.ts
│   │   ├── middlewares/
│   │   │   ├── ErrorHandler.ts
│   │   │   ├── NotFoundHandler.ts
│   │   │   └── RequestLogger.ts
│   │   └── ExpressApp.ts
│   ├── config/
│   │   └── AppConfig.ts
│   └── index.ts                    # Application entry point
├── protos/                         # Protocol Buffer definitions
│   ├── echo.proto
│   └── health.proto
├── dist/                           # Compiled JavaScript (generated)
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Technologies

- **TypeScript** (5.3.3): Type-safe JavaScript
- **Express** (5.1.0): Web framework
- **@grpc/grpc-js** (1.10.6): gRPC implementation for Node.js
- **@grpc/proto-loader** (0.7.13): Protocol Buffer loader
- **Node.js**: JavaScript runtime

## 📝 Best Practices

This project implements several software engineering best practices:

### Clean Architecture
- Clear separation of concerns across layers
- Domain layer independent of frameworks
- Dependency inversion principle

### Clean Code
- Meaningful variable and function names
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Consistent code style

### TypeScript
- Full type safety
- Interface-based design
- Compile-time error detection

### SOLID Principles
- **S**ingle Responsibility: Each class has one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Interfaces can be substituted
- **I**nterface Segregation: Focused interfaces
- **D**ependency Inversion: Depend on abstractions

### Other Practices
- Dependency Injection
- Centralized error handling
- Request validation
- Structured logging
- Environment-based configuration

## 🔧 Configuration

Configuration is managed through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Express server port | `3000` |
| `GRPC_PORT` | gRPC server port | `50051` |
| `NODE_ENV` | Environment mode (`development`/`production`) | `development` |

### Example

```bash
PORT=8080 GRPC_PORT=50052 NODE_ENV=production npm start
```

## 🐳 Docker

### Build Image

```bash
docker build -t crud-api .
```

### Run Container

```bash
docker run -p 3000:3000 -p 50051:50051 crud-api
```

### With Environment Variables

```bash
docker run -p 3000:3000 -p 50051:50051 \
  -e PORT=3000 \
  -e GRPC_PORT=50051 \
  -e NODE_ENV=production \
  crud-api
```

The Dockerfile uses a multi-stage build:
1. **Builder stage**: Installs dependencies and compiles TypeScript
2. **Production stage**: Copies only compiled code and production dependencies

## 💻 Development

### Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run tests (when implemented)
npm test
```

### Data Model

#### Product Entity

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}
```

#### Create Product DTO

```typescript
interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
}
```

#### Update Product DTO

```typescript
interface UpdateProductDto {
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
  description?: string;
}
```

### Validation Rules

- `name`: Required, non-empty string
- `price`: Required, must be greater than 0
- `stock`: Required, must be non-negative integer
- `category`: Required, non-empty string
- `description`: Optional string

## 📄 License

ISC

## 👤 Author

Leonardo Zwirtes

---

**Note**: This is a demonstration project showcasing Clean Architecture principles. For production use, consider adding:
- Database persistence (PostgreSQL, MongoDB, etc.)
- Authentication & Authorization
- Rate limiting
- API versioning
- Comprehensive test coverage
- CI/CD pipeline
- Monitoring and logging solutions
