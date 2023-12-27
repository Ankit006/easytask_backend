import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { CompanyPluginOptionType } from "../../types";
import { companyRoutes } from "./company.route";
export default function companyPlugin(
  fastifyInstance: FastifyInstance,
  _opts: CompanyPluginOptionType,
  done: DoneFuncWithErrOrRes
) {
  /////////////////////// fastify multipart /////////////////////////////
  fastifyInstance.register(require("@fastify/multipart"), {
    limits: {
      fileSize: 3000000,
      fields: 10,
    },
    attachFieldsToBody: true,
  });

  companyRoutes(fastifyInstance);

  fastifyInstance.register(require("./plugin/members/company_members.plugin"), {
    prefix: "/:companyId",
  });
  done();
}
