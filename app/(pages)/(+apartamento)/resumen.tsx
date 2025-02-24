import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useForm } from '@/context/FormContext';
import API_BASE_URL from '@/utils/apiConfig';
import CustomAlert from '@/components/CustomAlert';
import { useUser } from '@clerk/clerk-expo';  // Importar Clerk

export default function Resumen() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();
  const { formData, updateFormData, resetFormData } = useForm();
  const photos: string[] = formData.paso1_7?.photos || [];
  const { user } = useUser(); // Obtener el usuario logueado

  // Función para enviar los datos al servidor
  const handleCreateListing = async () => {
    try {
      console.log('API:', API_BASE_URL)
      const response = await fetch(`${API_BASE_URL}/create-listing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id_clerk: user?.id, nombre_usuario: user?.fullName || user?.firstName || 'Usuario desconocido' }), // Incluir id_clerk en los datos enviados
      });
      if (response.ok) {
        setAlertMessage('Listado creado correctamente');
        setAlertVisible(true);
        resetFormData(); // Resetea los datos del formulario después de enviarlo
        console.log('Datos del formulario después de resetear:', formData); // Verifica el estado del formulario
        router.push('/(tabs)/Crear');
      } else {
        Alert.alert('Error al crear el listado');
      }
    } catch (error) {
      console.error('Error en la creación del listado:', error);
      Alert.alert('Error en la conexión con el servidor');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{
        title: 'Resumen de pasos',
        headerTitleStyle: { fontFamily: 'mon-b', fontSize: 22, marginTop: 20 },
      }} />

      {/* Paso 1.1: Categoría del evento */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Paso 1.1 - Categoría del evento</Text>
        {formData.paso1_1?.length > 0 ? (
          formData.paso1_1.map((item, index) => (
            <Text key={index} style={styles.stepDescription}>✅ {item}</Text>
          ))
        ) : (
          <Text style={styles.stepDescription}>No se seleccionó ninguna categoría.</Text>
        )}
      </View>

      {/* Paso 1.2: Dirección */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Paso 1.2 - Dirección Confirmada</Text>
        <Text style={styles.stepDescription}>
          {formData.paso1_2
            ? ` País: ${formData.paso1_2.pais}\n Dirección: ${formData.paso1_2.address}\n Puerta: ${formData.paso1_2.door}\n Código Postal: ${formData.paso1_2.postalCode}\n Ciudad: ${formData.paso1_2.city}\n Provincia: ${formData.paso1_2.provincia}\n Distrito: ${formData.paso1_2.district}`
            : 'No hay dirección confirmada.'}
        </Text>
      </View>

      {/* Paso 1.3: Información del espacio */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Paso 1.3 - Información del espacio</Text>
        {formData.paso1_3 ? (
          <Text style={styles.stepDescription}>
            Huéspedes: {formData.paso1_3.huespedes}{"\n"}
            Dormitorios: {formData.paso1_3.dormitorios}{"\n"}
            Camas: {formData.paso1_3.camas}{"\n"}
            Baños: {formData.paso1_3.baños}{"\n"}
            Parking: {formData.paso1_3.parking}{"\n"}
            Piscina: {formData.paso1_3.piscina}{"\n"}
            Gimnasio: {formData.paso1_3.gimnasio}{"\n"}
            Cancelación: {formData.paso1_3.cancelación}

          </Text>
        ) : (
          <Text style={styles.stepDescription}>No se ha registrado la información del espacio.</Text>
        )}
      </View>

      {/* Paso 1.4: Servicios */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Paso 1.4 - Servicios Incluidos</Text>
        {formData.paso1_4 ? (
          <View style={styles.stepDescription}>
            {Object.keys(formData.paso1_4)
              .filter(key => formData.paso1_4[key])
              .map((key, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Text>✅ {key.replace(/_/g, ' ')}</Text>
                </View>
              ))}
          </View>
        ) : (
          <Text style={styles.stepDescription}>No se han seleccionado servicios.</Text>
        )}
      </View>

      {/* Paso 1.5: Reglas */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Paso 1.5 - Reglas de la casa</Text>
        {formData.paso1_5 ? (
          <View style={styles.stepDescription}>
            {Object.keys(formData.paso1_5).map((key, index) => (
              <Text key={index}>
                {formData.paso1_5[key] ? `✅ ${key.replace(/_/g, ' ')}` : `❌ ${key.replace(/_/g, ' ')}`}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.stepDescription}>No se han seleccionado reglas.</Text>
        )}
      </View>

      {/* Paso 1.6: Detalles adicionales */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Paso 1.6 - Detalles Adicionales</Text>
        {formData.paso1_6 ? (
          <Text style={styles.stepDescription}>
            Título: {formData.paso1_6.titulo}{"\n"}
            Descripción: {formData.paso1_6.descripcion}{"\n"}
            Precio: {formData.paso1_6.precio}
          </Text>
        ) : (
          <Text style={styles.stepDescription}>No se han registrado detalles adicionales.</Text>
        )}
      </View>

      {/* Paso 1.7: Fotos */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Paso 1.7 - Fotos</Text>
        <View style={styles.photosContainer}>
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.photo} />
            ))
          ) : (
            <Text>No hay fotos seleccionadas.</Text>
          )}
        </View>
      </View>

       {/* ID Clerk del usuario */}
       <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Información del usuario</Text>
        <Text style={styles.stepDescription}>
          {user ? `🆔 ID Clerk: ${user.id}` : 'No se ha identificado al usuario.'}
          {user ? `👤 Nombre: ${user.fullName || user.firstName}` : 'No se ha identificado al usuario.'}
        </Text>
      </View>

      {/* Botón para enviar la información y crear el listado */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleCreateListing}
      >
        <Text style={styles.nextButtonText}>Confirmar y crear listado</Text>
      </TouchableOpacity>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  stepContainer: { marginBottom: 20 },
  stepTitle: { fontSize: 20, fontWeight: 'bold' },
  stepDescription: { fontSize: 16 },
  nextButton: { backgroundColor: '#6E8387', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  nextButtonText: { color: '#fff', fontSize: 16 },
  photosContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  photo: { width: '48%', height: 150, marginBottom: 10, borderRadius: 8 },
  serviceItem: { marginBottom: 8 },
});
