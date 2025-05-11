import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AproposScreen() {
  return (
    <LinearGradient colors={['#6EE7B7', '#3B82F6']} style={styles.gradient}>
      <View style={styles.container}>
        <Icon name="information" size={44} color="#4F46E5" style={{ marginBottom: 10 }} />
        <Text style={styles.title}>À propos de Télémedecin</Text>
        <Text style={styles.text}>
          Télémedecin est une application dédiée aux médecins pour faciliter le suivi à distance de leurs patients. Elle permet de consulter les données vitales, d'écrire des notes, de gérer les téléconsultations et de garder un historique complet des consultations.
        </Text>
        <Text style={styles.text}>
          Notre objectif est d'améliorer la qualité des soins en offrant un outil simple, sécurisé et efficace pour la médecine à distance.
        </Text>
        <Image
          source={{ uri: 'https://storage.googleapis.com/a1aa/image/2c596a3c-b0e9-45ac-4820-6978fb9cd02c.jpg' }}
          style={styles.image}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16, color: '#4F46E5', textAlign: 'center' },
  text: { color: '#22223b', fontSize: 16, marginBottom: 10, textAlign: 'center' },
  image: { width: 300, height: 150, borderRadius: 18, marginTop: 16, borderWidth: 2, borderColor: '#4F46E5' },
});