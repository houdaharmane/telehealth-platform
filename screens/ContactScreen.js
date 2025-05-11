import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Linking, Alert } from 'react-native';
import { usePatients } from '../contexts/PatientContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    <LinearGradient colors={['#6EE7B7', '#3B82F6']} style={styles.gradient}>
      <View style={styles.container}>
        <Icon name="account-multiple" size={40} color="#4F46E5" style={{ marginBottom: 10 }} />
        <Text style={styles.title}>Liste des patients</Text>
        <FlatList
          data={patients}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.patientBox}
              onPress={() => setSelectedPatient(item)}
              activeOpacity={0.85}
            >
              <Icon name="account" size={22} color="#4F46E5" style={{ marginRight: 8 }} />
              <Text style={styles.patientName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun patient trouvé.</Text>}
        />
        <Modal visible={!!selectedPatient} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                <Icon name="phone" size={22} color="#4F46E5" /> Contacter {selectedPatient?.name}
              </Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#22c55e' }]}
                onPress={() => {
                  handleCall(selectedPatient.phone);
                  setSelectedPatient(null);
                }}
              >
                <Icon name="phone" size={18} color="#fff" />
                <Text style={styles.buttonText}>Appeler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#2563eb' }]}
                onPress={() => {
                  handleSMS(selectedPatient.phone);
                  setSelectedPatient(null);
                }}
              >
                <Icon name="message-text" size={18} color="#fff" />
                <Text style={styles.buttonText}>Envoyer SMS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelectedPatient(null)}>
                <Text style={{ color: '#dc2626', fontWeight: 'bold' }}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'flex-start' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16, color: '#4F46E5', textAlign: 'center' },
  patientBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    width: 320,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#4F46E5' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#4F46E5', marginBottom: 18, textAlign: 'center' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 6 },
  cancelBtn: { alignItems: 'center', marginTop: 16 },
});