import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { CompanyMemberPluginOptionType } from "./validation";
import { IMember } from "../../../../database/database.schema";
import { HttpStatus } from "../../../../utils";
import { companyMemberRoute } from "./company_member.route";

export default function companyMemebersPlugin(
  fastifyInstance: FastifyInstance,
  _opts: CompanyMemberPluginOptionType,
  done: DoneFuncWithErrOrRes
) {
  fastifyInstance.decorateRequest("companyId", "");
  fastifyInstance.decorateRequest("memberRole", "Member");

  fastifyInstance.addHook("preHandler", async function (request, reply) {
    const { companyId } = request.params as { companyId: string };
    const member = await this.DBClient.membersCollection().findOne<IMember>({
      companyId,
      userId: request.userId,
    });
    if (!member) {
      return reply
        .status(HttpStatus.FORBIDDEN)
        .send({ error: "You are not allowd to access this information" });
    }
    request.companyId = companyId;
    request.memberRole = member.role;
  });
  companyMemberRoute(fastifyInstance);
  fastifyInstance.register(require("./plugin/admin/company_admin.plugin"));
  done();
}
