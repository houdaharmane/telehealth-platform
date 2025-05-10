let patients = [
  {
    id: 1,
    name: "Ahmed Ben Ali",
    phone: "+33123456789",
    type: "Diabète",
    gender: "male",
    avatar: "https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-174669.jpg?semt=ais_hybrid&w=740",
    photo: "https://placehold.co/150x150/png?text=Ahmed+Ben+Ali",
    vitals: [
      { date: "2024-06-10", temperature: 37.2, fc: 78, saturation: 97 },
      { date: "2024-06-08", temperature: 37.0, fc: 80, saturation: 98 },
      { date: "2024-06-05", temperature: 36.8, fc: 75, saturation: 99 },
      { date: "2024-06-01", temperature: 37.1, fc: 77, saturation: 97 },
    ],
  },
  // ... autres patients
];

let nextId = patients.length ? Math.max(...patients.map(p => p.id)) + 1 : 1;

export const getPatients = () => patients;
export const getPatientById = (id) => patients.find((p) => p.id === id);

export function addPatient({ name, phone, type, gender }) {
  let avatar = gender === 'male'
    ? 'https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-174669.jpg?semt=ais_hybrid&w=740'
    : 'https://img.freepik.com/vecteurs-libre/femme-aux-cheveux-longs-sombres_1308-176524.jpg?semt=ais_hybrid&w=740';

  patients.push({
    id: nextId++,
    name,
    phone,
    type,
    gender,
    avatar,
    photo: 'https://placehold.co/150x150/png?text=' + encodeURIComponent(name),
    vitals: [],
  });
}

export function updatePatient(id, { name, phone, type, gender }) {
  const idx = patients.findIndex(p => p.id === id);
  if (idx !== -1) {
    patients[idx].name = name;
    patients[idx].phone = phone;
    patients[idx].type = type;
    if (gender) {
      patients[idx].gender = gender;
      patients[idx].avatar = gender === 'male'
        ? 'https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-174669.jpg?semt=ais_hybrid&w=740'
        : 'https://img.freepik.com/vecteurs-libre/femme-aux-cheveux-longs-sombres_1308-176524.jpg?semt=ais_hybrid&w=740';
    }
  }
}

export function deletePatient(id) {
  patients = patients.filter(p => p.id !== id);
}