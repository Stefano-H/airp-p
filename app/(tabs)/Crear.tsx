import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function App() {
    const router = useRouter();
    const [showMessage, setShowMessage] = useState(false);

    const handleStart = () => {
        router.push('/(pages)/(+apartamento)/paso1.1');
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Añade un apartamento',
          headerTitleStyle: {
            fontFamily: 'mon-b',
            fontSize: 22,
            marginTop: 20, // Ajusta este valor según sea necesario
          },
        }}
      />

      <View style={styles.step}>
        <Text style={styles.stepTitle}>1. Describe tu espacio</Text>
        <Text style={styles.stepDescription}>
          Añade algunos datos básicos, como dónde está y cuántos huéspedes pueden quedarse.
        </Text>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>2. Haz que destaque</Text>
        <Text style={styles.stepDescription}>
          Añade al menos cinco fotos, un título y una descripción. Te echaremos una mano.
        </Text>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>3. Da los últimos retoques y publícalo</Text>
        <Text style={styles.stepDescription}>
          Elige un precio inicial, verifica algunos detalles y publica tu anuncio.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Empieza</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  step: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
  },
  stepDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#ff385c',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  messageText: {
    color: 'white',
    textAlign: 'center',
  },
});
