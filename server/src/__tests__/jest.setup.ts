import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { cleanupDatabase, closeDatabase } from './utils/testUtils';

let mongod: MongoMemoryServer;

// Connect to the in-memory database
beforeAll(async () => {
  // Create new instance of MongoMemoryServer
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Disconnect from any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Connect to the in-memory database
  await mongoose.connect(uri);
});

// Clear all collections after each test
afterEach(async () => {
  await cleanupDatabase();
});

// Close database connection and stop mongod
afterAll(async () => {
  await closeDatabase();
  await mongod.stop();
}); 