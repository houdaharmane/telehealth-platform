// Exemple de stockage en mémoire (à adapter selon ton app)
const measuresDB = {
  // idPatient: [ { date: '2024-05-01', value: 120 }, ... ]
};

export function getPatientMeasures(patientId) {
  return measuresDB[patientId] ? [...measuresDB[patientId]].reverse() : [];
}

// Pour ajouter une mesure (optionnel)
export function addPatientMeasure(patientId, measure) {
  if (!measuresDB[patientId]) measuresDB[patientId] = [];
  measuresDB[patientId].push(measure);
}