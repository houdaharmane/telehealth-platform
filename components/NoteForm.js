import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function NoteForm({ onSave }) {
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!note.trim()) {
      Alert.alert('Erreur', 'La note est vide');
      return;
    }
    onSave(note);
    setNote('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écrire une nouvelle note</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={5}
        value={note}
        onChangeText={setNote}
        placeholder="Saisissez votre note ici..."
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#0077cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});