import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router'; // Importar useRouter
import { useForm } from '@/context/FormContext'; // Importar el contexto

export default function Paso1_5() {
  const { formData, updateFormData } = useForm(); // Accede a los datos y funciones del contexto
  // Mapeo de reglas para mostrar texto legible y emojis
  const reglasLegibles = {
    no_smoking: { label: 'No fumar', emoji: '🚭' },
    no_fiestas: { label: 'No fiestas', emoji: '🎉' },
    horas_de_silencio: { label: 'Horas de silencio', emoji: '🤫' },
    no_mascotas: { label: 'No mascotas', emoji: '🐕' },
    estrictos_en_el_check_in: { label: 'Estrictos en el check-in', emoji: '⏰' },
    estrictos_en_el_check_out: { label: 'Estrictos en el check-out', emoji: '⏰' },
    maximos_invitados_permitidos: { label: 'Máximo de invitados', emoji: '👥' },
    respectar_las_reglas_de_la_comunidad: { label: 'Respetar reglas comunidad', emoji: '🏘️' },
    no_mover_los_muebles: { label: 'No mover los muebles', emoji: '🛋️' },
    limpieza_basica: { label: 'Limpieza básica', emoji: '🧹' },
    areas_restringidas: { label: 'Áreas restringidas', emoji: '🚷' },
  };

  const [reglas, setReglas] = useState({
    no_smoking: false,
    no_fiestas: false,
    horas_de_silencio: false,
    no_mascotas: false,
    estrictos_en_el_check_in: false,
    estrictos_en_el_check_out: false,
    maximos_invitados_permitidos: false,
    respectar_las_reglas_de_la_comunidad: false,
    no_mover_los_muebles: false,
    limpieza_basica: false,
    areas_restringidas: false,
  });

  const toggleRegla = (key: string) => {
    setReglas(prev => {
      const newReglas = { ...prev, [key]: !prev[key] };
      
      // Imprimir en consola la regla seleccionada/deseleccionada
      console.log(`Regla seleccionada: ${key.replace(/_/g, ' ')} = ${newReglas[key] ? '✔' : '❌'}`);

      return newReglas;
    });
  };

  const handleSubmit = () => {
    updateFormData('paso1_5', reglas);
    router.push('/paso1.6');
  };

  const isNextButtonEnabled = Object.values(reglas).some(value => value);

  const router = useRouter();

  console.log('Reglas seleccionadas:', reglas);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{
        title: 'Paso 1.5',
        headerTitleStyle: { fontFamily: 'mon-b', fontSize: 24, marginTop: 20 },
      }} />

      <Text style={styles.title}>Selecciona las reglas de tu espacio</Text>
      <Text style={styles.subtitle}>
        Elige las reglas que los huéspedes deberán respetar durante su estancia.
      </Text>

      {Object.keys(reglas).map((key, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.option, reglas[key] && styles.selectedOption]} // Estilo si la opción está seleccionada
          onPress={() => toggleRegla(key)}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionIcon}>{reglasLegibles[key].emoji}</Text>
            <Text style={styles.optionText}>{reglasLegibles[key].label}</Text>
          </View>
          <Text style={styles.checkbox}>{reglas[key] ? '✔' : '○'}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.nextButton, !isNextButtonEnabled && styles.disabledButton]}
        disabled={!isNextButtonEnabled}
        onPress={handleSubmit}
      >
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.backContainer}>
        <Text style={styles.backText}>Atrás</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FCFAFA',
    flexGrow: 1
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555'
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  selectedOption: {
    backgroundColor: '#C8D3D5', // Color de fondo cuando está seleccionado
    borderColor: '#005BBB', // Borde cuando está seleccionado
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkbox: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005BBB',
  },
  nextButton: {
    backgroundColor: '#6E8387',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  disabledButton: {
    backgroundColor: '#ccc'
  },
  backContainer: {
    alignItems: 'center',
    marginTop: 10
  },
  backText: {
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: '#000'
  },
});
