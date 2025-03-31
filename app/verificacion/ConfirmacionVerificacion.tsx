// ConfirmacionVerificacion.tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function ConfirmacionVerificacion() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/profile');
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <AntDesign name="checkcircle" size={100} color="#4CAF50" style={styles.icon} />
      
      <Text style={styles.title}>¡Verificación en proceso!</Text>
      <Text style={styles.subtitle}>
        Tu documentación está siendo revisada. Este proceso puede tomar entre 24 y 48 horas.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/profile')}
      >
        <Text style={styles.buttonText}>Ir a mi perfil ahora</Text>
      </TouchableOpacity>

      <Text style={styles.timerText}>Serás redirigido automáticamente en 10 segundos...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#555',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#6E8387',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerText: {
    color: '#888',
    fontSize: 12,
  },
});