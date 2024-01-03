import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { RedisClientType, createClient } from "redis";

async function redis(fastify: FastifyInstance) {
  const client: RedisClientType = createClient();
  client.on("error", (err) => console.log("Redis Client Error", err));
  try {
    await client.connect();
    console.log("Redis connected");
  } catch (err) {
    console.log("redis error", err);
  }
  fastify.decorate("redis", client);
}

export default fp(redis);
