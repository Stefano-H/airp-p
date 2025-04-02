import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from '@/context/FormContext';

const IMG_BB_API_KEY = '4be0e183d9da005bf72f1088b24c85cc';

export default function VerificacionIdentidad() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
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
    if (photos.length >= 2) {
      Alert.alert('Límite alcanzado', 'Debes subir solo la parte frontal y trasera de tu identificación.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const uploadedPhoto = await uploadToImgBB(result.assets[0].uri);
        if (uploadedPhoto) {
          const updatedPhotos = [...photos, uploadedPhoto];
          setPhotos(updatedPhotos);
          setIsNextButtonEnabled(updatedPhotos.length === 2);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la imagen');
    }
  };

// Modifica la función handleNext
const handleNext = () => {
    if (photos.length === 2) {
      // Separa las fotos en dos campos distintos
      updateFormData('verificacion_identidad', {
        adelante: photos[0],
        detras: photos[1]
      });
      console.log('Documentos:', { 
        adelante: photos[0], 
        detras: photos[1] 
      });
      router.push('/verificacion/fotocara');
    } else {
      Alert.alert('Error', 'Sube ambas caras de tu documento');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{
        title: 'Verificación de Identidad',
        headerTitleStyle: { fontFamily: 'mon-b', fontSize: 24, marginTop: 20 },
      }} />

      <Text style={styles.title}>Sube tu Identificación</Text>
      <Text style={styles.subtitle}>Debes subir dos imágenes: la parte frontal y la trasera de tu identificación.</Text>

      <View style={styles.photosContainer}>
        {photos.map((photo, index) => (
          <Image key={index} source={{ uri: photo }} style={styles.photo} />
        ))}
        {photos.length < 2 && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !isNextButtonEnabled && styles.disabledButton]}
        disabled={!isNextButtonEnabled}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photo: {
    width: '48%',
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
  },
  addButton: {
    width: '48%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 48,
    color: '#007AFF',
  },
  nextButton: {
    backgroundColor: '#6E8387',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
