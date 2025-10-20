#!/usr/bin/env node
/**
 * Customer Management API Server
 * RESTful API for Customer CRUD Operations
 */

const express = require('express');
const app = express();
const PORT = 3001; // Different port from invoice API

// Middleware
app.use(express.json());

// In-memory database
let customers = [];
let customerCounter = 1;

// Logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// ==================== ROUTES ====================

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Customer Management API',
    version: '1.0.0',
    endpoints: {
      'GET /api/customers': 'Get all customers',
      'GET /api/customers/:id': 'Get specific customer',
      'POST /api/customers': 'Create new customer',
      'PUT /api/customers/:id': 'Update customer',
      'DELETE /api/customers/:id': 'Delete customer'
    }
  });
});

// GET all customers
app.get('/api/customers', (req, res) => {
  console.log('✅ Returning all customers');
  res.json({
    success: true,
    count: customers.length,
    data: customers
  });
});

// GET specific customer
app.get('/api/customers/:id', (req, res) => {
  const customer = customers.find(cust => cust.id === req.params.id);
  
  if (!customer) {
    console.log('❌ Customer not found:', req.params.id);
    return res.status(404).json({
      success: false,
      message: 'Customer not found',
      requestedId: req.params.id
    });
  }
  
  console.log('✅ Customer found:', customer.id);
  res.json({
    success: true,
    customer: customer
  });
});

// POST - Create new customer
app.post('/api/customers', (req, res) => {
  const { name, email, phone, address, company } = req.body;
  
  // Validation
  if (!name || !email) {
    console.log('❌ Validation failed');
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name and email'
    });
  }

  // Check if email already exists
  const existingCustomer = customers.find(cust => cust.email === email);
  if (existingCustomer) {
    console.log('❌ Email already exists:', email);
    return res.status(409).json({
      success: false,
      message: 'Customer with this email already exists',
      existingCustomerId: existingCustomer.id
    });
  }
  
  // Create customer
  const customer = {
    id: `CUST-${Date.now()}-${customerCounter++}`,
    name,
    email,
    phone: phone || null,
    address: address || null,
    company: company || null,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  customers.push(customer);
  
  console.log('✅ Customer created:', customer.id);
  console.log(`   Name: ${name}`);
  console.log(`   Email: ${email}`);
  console.log(`   Phone: ${phone || 'Not provided'}\n`);
  
  res.status(201).json({
    success: true,
    message: 'Customer created successfully',
    customer: customer
  });
});

// PUT - Update customer
app.put('/api/customers/:id', (req, res) => {
  const index = customers.findIndex(cust => cust.id === req.params.id);
  
  if (index === -1) {
    console.log('❌ Customer not found for update:', req.params.id);
    return res.status(404).json({
      success: false,
      message: 'Customer not found'
    });
  }

  // Check if email is being changed and if it already exists
  if (req.body.email && req.body.email !== customers[index].email) {
    const existingCustomer = customers.find(cust => 
      cust.email === req.body.email && cust.id !== req.params.id
    );
    if (existingCustomer) {
      console.log('❌ Email already exists:', req.body.email);
      return res.status(409).json({
        success: false,
        message: 'Another customer with this email already exists'
      });
    }
  }
  
  // Update customer
  const updatedCustomer = {
    ...customers[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  customers[index] = updatedCustomer;
  
  console.log('✅ Customer updated:', updatedCustomer.id);
  console.log(`   Name: ${updatedCustomer.name}`);
  console.log(`   Email: ${updatedCustomer.email}\n`);
  
  res.json({
    success: true,
    message: 'Customer updated successfully',
    customer: updatedCustomer
  });
});

// DELETE customer
app.delete('/api/customers/:id', (req, res) => {
  const index = customers.findIndex(cust => cust.id === req.params.id);
  
  if (index === -1) {
    console.log('❌ Customer not found for deletion:', req.params.id);
    return res.status(404).json({
      success: false,
      message: 'Customer not found'
    });
  }
  
  const deletedCustomer = customers.splice(index, 1)[0];
  
  console.log('✅ Customer deleted:', deletedCustomer.id);
  console.log(`   Name: ${deletedCustomer.name}`);
  console.log(`   Email: ${deletedCustomer.email}\n`);
  
  res.json({
    success: true,
    message: 'Customer deleted successfully',
    customer: deletedCustomer
  });
});

// GET customers by status
app.get('/api/customers/status/:status', (req, res) => {
  const { status } = req.params;
  const filteredCustomers = customers.filter(cust => cust.status === status);
  
  console.log(`✅ Returning customers with status: ${status}`);
  res.json({
    success: true,
    count: filteredCustomers.length,
    status: status,
    data: filteredCustomers
  });
});

// Search customers by name or email
app.get('/api/customers/search/:query', (req, res) => {
  const { query } = req.params;
  const searchResults = customers.filter(cust => 
    cust.name.toLowerCase().includes(query.toLowerCase()) ||
    cust.email.toLowerCase().includes(query.toLowerCase()) ||
    (cust.company && cust.company.toLowerCase().includes(query.toLowerCase()))
  );
  
  console.log(`✅ Search results for: ${query}`);
  res.json({
    success: true,
    count: searchResults.length,
    query: query,
    data: searchResults
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/customers',
      'GET /api/customers/:id',
      'POST /api/customers',
      'PUT /api/customers/:id',
      'DELETE /api/customers/:id',
      'GET /api/customers/status/:status',
      'GET /api/customers/search/:query'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Customer Management API Started 🚀   ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`📍 Server running at: http://localhost:${PORT}`);
  console.log(`📊 API Endpoint: http://localhost:${PORT}/api/customers`);
  console.log('');
  console.log('Available Endpoints:');
  console.log('  GET    /api/customers              - List all customers');
  console.log('  GET    /api/customers/:id          - Get specific customer');
  console.log('  POST   /api/customers              - Create customer');
  console.log('  PUT    /api/customers/:id          - Update customer');
  console.log('  DELETE /api/customers/:id         - Delete customer');
  console.log('  GET    /api/customers/status/:status - Get customers by status');
  console.log('  GET    /api/customers/search/:query  - Search customers');
  console.log('');
  console.log('📮 Use Postman or curl to test the API');
  console.log('🛑 Press Ctrl+C to stop the server');
  console.log('');
  console.log('Waiting for requests...\n');
});
