import { z } from "zod";
import { SignUpBodySchema } from "../validation";

export type singUpBodyType = z.infer<typeof SignUpBodySchema>;

export type AuthPlugInOptionType = {
  prefix: string;
};
