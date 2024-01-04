import { FastifyInstance } from "fastify";
import { IJoinRequestNotification } from "../../database/database.schema";

export default class RedisCache {
  private fastify: FastifyInstance;
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  async storeNotification(userId: string, payload: IJoinRequestNotification) {
    try {
      const res = await this.fastify.redis.hSet(
        `${userId}:notification`,
        payload._id,
        JSON.stringify(payload)
      );
      return res > 0;
    } catch (err) {
      return { error: "Database error" };
    }
  }

  async getAllNotification(userId: string) {
    try {
      const res = await this.fastify.redis.hVals(`${userId}:notification`);
      if (res.length > 0) {
        const newRes: string[] = [];
        for (let value of res) {
          newRes.push(JSON.parse(value));
        }
        return newRes;
      } else {
        return res;
      }
    } catch (err) {
      return { error: "Unable to get notifications" };
    }
  }
}
