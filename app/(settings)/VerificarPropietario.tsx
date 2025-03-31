import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

const VerificacionDetalles = () => {
  const router = useRouter();

  const handleStartVerification = () => {
    // Redirigir a la página de verificación de identidad
    router.push('/verificacion/identidad');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Verifica tu cuenta',
          headerTitleStyle: { fontFamily: 'mon-b', fontSize: 20, marginTop: 20 },
        }} 
      />

      <Text style={styles.stepDescription}>
        Para poder publicar tus espacios en AlquilaTuEvento, es necesario que verifiques tanto tu identidad como tu domicilio.
        Asegúrate de que la información de tu perfil esté actualizada.
      </Text>

      <Text></Text>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>Verificación de Identidad</Text>
        <Text style={styles.stepDescription}>
          Sube una copia de tu identificación oficial (INE, pasaporte, etc.) y, si es posible, un selfie para confirmar tu identidad.
        </Text>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>Verificación de Domicilio</Text>
        <Text style={styles.stepDescription}>
          Sube un comprobante de domicilio reciente (recibo de luz, agua, etc.) que acredite tu lugar de residencia.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStartVerification}>
        <Text style={styles.buttonText}>Comenzar proceso</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

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
    fontFamily: 'mon-b',
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
  },
  stepDescription: {
    fontFamily: 'mon',
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
    fontFamily: 'mon-sb',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerificacionDetalles;