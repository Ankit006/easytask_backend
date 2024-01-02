import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { JwtVerifyPayloadType } from "../../types";
import { HttpStatus } from "../../utils";
import { ObjectId } from "@fastify/mongodb";
import { IUser } from "../../database/database.schema";
import { BaseOptionTypes } from "../../validation";

export default function privateGuardPlugin(
  fastifyInstance: FastifyInstance,
  _otps: BaseOptionTypes,
  done: DoneFuncWithErrOrRes
) {
  fastifyInstance.decorateRequest("userId", "");
  fastifyInstance.addHook("preHandler", async function (request, reply) {
    const cookies = request.cookies;
    if (cookies["auth"]) {
      try {
        const res = this.jwt.verify<JwtVerifyPayloadType>(cookies["auth"]);
        const user = await this.DBClient.userCollection().findOne<IUser>({
          _id: new ObjectId(res.userId),
        });
        if (!user) {
          return reply
            .status(HttpStatus.UNAUTHORIZED)
            .send({ error: "UNAUTHORIZED ACCESS" });
        }
        request.userId = user._id.toString();
      } catch (err) {
        return reply
          .status(HttpStatus.UNAUTHORIZED)
          .send({ error: "UNAUTHORIZED ACCESS" });
      }
    } else {
      return reply
        .status(HttpStatus.UNAUTHORIZED)
        .send({ error: "UNAUTHORIZED ACCESS" });
    }
  });

  fastifyInstance.get("/user", async function (request, reply) {
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

  // company plugin
  fastifyInstance.register(require("../company/company.plugin"), {
    prefix: "/company",
  });
  done();
}
