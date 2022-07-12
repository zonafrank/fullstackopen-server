const notesRouter = require("express").Router();
const Note = require("../models/note");

const initialNotes = [
  {
    content: "HTML is easy",
    date: "2022-07-09T07:52:29.746Z",
    important: true,
  },
  {
    content: "Browser can execute only Javascript",
    date: "2022-07-09T07:52:30.828Z",
    important: false,
  },
  {
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-07-09T07:52:30.979Z",
    important: false,
  },
  {
    content: "PUT is another HTTP Protocol method",
    date: "2022-07-09T11:17:44.327Z",
    important: true,
  },
  {
    content: "DELETE is also another HTTP method",
    date: "2022-07-09T11:19:38.771Z",
    important: false,
  },
];

(async function () {
  for (let i = 0; i < initialNotes.length; i++) {
    const note = new Note(initialNotes[i]);
    await note.save();
  }
})();

notesRouter.get("/", async (request, response, next) => {
  try {
    const notes = await Note.find({});
    response.json(notes);
  } catch (error) {
    next(error);
  }
});

notesRouter.get("/:id", async (request, response, next) => {
  try {
    const savedNote = await Note.findById(request.params.id);

    if (savedNote) {
      response.json(savedNote);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

notesRouter.delete("/:id", async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

notesRouter.post("/api/notes", async (request, response, next) => {
  try {
    if (!request.body.content) {
      return response.status(400).json({ error: "content missing" });
    }

    const body = request.body;

    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    });

    const savedNote = await note.save();
    response.json(savedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.put("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const { content, important } = request.body;
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { content, important },
      { new: true, runValidators: true, context: "query" }
    );
    response.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;
