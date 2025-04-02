import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from '@/context/FormContext';

const IMG_BB_API_KEY = '4be0e183d9da005bf72f1088b24c85cc';

export default function VerificacionCara() {
  const [photo, setPhoto] = useState<string | null>(null);
  const router = useRouter();
  const { updateFormData } = useForm();

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

  const uploadToImgBB = async (imageUri: string): Promise<string | null> => {
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
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uploadedPhoto = await uploadToImgBB(result.assets[0].uri);
        if (uploadedPhoto) {
          setPhoto(uploadedPhoto);
          // Guarda el URL de la foto en el contexto con la clave 'verificacion_cara'
          updateFormData('verificacion_cara', { photo: uploadedPhoto });
        } else {
          Alert.alert('Error', 'No se pudo cargar la imagen');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la imagen');
    }
  };

  const handleNext = () => {
    if (!photo) {
      Alert.alert('Error', 'Debes subir la foto requerida');
      return;
    }
    // Navegar a la siguiente pantalla (por ejemplo, a domicilio.tsx)
    router.push('/verificacion/domicilio');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Verificación de Cara',
          headerTitleStyle: { fontFamily: 'mon-b', fontSize: 24, marginTop: 20 },
        }}
      />
      <Text style={styles.title}>Sube una foto donde sostengas tu DNI y un papel con la fecha de hoy</Text>
      <Text style={styles.subtitle}>Asegúrate de que se vea claramente tu documento y la fecha actual.</Text>
      <View style={styles.photoContainer}>
        {photo && <Image source={{ uri: photo }} style={styles.photo} />}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.nextButton, !photo && styles.disabledButton]}
        disabled={!photo}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#555' },
  photoContainer: { alignItems: 'center', marginBottom: 20 },
  photo: { width: 200, height: 200, borderRadius: 8, marginBottom: 10 },
  addButton: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', borderColor: '#ddd', borderWidth: 1, borderRadius: 8 },
  addButtonText: { fontSize: 48, color: '#007AFF' },
  nextButton: { backgroundColor: '#6E8387', padding: 15, borderRadius: 8, alignItems: 'center' },
  nextButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#ccc' },
});
