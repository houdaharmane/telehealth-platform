import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import NoteForm from '../components/NoteForm';
import { usePatients } from '../contexts/PatientContext';
import { getNotesForPatient, saveNote } from '../services/noteService';
import { Picker } from '@react-native-picker/picker';

export default function NotesScreen() {
  const { patients } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState(patients.length > 0 ? patients[0].id : null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (selectedPatientId) {
      setNotes(getNotesForPatient(selectedPatientId));
    }
  }, [selectedPatientId]);

  const handleSaveNote = (content) => {
    saveNote(selectedPatientId, content);
    setNotes(getNotesForPatient(selectedPatientId));
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <View style={styles.container}>
      {/* Menu déroulant pour choisir le patient */}
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
      {selectedPatient && (
        <>
          <Text style={styles.title}>Bloc-notes pour {selectedPatient.name}</Text>
          <NoteForm onSave={handleSaveNote} />
          <Text style={styles.subtitle}>Historique des notes :</Text>
          <FlatList
            data={notes}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.noteCard}>
                <Text>{item.content}</Text>
                <Text style={styles.noteDate}>{item.date}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center' }}>Aucune note pour ce patient.</Text>}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  patientBox: { backgroundColor: '#f1f5f9', borderRadius: 8, padding: 14, marginBottom: 10 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#2563eb' },
  noteCard: { backgroundColor: '#f1f1f1', borderRadius: 8, padding: 10, marginVertical: 6 },
  noteDate: { color: '#888', fontSize: 12, textAlign: 'right' },
});