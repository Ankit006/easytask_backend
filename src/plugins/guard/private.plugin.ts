import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { BaseOptionTypes, JwtVerifyPayloadType } from "../../types";
import { HttpStatus } from "../../utils";

export default function privateGuardPlugin(
  fastifyInstance: FastifyInstance,
  _otps: BaseOptionTypes,
  done: DoneFuncWithErrOrRes
) {
  fastifyInstance.decorateRequest("userId", "");

  fastifyInstance.addHook("preHandler", function (request, reply, done) {
    const cookies = request.cookies;
    if (cookies["auth"]) {
      try {
        const res = this.jwt.verify<JwtVerifyPayloadType>(cookies["auth"]);
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
    done();
  });

  // company plugin
  fastifyInstance.register(require("../company/company.plugin"), {
    prefix: "/company",
  });
  done();
}
