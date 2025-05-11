import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Modal, TextInput, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTeleconsultations, addTeleconsultation, removeTeleconsultation } from '../services/teleconsultationService';
import { addHistory, addCancelled } from '../services/historyService';
import { usePatients } from '../contexts/PatientContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function generateMeetingLink(patientName, date) {
  const cleanName = patientName.replace(/\s+/g, '_').replace(/[^\w]/g, '');
  return `https://meet.jit.si/${cleanName}_${date}`;
}

export default function TeleconsultationScreen({ route, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState('En ligne');
  const [time, setTime] = useState('');
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultToShow, setConsultToShow] = useState(null);
  const { patients } = usePatients();
  const [refresh, setRefresh] = useState(false);

  let teleconsultations = getTeleconsultations();

  const openModal = () => {
    setModalVisible(true);
    setStep(0);
    setSelectedPatient(null);
    setDate(new Date());
    setType('En ligne');
    setTime('');
  };

  const handleAddConsult = () => {
    if (!selectedPatient) {
      Alert.alert('Erreur', 'Veuillez choisir un patient.');
      return;
    }
    if (!time.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir l\'heure de la consultation.');
      return;
    }
    let meetingLink;
    if (type === 'En ligne') {
      meetingLink = generateMeetingLink(selectedPatient.name, date.toISOString().slice(0, 10));
    }
    addTeleconsultation({
      patientName: selectedPatient.name,
      nextConsultDate: date.toISOString().slice(0, 10),
      type,
      meetingLink,
      time,
    });
    setModalVisible(false);
    setRefresh(r => !r);
  };

  // Finaliser la réunion
  const finalizeMeeting = () => {
    if (consultToShow) {
      addHistory({
        date: consultToShow.nextConsultDate,
        name: consultToShow.patientName,
        type: consultToShow.type,
        notes: 'Réunion finalisée',
      });
      removeTeleconsultation(teleconsultations.indexOf(consultToShow));
      setShowConsultModal(false);
      setRefresh(r => !r);
      navigation.navigate('Accueil');
    }
  };

  // Annuler la réunion
  const cancelMeeting = () => {
    if (consultToShow) {
      addCancelled({
        date: consultToShow.nextConsultDate,
        name: consultToShow.patientName,
        type: consultToShow.type,
        notes: 'Consultation annulée',
      });
      removeTeleconsultation(teleconsultations.indexOf(consultToShow));
      setShowConsultModal(false);
      setRefresh(r => !r);
      navigation.navigate('Accueil');
    }
  };

  return (
    <LinearGradient colors={['#6EE7B7', '#3B82F6']} style={styles.gradient}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.addBtn} onPress={openModal}>
          <Icon name="plus-circle" size={22} color="#fff" />
          <Text style={styles.addBtnText}>Ajouter une prochaine consultation</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          <Icon name="calendar-month" size={24} color="#4F46E5" /> Prochaines consultations
        </Text>
        <FlatList
          data={teleconsultations}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}>{item.patientName}</Text>
              <Text>Prochaine consultation : {item.nextConsultDate}</Text>
              <Text>Type : {item.type || (item.meetingLink ? 'En ligne' : 'Présentiel')}</Text>
              {item.meetingLink && (
                <Text style={{ color: '#2563eb', fontSize: 12 }}>Lien : {item.meetingLink}</Text>
              )}
              {item.time && (
                <Text style={{ color: '#2563eb', fontSize: 12 }}>Heure : {item.time}</Text>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setConsultToShow(item);
                  setShowConsultModal(true);
                }}
              >
                <Text style={styles.buttonText}>Démarrer / Gérer</Text>
              </TouchableOpacity>
            </View>
          )}
          extraData={refresh}
        />

        {/* Modal ajout consultation */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {step === 0 && (
                <>
                  <Text style={styles.modalTitle}>Choisissez un patient</Text>
                  <FlatList
                    data={patients}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.patientBox} onPress={() => { setSelectedPatient(item); setStep(1); }}>
                        <Text style={styles.patientName}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                    <Text style={{ color: '#dc2626' }}>Annuler</Text>
                  </TouchableOpacity>
                </>
              )}
              {step === 1 && (
                <>
                  <Text style={styles.modalTitle}>Nouvelle consultation pour {selectedPatient.name}</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBtn}>
                    <Text>Choisir la date : {date.toISOString().slice(0, 10)}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(_, d) => { setShowDatePicker(false); if (d) setDate(d); }}
                    />
                  )}
                  <View style={{ flexDirection: 'row', marginVertical: 8 }}>
                    <TouchableOpacity
                      style={[styles.typeBtn, type === 'En ligne' && styles.typeBtnActive]}
                      onPress={() => setType('En ligne')}
                    >
                      <Text style={{ color: type === 'En ligne' ? '#fff' : '#2563eb' }}>En ligne</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.typeBtn, type === 'Présentiel' && styles.typeBtnActive]}
                      onPress={() => setType('Présentiel')}
                    >
                      <Text style={{ color: type === 'Présentiel' ? '#fff' : '#2563eb' }}>Présentiel</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Heure de la consultation (ex: 14:00)"
                    value={time}
                    onChangeText={setTime}
                  />
                  <TouchableOpacity style={styles.button} onPress={handleAddConsult}>
                    <Text style={styles.buttonText}>Enregistrer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                    <Text style={{ color: '#dc2626' }}>Annuler</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Modal consultation sélectionnée */}
        <Modal visible={showConsultModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.meetingModalContent}>
              {consultToShow && (
                <>
                  <View style={styles.meetingHeader}>
                    <Icon name="video" size={32} color="#4F46E5" style={{ marginBottom: 8 }} />
                    <Text style={styles.meetingTitle}>Démarrer la réunion</Text>
                  </View>
                  <View style={styles.meetingInfoBox}>
                    <Text style={styles.meetingPatientName}>{consultToShow.patientName}</Text>
                    <View style={styles.meetingRow}>
                      <Icon name="calendar" size={18} color="#2563eb" />
                      <Text style={styles.meetingInfoText}>Date : <Text style={styles.meetingInfoValue}>{consultToShow.nextConsultDate}</Text></Text>
                    </View>
                    <View style={styles.meetingRow}>
                      <Icon name="clock-outline" size={18} color="#2563eb" />
                      <Text style={styles.meetingInfoText}>Heure : <Text style={styles.meetingInfoValue}>{consultToShow.time || '-'}</Text></Text>
                    </View>
                    <View style={styles.meetingRow}>
                      <Icon name="stethoscope" size={18} color="#2563eb" />
                      <Text style={styles.meetingInfoText}>Type : <Text style={styles.meetingInfoValue}>{consultToShow.type}</Text></Text>
                    </View>
                  </View>
                  {consultToShow.meetingLink && (
                    <TouchableOpacity
                      style={[styles.meetingActionBtn, { backgroundColor: '#4F46E5' }]}
                      onPress={() => Linking.openURL(consultToShow.meetingLink)}
                    >
                      <Icon name="video-plus" size={20} color="#fff" />
                      <Text style={styles.meetingActionText}>Démarrer la réunion en ligne</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={[styles.meetingActionBtn, { backgroundColor: '#22c55e' }]} onPress={finalizeMeeting}>
                    <Icon name="check-circle" size={20} color="#fff" />
                    <Text style={styles.meetingActionText}>Finaliser la réunion</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.meetingActionBtn, { backgroundColor: '#dc2626' }]} onPress={cancelMeeting}>
                    <Icon name="close-circle" size={20} color="#fff" />
                    <Text style={styles.meetingActionText}>Annuler la réunion</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowConsultModal(false)} style={styles.meetingCloseBtn}>
                    <Text style={{ color: '#2563eb', fontWeight: 'bold', fontSize: 16 }}>Fermer</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#4F46E5' },
  addBtn: { flexDirection: 'row', backgroundColor: '#4F46E5', padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#4F46E5', shadowOpacity: 0.13, shadowRadius: 8, elevation: 2, gap: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  item: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: '#4F46E5', shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
  name: { fontWeight: 'bold', fontSize: 16, color: '#4F46E5' },
  button: { backgroundColor: '#4F46E5', padding: 10, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '90%', maxHeight: '90%' },
  modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12, textAlign: 'center', color: '#4F46E5' },
  patientBox: { backgroundColor: '#f1f5f9', borderRadius: 10, padding: 14, marginBottom: 10 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#4F46E5' },
  cancelBtn: { alignItems: 'center', marginTop: 10 },
  dateBtn: { backgroundColor: '#e0e7ff', borderRadius: 8, padding: 10, marginBottom: 8, alignItems: 'center' },
  typeBtn: { flex: 1, borderWidth: 1, borderColor: '#4F46E5', borderRadius: 8, padding: 10, marginHorizontal: 4, alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#4F46E5' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, marginBottom: 10, backgroundColor: '#f3f4f6', fontSize: 16 },

  // Amélioration du design du modal réunion
  meetingModalContent: { backgroundColor: '#fff', borderRadius: 18, padding: 24, width: '92%', maxWidth: 400, alignSelf: 'center', alignItems: 'center', shadowColor: '#4F46E5', shadowOpacity: 0.13, shadowRadius: 12, elevation: 4 },
  meetingHeader: { alignItems: 'center', marginBottom: 10 },
  meetingTitle: { fontSize: 22, fontWeight: 'bold', color: '#4F46E5', marginBottom: 2 },
  meetingInfoBox: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 16, marginBottom: 18, width: '100%' },
  meetingPatientName: { fontSize: 18, fontWeight: 'bold', color: '#2563eb', marginBottom: 8, textAlign: 'center' },
  meetingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  meetingInfoText: { fontSize: 15, color: '#22223b' },
  meetingInfoValue: { fontWeight: 'bold', color: '#4F46E5' },
  meetingActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 10, width: '100%' },
  meetingActionText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  meetingCloseBtn: { alignItems: 'center', marginTop: 8 },
});