import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useForm } from '@/context/FormContext'; // Usar el contexto
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const options = [
  { label: 'Bodas', icon: <FontAwesome5 name="ring" size={24} color="black" /> },
  { label: 'Fiestas', icon: <FontAwesome5 name="glass-cheers" size={24} color="black" /> },
  { label: 'Frente a la Playa', icon: <MaterialIcons name="beach-access" size={24} color="black" /> },
  { label: 'Campo', icon: <MaterialIcons name="nature-people" size={24} color="black" /> },
  { label: 'Eventos Corporativos', icon: <FontAwesome5 name="briefcase" size={24} color="black" /> },
];

export default function Paso1_1() {
  const { formData, updateFormData } = useForm(); // Accede al contexto
  const router = useRouter();

  // ✅ Aseguramos que `selected` nunca sea undefined
  const [selected, setSelected] = useState<string[]>(Array.isArray(formData.paso1_1) ? formData.paso1_1 : []);


  useEffect(() => {
    console.log('Valores actuales en paso1.1:', formData.paso1_1);
  }, [formData]);

  const toggleSelection = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleNextPress = () => {
    updateFormData('paso1_1', selected); // Guarda en el contexto
    router.push('/paso1.2');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Paso 1.1',
          headerTitleStyle: {
            fontFamily: 'mon-b',
            fontSize: 24,
            marginTop: 20,
          },
        }}
      />

      <Text style={styles.title}>¿Cuál de estas opciones describe mejor tu evento?</Text>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selected.includes(option.label) && styles.selectedOption,
            ]}
            onPress={() => toggleSelection(option.label)}
          >
            <Text style={styles.optionIcon}>
              {React.cloneElement(option.icon, {
                color: selected.includes(option.label) ? 'white' : 'black', // Cambia el color aquí
              })}
            </Text>
            <Text
              style={[
                styles.optionText,
                selected.includes(option.label) && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>

        ))}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, selected.length === 0 && styles.disabledButton]}
        disabled={selected.length === 0}
        onPress={handleNextPress}
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'black',
    borderColor: '#005BBB',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 10,
  },
  selectedOptionText: {
    color: 'white',
  },
  nextButton: {
    backgroundColor: '#6E8387',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  backText: {
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: '#000'
  },
});
