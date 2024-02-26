import { FastifyInstance } from "fastify";
import {
  addProjectSprintsValidation,
  createProjectValidation,
} from "../validation/project.validation";
import { HttpStatus, mongoErrorFormatter, zodErrorFormatter } from "../utils";
import { IProject, IProjectSprint } from "../database/database.schema";
import { ObjectId } from "@fastify/mongodb";

export default function projectRoutes(fastify: FastifyInstance) {
  // create a new project
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

  // get list of projects
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

  // get single project details
  fastify.get("/:projectId", async function (request, reply) {
    const { projectId } = request.params as { projectId: string };
    if (!ObjectId.isValid(projectId)) {
      return reply
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send({ error: "Please provide a valid project id" });
    }

    try {
      const res = await this.DBClient.projectCollection().findOne<IProject>({
        _id: new ObjectId(projectId),
      });
      if (res) {
        return reply.status(HttpStatus.SUCCESS).send(res);
      } else {
        return reply
          .status(HttpStatus.NOT_FOUND)
          .send({ error: "No project found" });
      }
    } catch (err) {
      return reply
        .status(HttpStatus.SERVER_ERROR)
        .send(mongoErrorFormatter(err));
    }
  });

  // update project details

  fastify.put("/:projectId", async function (request, reply) {
    const { projectId } = request.params as { projectId: string };
    if (!ObjectId.isValid(projectId)) {
      return reply
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send({ error: "Please provide a valid project id" });
    }

    const validData = createProjectValidation.safeParse(request.body);
    if (!validData.success) {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(zodErrorFormatter(validData.error.errors));
    }

    try {
      const res = await this.DBClient.projectCollection().updateOne(
        { _id: new ObjectId(projectId) },
        {
          $set: {
            ...validData.data,
          },
        }
      );
      if (res.matchedCount === 1) {
        reply
          .status(HttpStatus.SUCCESS)
          .send({ message: "Project is updated" });
      } else {
        reply.status(HttpStatus.NOT_FOUND).send({ error: "Project not found" });
      }
    } catch (err) {
      return reply
        .status(HttpStatus.SERVER_ERROR)
        .send(mongoErrorFormatter(err));
    }
  });

  fastify.post("/:projectId/sprints", async function (request, reply) {
    const { projectId } = request.params as { projectId: string };
    if (!ObjectId.isValid(projectId)) {
      return reply
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send({ error: "Please provide a valid project id" });
    }
    const validData = addProjectSprintsValidation.safeParse(request.body);
    if (!validData.success) {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(zodErrorFormatter(validData.error.errors));
    }
    const sprintObj: Partial<IProjectSprint> = {
      projectId: projectId,
      sprintIndex: validData.data.sprintIndex,
      sprintStartDate: validData.data.sprintStartDate,
      sprintEndDate: validData.data.sprintEndDate,
      tasks: [],
    };

    try {
      await this.DBClient.projectSprintCollection().insertOne(sprintObj);
      return reply
        .status(HttpStatus.CREATED)
        .send({ message: "Sprint is added" });
    } catch (err) {
      return reply
        .status(HttpStatus.SERVER_ERROR)
        .send(mongoErrorFormatter(err));
    }
  });
}
