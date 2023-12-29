import { FastifyInstance, FastifyRequest } from "fastify";
import { searchUserValidation } from "./validation";
import { HttpStatus, zodErrorFormatter } from "../../../../../../utils";
import { IMember, IUser } from "../../../../../../database/database.schema";

export default function companyAdminRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.get(
    "/users",
    async function (
      request: FastifyRequest<{ Querystring: { email: string } }>,
      reply
    ) {
      const params = request.query;
      const validationResult = searchUserValidation.safeParse(params);
      if (validationResult.success) {
        const user = await this.DBClient.userCollection().findOne<IUser>({
          email: validationResult.data.email,
        });
        if (user) {
          const member =
            await this.DBClient.membersCollection().findOne<IMember>({
              userId: user._id.toString(),
              companyId: request.companyId,
            });
          const isMember = member ? true : false;
          const resultObj = { ...user, isMember };
          return reply.status(HttpStatus.SUCCESS).send(resultObj);
        } else {
          return reply
            .status(HttpStatus.NOT_FOUND)
            .send({ error: "No user found" });
        }
      } else {
        return reply
          .status(HttpStatus.BAD_REQUEST)
          .send(zodErrorFormatter(validationResult.error.errors));
      }
    }
  );
}
