import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { useUser } from '@clerk/clerk-expo';
import API_BASE_URL from '@/utils/apiConfig';

const VerificacionPropietario = () => {
  const router = useRouter();
  const { user } = useUser();
  const [ownerStatus, setOwnerStatus] = useState<{ propietario: number; revision: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerStatus = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/getOwnerStatus`, {
          clerkId: user.id
        });
        setOwnerStatus(response.data);
      } catch (error) {
        console.error('Error al obtener el estatus de verificación:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOwnerStatus();
    }
  }, [user]);

  const handleStartVerification = () => {
    // Redirige a la página de verificación de identidad
    router.push('/verificacion/identidad');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff385c" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Verifica tu cuenta',
          headerTitleStyle: { fontFamily: 'mon-b', fontSize: 20, marginTop: 20 },
        }} 
      />

      {ownerStatus && ownerStatus.propietario === 1 ? (
              <View style={styles.verifiedContainer}>
                <Text style={styles.verifiedTitle}>¡Felicidades!</Text>
                <Text style={styles.stepDescription}>
                  Tu cuenta ha sido verificada con éxito. Ahora puedes disfrutar de todas las ventajas de publicar y gestionar tus espacios en AlquilaTuEvento. ¡Gracias por confiar en nosotros!
                </Text>
              </View>
      ) : (
        <>
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
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  verifiedText: {
    fontFamily: 'mon-b',
    fontSize: 20,
    textAlign: 'center',
    color: 'green',
    marginTop: 20,
  },
  verifiedContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedTitle: {
    fontFamily: 'mon-b',
    fontSize: 24,
    color: 'green',
    marginBottom: 10,
  },
});

export default VerificacionPropietario;
