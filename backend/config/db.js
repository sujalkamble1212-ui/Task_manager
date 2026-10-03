const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  try {
    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to specified MongoDB URI...');
      const conn = await mongoose.connect(mongoUri);
      console.log(` MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }

    // Fallback: If no MONGO_URI is specified, start embedded MongoMemoryServer for instant zero-config testing
    console.log(' No MONGO_URI provided in .env. Initializing in-memory MongoDB instance for local testing...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(` In-Memory MongoDB Connected at ${uri}`);
    console.log(' Tip: To use MongoDB Atlas or a local mongod, set MONGO_URI in backend/.env');
    return conn;
  } catch (error) {
    console.error(` MongoDB connection error: ${error.message}`);
    // If the configured URI failed (e.g. invalid Atlas credentials or offline), offer fallback in dev
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log(' Falling back to in-memory MongoDB instance...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        console.log(` In-Memory MongoDB Connected at ${uri}`);
        return conn;
      } catch (memErr) {
        console.error('Failed to start fallback in-memory MongoDB:', memErr.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
