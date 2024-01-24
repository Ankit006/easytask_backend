import { ObjectId } from "@fastify/mongodb";
import { z } from "zod";

export const createProjectValidation = z.object({
  name: z.string(),
  projectDesc: z.string(),
  projectCost: z.string(),
  projectDeadLine: z.string(),
});
