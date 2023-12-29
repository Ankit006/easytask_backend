import { z } from "zod";

export const searchUserValidation = z.object({
  email: z.string().email({ message: "Please provide valid email" }),
});
