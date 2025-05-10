import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getHistory, getCancelled } from '../services/historyService';
import { useIsFocused } from '@react-navigation/native';

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
    <View style={styles.container}>
      <Text style={styles.title}>Historique des consultations</Text>
      <FlatList
        data={history}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Date : {item.date}</Text>
            <Text>Type : {item.type}</Text>
            <Text>{item.notes}</Text>
          </View>
        )}
      />
      <Text style={styles.title}>Consultations annulées</Text>
      <FlatList
        data={cancelled}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: '#fee2e2' }]}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Date : {item.date}</Text>
            <Text>Type : {item.type}</Text>
            <Text>{item.notes}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  item: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, marginBottom: 10 },
  name: { fontWeight: 'bold', fontSize: 16 },
});