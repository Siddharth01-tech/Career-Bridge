const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisClient = createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.warn("[Redis] Maximum reconnect retries reached. Caching disabled temporarily.");
                return new Error("Max retries reached");
            }
            return Math.min(retries * 200, 3000);
        }
    }
});

let isConnected = false;

redisClient.on("error", (err) => {
    // Log as warning rather than crashing the application
    console.warn(`[Redis Error] ${err.message || err}`);
});

redisClient.on("connect", () => {
    console.log("[Redis] Connecting to Redis server...");
});

redisClient.on("ready", () => {
    isConnected = true;
    console.log("[Redis] Connected and ready");
});

redisClient.on("end", () => {
    isConnected = false;
    console.log("[Redis] Connection closed");
});

const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        console.warn(`[Redis Connection Warning] Could not connect to Redis at ${redisUrl}. Continuing with database-only fallback.`);
    }
};

/**
 * Safe Get from Redis Cache
 * @param {string} key
 * @returns {Promise<any|null>}
 */
const getCache = async (key) => {
    try {
        if (!redisClient.isOpen) return null;
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.warn(`[Redis Get Error] Key: ${key}:`, err.message);
        return null;
    }
};

/**
 * Safe Set to Redis Cache with TTL
 * @param {string} key
 * @param {any} value
 * @param {number} ttlSeconds Default is 300 seconds (5 minutes)
 */
const setCache = async (key, value, ttlSeconds = 300) => {
    try {
        if (!redisClient.isOpen) return;
        await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (err) {
        console.warn(`[Redis Set Error] Key: ${key}:`, err.message);
    }
};

/**
 * Safe Delete single key from Redis Cache
 * @param {string} key
 */
const delCache = async (key) => {
    try {
        if (!redisClient.isOpen) return;
        await redisClient.del(key);
    } catch (err) {
        console.warn(`[Redis Del Error] Key: ${key}:`, err.message);
    }
};

/**
 * Safe Delete all keys matching pattern (e.g. "jobs:all*")
 * @param {string} pattern
 */
const delCachePattern = async (pattern) => {
    try {
        if (!redisClient.isOpen) return;
        const keys = await redisClient.keys(pattern);
        if (keys && keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (err) {
        console.warn(`[Redis Del Pattern Error] Pattern: ${pattern}:`, err.message);
    }
};

module.exports = {
    redisClient,
    connectRedis,
    getCache,
    setCache,
    delCache,
    delCachePattern,
    isRedisConnected: () => isConnected && redisClient.isOpen
};