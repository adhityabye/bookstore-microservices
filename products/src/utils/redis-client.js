// utils/redis-client.js

const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://localhost:6379", // Update with your Redis server configuration
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.connect().catch(console.error);

module.exports = redisClient;
