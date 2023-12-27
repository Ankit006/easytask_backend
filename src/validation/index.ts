import { ObjectId } from "@fastify/mongodb";
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
    APP_URL: {
      type: "string",
    },
    FRONTEND_URL: {
      type: "string",
    },
    IMAGEKIT_PUBLIC_KEY: {
      type: "string",
    },
    IMAGEKIT_PRIVATE_KEY: {
      type: "string",
    },
    IMAGEKIT_URL_ENDPOINT: {
      type: "string",
    },
  },
};

export interface BaseOptionTypes {
  prefix: string;
}
const FileFormField = z.object({
  type: z.string(),
  fieldname: z.string(),
  mimetype: z.string(),
  value: z.string(),
});

export const SignUpBodySchema = z.object({
  firstName: FileFormField,
  lastName: FileFormField,
  age: FileFormField,
  email: FileFormField,
  phoneNumber: FileFormField,
  password: FileFormField,
  file: z.any(),
});

export const loginBodyValidation = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const companyBodyValidation = z.object({
  name: z.string(),
  address: z.string(),
  country: z.string(),
  pinCode: z.string(),
});
