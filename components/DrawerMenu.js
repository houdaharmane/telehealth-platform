import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

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

export default function DrawerMenu({ onLogout }) {
  return (
    <Drawer.Navigator
      initialRouteName="Accueil"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#7c3aed',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          elevation: 8,
          shadowColor: '#6366f1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 22,
          letterSpacing: 1,
        },
        headerTitleAlign: 'center',
        drawerStyle: {
          backgroundColor: '#f9fafb',
          width: 240,
        },
        drawerActiveTintColor: '#7c3aed',
        drawerInactiveTintColor: '#4b5563',
        drawerItemStyle: {
          marginVertical: 10,
        },
      }}
      drawerContent={props => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Déconnexion"
            icon={({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color="#dc2626" />
            )}
            labelStyle={{ color: '#dc2626', fontWeight: 'bold' }}
            onPress={onLogout}
            style={{ marginTop: 'auto', borderTopWidth: 1, borderColor: '#eee' }}
          />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Consultation"
        component={ConsultationScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="clipboard-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Détails Patient"
        component={PatientDetailsScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Notes"
        component={NotesScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="document-text-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Téléconsultation"
        component={TeleconsultationScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="laptop-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Historique"
        component={HistoryScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="time-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Gestion Patients"
        component={PatientManagementScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="À propos"
        component={AproposScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="information-circle-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="call-outline" size={24} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}