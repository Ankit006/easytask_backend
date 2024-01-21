import { FastifyInstance } from "fastify";
import { createProjectValidation } from "../validation/project.validation";
import { HttpStatus, mongoErrorFormatter, zodErrorFormatter } from "../utils";
import { IProject } from "../database/database.schema";

export default function projectRoutes(fastify: FastifyInstance) {
  fastify.post("/", async function (request, reply) {
    const validData = createProjectValidation.safeParse(request.body);
    if (!validData.success) {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(zodErrorFormatter(validData.error.errors));
    }
    const projectObj: Partial<IProject> = {
      name: validData.data.name,
      companyId: validData.data.companyId,
      projectDesc: validData.data.projectDesc,
      projectCost: validData.data.projectCost,
      projectDeadLine: validData.data.projectDeadLine,
      completed: false,
    };
    try {
      await this.DBClient.projectCollection().insertOne(projectObj);
      return reply
        .status(HttpStatus.CREATED)
        .send({ message: "Project is created" });
    } catch (err) {
      return reply
        .status(HttpStatus.BAD_GATEWAY)
        .send(mongoErrorFormatter(err));
    }
  });
}
