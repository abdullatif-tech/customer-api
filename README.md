# Customer Management API

A RESTful API for managing customers with full CRUD operations, built with Node.js and Express.

## 🚀 Features

- **Create** new customers
- **Read** all customers or specific customer
- **Update** existing customers
- **Delete** customers
- **Search** customers by name, email, or company
- **Filter** customers by status
- **Validation** for required fields and duplicate emails
- **Error handling** with proper HTTP status codes

## 📁 Project Structure

```
customer-api/
├── customer_server.js      # Main API server
├── test_customer_api.js    # Automated test script
├── package.json           # Dependencies and scripts
├── README.md              # This file
└── Customer_API.postman_collection.json  # Postman collection
```

## 🛠️ Setup

### 1. Install Node.js
Make sure Node.js is installed:
```bash
node --version
npm --version
```

### 2. Install Dependencies
```bash
cd customer-api
npm install
```

This will install:
- `express` - Web framework for the API server
- `nodemon` - Auto-restart during development (optional)

## 🎬 Running the API

### Start the Server
```bash
npm start
# or
node customer_server.js
```

You'll see:
```
╔════════════════════════════════════════╗
║   Customer Management API Started 🚀   ║
╚════════════════════════════════════════╝

📍 Server running at: http://localhost:3001
📊 API Endpoint: http://localhost:3001/api/customers
```

### Development Mode (Auto-restart)
```bash
npm run dev
# or
nodemon customer_server.js
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check and API info |
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/:id` | Get specific customer |
| POST | `/api/customers` | Create new customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |
| GET | `/api/customers/status/:status` | Get customers by status |
| GET | `/api/customers/search/:query` | Search customers |

## 🧪 Testing

### Automated Testing
Run the comprehensive test suite:
```bash
npm test
# or
node test_customer_api.js
```

This will test all CRUD operations, validation, error handling, and edge cases.

### Manual Testing with Postman

#### 1. Create a Customer
- **Method:** `POST`
- **URL:** `http://localhost:3001/api/customers`
- **Body (JSON):**
```json
{
  "name": "Ahmed Mohamed",
  "email": "ahmed@example.com",
  "phone": "+218-91-123-4567",
  "address": "Tripoli, Libya",
  "company": "Tech Solutions"
}
```
- **Expected:** `201 Created`

#### 2. Get All Customers
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/customers`
- **Expected:** `200 OK` with customer list

#### 3. Get Specific Customer
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/customers/CUST-123...`
- **Expected:** `200 OK` with customer details

#### 4. Update Customer
- **Method:** `PUT`
- **URL:** `http://localhost:3001/api/customers/CUST-123...`
- **Body (JSON):**
```json
{
  "name": "Ahmed Mohamed Updated",
  "phone": "+218-91-999-8888"
}
```
- **Expected:** `200 OK`

#### 5. Search Customers
- **Method:** `GET`
- **URL:** `http://localhost:3001/api/customers/search/ahmed`
- **Expected:** `200 OK` with search results

#### 6. Delete Customer
- **Method:** `DELETE`
- **URL:** `http://localhost:3001/api/customers/CUST-123...`
- **Expected:** `200 OK`

### Testing with curl

```bash
# Create customer
curl -X POST http://localhost:3001/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmed Mohamed","email":"ahmed@example.com","phone":"+218-91-123-4567"}'

# Get all customers
curl http://localhost:3001/api/customers

# Get specific customer
curl http://localhost:3001/api/customers/CUST-123...

# Update customer
curl -X PUT http://localhost:3001/api/customers/CUST-123... \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Search customers
curl http://localhost:3001/api/customers/search/ahmed

# Delete customer
curl -X DELETE http://localhost:3001/api/customers/CUST-123...
```

## 📋 Customer Data Model

```json
{
  "id": "CUST-1234567890-1",
  "name": "Ahmed Mohamed",
  "email": "ahmed@example.com",
  "phone": "+218-91-123-4567",
  "address": "Tripoli, Libya",
  "company": "Tech Solutions",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Required Fields
- `name` (string) - Customer's full name
- `email` (string) - Customer's email address (must be unique)

### Optional Fields
- `phone` (string) - Customer's phone number
- `address` (string) - Customer's address
- `company` (string) - Customer's company name

### Auto-generated Fields
- `id` (string) - Unique customer ID
- `status` (string) - Customer status (default: "active")
- `createdAt` (string) - Creation timestamp
- `updatedAt` (string) - Last update timestamp

## 🔍 Advanced Features

### Search Customers
Search by name, email, or company:
```
GET /api/customers/search/ahmed
```

### Filter by Status
Get customers with specific status:
```
GET /api/customers/status/active
```

### Validation Rules
- **Name and email are required**
- **Email must be unique**
- **Phone, address, and company are optional**
- **Email format validation** (basic)

## 🚨 Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Missing required fields
- `404 Not Found` - Customer not found
- `409 Conflict` - Duplicate email
- `500 Internal Server Error` - Server error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "requestedId": "CUST-123..." // (for 404 errors)
}
```

## 🎓 Learning Objectives

After using this API, you'll understand:
- ✅ RESTful API design principles
- ✅ HTTP methods (GET, POST, PUT, DELETE)
- ✅ HTTP status codes (200, 201, 400, 404, 409, 500)
- ✅ JSON request/response format
- ✅ Input validation and error handling
- ✅ CRUD operations in practice
- ✅ API testing strategies

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "Port 3001 already in use"
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
```

### "Command not found: node"
Install Node.js from: https://nodejs.org/

### Server not responding
1. Check if server is running: `npm start`
2. Verify port 3001 is available
3. Check console for error messages

## 📚 Next Steps

After mastering this API, consider:
- Adding authentication (JWT tokens)
- Database integration (MySQL, PostgreSQL)
- Input validation middleware (Joi, express-validator)
- API documentation (Swagger/OpenAPI)
- Rate limiting and security
- Unit testing with Jest
- Docker containerization

## 🤝 Contributing

Feel free to:
- Add new features
- Improve error handling
- Add more test cases
- Enhance documentation
- Optimize performance

## 📄 License

MIT License - feel free to use this code for learning and development!

---

**Happy coding! 🚀**
# customer-api
