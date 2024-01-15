import { ObjectId } from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import { HttpStatus } from "../utils";
import { IUser } from "../database/database.schema";

export function companyMemberRoute(fastify: FastifyInstance) {
  fastify.get("/header", async function (request, reply) {
    const user = await this.DBClient.userCollection().findOne<IUser>(
      {
        _id: new ObjectId(request.userId),
      },
      { projection: { password: 0 } }
    );
    if (user) {
      const headerData = { ...user, role: request.memberRole };
      return reply.status(HttpStatus.SUCCESS).send(headerData);
    } else {
      return reply
        .status(HttpStatus.NOT_FOUND)
        .send({ error: "User not found" });
    }
  });
}
