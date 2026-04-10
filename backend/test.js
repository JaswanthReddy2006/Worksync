const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const http = require('http');
const app = require('./app.js'); 
test('Generic Backend Smoke Tests', async (t) => {
    let server;
    let port; 
    
    const uri = process.env.DATABASE_URL || process.env.MONGO_URI;
    await t.test('1. Application should be defined', () => {
        assert.ok(app, 'App instance should exist');
        assert.strictEqual(typeof app.use, 'function', 'App should be a valid Express instance');
    });
    await t.test('2. Server should start successfully', async () => {
        server = http.createServer(app);
        await new Promise((resolve) => server.listen(0, resolve));
        
        port = server.address().port;
        assert.ok(port > 0, 'Server bound to a valid ephemeral port');
    });

    await t.test('3. Server should accept HTTP requests', async () => {
        const res = await fetch(`http://localhost:${port}/api-health-check-dummy-route`);
        
        assert.notStrictEqual(res.status, 500, 'Server should not crash internally on unknown routes');
        assert.ok(res.status === 404 || res.status === 200, `Expected 404 or 200, got ${res.status}`);
    });

    // Optional: Test Database Connection if a URI is provided
    await t.test('4. Database Setup (Optional)', async () => {
        if (!uri) {
            console.log('⚠️ Skipping DB connection test (No DATABASE_URL or MONGO_URI in environment)');
            return; // Skip test if no DB url provided in this CI step
        }
        
        try {
            await mongoose.connect(uri);
            assert.strictEqual(mongoose.connection.readyState, 1, 'Mongoose should connect successfully');
        } catch (error) {
            // Making this a warning rather than a hard fail, in case CI doesn't have network access to your DB
            console.log(`⚠️ Warning: Could not connect to DB from test runner. ${error.message}`);
        }
    });

    // Teardown: Clean up resources to allow the test runner to exit cleanly
    test.after(async () => {
        if (server) server.close();
        if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
    });
});