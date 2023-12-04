import { FastifyInstance } from "fastify";
import { companyBodyValidation } from "../../validation";
import { HttpStatus, zodErrorFormatter } from "../../utils";
import { CompanyType } from "../../database/database.schema";

export function companyRoutes(fastifyInstance: FastifyInstance) {
  fastifyInstance.get("/", async function (request, reply) {
    try {
      const companyList = await this.DBClient.companyCollection()
        .find<CompanyType>({
          adminId: request.userId,
        })
        .toArray();
      return reply.send(companyList);
    } catch (err) {
      return reply
        .status(HttpStatus.BAD_GATEWAY)
        .send({ error: "Oops, its looks like there are server issues😟" });
    }
  });

  fastifyInstance.post("/", async function (req, reply) {
    const validCompanyData = companyBodyValidation.safeParse(req.body);
    if (validCompanyData.success) {
      try {
        const companyObj: Partial<CompanyType> = {
          ...validCompanyData.data,
          adminId: req.userId,
          members: [],
        };
        await this.DBClient.companyCollection().insertOne(companyObj);
        return reply.status(HttpStatus.CREATED).send({
          message: "New company added successfuly",
          company: companyObj,
        });
      } catch (err) {
        return reply
          .status(HttpStatus.BAD_GATEWAY)
          .send({ error: "Oops, its looks like there are server issues😟" });
      }
    } else {
      return reply
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send(zodErrorFormatter(validCompanyData.error.errors));
    }
  });
}
