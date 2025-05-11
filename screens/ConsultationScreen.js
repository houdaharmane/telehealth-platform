import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import { usePatients } from '../contexts/PatientContext';
import { getPatientById } from '../services/patientService';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    navigation.navigate('Détails Patient', { patient });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <LinearGradient colors={['#6EE7B7', '#3B82F6']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>
            <Icon name="account-search" size={20} color="#4F46E5" /> Choisir un patient :
          </Text>
          <View style={styles.pickerWrapper}>
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
        </View>

        {selectedPatient ? (
          <>
            <Text style={styles.title}>
              <Icon name="stethoscope" size={24} color="#4F46E5" /> Consultation pour {selectedPatient.name}
            </Text>
            <TouchableOpacity style={styles.button} onPress={startMeasures} activeOpacity={0.85}>
              <Icon name="play-circle" size={20} color="#fff" /> 
              <Text style={styles.buttonText}> Démarrer les mesures</Text>
            </TouchableOpacity>
            {measuring && (
              <TouchableOpacity style={[styles.button, { backgroundColor: '#dc2626', marginTop: 8 }]} onPress={stopMeasures} activeOpacity={0.85}>
                <Icon name="stop-circle" size={20} color="#fff" /> 
                <Text style={styles.buttonText}> Arrêter les mesures</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.subtitle}>Mesures en cours :</Text>
            {measures.map((m, i) => (
              <View key={i} style={styles.measureBox}>
                <Text style={styles.measureText}><Icon name="calendar" size={16} color="#3B82F6" /> {m.date}</Text>
                <Text style={styles.measureText}><Icon name="thermometer" size={16} color="#3B82F6" /> Température : {m.temperature} °C</Text>
                <Text style={styles.measureText}><Icon name="heart-pulse" size={16} color="#3B82F6" /> Fréquence cardiaque : {m.fc} bpm</Text>
                <Text style={styles.measureText}><Icon name="water-percent" size={16} color="#3B82F6" /> Saturation : {m.saturation} %</Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.infoText}>Veuillez sélectionner un patient pour démarrer les mesures.</Text>
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
  label: { fontWeight: 'bold', color: '#4F46E5', marginBottom: 4, fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 18, textAlign: 'center', color: '#4F46E5' },
  subtitle: { fontWeight: 'bold', color: '#2563eb', marginTop: 18, marginBottom: 8, fontSize: 17 },
  button: { flexDirection: 'row', backgroundColor: '#4F46E5', padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 12, shadowColor: '#4F46E5', shadowOpacity: 0.13, shadowRadius: 8, elevation: 2, gap: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  measureBox: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, width: 320, shadowColor: '#4F46E5', shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
  measureText: { color: '#22223b', fontSize: 15, marginBottom: 2 },
  infoText: { marginTop: 20, textAlign: 'center', color: '#888', fontSize: 16 },
});