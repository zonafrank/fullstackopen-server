const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/info", async (request, response, next) => {
  try {
    const persons = await Person.find({});

    response.send(
      `<p>Phonebook has info for ${
        persons.length
      } people.</p><p>${new Date()}</p>`
    );
  } catch (error) {
    next(error);
  }
});

personsRouter.get("/", async (request, response, next) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    next(error);
  }
});

personsRouter.get("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const dbResponse = await Person.findById(id);

    if (dbResponse) {
      return response.json(dbResponse);
    }
    response.status(404).end();
  } catch (error) {
    next(error);
  }
});

personsRouter.put("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const body = request.body;
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      {
        name: body.name,
        number: body.number,
      },
      { new: true, runValidators: true, context: "query" }
    );

    if (updatedPerson) {
      return response.json(updatedPerson);
    }
    response.status(404).end();
  } catch (error) {
    next(error);
  }
});

personsRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    await Person.findByIdAndRemove(id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

personsRouter.post("/api/persons", async (request, response, next) => {
  try {
    const { body } = request;

    if (!(body.name && body.number)) {
      return response
        .status(400)
        .json({ error: "You must provide a name and phone number" });
    }

    const foundPerson = await Person.find({ name: body.name });

    if (foundPerson.length) {
      return response.status(400).send({
        error: `Name must be unique. ${body.name} already exists in the database.`,
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    next(error);
  }
});

module.exports = personsRouter;
