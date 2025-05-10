import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { usePatients } from '../contexts/PatientContext';
import { Picker } from '@react-native-picker/picker';

export default function PatientDetailsScreen({ route }) {
  const { patients } = usePatients();
  const initialPatient = route.params?.patient || (patients.length > 0 ? patients[0] : null);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatient ? initialPatient.id : null);

  // Synchronise le patient sélectionné avec le paramètre de navigation
  useEffect(() => {
    if (route.params?.patient) {
      setSelectedPatientId(route.params.patient.id);
    }
  }, [route.params?.patient]);

  const patient = patients.find(p => p.id === selectedPatientId);
  if (!patient) return <Text>Patient introuvable.</Text>;

  const [prenom, ...nomParts] = patient.name.split(' ');
  const nom = nomParts.join(' ');

  const lastMeasures = (patient.vitals || []).slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Choisir un patient :</Text>
        <Picker
          selectedValue={selectedPatientId}
          style={styles.picker}
          onValueChange={setSelectedPatientId}
          mode={Platform.OS === 'ios' ? 'dialog' : 'dropdown'}
        >
          {patients.map(p => (
            <Picker.Item key={p.id} label={p.name} value={p.id} />
          ))}
        </Picker>
      </View>
      <Text style={styles.title}>Détails du patient</Text>
      <Text style={styles.info}><Text style={styles.label}>Nom :</Text> {nom}</Text>
      <Text style={styles.info}><Text style={styles.label}>Prénom :</Text> {prenom}</Text>
      <Text style={styles.info}><Text style={styles.label}>Numéro :</Text> {patient.phone}</Text>
      <Text style={styles.info}><Text style={styles.label}>Type de maladie :</Text> {patient.type || 'Non renseigné'}</Text>
      <Text style={[styles.title, {fontSize:18, marginTop:20}]}>4 dernières mesures</Text>
      {lastMeasures.length === 0 ? (
        <Text style={styles.info}>Aucune mesure enregistrée.</Text>
      ) : (
        lastMeasures.map((v, i) => (
          <View key={i} style={styles.measureBox}>
            <Text style={styles.measureDate}>{v.date}</Text>
            <Text>Température : {v.temperature} °C</Text>
            <Text>Fréquence cardiaque : {v.fc} bpm</Text>
            <Text>Saturation : {v.saturation} %</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
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
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  info: { fontSize: 16, marginBottom: 6 },
  label: { fontWeight: 'bold', color: '#2563eb' },
  measureBox: { backgroundColor: '#f1f5f9', borderRadius: 8, padding: 10, marginVertical: 6 },
  measureDate: { color: '#2563eb', fontWeight: 'bold' },
});