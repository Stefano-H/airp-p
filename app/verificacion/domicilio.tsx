import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from '@/context/FormContext';
import API_BASE_URL from '@/utils/apiConfig';
import { useUser } from "@clerk/clerk-expo";

const IMG_BB_API_KEY = '4be0e183d9da005bf72f1088b24c85cc';

export default function DomicilioVerification() {
  const [domicilioPhoto, setDomicilioPhoto] = useState<string | null>(null);
  const router = useRouter();
  const { formData, updateFormData } = useForm();
  const { user } = useUser();

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería');
        }
      }
    };
    requestPermissions();
  }, []);

  const uploadToImgBB = async (imageUri: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }
  };

  const handleAddPhoto = async () => {
    console.log('handleAddPhoto');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
  
      if (!result.canceled && result.assets.length > 0) {
        const uploadedPhoto = await uploadToImgBB(result.assets[0].uri);
        if (uploadedPhoto) {
          setDomicilioPhoto(uploadedPhoto);
          // Actualiza el contexto con la foto de domicilio
          updateFormData('verificacion_domicilio', { photos: [uploadedPhoto] }); 
          console.log('verificacion_domicilio:', formData.verificacion_domicilio);
        } else {
          Alert.alert('Error', 'No se pudo cargar la imagen');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la imagen');
    }
  };

  // domicilio.tsx (corregido)
const handleFinalizar = async () => {
    try {
      // 1. Validar datos
         if (
            !formData.verificacion_identidad || 
            !formData.verificacion_cara ||
            !formData.verificacion_domicilio
          ) {
            Alert.alert('Error', 'Sube la identificación, la foto de tu cara (con DNI y papel con la fecha) y el comprobante de domicilio.');
          return;
      }
  
      // 2. Obtener user.id (Asegúrate de tener acceso al usuario aquí)
      if (!user?.id) {
        Alert.alert('Error', 'Usuario no identificado.');
        return;
      }
  
      // 3. Llamar a la API
      console.log('Enviando datos a la API...'); // 🛠️
      const response = await fetch(`${API_BASE_URL}/api/updateUserDocuments`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            clerk_id: user.id,
            documentopersonal_adelante: formData.verificacion_identidad.adelante,
            documentopersonal_detras: formData.verificacion_identidad.detras,
            documentodomicilio: formData.verificacion_domicilio.photos[0],
            fotocara: formData.verificacion_cara.photo
        }),
      });
  
      // 4. Manejar respuesta
      const data = await response.json();
      console.log('Respuesta del servidor:', data); // 🛠️
  
      if (!response.ok) {
        throw new Error(data.error || 'Error desconocido');
      }
  
      Alert.alert('Éxito', 'Documentos guardados');
      router.push('/verificacion/ConfirmacionVerificacion');
    } catch (error) {
      console.error('Error en handleFinalizar:', error); // 🔥
      Alert.alert('Error', error.message || 'Algo salió mal');
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{
        title: 'Verificación de Domicilio',
        headerTitleStyle: { fontFamily: 'mon-b', fontSize: 24, marginTop: 20 },
      }} />

      <Text style={styles.title}>Sube un Comprobante de Domicilio</Text>
      <Text style={styles.subtitle}>Puedes subir un recibo de luz, agua, internet, etc.</Text>

      <View style={styles.photosContainer}>
        {domicilioPhoto && <Image source={{ uri: domicilioPhoto }} style={styles.photo} />}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !domicilioPhoto && styles.disabledButton]}
        disabled={!domicilioPhoto}
        onPress={handleFinalizar}
      >
        <Text style={styles.nextButtonText}>Finalizar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#555' },
  photosContainer: { alignItems: 'center', marginBottom: 20 },
  photo: { width: 200, height: 200, borderRadius: 8, marginBottom: 10 },
  addButton: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', borderColor: '#ddd', borderWidth: 1, borderRadius: 8 },
  addButtonText: { fontSize: 48, color: '#007AFF' },
  nextButton: { backgroundColor: '#6E8387', padding: 15, borderRadius: 8, alignItems: 'center' },
  nextButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#ccc' },
});
