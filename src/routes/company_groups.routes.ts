import { FastifyInstance } from "fastify";
import { CreateCompanyGroupPostValidation } from "../validation/company_group.validation";
import { HttpStatus, mongoErrorFormatter } from "../utils";
import { IGroup } from "../database/database.schema";

export default function companyGroupRoutes(fastify: FastifyInstance) {
  fastify.post("/group", async function (request, reply) {
    const validatedData = CreateCompanyGroupPostValidation.safeParse(
      request.body
    );
    if (validatedData.success) {
      const groupBody: Partial<IGroup> = {
        name: validatedData.data.name,
        companyId: request.companyId,
        members: [],
      };
      try {
        await this.DBClient.groupCollection().insertOne(groupBody);
        return reply
          .status(HttpStatus.CREATED)
          .send({ message: "New grop added" });
      } catch (err) {
        return reply
          .status(HttpStatus.BAD_GATEWAY)
          .send(mongoErrorFormatter(err));
      }
    } else {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: "Wrong information provided" });
    }
  });
}
