/**
 *  Routes under this pluin can only be accessed bty
 */

import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { BaseOptionTypes } from "../../../../../validation";
import companyAdminMemberRoute from "../../../../../routes/company_admin_member.routes";

export default function companyAdminMemberPluin(
  fastify: FastifyInstance,
  _opts: BaseOptionTypes,
  done: DoneFuncWithErrOrRes
) {
  companyAdminMemberRoute(fastify);
  done();
}
