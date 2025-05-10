import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import PatientCard from '../components/PatientCard';
import { usePatients } from '../contexts/PatientContext';
import { getTeleconsultations } from '../services/teleconsultationService';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const { patients } = usePatients();
  const isFocused = useIsFocused();
  const [teleconsultations, setTeleconsultations] = useState(getTeleconsultations());
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isFocused) {
      setTeleconsultations(getTeleconsultations());
    }
  }, [isFocused]);

  // Trie par date croissante et prend les deux prochaines
  const nextConsults = [...teleconsultations]
    .sort((a, b) => new Date(a.nextConsultDate) - new Date(b.nextConsultDate))
    .slice(0, 2);

  const handlePatientSelect = (patient) => {
    navigation.navigate('Détails Patient', { patient });
  };

  // Filtre les patients selon la recherche
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Télémedecin</Text>
      {/* Bloc prochaines consultations */}
      <View style={styles.nextConsultBox}>
        <Text style={styles.subtitle}>Prochaines consultations</Text>
        {nextConsults.length === 0 ? (
          <Text style={{ color: '#888' }}>Aucune consultation à venir.</Text>
        ) : (
          nextConsults.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={styles.consultItem}
              onPress={() =>
                navigation.navigate('Téléconsultation', { consultIndex: teleconsultations.indexOf(c) })
              }
            >
              <Text style={styles.consultPatient}>{c.patientName}</Text>
              <Text>Date : {c.nextConsultDate}</Text>
              <Text>Heure : {c.time || '-'}</Text>
              <Text>Type : {c.type || (c.meetingLink ? 'En ligne' : 'Présentiel')}</Text>
              {c.meetingLink && (
                <Text style={{ color: '#2563eb', fontSize: 12 }}>Lien : {c.meetingLink}</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
      <Text style={styles.subtitle}>Liste des patients</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un patient..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredPatients}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <PatientCard patient={item} onPress={() => handlePatientSelect(item)} />
        )}
        contentContainerStyle={{ gap: 12 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888' }}>Aucun patient trouvé.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  nextConsultBox: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 16, elevation: 2 },
  consultItem: { marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 6 },
  consultPatient: { fontWeight: 'bold', color: '#2563eb' },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
});