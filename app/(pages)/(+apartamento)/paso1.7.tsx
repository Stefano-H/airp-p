import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from '@/context/FormContext'; // Importar el contexto

const IMG_BB_API_KEY = '4be0e183d9da005bf72f1088b24c85cc'; // 🔥 Reemplaza con tu API Key de ImgBB

export default function Paso1_7() {
  const [photos, setPhotos] = useState<string[]>([]); // Lista de URLs de fotos subidas a ImgBB
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false); // Estado del botón "Siguiente"
  const router = useRouter();
  const { formData, updateFormData } = useForm(); // Accede a los datos y funciones del contexto

  // Solicitar permisos
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

  // Función para subir imágenes a ImgBB y obtener la URL
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
      return data.data.url; // Retorna la URL de la imagen subida
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }
  };

  // Función para añadir fotos y subirlas a ImgBB
  const handleAddPhoto = async () => {
    if (photos.length >= 5) {
      Alert.alert('Límite alcanzado', 'Máximo 5 fotos');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5 - photos.length,
      });

      if (!result.canceled && result.assets) {
        const newPhotos = result.assets.map(asset => asset.uri);

        // Subir imágenes a ImgBB y obtener sus URLs
        const uploadedPhotos = await Promise.all(newPhotos.map(uploadToImgBB));

        // Filtrar imágenes fallidas y actualizar estado
        const validPhotos = uploadedPhotos.filter(url => url !== null);
        const updatedPhotos = [...photos, ...validPhotos];

        setPhotos(updatedPhotos);
        setIsNextButtonEnabled(updatedPhotos.length >= 3);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la imagen');
    }
  };

  const handleNext = () => {
    console.log('Fotos antes de validación:', photos.length); // Verifica aquí
    if (photos.length >= 3 && photos.length <= 5) {
      updateFormData('paso1_7', { photos });
      router.push('/resumen');
    } else {
      Alert.alert('Fotos requeridas', 'Debes seleccionar entre 3 y 5 fotos.');
    }
  };
  

  const handleBack = () => {
    router.push('/paso1.6');
  };

  console.log('Fotos seleccionadas:', photos);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{
        title: 'Paso 1.7',
        headerTitleStyle: { fontFamily: 'mon-b', fontSize: 24, marginTop: 20 },
      }} />

      <Text style={styles.title}>Selecciona y Organiza tus Fotos</Text>
      <Text style={styles.subtitle}>
        Elige entre 3 y 5 fotos para mostrar tu apartamento. Arrastra las fotos para cambiar su orden.
      </Text>

      <View style={styles.photosContainer}>
        {photos.map((photo, index) => (
          <Image key={index} source={{ uri: photo }} style={styles.photo} />
        ))}
        {photos.length < 5 && (
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

      <TouchableOpacity onPress={handleBack} style={styles.backContainer}>
        <Text style={styles.backText}>Atrás</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: '#fff', 
    flexGrow: 1 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 14, 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#555' 
  },
  photosContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  photo: { 
    width: '48%', 
    height: 150, 
    marginBottom: 10, 
    borderRadius: 8 
  },
  addButton: { 
    width: '48%', 
    height: 150, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderColor: '#ddd', 
    borderWidth: 1, 
    borderRadius: 8 
  },
  addButtonText: { 
    fontSize: 48, 
    color: '#007AFF' 
  },
  nextButton: {
    backgroundColor: '#6E8387',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  disabledButton: {
    backgroundColor: '#ccc'
  },
  backContainer: {
    alignItems: 'center',
    marginTop: 10
  },
  backText: {
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: '#000'
  },
});

