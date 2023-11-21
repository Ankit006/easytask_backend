const environmentSchema = {
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

export default environmentSchema;
