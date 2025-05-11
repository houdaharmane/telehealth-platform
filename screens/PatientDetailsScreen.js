import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Image, ScrollView } from 'react-native';
import { usePatients } from '../contexts/PatientContext';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

  // Avatar par défaut selon le genre
  const avatar =
    patient.avatar ||
    (patient.gender === 'male'
      ? 'https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-174669.jpg?semt=ais_hybrid&w=740'
      : 'https://img.freepik.com/vecteurs-libre/femme-aux-cheveux-longs-sombres_1308-176524.jpg?semt=ais_hybrid&w=740');

  return (
    <LinearGradient colors={['#6EE7B7', '#3B82F6']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>
            <Icon name="account-search" size={18} color="#4F46E5" /> Choisir un patient :
          </Text>
          <View style={styles.pickerWrapper}>
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
        </View>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.title}>Détails du patient</Text>
        <View style={styles.card}>
          <Text style={styles.info}><Text style={styles.label}>Nom :</Text> {nom}</Text>
          <Text style={styles.info}><Text style={styles.label}>Prénom :</Text> {prenom}</Text>
          <Text style={styles.info}><Text style={styles.label}>Numéro :</Text> {patient.phone}</Text>
          <Text style={styles.info}><Text style={styles.label}>Type de maladie :</Text> {patient.type || 'Non renseigné'}</Text>
          <Text style={styles.info}>
            <Icon name={patient.gender === 'male' ? "gender-male" : "gender-female"} size={16} color="#4F46E5" /> {patient.gender === 'male' ? 'Homme' : 'Femme'}
          </Text>
        </View>
        <Text style={[styles.title, { fontSize: 18, marginTop: 24 }]}>4 dernières mesures</Text>
        {lastMeasures.length === 0 ? (
          <Text style={styles.info}>Aucune mesure enregistrée.</Text>
        ) : (
          lastMeasures.map((v, i) => (
            <View key={i} style={styles.measureBox}>
              <Text style={styles.measureDate}><Icon name="calendar" size={15} color="#2563eb" /> {v.date}</Text>
              <Text><Icon name="thermometer" size={15} color="#2563eb" /> Température : {v.temperature} °C</Text>
              <Text><Icon name="heart-pulse" size={15} color="#2563eb" /> Fréquence cardiaque : {v.fc} bpm</Text>
              <Text><Icon name="water-percent" size={15} color="#2563eb" /> Saturation : {v.saturation} %</Text>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flexGrow: 1, padding: 20, alignItems: 'center', justifyContent: 'flex-start' },
  pickerContainer: { width: '100%', marginBottom: 18 },
  pickerWrapper: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#4F46E5', overflow: 'hidden' },
  picker: { height: 50, width: '100%', color: '#222' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, borderWidth: 2, borderColor: '#4F46E5', backgroundColor: '#e0e7ff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#4F46E5', textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 18, shadowColor: '#4F46E5', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2, width: 320 },
  info: { fontSize: 16, marginBottom: 6, color: '#22223b', textAlign: 'center' },
  label: { fontWeight: 'bold', color: '#4F46E5' },
  measureBox: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, width: 320, shadowColor: '#4F46E5', shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
  measureDate: { color: '#2563eb', fontWeight: 'bold', marginBottom: 4 },
});