import { FastifyInstance } from "fastify";
import argon2 from "argon2";
import { singUpBodyType } from "../types";
import { UserType } from "./database.schema";

export default class DBClient {
  private fastifyInstance: FastifyInstance;

  private collection = {
    user: "user",
    company: "company",
    notification: "notification",
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

  userCollection() {
    return this.getClient().collection(this.collection.user);
  }

  async generateUserObject(userData: singUpBodyType) {
    const hashedPassword = await argon2.hash(userData.password);
    const userObject: Partial<UserType> = {
      ...userData,
      password: hashedPassword,
      isActive: true,
    };
    return userObject;
  }

  companyCollection() {
    return this.getClient().collection(this.collection.company);
  }

  notificationCollection() {
    return this.getClient().collection(this.collection.notification);
  }
}
