import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { CompanyPluginOptionType } from "../../types";
import { companyRoutes } from "./company.route";
export default function companyPlugin(
  fastifyInstance: FastifyInstance,
  _opts: CompanyPluginOptionType,
  done: DoneFuncWithErrOrRes
) {
  companyRoutes(fastifyInstance);
  fastifyInstance.register(require("./admin/company_admin.plugin"), {
    prefix: "/:companyId",
  });
  done();
}
