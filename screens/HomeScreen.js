import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import PatientCard from '../components/PatientCard';
import { usePatients } from '../contexts/PatientContext';
import { getTeleconsultations } from '../services/teleconsultationService';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    <LinearGradient colors={['#6EE7B7', '#3B82F6']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>
          <Icon name="home-heart" size={28} color="#fff" /> Bienvenue sur Télémedecin
        </Text>
        {/* Bloc prochaines consultations */}
        <View style={styles.nextConsultBox}>
          <Text style={styles.subtitle}>
            <Icon name="calendar-clock" size={20} color="#4F46E5" /> Prochaines consultations
          </Text>
          {nextConsults.length === 0 ? (
            <Text style={{ color: '#888', textAlign: 'center' }}>Aucune consultation à venir.</Text>
          ) : (
            nextConsults.map((c, i) => (
              <TouchableOpacity
                key={i}
                style={styles.consultItem}
                onPress={() =>
                  navigation.navigate('Téléconsultation', { consultIndex: teleconsultations.indexOf(c) })
                }
              >
                <Text style={styles.consultPatient}>
                  <Icon name="account" size={16} color="#4F46E5" /> {c.patientName}
                </Text>
                <Text>
                  <Icon name="calendar" size={14} color="#3B82F6" /> {c.nextConsultDate}
                </Text>
                <Text>
                  <Icon name="clock" size={14} color="#3B82F6" /> {c.time || '-'}
                </Text>
                <Text>
                  <Icon name={c.type === 'En ligne' ? "video" : "hospital"} size={14} color="#3B82F6" /> {c.type || (c.meetingLink ? 'En ligne' : 'Présentiel')}
                </Text>
                {c.meetingLink && (
                  <Text style={{ color: '#2563eb', fontSize: 12 }}>
                    <Icon name="link-variant" size={12} color="#2563eb" /> Lien : {c.meetingLink}
                  </Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
        <Text style={styles.subtitle}>
          <Icon name="account-group" size={20} color="#4F46E5" /> Liste des patients
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un patient..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#aaa"
        />
        <FlatList
          data={filteredPatients}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <PatientCard patient={item} onPress={() => handlePatientSelect(item)} />
          )}
          contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888' }}>Aucun patient trouvé.</Text>}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    padding: 18,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: '#3B82F6',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#4F46E5',
    textAlign: 'left',
  },
  nextConsultBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#3B82F6',
    shadowOpacity: 0.10,
    shadowRadius: 10,
  },
  consultItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
    paddingTop: 4,
  },
  consultPatient: {
    fontWeight: 'bold',
    color: '#4F46E5',
    fontSize: 16,
    marginBottom: 2,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#3B82F6',
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 16,
    shadowColor: '#3B82F6',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});