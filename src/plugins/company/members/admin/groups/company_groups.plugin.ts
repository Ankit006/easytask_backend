import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { BaseOptionTypes } from "../../../../../validation";
import companyGroupRoutes from "../../../../../routes/company_groups.routes";

export default function companyGroupPlugin(
  fastify: FastifyInstance,
  _opts: BaseOptionTypes,
  done: DoneFuncWithErrOrRes
) {
  companyGroupRoutes(fastify);
  done();
}
