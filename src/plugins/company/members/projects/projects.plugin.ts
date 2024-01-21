import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { BaseOptionTypes } from "../../../../validation";
import { HttpStatus } from "../../../../utils";
import projectRoutes from "../../../../routes/projects.route";

export default function projectPlugin(
  fastify: FastifyInstance,
  _opts: BaseOptionTypes,
  done: DoneFuncWithErrOrRes
) {
  fastify.addHook("preHandler", async function (request, reply) {
    const role = request.memberRole;
    if (role !== "Admin") {
      return reply
        .status(HttpStatus.FORBIDDEN)
        .send({ error: "You are not allowd to access this information" });
    }
  });
  projectRoutes(fastify);
  done();
}
