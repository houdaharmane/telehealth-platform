import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { authenticate } from '../services/authService';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [buttonAnim] = useState(new Animated.Value(1));

  const handleLogin = () => {
    if (authenticate(username, password)) {
      onLogin();
    } else {
      Alert.alert('Erreur', "Nom d'utilisateur ou mot de passe incorrect.");
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <LinearGradient colors={['#6EE7B7', '#3B82F6']} style={styles.gradient}>
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://storage.googleapis.com/a1aa/image/3ab48136-84dd-4789-73f4-4371e1501f58.jpg' }}
          style={styles.logo}
        />
        <Text style={styles.title}>
          <Icon name="doctor" size={30} color="#fff" /> Connexion Médecin
        </Text>
        <Text style={styles.subtitle}>Veuillez vous identifier pour continuer</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
        <Animated.View style={{ transform: [{ scale: buttonAnim }], width: '100%' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { animateButton(); handleLogin(); }}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              <Icon name="login" size={20} color="#fff" /> Se connecter
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: { 
    width: 120, 
    height: 120, 
    marginBottom: 20, 
    borderRadius: 60, 
    borderWidth: 2, 
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: { 
    fontSize: 30, 
    fontWeight: '600', 
    color: '#fff', 
    marginBottom: 8, 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 18, 
    color: '#f3f4f6', 
    marginBottom: 32, 
    textAlign: 'center' 
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 18, 
    letterSpacing: 1 
  },
});