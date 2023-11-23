import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";

import { authRoutes } from "./auth.route";
import { AuthPluginOptionType } from "../../types";

export default function authPlugin(
  fastifyInstance: FastifyInstance,
  _opts: AuthPluginOptionType,
  done: DoneFuncWithErrOrRes
) {
  // auth route
  authRoutes(fastifyInstance);

  done();
}
