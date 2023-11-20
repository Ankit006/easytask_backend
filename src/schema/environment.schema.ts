const environmentSchema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "string",
    },
  },
};

export default environmentSchema;
