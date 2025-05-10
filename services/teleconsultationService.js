let teleconsultations = [
  {
    patientName: "Ahmed Ben Ali",
    meetingLink: "https://meet.jit.si/consultation_ahmed",
    nextConsultDate: "2024-06-15",
    type: "En ligne",
    time: "15:00",
  },
  // ... autres téléconsultations
];

export const getTeleconsultations = () => teleconsultations;

export function addTeleconsultation(consult) {
  teleconsultations.push(consult);
}

export function removeTeleconsultation(index) {
  teleconsultations.splice(index, 1);
}