import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { BaseOptionTypes, JwtVerifyPayloadType } from "../../types";
import { HttpStatus } from "../../utils";
import { ObjectId } from "@fastify/mongodb";

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
        const user = await this.DBClient.userCollection().findOne({
          _id: new ObjectId(res.userId),
        });
        if (!user) {
          return reply
            .status(HttpStatus.UNAUTHORIZED)
            .send({ message: "UNAUTHORIZED ACCESS" });
        }
        request.userId = res.userId;
      } catch (err) {
        return reply
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: "UNAUTHORIZED ACCESS" });
      }
    } else {
      return reply
        .status(HttpStatus.UNAUTHORIZED)
        .send({ message: "UNAUTHORIZED ACCESS" });
    }
  });

  // company plugin
  fastifyInstance.register(require("../company/company.plugin"), {
    prefix: "/company",
  });
  done();
}
