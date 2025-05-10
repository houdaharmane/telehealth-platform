import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { usePatients } from '../contexts/PatientContext';
import { getPatientById } from '../services/patientService';
import { Picker } from '@react-native-picker/picker';

export default function ConsultationScreen({ navigation }) {
  const { patients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [measures, setMeasures] = useState([]);
  const [measuring, setMeasuring] = useState(false);
  const intervalRef = useRef(null);

  const addMeasure = () => {
    const newMeasure = {
      date: new Date().toLocaleString(),
      temperature: (Math.random() * (37.5 - 36.1) + 36.1).toFixed(1),
      fc: Math.floor(Math.random() * (120 - 90 + 1)) + 90,
      saturation: Math.floor(Math.random() * (100 - 93 + 1)) + 93,
    };
    setMeasures(prev => {
      const updated = [newMeasure, ...prev].slice(0, 10);
      const patient = getPatientById(selectedPatient.id);
      if (patient) {
        patient.vitals = updated;
      }
      return updated;
    });
  };

  const startMeasures = () => {
    if (!selectedPatient) {
      Alert.alert('Sélectionnez un patient d\'abord');
      return;
    }
    if (measuring) return;
    setMeasuring(true);
    addMeasure();
    intervalRef.current = setInterval(addMeasure, 2000);
  };

  const stopMeasures = () => {
    setMeasuring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const last4 = measures.slice(0, 4);
    const patient = getPatientById(selectedPatient.id);
    if (patient) {
      patient.vitals = last4;
    }
    // Passe le patient à jour à la page de détails
    navigation.navigate('Détails Patient', { patient });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Choisir un patient :</Text>
        <Picker
          selectedValue={selectedPatient ? selectedPatient.id : ''}
          style={styles.picker}
          onValueChange={id => {
            const patient = patients.find(p => p.id === id);
            setSelectedPatient(patient);
            setMeasures(patient && patient.vitals ? [...patient.vitals] : []);
            setMeasuring(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
          }}
          mode={Platform.OS === 'ios' ? 'dialog' : 'dropdown'}
        >
          <Picker.Item label="Sélectionner..." value="" />
          {patients.map(p => (
            <Picker.Item key={p.id} label={p.name} value={p.id} />
          ))}
        </Picker>
      </View>

      {selectedPatient ? (
        <>
          <Text style={styles.title}>Consultation pour {selectedPatient.name}</Text>
          <TouchableOpacity style={styles.button} onPress={startMeasures}>
            <Text style={styles.buttonText}>Démarrer les mesures</Text>
          </TouchableOpacity>
          {measuring && (
            <TouchableOpacity style={[styles.button, { backgroundColor: '#dc2626', marginTop: 8 }]} onPress={stopMeasures}>
              <Text style={styles.buttonText}>Arrêter les mesures</Text>
            </TouchableOpacity>
          )}
          <Text style={{marginTop:16, fontWeight:'bold'}}>Mesures en cours :</Text>
          {measures.map((m, i) => (
            <View key={i} style={styles.measureBox}>
              <Text>Date : {m.date}</Text>
              <Text>Température : {m.temperature} °C</Text>
              <Text>Fréquence cardiaque : {m.fc} bpm</Text>
              <Text>Saturation : {m.saturation} %</Text>
            </View>
          ))}
        </>
      ) : (
        <Text style={{marginTop: 20, textAlign: 'center', color: '#888'}}>Veuillez sélectionner un patient pour démarrer les mesures.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  pickerContainer: { marginBottom: 16 },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
    color: '#222',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  label: { fontWeight: 'bold', color: '#2563eb', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  patientBox: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 10, elevation: 2 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#2563eb' },
  button: { backgroundColor: '#ff9800', padding: 14, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  measureBox: { backgroundColor: '#f1f5f9', borderRadius: 8, padding: 10, marginVertical: 6 },
});