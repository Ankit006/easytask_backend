import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";

import { authRoutes } from "./auth.route";
import { AuthPluginOptionType } from "../../types";
import { HttpStatus } from "../../utils";
import { UserType } from "../../database/database.schema";

export default function authPlugin(
  fastifyInstance: FastifyInstance,
  _opts: AuthPluginOptionType,
  done: DoneFuncWithErrOrRes
) {
  // auth route
  authRoutes(fastifyInstance);

  // This hook is used for set a cookie if signup or signin is successful
  fastifyInstance.addHook("onSend", function (_request, reply, payload, done) {
    if (
      (reply.statusCode === HttpStatus.SUCCESS ||
        reply.statusCode === HttpStatus.CREATED) &&
      typeof payload === "string"
    ) {
      const user: UserType = JSON.parse(payload).user;

      const token = this.jwt.sign({ userId: user._id });
      reply.setCookie("auth", token, {
        domain: "localhost",
        path: "/",
        secure: true,
        sameSite: "lax",
        httpOnly: true,
        maxAge: 24 * 60 * 60,
      });
    }
    done();
  });

  done();
}
