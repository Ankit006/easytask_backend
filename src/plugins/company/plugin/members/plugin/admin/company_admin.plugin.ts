import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { CompanyPluginOptionType } from "../../../../../../types";
import companyAdminRoute from "./company_admin.route";
import { HttpStatus } from "../../../../../../utils";

export default function companyAdminPlugin(
  fastifyInstance: FastifyInstance,
  _opts: CompanyPluginOptionType,
  done: DoneFuncWithErrOrRes
) {
  fastifyInstance.addHook("preHandler", async function (request, reply) {
    const role = request.memberRole;
    if (role !== "Admin") {
      return reply
        .status(HttpStatus.FORBIDDEN)
        .send({ error: "You are not allowd to access this information" });
    }
  });
  companyAdminRoute(fastifyInstance);
  done();
}
