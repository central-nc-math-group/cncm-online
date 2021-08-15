import Redis from "ioredis";

// remember to only use redis in a server-side context

const redis = new Redis(process.env.REDIS_URL);

export default redis;