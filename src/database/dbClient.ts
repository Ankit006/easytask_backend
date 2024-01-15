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
    groups: "groups",
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

  companyCollection() {
    return this.getClient().collection(this.collection.company);
  }

  membersCollection() {
    return this.getClient().collection(this.collection.members);
  }

  notificationCollection() {
    return this.getClient().collection(this.collection.notification);
  }

  groupCollection() {
    return this.getClient().collection(this.collection.groups);
  }
}
