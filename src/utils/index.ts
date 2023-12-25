import { ZodIssue } from "zod";

export const HttpStatus = {
  SUCCESS: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  BAD_REQUEST: 400,
  UNPROCESSABLE_ENTITY: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const MongoErrorCode = {
  DUPLICATE_KEY: 11000,
};

export function zodErrorFormatter(errors: ZodIssue[]) {
  const newErrorObj: {
    [key: string | number]: string;
  } = {};
  for (let error of errors) {
    newErrorObj[error.path[0]] = error.message;
  }
  return { error: newErrorObj };
}

export function mongoErrorFormatter(err: any) {
  const error = { error: "" };
  try {
    if (err.code === MongoErrorCode.DUPLICATE_KEY) {
      const keys = Object.keys(err.keyPattern);
      error.error = `${keys[0]} is already exist`;
      return error;
    }
  } catch (_err) {
    error.error = "There is a issue with database";
    return error;
  }
}
