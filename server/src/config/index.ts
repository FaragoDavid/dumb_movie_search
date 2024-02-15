export default {
  jwtSecret: process.env.JWT_SECRET as string,
  redisUrl: process.env.REDIS_URL as string,
};
