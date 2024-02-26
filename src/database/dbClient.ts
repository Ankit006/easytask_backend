import { FastifyInstance } from "fastify";

export default class DBClient {
  private fastifyInstance: FastifyInstance;

  private collection = {
    users: "users",
    company: "company",
    notification: "notification",
    members: "members",
    groups: "groups",
    projects: "projects",
    projectSprints: "projectSprints",
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
  projectCollection() {
    return this.getClient().collection(this.collection.projects);
  }
  projectSprintCollection() {
    return this.getClient().collection(this.collection.projectSprints);
  }
}
