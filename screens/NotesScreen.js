import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import NoteForm from '../components/NoteForm';
import { usePatients } from '../contexts/PatientContext';
import { getNotesForPatient, saveNote } from '../services/noteService';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    <LinearGradient colors={['#6EE7B7', '#3B82F6']} style={styles.gradient}>
      <FlatList
        data={selectedPatient ? notes : []}
        keyExtractor={(_, i) => i.toString()}
        ListHeaderComponent={
          <View>
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
            {selectedPatient && (
              <>
                <Text style={styles.title}>
                  <Icon name="notebook" size={22} color="#4F46E5" /> Notes pour {selectedPatient.name}
                </Text>
                <View style={styles.formBox}>
                  <NoteForm onSave={handleSaveNote} />
                </View>
                <Text style={styles.subtitle}>Historique des notes :</Text>
              </>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteContent}>{item.content}</Text>
            <Text style={styles.noteDate}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={
          selectedPatient ? (
            <Text style={{ color: '#888', textAlign: 'center' }}>Aucune note pour ce patient.</Text>
          ) : null
        }
        contentContainerStyle={styles.container}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20, alignItems: 'center', justifyContent: 'flex-start' },
  pickerContainer: { width: '100%', marginBottom: 18 },
  pickerWrapper: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#4F46E5', overflow: 'hidden' },
  picker: { height: 50, width: '100%', color: '#222' },
  label: { fontWeight: 'bold', color: '#4F46E5', marginBottom: 4, fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: '#4F46E5' },
  subtitle: { fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#2563eb', fontSize: 16 },
  formBox: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 12, shadowColor: '#4F46E5', shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
  noteCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginVertical: 6, shadowColor: '#4F46E5', shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
  noteContent: { color: '#22223b', fontSize: 15, marginBottom: 4 },
  noteDate: { color: '#888', fontSize: 12, textAlign: 'right' },
});