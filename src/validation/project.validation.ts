import { ObjectId } from "@fastify/mongodb";
import { z } from "zod";

export const createProjectValidation = z.object({
  name: z.string(),
  companyId: z.string().refine((data) => ObjectId.isValid(data), {
    message: "Please provide valid company id",
  }),
  projectDesc: z.string(),
  projectCost: z.string(),
  projectDeadLine: z.string(),
});
