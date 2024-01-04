import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { BaseOptionTypes } from "../../validation";
import { ObjectId } from "@fastify/mongodb";
import { IUser } from "../../database/database.schema";
import { HttpStatus } from "../../utils";

export default function usersPlugin(
  fastify: FastifyInstance,
  _opts: BaseOptionTypes,
  done: DoneFuncWithErrOrRes
) {
  fastify.get("/", async function (request, reply) {
    const user = await this.DBClient.userCollection().findOne<IUser>(
      {
        _id: new ObjectId(request.userId),
      },
      { projection: { password: 0 } }
    );
    return user
      ? reply.status(HttpStatus.SUCCESS).send(user)
      : reply.status(HttpStatus.NOT_FOUND).send({ error: "user not found" });
  });

  fastify.get("/notifications", async function (request, reply) {
    const res = await this.redisCache.getAllNotification(request.userId);
    if (Array.isArray(res)) {
      return reply.status(HttpStatus.SUCCESS).send(res);
    } else {
      return reply.status(HttpStatus.SERVER_ERROR).send(res);
    }
  });

  done();
}
