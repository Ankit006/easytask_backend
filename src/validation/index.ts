import { z } from "zod";

// @fastify/env schema for env files
export const environmentSchema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "string",
      default: 4000,
    },
    MONGO_URI: {
      type: "string",
    },
    DB: {
      type: "string",
    },
    TOKEN_SECRET: {
      type: "string",
    },
    COOKIE_SECRET: {
      type: "string",
    },
  },
};

export const SignUpBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  age: z.string(),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .refine((value) => value.length >= 10 && value.length <= 12, {
      message: "Phone number length must be between 10 and 12 characters",
    }),
  password: z.string().min(8),
});

export const loginBodyValidation = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const companyBody = z.object({
  name: z.string(),
  address: z.string(),
  country: z.string(),
  pinCode: z.string(),
});
