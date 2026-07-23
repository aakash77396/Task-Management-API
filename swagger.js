const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Task Management API",
    description: "Task Management REST API",
  },
  host: "localhost:5001",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);