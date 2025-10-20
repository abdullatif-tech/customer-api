#!/usr/bin/env node
/**
 * Customer API Test Script
 * Automated testing for Customer Management API
 */

const http = require('http');

const API_BASE = 'http://localhost:3001';
let testResults = [];
let createdCustomerId = null;

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test function
async function runTest(testName, testFunction) {
  try {
    console.log(`🧪 Running: ${testName}`);
    await testFunction();
    console.log(`✅ PASSED: ${testName}\n`);
    testResults.push({ name: testName, status: 'PASSED' });
  } catch (error) {
    console.log(`❌ FAILED: ${testName}`);
    console.log(`   Error: ${error.message}\n`);
    testResults.push({ name: testName, status: 'FAILED', error: error.message });
  }
}

// Test cases
async function testHealthCheck() {
  const response = await makeRequest('GET', '/');
  if (response.statusCode !== 200) {
    throw new Error(`Expected 200, got ${response.statusCode}`);
  }
  if (!response.body.message.includes('Customer Management API')) {
    throw new Error('API message not found');
  }
}

async function testGetAllCustomersEmpty() {
  const response = await makeRequest('GET', '/api/customers');
  if (response.statusCode !== 200) {
    throw new Error(`Expected 200, got ${response.statusCode}`);
  }
  if (response.body.count !== 0) {
    throw new Error(`Expected 0 customers, got ${response.body.count}`);
  }
}

async function testCreateCustomer() {
  const customerData = {
    name: 'Ahmed Mohamed',
    email: 'ahmed@example.com',
    phone: '+218-91-123-4567',
    address: 'Tripoli, Libya',
    company: 'Tech Solutions'
  };

  const response = await makeRequest('POST', '/api/customers', customerData);
  if (response.statusCode !== 201) {
    throw new Error(`Expected 201, got ${response.statusCode}`);
  }
  if (!response.body.success) {
    throw new Error('Customer creation not successful');
  }
  if (!response.body.customer.id) {
    throw new Error('Customer ID not returned');
  }
  
  createdCustomerId = response.body.customer.id;
  console.log(`   Created customer ID: ${createdCustomerId}`);
}

async function testCreateCustomerValidation() {
  const invalidData = {
    name: 'Test User'
    // Missing required email field
  };

  const response = await makeRequest('POST', '/api/customers', invalidData);
  if (response.statusCode !== 400) {
    throw new Error(`Expected 400, got ${response.statusCode}`);
  }
  if (!response.body.message.includes('Missing required fields')) {
    throw new Error('Validation error message not found');
  }
}

async function testCreateDuplicateEmail() {
  const customerData = {
    name: 'Another User',
    email: 'ahmed@example.com', // Same email as before
    phone: '+218-92-987-6543'
  };

  const response = await makeRequest('POST', '/api/customers', customerData);
  if (response.statusCode !== 409) {
    throw new Error(`Expected 409, got ${response.statusCode}`);
  }
  if (!response.body.message.includes('already exists')) {
    throw new Error('Duplicate email error message not found');
  }
}

async function testGetAllCustomers() {
  const response = await makeRequest('GET', '/api/customers');
  if (response.statusCode !== 200) {
    throw new Error(`Expected 200, got ${response.statusCode}`);
  }
  if (response.body.count !== 1) {
    throw new Error(`Expected 1 customer, got ${response.body.count}`);
  }
  if (!response.body.data[0].id) {
    throw new Error('Customer data not found');
  }
}

async function testGetSpecificCustomer() {
  const response = await makeRequest('GET', `/api/customers/${createdCustomerId}`);
  if (response.statusCode !== 200) {
    throw new Error(`Expected 200, got ${response.statusCode}`);
  }
  if (!response.body.customer) {
    throw new Error('Customer data not returned');
  }
  if (response.body.customer.id !== createdCustomerId) {
    throw new Error('Customer ID mismatch');
  }
}

async function testGetNonExistentCustomer() {
  const response = await makeRequest('GET', '/api/customers/FAKE-ID');
  if (response.statusCode !== 404) {
    throw new Error(`Expected 404, got ${response.statusCode}`);
  }
  if (!response.body.message.includes('not found')) {
    throw new Error('404 error message not found');
  }
}

async function testUpdateCustomer() {
  const updateData = {
    name: 'Ahmed Mohamed Updated',
    phone: '+218-91-999-8888',
    company: 'Updated Tech Solutions'
  };

  const response = await makeRequest('PUT', `/api/customers/${createdCustomerId}`, updateData);
  if (response.statusCode !== 200) {
    throw new Error(`Expected 200, got ${response.statusCode}`);
  }
  if (response.body.customer.name !== updateData.name) {
    throw new Error('Customer name not updated');
  }
  if (response.body.customer.phone !== updateData.phone) {
    throw new Error('Customer phone not updated');
  }
}

async function testUpdateNonExistentCustomer() {
  const updateData = { name: 'Updated Name' };
  const response = await makeRequest('PUT', '/api/customers/FAKE-ID', updateData);
  if (response.statusCode !== 404) {
    throw new Error(`Expected 404, got ${response.statusCode}`);
  }
}

async function testSearchCustomers() {
  const response = await makeRequest('GET', '/api/customers/search/ahmed');
  if (response.statusCode !== 200) {
    throw new Error(`Expected 200, got ${response.statusCode}`);
  }
  if (response.body.count === 0) {
    throw new Error('Search should return at least one result');
  }
}

async function testGetCustomersByStatus() {
  const response = await makeRequest('GET', '/api/customers/status/active');
  if (response.statusCode !== 200) {
    throw new Error(`Expected 200, got ${response.statusCode}`);
  }
  if (response.body.count === 0) {
    throw new Error('Should have at least one active customer');
  }
}

async function testDeleteCustomer() {
  const response = await makeRequest('DELETE', `/api/customers/${createdCustomerId}`);
  if (response.statusCode !== 200) {
    throw new Error(`Expected 200, got ${response.statusCode}`);
  }
  if (!response.body.success) {
    throw new Error('Customer deletion not successful');
  }
}

async function testDeleteNonExistentCustomer() {
  const response = await makeRequest('DELETE', '/api/customers/FAKE-ID');
  if (response.statusCode !== 404) {
    throw new Error(`Expected 404, got ${response.statusCode}`);
  }
}

async function testCustomerDeleted() {
  const response = await makeRequest('GET', '/api/customers');
  if (response.statusCode !== 200) {
    throw new Error(`Expected 200, got ${response.statusCode}`);
  }
  if (response.body.count !== 0) {
    throw new Error(`Expected 0 customers after deletion, got ${response.body.count}`);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Customer API Tests');
  console.log('================================\n');

  // Check if server is running
  try {
    await makeRequest('GET', '/');
    console.log('✅ Server is running\n');
  } catch (error) {
    console.log('❌ Server is not running!');
    console.log('Please start the server first: npm start\n');
    process.exit(1);
  }

  // Run all tests
  await runTest('Health Check', testHealthCheck);
  await runTest('Get All Customers (Empty)', testGetAllCustomersEmpty);
  await runTest('Create Customer', testCreateCustomer);
  await runTest('Create Customer Validation', testCreateCustomerValidation);
  await runTest('Create Duplicate Email', testCreateDuplicateEmail);
  await runTest('Get All Customers', testGetAllCustomers);
  await runTest('Get Specific Customer', testGetSpecificCustomer);
  await runTest('Get Non-existent Customer', testGetNonExistentCustomer);
  await runTest('Update Customer', testUpdateCustomer);
  await runTest('Update Non-existent Customer', testUpdateNonExistentCustomer);
  await runTest('Search Customers', testSearchCustomers);
  await runTest('Get Customers by Status', testGetCustomersByStatus);
  await runTest('Delete Customer', testDeleteCustomer);
  await runTest('Delete Non-existent Customer', testDeleteNonExistentCustomer);
  await runTest('Verify Customer Deleted', testCustomerDeleted);

  // Print results
  console.log('📊 Test Results Summary');
  console.log('======================');
  
  const passed = testResults.filter(r => r.status === 'PASSED').length;
  const failed = testResults.filter(r => r.status === 'FAILED').length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${testResults.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults
      .filter(r => r.status === 'FAILED')
      .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
  }
  
  console.log('\n🎉 Testing completed!');
}

// Run tests
runAllTests().catch(console.error);
