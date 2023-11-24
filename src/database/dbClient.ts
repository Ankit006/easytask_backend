import { FastifyInstance } from "fastify";
import argon2 from "argon2";
import { singUpBodyType } from "../types";
import { UserType } from "./database.schema";

export default class DBClient {
  private fastifyInstance: FastifyInstance;

  private collection = {
    user: "user",
    company: "company",
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
    return this.getClient().collection(this.collection.user);
  }

  /**
   *
   * @returns company collection
   */
  companyCollection() {
    return this.getClient().collection(this.collection.company);
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
}
