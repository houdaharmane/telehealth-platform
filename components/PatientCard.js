import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

export default function PatientCard({ patient, onPress }) {
  const avatar =
    patient.avatar ||
    (patient.gender === 'male'
      ? 'https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-174669.jpg?semt=ais_hybrid&w=740'
      : 'https://img.freepik.com/vecteurs-libre/femme-aux-cheveux-longs-sombres_1308-176524.jpg?semt=ais_hybrid&w=740');

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(patient)}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <Text style={styles.name}>{patient.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, alignItems: 'center', margin: 8, backgroundColor: '#fff', borderRadius: 10, padding: 12, elevation: 2 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 8, backgroundColor: '#e5e7eb' },
  name: { fontWeight: 'bold', fontSize: 16, color: '#2563eb' },
});