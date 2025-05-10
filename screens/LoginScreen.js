import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      onLogin();
    } else {
      Alert.alert('Erreur', "Veuillez saisir un nom d'utilisateur et un mot de passe valides.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://storage.googleapis.com/a1aa/image/3ab48136-84dd-4789-73f4-4371e1501f58.jpg' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Connexion Médecin</Text>
      <Text style={styles.subtitle}>Veuillez vous identifier pour continuer</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  logo: { width: 100, height: 100, marginBottom: 16, borderRadius: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 24 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});