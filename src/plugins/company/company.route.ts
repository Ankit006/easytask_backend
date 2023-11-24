import { FastifyInstance } from "fastify";
import { companyBodyValidation } from "../../validation";
import { HttpStatus, zodErrorFormatter } from "../../utils";

export function companyRoutes(fastifyInstance: FastifyInstance) {
  fastifyInstance.post("/create", async function (req, reply) {
    const validCompanyData = companyBodyValidation.safeParse(req.body);
    if (validCompanyData.success) {
      try {
        await this.DBClient.companyCollection().insertOne(
          validCompanyData.data
        );
        return reply
          .status(HttpStatus.CREATED)
          .send({ message: "New company added successfuly" });
      } catch (err) {
        return reply
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .send({ message: "Oops, its looks like there are server issues😟" });
      }
    } else {
      return reply
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send(zodErrorFormatter(validCompanyData.error.errors));
    }
  });
}
