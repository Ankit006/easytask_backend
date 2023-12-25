import { ObjectId } from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import { HttpStatus } from "../../../../utils";
import { IUser } from "../../../../database/database.schema";

export function companyMemberRoute(fastify: FastifyInstance) {
  fastify.get("/header", async function (request, reply) {
    const user = await this.DBClient.userCollection().findOne<IUser>({
      _id: new ObjectId(request.userId),
    });
    if (user) {
      return reply
        .send(HttpStatus.SUCCESS)
        .send({ ...user, role: request.memberRole });
    } else {
      return reply.send(HttpStatus.NOT_FOUND).send({ error: "User not found" });
    }
  });
}
