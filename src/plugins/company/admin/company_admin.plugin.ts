import { FastifyInstance, DoneFuncWithErrOrRes } from "fastify";
import { CompanyPluginOptionType } from "../../../types";
import companyAdminRoute from "./company_admin.route";
import { ICompany } from "../../../database/database.schema";
import { ObjectId } from "@fastify/mongodb";
import { HttpStatus } from "../../../utils";

export default function companyPlugin(
  fastifyInstance: FastifyInstance,
  _opts: CompanyPluginOptionType,
  done: DoneFuncWithErrOrRes
) {
  fastifyInstance.decorateRequest("companyId", "");
  fastifyInstance.addHook("preHandler", async function (request, reply) {
    const { companyId } = request.params as { companyId: string };

    const res = await this.DBClient.companyCollection().findOne<ICompany>({
      _id: new ObjectId(companyId),
      adminId: request.userId,
    });
    if (res === null) {
      return reply
        .status(HttpStatus.FORBIDDEN)
        .send({ error: "You are not allowd to access this information" });
    }
    request.companyId = companyId;
  });

  companyAdminRoute(fastifyInstance);

  done();
}
