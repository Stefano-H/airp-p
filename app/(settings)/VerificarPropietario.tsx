import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter, Stack } from 'expo-router';
import API_BASE_URL from '@/utils/apiConfig';

const VerificarPropietario = () => {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    // Verifica que se tenga el clerkId del usuario
    if (!user?.id) {
      Alert.alert('Error', 'No se pudo obtener el identificador del usuario.');
      return;
    }
    try {
      setLoading(true);
      // Llamamos al endpoint que verifica el estado de propietario
      const response = await fetch(`${API_BASE_URL}/api/verifyOwner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId: user.id }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        Alert.alert('Verificación exitosa', 'Tu cuenta ha sido verificada como propietario.');
        // Redirige a la página para crear un anuncio o la sección principal
        router.push('/(pages)/(+apartamento)/paso1.1');
      } else {
        Alert.alert('Error', data.error || 'No se pudo verificar tu cuenta. Inténtalo de nuevo más tarde.');
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: '',
          headerTitleStyle: { fontFamily: 'mon-b', fontSize: 20, marginTop: 20 },
        }} 
      />
      <Text style={styles.title}>Verifica tu cuenta como propietario</Text>
      <Text style={styles.description}>
        Para poder publicar tus espacios en AlquilaTuEvento, es necesario que verifiques tu cuenta como propietario.
        Presiona el botón a continuación para confirmar tu verificación. Si tienes dudas o necesitas asistencia,
        visita la sección de Perfil.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleVerification} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verificar cuenta</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'mon-b',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'mon',
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff385c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
  },
  buttonText: {
    fontFamily: 'mon-sb',
    color: '#fff',
    fontSize: 18,
  },
});

export default VerificarPropietario;
