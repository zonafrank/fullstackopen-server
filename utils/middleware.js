const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info(`Method: ${request.method}, Path: ${request.path}`);
  logger.info("Body", request.body);
  next();
};

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

module.exports = { requestLogger, errorHandler, unknownEndpoint };
