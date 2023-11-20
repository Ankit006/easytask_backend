import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { AuthPlugInOptionType } from "../types";
import { authRoutes } from "./auth.route";

export default function authPlugin(
  fastifyInstance: FastifyInstance,
  _opts: AuthPlugInOptionType,
  done: DoneFuncWithErrOrRes
) {
  // auth route
  authRoutes(fastifyInstance);

  done();
}
