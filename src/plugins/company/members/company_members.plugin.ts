import { FastifyInstance, DoneFuncWithErrOrRes } from "fastify";
import { IMember } from "../../../database/database.schema";
import { companyMemberRoute } from "../../../routes/company_members.routes";
import { HttpStatus } from "../../../utils";
import { BaseOptionTypes } from "../../../validation";

export default function companyMemebersPlugin(
  fastifyInstance: FastifyInstance,
  _opts: BaseOptionTypes,
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
  fastifyInstance.register(require("./admin/company_admin.plugin"));
  done();
}
