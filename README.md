# 🩺 Telemedecin App — Application Mobile de Téléconsultation Médicale

[![Licence: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red)

Bienvenue sur le dépôt **Telemedecin App**, une application mobile moderne pour les professionnels de santé, dédiée à la **gestion de patients** et à la **téléconsultation**, développée avec **React Native** et **Expo**.

---

## 🚀 Fonctionnalités Clés

* 🔐 **Connexion sécurisée des médecins**
* 🧑‍⚕️ **Gestion complète des patients** (ajout, modification, suppression)
* 📅 **Suivi des consultations** (en ligne, à venir, passées)
* 📝 **Prise de notes médicales intuitive**
* 📹 **Liaison directe aux réunions vidéo (Jitsi Meet ou autre)**
* ☎️ **Contact simplifié avec les patients**
* 📚 **Historique des consultations**
* 🧭 **Navigation fluide avec un menu latéral**
* 🎨 **Interface claire, responsive et professionnelle**

---

## 🗂️ Structure du Projet

```bash
telemedecin-app/
│
├── App.js                     # Point d'entrée principal
├── package.json               # Dépendances du projet
├── .gitignore
├── README.md
│
├── components/                # Composants réutilisables
│   └── DrawerMenu.js
│
├── contexts/                  # Contexte global (ex: patients)
│   └── PatientContext.js
│
├── screens/                   # Écrans principaux de l'app
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── ConsultationScreen.js
│   ├── PatientManagementScreen.js
│   ├── PatientDetailsScreen.js
│   ├── NotesScreen.js
│   ├── HistoryScreen.js
│   ├── ContactScreen.js
│   ├── AproposScreen.js
│   └── TeleconsultationScreen.js
│
├── services/                  # API / logique métier
│   ├── authService.js
│   ├── historyService.js
│   └── teleconsultationService.js
│
└── assets/                    # Logos, images, icônes
```

---

## ⚙️ Installation & Lancement

### ✅ Prérequis

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* [Expo CLI](https://docs.expo.dev/get-started/installation/)
  *(Installer avec : `npm install -g expo-cli`)*

### 🛠️ Étapes d’installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-utilisateur/telemedecin-app.git
cd telemedecin-app

# 2. Installer les dépendances
npm install
# ou
yarn install

# 3. Lancer l’application
expo start
```

Scannez ensuite le **QR Code** via l’app **Expo Go** ou utilisez un **émulateur Android/iOS**.

---

## 🧩 Personnalisation

* Ajoutez vos patients via l'interface dédiée
* Intégrez vos propres APIs dans `/services`
* Modifiez le style dans `/screens` ou `/components`

---

## 🤝 Contribution

Les contributions sont bienvenues ! Ouvrez une **issue** ou proposez une **pull request**.

---

## 📄 Licence

Distribué sous licence **MIT** — libre d’utilisation et de modification.

---

## 👨‍💻 Équipe

Développé avec ❤️ .
Pour toute question ou suggestion, contactez-nous !
