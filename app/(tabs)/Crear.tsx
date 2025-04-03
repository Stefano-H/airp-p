import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import API_BASE_URL from '@/utils/apiConfig';
import CustomAlert from '@/components/CustomAlert';

export default function App() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser(); // Extraemos la información del usuario

  // Estados para la alerta personalizada
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const showCustomAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // Modifica la función handleStart
  const handleStart = async () => {
    if (!isSignedIn) {
      router.push('/(modals)/login');
    } else {
      try {
        const clerkId = user?.id;
        if (!clerkId) {
          showCustomAlert('Error', 'No se pudo obtener el identificador del usuario.');
          return;
        }

        // Consulta ampliada para obtener estado de revisión
        const response = await fetch(`${API_BASE_URL}/api/getOwnerStatus`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clerkId }),
        });
        const data = await response.json();

        // Primero verificar si está en revisión
        if (data.revision === 1) {
          router.push('/verificacion/ConfirmacionVerificacion');
          return;
        }

        // Luego verificar si es propietario
        if (data.propietario === 0) {
          showCustomAlert(
            'Verificación requerida',
            'Primero debes verificar tu cuenta como propietario en la sección "Perfil".'
          );
          return;
        }

        // Si pasa ambas validaciones, continuar
        router.push('/(pages)/(+apartamento)/paso1.1');
      } catch (error) {
        console.error('Error al verificar el estado:', error);
        showCustomAlert(
          'Error',
          'Error al verificar tu estado. Por favor, inténtalo de nuevo más tarde.'
        );
      }
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            title: 'Añade un apartamento',
            headerTitleStyle: {
              fontFamily: 'mon-b',
              fontSize: 22,
              marginTop: 20,
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
            Añade al menos tres fotos, un título y una descripción. Te echaremos una mano.
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
      
      {/* Componente de alerta personalizada */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={handleAlertClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  step: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
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
});
