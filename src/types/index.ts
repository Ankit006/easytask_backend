import { z } from "zod";
import {
  BaseOptionTypes,
  SignUpBodySchema,
  companyBodyValidation,
} from "../validation";

export type singUpBodyType = z.infer<typeof SignUpBodySchema>;
export type companyBodyType = z.infer<typeof companyBodyValidation>;

export interface AuthPluginOptionType extends BaseOptionTypes {}

export interface CompanyPluginOptionType extends BaseOptionTypes {}

export type JwtVerifyPayloadType = {
  userId: string;
  iat: number;
};
