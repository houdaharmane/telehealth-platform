import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function AproposScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>À propos de Télémedecin</Text>
      <Text style={styles.text}>
        Télémedecin est une application dédiée aux médecins pour faciliter le suivi à distance de leurs patients. Elle permet de consulter les données vitales, d'écrire des notes, de gérer les téléconsultations et de garder un historique complet des consultations.
      </Text>
      <Text style={styles.text}>
        Notre objectif est d'améliorer la qualité des soins en offrant un outil simple, sécurisé et efficace pour la médecine à distance.
      </Text>
      <Image source={{ uri: 'https://storage.googleapis.com/a1aa/image/2c596a3c-b0e9-45ac-4820-6978fb9cd02c.jpg' }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  text: { color: '#444', fontSize: 16, marginBottom: 10, textAlign: 'center' },
  image: { width: 300, height: 150, borderRadius: 12, marginTop: 16 },
});