import { FastifyInstance } from "fastify";
import argon2 from "argon2";
import { singUpBodyType } from "../types";
import { IUser } from "./database.schema";

export default class DBClient {
  private fastifyInstance: FastifyInstance;

  private collection = {
    users: "users",
    company: "company",
    notification: "notification",
    members: "members",
  };

  constructor(fastifyInstance: FastifyInstance) {
    this.fastifyInstance = fastifyInstance;
  }

  /**
   * @returns mongoDB client
   */
  private getClient() {
    return this.fastifyInstance.mongo.client.db(
      this.fastifyInstance.envConfig.DB
    );
  }

  userCollection() {
    return this.getClient().collection(this.collection.users);
  }

  async generateUserObject(userData: singUpBodyType) {
    const hashedPassword = await argon2.hash(userData.password);
    const userObject: Partial<IUser> = {
      ...userData,
      password: hashedPassword,
      isActive: true,
    };
    return userObject;
  }

  companyCollection() {
    return this.getClient().collection(this.collection.company);
  }

  membersCollection() {
    return this.getClient().collection(this.collection.members);
  }

  notificationCollection() {
    return this.getClient().collection(this.collection.notification);
  }
}
