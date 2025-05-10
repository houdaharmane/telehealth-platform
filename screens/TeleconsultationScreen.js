import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Modal, TextInput, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTeleconsultations, addTeleconsultation, removeTeleconsultation } from '../services/teleconsultationService';
import { addHistory, addCancelled } from '../services/historyService';
import { usePatients } from '../contexts/PatientContext';

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
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={openModal}>
        <Text style={styles.addBtnText}>+ Ajouter une prochaine consultation</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Prochaines consultations</Text>
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
          <View style={styles.modalContent}>
            {consultToShow && (
              <>
                <Text style={styles.title}>Démarrer la réunion</Text>
                <Text style={styles.name}>{consultToShow.patientName}</Text>
                <Text>Date : {consultToShow.nextConsultDate}</Text>
                <Text>Heure : {consultToShow.time || '-'}</Text>
                <Text>Type : {consultToShow.type}</Text>
                {consultToShow.meetingLink && (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => Linking.openURL(consultToShow.meetingLink)}
                  >
                    <Text style={styles.buttonText}>Démarrer la réunion en ligne</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.button, { backgroundColor: '#22c55e' }]} onPress={finalizeMeeting}>
                  <Text style={styles.buttonText}>Finaliser la réunion</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#dc2626' }]} onPress={cancelMeeting}>
                  <Text style={styles.buttonText}>Annuler la réunion</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowConsultModal(false)} style={styles.cancelBtn}>
                  <Text style={{ color: '#2563eb' }}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  addBtn: { backgroundColor: '#2563eb', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  item: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, marginBottom: 10 },
  name: { fontWeight: 'bold', fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 8, borderRadius: 6, marginTop: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%', maxHeight: '90%' },
  modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12, textAlign: 'center' },
  patientBox: { backgroundColor: '#f1f5f9', borderRadius: 8, padding: 14, marginBottom: 10 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#2563eb' },
  cancelBtn: { alignItems: 'center', marginTop: 10 },
  dateBtn: { backgroundColor: '#e0e7ff', borderRadius: 6, padding: 10, marginBottom: 8, alignItems: 'center' },
  typeBtn: { flex: 1, borderWidth: 1, borderColor: '#2563eb', borderRadius: 6, padding: 10, marginHorizontal: 4, alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#2563eb' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8 },
});