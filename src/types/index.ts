import { z } from "zod";
import { SignUpBodySchema } from "../validation";

export type singUpBodyType = z.infer<typeof SignUpBodySchema>;

interface BaseOptionTypes {
  prefix: string;
}

export interface AuthPluginOptionType extends BaseOptionTypes {}

export interface CompanyPluginOptionType extends BaseOptionTypes {}
