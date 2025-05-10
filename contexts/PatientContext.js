import React, { createContext, useContext, useState } from 'react';
import * as patientService from '../services/patientService';
import * as noteService from '../services/noteService';

const PatientContext = createContext();

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState(patientService.getPatients());

  const addPatient = (data) => {
    patientService.addPatient(data);
    setPatients(patientService.getPatients());
  };

  const updatePatient = (id, data) => {
    patientService.updatePatient(id, data);
    setPatients(patientService.getPatients());
  };

  const deletePatient = (id) => {
    patientService.deletePatient(id);
    noteService.deleteNotesForPatient(id); // à ajouter dans noteService.js
    setPatients(patientService.getPatients());
  };

  return (
    <PatientContext.Provider value={{ patients, addPatient, updatePatient, deletePatient }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  return useContext(PatientContext);
}