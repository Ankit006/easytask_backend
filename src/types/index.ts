import { z } from "zod";
import { SignUpBodySchema, companyBodyValidation } from "../validation";

export type singUpBodyType = z.infer<typeof SignUpBodySchema>;
export type companyBodyType = z.infer<typeof companyBodyValidation>;

export interface BaseOptionTypes {
  prefix: string;
}

export interface AuthPluginOptionType extends BaseOptionTypes {}

export interface CompanyPluginOptionType extends BaseOptionTypes {}

export type JwtVerifyPayloadType = {
  userId: string;
  iat: number;
};
