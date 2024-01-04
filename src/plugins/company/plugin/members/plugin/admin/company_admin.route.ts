import { FastifyInstance, FastifyRequest } from "fastify";
import { searchUserValidation, userRequestQueryValidation } from "./validation";
import { HttpStatus, zodErrorFormatter } from "../../../../../../utils";
import {
  ICompany,
  IJoinRequestNotification,
  IMember,
  IUser,
} from "../../../../../../database/database.schema";
import { ObjectId } from "@fastify/mongodb";
import { v4 as uuidv4 } from "uuid";

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

  fastifyInstance.get("/users/request", async function (request, reply) {
    const validData = userRequestQueryValidation.safeParse(request.query);
    if (validData.success) {
      const companyData =
        await this.DBClient.companyCollection().findOne<ICompany>({
          _id: new ObjectId(request.companyId),
        });
      if (companyData) {
        const date = new Date();
        const joinRequest: IJoinRequestNotification = {
          _id: uuidv4(),
          type: "JOIN_REQUEST",
          companyDetail: {
            companyLogo: companyData.logo,
            companyName: companyData.name,
          },
          buttonAction: {
            accept: "",
            cancel: "",
          },
          timestamp: date.toISOString(),
        };
        this.webSocket.emitEvent(
          "notification",
          validData.data.userId,
          joinRequest
        );
        reply
          .status(HttpStatus.SUCCESS)
          .send({ message: "Join request is sent" });
      } else {
        reply
          .status(HttpStatus.NOT_FOUND)
          .send({ error: "No company details found" });
      }
    } else {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(zodErrorFormatter(validData.error.errors));
    }
  });
}
