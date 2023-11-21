import { FastifyInstance } from "fastify";

export default class DBClient {
  private fastifyInstance: FastifyInstance;

  private routes = {
    user: "user",
  };

  constructor(fastifyInstance: FastifyInstance) {
    this.fastifyInstance = fastifyInstance;
  }

  /**
   * @returns mongoDB client
   */
  getClient() {
    return this.fastifyInstance.mongo.client.db(
      this.fastifyInstance.envConfig.DB
    );
  }

  /**
   *
   * @returns user collection
   */
  userCollection() {
    return this.getClient().collection(this.routes.user);
  }
}
