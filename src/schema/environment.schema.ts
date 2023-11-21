const environmentSchema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "string",
    },
    MONGO_URI: {
      type: "string",
    },
  },
};

export default environmentSchema;
