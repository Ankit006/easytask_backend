import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { CompanyPluginOptionType } from "../../types";
import { companyRoutes } from "./company.route";
export default function companyPlugin(
  fastifyInstance: FastifyInstance,
  _opts: CompanyPluginOptionType,
  done: DoneFuncWithErrOrRes
) {
  companyRoutes(fastifyInstance);

  fastifyInstance.register(require("./plugin/members/company_members.plugin"), {
    prefix: "/:companyId",
  });
  done();
}
