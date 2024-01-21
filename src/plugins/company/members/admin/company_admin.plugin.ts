import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { CompanyPluginOptionType } from "../../../../types";
import { HttpStatus } from "../../../../utils";
import companyAdminRoute from "../../../../routes/company_admin.routes";

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

  fastifyInstance.register(require("./groups/company_groups.plugin.ts"));
  fastifyInstance.register(require("./member/company_admin_member.plugin"));
  done();
}
