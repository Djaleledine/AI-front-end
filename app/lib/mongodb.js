import mongoose from "mongoose";

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/anjucia_dermaceutical";

let cached = global._anjuciaMongoCache;
if (!cached) {
  cached = global._anjuciaMongoCache = {
    conn: null,
    promise: null,
    uri: process.env.MONGODB_URI || DEFAULT_LOCAL_URI,
    lastError: null,
    isConnected: false
  };
}

/**
 * Connects to MongoDB using Mongoose with fast timeout so the app stays
 * instant even if a local MongoDB service is not currently running.
 */
export async function connectToMongoDB(customUri = null) {
  const targetUri = customUri || process.env.MONGODB_URI || cached.uri || DEFAULT_LOCAL_URI;

  if (customUri && customUri !== cached.uri) {
    try {
      if (cached.conn) {
        await mongoose.disconnect();
      }
    } catch (_) {}
    cached.conn = null;
    cached.promise = null;
    cached.uri = customUri;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    cached.isConnected = true;
    return { conn: cached.conn, isConnected: true, uri: cached.uri, error: null };
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(targetUri, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
        bufferCommands: false
      })
      .then((m) => {
        cached.conn = m;
        cached.isConnected = true;
        cached.lastError = null;
        return m;
      })
      .catch((err) => {
        cached.conn = null;
        cached.promise = null;
        cached.isConnected = false;
        cached.lastError = err?.message || "MongoDB connection unavailable";
        return null;
      });
  }

  const conn = await cached.promise;
  return {
    conn,
    isConnected: Boolean(conn && mongoose.connection.readyState === 1),
    uri: cached.uri,
    error: cached.lastError
  };
}

export function getMongoStatus() {
  return {
    isConnected: Boolean(cached.isConnected && mongoose.connection.readyState === 1),
    readyState: mongoose.connection.readyState,
    uri: cached.uri ? cached.uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@") : DEFAULT_LOCAL_URI,
    lastError: cached.lastError
  };
}

