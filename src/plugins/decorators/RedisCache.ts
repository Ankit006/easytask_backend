import { FastifyInstance } from "fastify";

export default class RedisCache {
  private fastify: FastifyInstance;
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  async storeNotification(userId: string, payload: any) {
    await this.fastify.redis.rPush(`notification:${userId}`, payload);
  }
}
