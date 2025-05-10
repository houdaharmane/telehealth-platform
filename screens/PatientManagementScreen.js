import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Pressable } from 'react-native';
import { usePatients } from '../contexts/PatientContext';

export default function PatientManagementScreen() {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('');
  const [gender, setGender] = useState(null); // Aucun genre sélectionné par défaut
  const [editId, setEditId] = useState(null);

  const handleAddOrUpdate = () => {
    if (!prenom.trim() || !nom.trim() || !phone.trim() || !type.trim() || !gender) {
      Alert.alert('Erreur', 'Tous les champs sont requis');
      return;
    }
    const avatar = gender === 'male'
      ? 'https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-174669.jpg?semt=ais_hybrid&w=740'
      : 'https://img.freepik.com/vecteurs-libre/femme-aux-cheveux-longs-sombres_1308-176524.jpg?semt=ais_hybrid&w=740';

    const patientData = {
      name: `${prenom} ${nom}`,
      phone,
      type,
      gender,
      avatar,
    };
    if (editId) {
      updatePatient(editId, patientData);
      setEditId(null);
    } else {
      addPatient(patientData);
    }
    setPrenom('');
    setNom('');
    setPhone('');
    setType('');
    setGender(null);
  };

  const handleEdit = (patient) => {
    const [prenomPart, ...nomParts] = patient.name.split(' ');
    setPrenom(prenomPart);
    setNom(nomParts.join(' '));
    setPhone(patient.phone);
    setType(patient.type || '');
    setGender(patient.gender || null);
    setEditId(patient.id);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer ce patient ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deletePatient(id);
            if (editId === id) {
              setEditId(null);
              setPrenom('');
              setNom('');
              setPhone('');
              setType('');
              setGender(null);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des patients</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Type de maladie"
          value={type}
          onChangeText={setType}
        />
        <Text style={styles.label}>Genre</Text>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <Pressable
            style={[
              styles.radio,
              gender === 'female' && styles.radioSelected
            ]}
            onPress={() => setGender('female')}
          >
            <Text style={gender === 'female' ? styles.radioTextSelected : styles.radioText}>Femme</Text>
          </Pressable>
          <Pressable
            style={[
              styles.radio,
              gender === 'male' && styles.radioSelected
            ]}
            onPress={() => setGender('male')}
          >
            <Text style={gender === 'male' ? styles.radioTextSelected : styles.radioText}>Homme</Text>
          </Pressable>
        </View>
        <TouchableOpacity
          style={[styles.button, !gender && { backgroundColor: '#a5b4fc' }]}
          onPress={handleAddOrUpdate}
          disabled={!gender}
        >
          <Text style={styles.buttonText}>{editId ? 'Modifier' : 'Ajouter'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={patients}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const [prenomPart, ...nomParts] = item.name.split(' ');
          const avatar =
            item.avatar ||
            (item.gender === 'male'
              ? 'https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-174669.jpg?semt=ais_hybrid&w=740'
              : 'https://img.freepik.com/vecteurs-libre/femme-aux-cheveux-longs-sombres_1308-176524.jpg?semt=ais_hybrid&w=740');
          return (
            <View style={styles.patientRow}>
              <Image source={{ uri: avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.patientText}>
                  <Text style={styles.label}>Prénom :</Text> {prenomPart}
                </Text>
                <Text style={styles.patientText}>
                  <Text style={styles.label}>Nom :</Text> {nomParts.join(' ')}
                </Text>
                <Text style={styles.patientText}>
                  <Text style={styles.label}>Téléphone :</Text> {item.phone}
                </Text>
                <Text style={styles.patientText}>
                  <Text style={styles.label}>Maladie :</Text> {item.type || 'Non renseigné'}
                </Text>
                <Text style={styles.patientText}>
                  <Text style={styles.label}>Genre :</Text> {item.gender === 'male' ? 'Homme' : 'Femme'}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                  <Text style={styles.editText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  form: { marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8 },
  button: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  patientRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, backgroundColor: '#f1f5f9', borderRadius: 8, padding: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#e5e7eb' },
  patientText: { fontSize: 15, marginBottom: 2 },
  label: { fontWeight: 'bold', color: '#2563eb' },
  actions: { flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', marginLeft: 10 },
  editBtn: { backgroundColor: '#e0e7ff', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12, marginBottom: 6 },
  deleteBtn: { backgroundColor: '#fee2e2', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12 },
  editText: { color: '#2563eb', fontWeight: 'bold' },
  deleteText: { color: '#dc2626', fontWeight: 'bold' },
  radio: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  radioSelected: {
    backgroundColor: '#2563eb',
  },
  radioText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});