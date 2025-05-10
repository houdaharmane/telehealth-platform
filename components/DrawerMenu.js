import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../screens/HomeScreen';
import PatientDetailsScreen from '../screens/PatientDetailsScreen';
import NotesScreen from '../screens/NotesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import TeleconsultationScreen from '../screens/TeleconsultationScreen';
import ConsultationScreen from '../screens/ConsultationScreen';
import AproposScreen from '../screens/AproposScreen';
import ContactScreen from '../screens/ContactScreen';
import PatientManagementScreen from '../screens/PatientManagementScreen';

const Drawer = createDrawerNavigator();

export default function DrawerMenu() {
  return (
    <Drawer.Navigator initialRouteName="Accueil">
      <Drawer.Screen name="Accueil" component={HomeScreen} />
      <Drawer.Screen name="Consultation" component={ConsultationScreen} />
      <Drawer.Screen name="Détails Patient" component={PatientDetailsScreen} />
      <Drawer.Screen name="Notes" component={NotesScreen} />
      <Drawer.Screen name="Téléconsultation" component={TeleconsultationScreen} />
      <Drawer.Screen name="Historique" component={HistoryScreen} />
      <Drawer.Screen name="Gestion Patients" component={PatientManagementScreen} />
      <Drawer.Screen name="À propos" component={AproposScreen} />
      <Drawer.Screen name="Contact" component={ContactScreen} />
    </Drawer.Navigator>
  );
}