export function authenticate(username, password) {
  // Authentification simulée
  return username.trim() !== 'medecin' && password.trim() !== 'medecin123';
}