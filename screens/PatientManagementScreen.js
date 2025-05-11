import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { usePatients } from '../contexts/PatientContext';

export default function PatientManagementScreen() {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('');
  const [gender, setGender] = useState(null);
  const [editId, setEditId] = useState(null);
  const [buttonAnim] = useState(new Animated.Value(1));

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

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  return (
    <LinearGradient colors={['#6EE7B7', '#3B82F6']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>
          <Icon name="account-group" size={28} color="#4F46E5" /> Gestion des patients
        </Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={prenom}
            onChangeText={setPrenom}
            placeholderTextColor="#a1a1aa"
          />
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={nom}
            onChangeText={setNom}
            placeholderTextColor="#a1a1aa"
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#a1a1aa"
          />
          <TextInput
            style={styles.input}
            placeholder="Type de maladie"
            value={type}
            onChangeText={setType}
            placeholderTextColor="#a1a1aa"
          />
          <Text style={styles.label}>Genre</Text>
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <Pressable
              style={[
                styles.radio,
                gender === 'female' && styles.radioSelected
              ]}
              onPress={() => setGender('female')}
            >
              <Icon name="gender-female" size={22} color={gender === 'female' ? "#fff" : "#4F46E5"} />
              <Text style={gender === 'female' ? styles.radioTextSelected : styles.radioText}>Femme</Text>
            </Pressable>
            <Pressable
              style={[
                styles.radio,
                gender === 'male' && styles.radioSelected
              ]}
              onPress={() => setGender('male')}
            >
              <Icon name="gender-male" size={22} color={gender === 'male' ? "#fff" : "#4F46E5"} />
              <Text style={gender === 'male' ? styles.radioTextSelected : styles.radioText}>Homme</Text>
            </Pressable>
          </View>
          <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
            <TouchableOpacity
              style={[styles.button, !gender && { backgroundColor: '#a5b4fc' }]}
              onPress={() => { animateButton(); handleAddOrUpdate(); }}
              disabled={!gender}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                <Icon name={editId ? "content-save-edit" : "plus-circle"} size={20} color="#fff" /> {editId ? 'Modifier' : 'Ajouter'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
                    <Icon name="phone" size={14} color="#4F46E5" /> {item.phone}
                  </Text>
                  <Text style={styles.patientText}>
                    <Icon name="heart-pulse" size={14} color="#4F46E5" /> {item.type || 'Non renseigné'}
                  </Text>
                  <Text style={styles.patientText}>
                    <Icon name={item.gender === 'male' ? "gender-male" : "gender-female"} size={14} color="#4F46E5" /> {item.gender === 'male' ? 'Homme' : 'Femme'}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                    <Icon name="pencil" size={18} color="#4F46E5" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                    <Icon name="delete" size={18} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flexGrow: 1, padding: 20, alignItems: 'center', justifyContent: 'flex-start' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 18, textAlign: 'center', color: '#4F46E5', letterSpacing: 1 },
  form: { marginBottom: 24, backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#4F46E5', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, width: 340, maxWidth: '100%' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, marginBottom: 10, backgroundColor: '#f3f4f6', fontSize: 16 },
  button: { backgroundColor: '#4F46E5', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 8, shadowColor: '#4F46E5', shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  patientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, backgroundColor: '#f8fafc', borderRadius: 14, padding: 12, shadowColor: '#4F46E5', shadowOpacity: 0.06, shadowRadius: 6, elevation: 1, width: 340, maxWidth: '100%' },
  avatar: { width: 54, height: 54, borderRadius: 27, marginRight: 14, backgroundColor: '#e5e7eb' },
  patientText: { fontSize: 15, marginBottom: 2, color: '#444' },
  label: { fontWeight: 'bold', color: '#4F46E5' },
  actions: { flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', marginLeft: 10 },
  editBtn: { backgroundColor: '#e0e7ff', borderRadius: 8, padding: 8, marginBottom: 6 },
  deleteBtn: { backgroundColor: '#fee2e2', borderRadius: 8, padding: 8 },
  radio: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#4F46E5',
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    gap: 6,
  },
  radioSelected: {
    backgroundColor: '#4F46E5',
  },
  radioText: {
    color: '#4F46E5',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});