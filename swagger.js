const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.3" });

const doc = {
  info: {
    title: "Task Management API",
    description: "Task Management REST API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:5001",
      description: "Local Server",
    },
  ],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);