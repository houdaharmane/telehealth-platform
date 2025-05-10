import React from 'react';
import { View, Text, Linking, TouchableOpacity, StyleSheet } from 'react-native';

export default function ContactActions({ patient, onClose }) {
  return (
    <View style={styles.box}>
      <Text style={styles.name}>{patient.name}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.call} onPress={() => Linking.openURL(`tel:${patient.phone}`)}>
          <Text style={styles.btnText}>📞 Appeler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sms} onPress={() => Linking.openURL(`sms:${patient.phone}`)}>
          <Text style={styles.btnText}>💬 SMS</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.close}>Fermer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 4,
    marginTop: 20,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  call: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 6,
  },
  sms: {
    backgroundColor: '#0077cc',
    padding: 10,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  close: {
    color: '#cc0000',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 10,
  },
});