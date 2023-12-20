import { z } from "zod";

const FileFormField = z.object({
  type: z.string(),
  fieldname: z.string(),
  mimetype: z.string(),
  value: z.string(),
});

export const CompanyFileFormValidation = z.object({
  name: FileFormField,
  address: FileFormField,
  pinCode: FileFormField,
  country: FileFormField,
  file: z.any(),
});
