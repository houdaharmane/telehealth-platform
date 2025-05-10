import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VitalBlock({ label, values }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {values.map((entry, index) => (
        <Text key={index} style={styles.value}>
          {entry.date} : {entry.value}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eef',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2a2a2a',
  },
  value: {
    color: '#444',
    fontSize: 14,
  },
});