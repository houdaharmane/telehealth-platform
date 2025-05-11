import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from './screens/LoginScreen';
import { PatientProvider } from './contexts/PatientContext';
import DrawerMenu from './components/DrawerMenu';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <PatientProvider>
      <NavigationContainer>
        <DrawerMenu onLogout={() => setIsLoggedIn(false)} />
      </NavigationContainer>
    </PatientProvider>
  );
}