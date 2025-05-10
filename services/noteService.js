let notes = {};

export const saveNote = (patientId, content) => {
  if (!notes[patientId]) notes[patientId] = [];
  notes[patientId].unshift({ content, date: new Date().toLocaleDateString() });
};

export const getNotesForPatient = (patientId) => notes[patientId] || [];

export function deleteNotesForPatient(patientId) {
  delete notes[patientId];
}