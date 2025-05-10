import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Linking, Alert } from 'react-native';
import { usePatients } from '../contexts/PatientContext';

export default function ContactScreen() {
  const { patients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('Erreur', 'Impossible de lancer l\'appel'));
  };

  const handleSMS = (phone) => {
    Linking.openURL(`sms:${phone}`).catch(() => Alert.alert('Erreur', 'Impossible d\'envoyer le SMS'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des patients</Text>
      <FlatList
        data={patients}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.patientBox}
            onPress={() => setSelectedPatient(item)}
          >
            <Text style={styles.patientName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal visible={!!selectedPatient} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Contacter {selectedPatient?.name}</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#22c55e' }]}
              onPress={() => {
                handleCall(selectedPatient.phone);
                setSelectedPatient(null);
              }}
            >
              <Text style={styles.buttonText}>Appeler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#2563eb' }]}
              onPress={() => {
                handleSMS(selectedPatient.phone);
                setSelectedPatient(null);
              }}
            >
              <Text style={styles.buttonText}>Envoyer SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelectedPatient(null)}>
              <Text style={{ color: '#dc2626' }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  patientBox: { backgroundColor: '#f1f5f9', borderRadius: 8, padding: 14, marginBottom: 10 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#2563eb' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%' },
  button: { padding: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { alignItems: 'center', marginTop: 10 },
});