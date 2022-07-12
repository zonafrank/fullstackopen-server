const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const notesRouter = require("./controllers/notes.js");
const personsRouter = require("./controllers/persons");
const weatherRouter = require("./controllers/weather");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");
const logger = require("./utils/logger");
const config = require("./utils/config");

logger.info("Connecting to database");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB");
    logger.error(error.message);
  });

const app = express();
app.set("json spaces", 2);
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

app.use(requestLogger);

app.use("/api/notes", notesRouter);
app.use("/api/persons", personsRouter);
app.use("/api/weather", weatherRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
