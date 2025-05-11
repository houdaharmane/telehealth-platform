import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getHistory, getCancelled } from '../services/historyService';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HistoryScreen() {
  const isFocused = useIsFocused();
  const [history, setHistory] = useState(getHistory());
  const [cancelled, setCancelled] = useState(getCancelled());

  useEffect(() => {
    if (isFocused) {
      setHistory(getHistory());
      setCancelled(getCancelled());
    }
  }, [isFocused]);

  return (
    <LinearGradient colors={['#6EE7B7', '#3B82F6']} style={styles.gradient}>
      <View style={styles.container}>
        <Icon name="history" size={40} color="#4F46E5" style={{ marginBottom: 10, alignSelf: 'center' }} />
        <Text style={styles.title}>Historique des consultations</Text>
        <FlatList
          data={history}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}><Icon name="account" size={16} color="#4F46E5" /> {item.name}</Text>
              <Text style={styles.text}><Icon name="calendar" size={15} color="#2563eb" /> {item.date}</Text>
              <Text style={styles.text}><Icon name="stethoscope" size={15} color="#2563eb" /> {item.type}</Text>
              <Text style={styles.text}><Icon name="note-text" size={15} color="#2563eb" /> {item.notes}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.text}>Aucun historique pour le moment.</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        <Text style={styles.title}>Consultations annulées</Text>
        <FlatList
          data={cancelled}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={[styles.item, { backgroundColor: '#fee2e2' }]}>
              <Text style={styles.name}><Icon name="account" size={16} color="#dc2626" /> {item.name}</Text>
              <Text style={styles.text}><Icon name="calendar" size={15} color="#dc2626" /> {item.date}</Text>
              <Text style={styles.text}><Icon name="stethoscope" size={15} color="#dc2626" /> {item.type}</Text>
              <Text style={styles.text}><Icon name="note-text" size={15} color="#dc2626" /> {item.notes}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.text}>Aucune consultation annulée.</Text>}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flexGrow: 1, padding: 20, alignItems: 'center', justifyContent: 'flex-start' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#4F46E5' },
  item: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    width: 320,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  name: { fontWeight: 'bold', fontSize: 16, color: '#4F46E5', marginBottom: 4 },
  text: { color: '#22223b', fontSize: 15, marginBottom: 2 },
});