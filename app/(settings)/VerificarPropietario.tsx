import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import API_BASE_URL from '@/utils/apiConfig';

const VerificacionDetalles = () => {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmitVerification = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'No se pudo obtener el identificador del usuario.');
      return;
    }
    try {
      setLoading(true);
      // Llamada al endpoint para enviar la solicitud de verificación
      const response = await fetch(`${API_BASE_URL}/api/submitVerification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId: user.id }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        Alert.alert('Verificación enviada', 'Tu solicitud de verificación ha sido enviada. Espera la confirmación.');
        // Redirige al usuario al siguiente paso (por ejemplo, a la pantalla para crear un anuncio)
        router.push('/(pages)/(+apartamento)/paso1.1');
      } else {
        Alert.alert('Error', data.error || 'No se pudo enviar la verificación. Inténtalo de nuevo más tarde.');
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error. Por favor, inténtalo de nuevo.');
    }
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
         Para poder publicar tus espacios en AlquilaTuEvento, es necesario que verifiques tu cuenta como propietario.
         Asegúrate de que la información de tu perfil esté actualizada.
       </Text>

       <Text></Text>

       <View style={styles.step}>
        <Text style={styles.stepTitle}>Documentación Personal</Text>
        <Text style={styles.stepDescription}>
          Sube una copia de tu identificación oficial (INE, pasaporte, etc.) para verificar tu identidad. 
        </Text>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>Documentación Inmuebles</Text>
        <Text style={styles.stepDescription}>
          Sube los documentos que acrediten la propiedad de tu inmueble, por ejemplo, comprobante de domicilio o escritura.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmitVerification} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Comenzar proceso</Text>
        )}
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
