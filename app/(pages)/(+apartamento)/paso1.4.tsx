import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useForm } from '@/context/FormContext'; // Importar el contexto

export default function Paso1_4() {
  const router = useRouter();
  const { formData, updateFormData } = useForm(); // Accede a los datos y funciones del contexto

  const [servicios, setServicios] = useState({
    wifi: false,
    aire_acondicionado: false,
    calefacción: false,
    lavadora: false,
    plancha: false,
    toallas: false,
    detector_de_humo: false,
    detector_de_monoxido_de_carbono: false,
  });

  const toggleServicio = (key: keyof typeof servicios) => {
    setServicios(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Verificar si al menos un servicio está seleccionado
  const isNextButtonEnabled = Object.values(servicios).some(value => value);

  console.log('Servicios seleccionados:', servicios);

  // useEffect(() => {
  //   // Cargar datos previos del contexto si existen
  //   if (formData.paso1_4) {
  //     setServicios(formData.paso1_4);
  //   }
  // }, [formData]);

  const handleSubmit = () => {
    // Guarda los datos en el contexto antes de redirigir
    updateFormData('paso1_4', servicios);
    console.log('Servicios seleccionados:', servicios);
    router.push('/paso1.5'); // Redirigir al siguiente paso
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Paso 1.4',
          headerTitleStyle: { fontFamily: 'mon-b', fontSize: 24, marginTop: 20 },
        }}
      />
      <Text style={styles.title}>🏡 Servicios incluidos en tu espacio</Text>
      <Text style={styles.subtitle}>Selecciona los servicios que ofreces a tus huéspedes</Text>

      <View style={styles.optionsContainer}>
        {Object.keys(servicios).map((key, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.option, servicios[key as keyof typeof servicios] && styles.optionSelected]}
            onPress={() => toggleServicio(key as keyof typeof servicios)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, servicios[key as keyof typeof servicios] && styles.optionTextSelected]}>
              {key.replace(/_/g, ' ').toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isNextButtonEnabled}
          style={[styles.nextButton, !isNextButtonEnabled && styles.nextButtonDisabled]}
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
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#000',
  },
  optionSelected: {
    backgroundColor: 'black',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
  },
  navButton: {
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#ddd',
  },
  nextButton: {
    backgroundColor: '#6E8387',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backText: {
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: '#000'
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  backContainer: {
    alignItems: 'center',
    marginTop: 10 // Centra el texto "Atrás"
  },
  disabledButton: {
    backgroundColor: '#ccc'
  },
});
