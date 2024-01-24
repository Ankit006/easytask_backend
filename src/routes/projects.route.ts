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
      companyId: request.companyId,
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

  fastify.get("/", async function (request, reply) {
    try {
      const res = this.DBClient.projectCollection().find<IProject>({
        companyId: request.companyId,
      });

      type ProjectListItem = IProject & {
        workDone: number; // This value represent total work done in the project in percentage
      };
      const projectList: ProjectListItem[] = [];

      for await (let project of res) {
        const totalSprints =
          await this.DBClient.projectSprintCollection().countDocuments({
            projectId: project._id,
          });

        const completedSprints =
          await this.DBClient.projectSprintCollection().countDocuments({
            projectId: project._id,
            completed: true,
          });

        const workDone =
          totalSprints > 0 ? (completedSprints / totalSprints) * 100 : 0;
        const listItme = {
          ...project,
          workDone,
        };
        projectList.push(listItme);
      }
      return reply.status(HttpStatus.SUCCESS).send(projectList);
    } catch (err) {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(mongoErrorFormatter(err));
    }
  });
}
