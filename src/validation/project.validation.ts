import { z } from "zod";

export const createProjectValidation = z.object({
  name: z.string(),
  projectDesc: z.string(),
  projectCost: z.string(),
  projectDeadLine: z.string(),
});

export const addProjectSprintsValidation = z.object({
  sprintIndex: z.number(),
  sprintStartDate: z.string(),
  sprintEndDate: z.string(),
});
