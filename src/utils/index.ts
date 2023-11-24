import { ZodIssue } from "zod";

export function zodErrorFormatter(errors: ZodIssue[]) {
  const newErrorObj: {
    [key: string | number]: string;
  } = {};
  for (let error of errors) {
    newErrorObj[error.path[0]] = error.message;
  }
  return { error: newErrorObj };
}

export const HttpStatus = {
  SUCCESS: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  BAD_REQUEST: 400,
  UNPROCESSABLE_ENTITY: 422,
};
