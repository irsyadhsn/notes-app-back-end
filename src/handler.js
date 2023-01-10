const { nanoid } = require('nanoid');
const notes = require('./notes');

// CREATE
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);

  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNotes = {
    id, title, tags, body, createdAt, updatedAt,
  };

  notes.push(newNotes);
  const isSuccess = notes.filter((note) => note.id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Note has been added!',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Note failed to be added!',
  });
  response.code(500);
  return response;
};

// READ
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0];
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Note not found',
  });
  response.code(404);
  return response;
};

// UPDATE
const editNotebyIdHandler = (request, h) => {
  const { id } = request.params; // mengambil nilai id
  const { title, tags, body } = request.payload; // mengambil data nilai notes
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Note has been updated!',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Failed to update the note, id not found',
  });
  response.code(404);
  return response;
};

// DELETE
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Note has been deleted',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Note failed to be deleted, Id not found',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNotebyIdHandler,
  deleteNoteByIdHandler,
};
