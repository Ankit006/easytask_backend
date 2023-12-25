import { FastifyInstance, DoneFuncWithErrOrRes } from "fastify";
import companyAdminRoute from "./company_admin.route";
import { ObjectId } from "@fastify/mongodb";
import { ICompany } from "../../../../../../database/database.schema";
import { CompanyPluginOptionType } from "../../../../../../types";
import { HttpStatus } from "../../../../../../utils";

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
