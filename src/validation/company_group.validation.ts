import { z } from "zod";

export const CreateCompanyGroupPostValidation = z.object({
  name: z.string(),
});
