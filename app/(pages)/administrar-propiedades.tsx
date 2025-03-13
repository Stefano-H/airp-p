import { View, SafeAreaView, Text, StyleSheet, TextInput, Button, ScrollView, Image, Alert, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import axios from 'axios';
import API_BASE_URL from '@/utils/apiConfig';
import GlobalStyles from '@/Android-styles/GlobalStyles';
import { useAuth, useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { LogBox } from 'react-native';
import Colors from '@/constants/Colors';

LogBox.ignoreAllLogs(true);

// Clave de API para ImgBB (reemplazar si es necesario)
const IMG_BB_API_KEY = '4be0e183d9da005bf72f1088b24c85cc';

// Función para subir una imagen a ImgBB y obtener la URL
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

const EditListingForm = ({ listing, onCancel, onUpdate }) => {
  // Estados para campos de texto
  const [nombre, setNombre] = useState(listing.nombre || '');
  const [descripcion, setDescripcion] = useState(listing.descripción || '');
  const [precio, setPrecio] = useState(String(listing.precio || ''));
  const [tipoDeHabitacion, setTipoDeHabitacion] = useState(listing['tipo_de_habitación'] || '');
  const [habitaciones, setHabitaciones] = useState(String(listing.habitaciones || ''));
  const [camas, setCamas] = useState(String(listing.camas || ''));
  const [banos, setBanos] = useState(String(listing['baños'] || ''));

  // Estados para imágenes (URLs almacenadas)
  const [newMiniatura, setNewMiniatura] = useState(listing.miniatura || '');
  const [newFoto1, setNewFoto1] = useState(listing.foto1 || '');
  const [newFoto2, setNewFoto2] = useState(listing.foto2 || '');
  const [newFoto3, setNewFoto3] = useState(listing.foto3 || '');

  // Solicitar permisos de galería
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

  // Función para elegir una imagen y subirla a ImgBB
  const pickImage = async (field: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const uploadedUrl = await uploadToImgBB(imageUri);
      if (uploadedUrl) {
        if (field === 'miniatura') {
          setNewMiniatura(uploadedUrl);
        } else if (field === 'foto1') {
          setNewFoto1(uploadedUrl);
        } else if (field === 'foto2') {
          setNewFoto2(uploadedUrl);
        } else if (field === 'foto3') {
          setNewFoto3(uploadedUrl);
        }
      } else {
        Alert.alert('Error', 'No se pudo subir la imagen.');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/update-listing`, {
        id: listing.id,
        nombre,
        descripcion,
        precio: parseFloat(precio),
        tipo_de_habitacion: tipoDeHabitacion,
        habitaciones: parseInt(habitaciones, 10),
        camas: parseInt(camas, 10),
        banos: parseFloat(banos),
        miniatura: newMiniatura,
        foto1: newFoto1,
        foto2: newFoto2,
        foto3: newFoto3,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>Editar Apartamento</Text>
      
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Descripción:</Text>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Precio:</Text>
        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Tipo Hab.:</Text>
        <TextInput
          style={styles.input}
          placeholder="Tipo de Habitación"
          value={tipoDeHabitacion}
          onChangeText={setTipoDeHabitacion}
        />
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Habitaciones:</Text>
        <TextInput
          style={styles.input}
          placeholder="Habitaciones"
          value={habitaciones}
          onChangeText={setHabitaciones}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Camas:</Text>
        <TextInput
          style={styles.input}
          placeholder="Camas"
          value={camas}
          onChangeText={setCamas}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Baños:</Text>
        <TextInput
          style={styles.input}
          placeholder="Baños"
          value={banos}
          onChangeText={setBanos}
          keyboardType="numeric"
        />
      </View>
      
      {/* Sección de imágenes debajo de "Baños" */}
      <Text style={styles.sectionTitle}>Imágenes actuales:</Text>
      
      <View style={styles.imageRow}>
        <Text style={styles.imageLabel}>Miniatura:</Text>
        {newMiniatura ? (
          <Image style={styles.formImage} source={{ uri: newMiniatura }} />
        ) : (
          <Text>Sin imagen</Text>
        )}
        <Button title="Reemplazar" onPress={() => pickImage('miniatura')} color="#c4c4c4" />
      </View>

      <View style={styles.imageRow}>
        <Text style={styles.imageLabel}>Foto 1:</Text>
        {newFoto1 ? (
          <Image style={styles.formImage} source={{ uri: newFoto1 }} />
        ) : (
          <Text>Sin imagen</Text>
        )}
        <Button title="Reemplazar" onPress={() => pickImage('foto1')} color="#c4c4c4" />
      </View>

      <View style={styles.imageRow}>
        <Text style={styles.imageLabel}>Foto 2:</Text>
        {newFoto2 ? (
          <Image style={styles.formImage} source={{ uri: newFoto2 }} />
        ) : (
          <Text>Sin imagen</Text>
        )}
        <Button title="Reemplazar" onPress={() => pickImage('foto2')} color="#c4c4c4" />
      </View>

      <View style={styles.imageRow}>
        <Text style={styles.imageLabel}>Foto 3:</Text>
        {newFoto3 ? (
          <Image style={styles.formImage} source={{ uri: newFoto3 }} />
        ) : (
          <Text>Sin imagen</Text>
        )}
        <Button title="Reemplazar" onPress={() => pickImage('foto3')} color="#c4c4c4" />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Guardar cambios" onPress={handleSubmit} color="#4CAF50" />
        <Text></Text>
        <Button title="Cancelar" onPress={onCancel} color="#000000" />
        <Text></Text>
      </View>
      
    </ScrollView>
  );
};

const Page = () => {
  const [category, setCategory] = useState('Todas');
  const [items, setItems] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const { user } = useUser();

  // Función para obtener los listados del propietario
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/listings-by-owner?clerkId=${user.id}`
      );
      if (!response.ok) throw new Error('Error en la respuesta');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, user.id]);

  // Inicia la edición de un listado
  const handleEdit = (listing) => {
    setEditingListing(listing);
  };

  // Refresca los datos luego de actualizar y cierra el formulario de edición
  const handleUpdate = () => {
    setEditingListing(null);
    fetchData();
  };

  // Cancela la edición
  const handleCancel = () => {
    setEditingListing(null);
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Stack.Screen
        options={{
          title: 'Administrar Propiedades',
          headerTitleStyle: {
            fontFamily: 'mon-b',
            fontSize: 18,
            marginTop: 20,
          },
        }}
      />
      <View style={{ flex: 1 }}>
        {editingListing ? (
          <EditListingForm
            listing={editingListing}
            onCancel={handleCancel}
            onUpdate={handleUpdate}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.listingsContainer}>
            {items.map((listing) => (
              <View key={listing.id} style={styles.listingCard}>
                <Image
                  style={styles.listingImage}
                  source={{ uri: listing.miniatura }}
                />
                <Text style={styles.listingTitle}>{listing.nombre}</Text>
                <Text numberOfLines={2}>{listing.descripción}</Text>
                <Text>Precio: {listing.precio}</Text>
                <Text></Text>
                <Button title="Editar" onPress={() => handleEdit(listing)} color="#000000"/>
                <Text></Text>
                <Button title="Reservas" onPress={() => handleEdit(listing)} color={Colors.red} />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  formTitle: {
    fontFamily: 'mon-b',
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    width: 120,
    fontFamily: 'mon-b',
    fontSize: 14,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageLabel: {
    width: 100,
    fontFamily: 'mon-b',
    fontSize: 15,
  },
  formImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontFamily: 'mon-b',
    fontSize: 18,
    marginVertical: 10,
  },
  listingsContainer: {
    padding: 20,
  },
  listingCard: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    elevation: 2,
  },
  listingTitle: {
    fontFamily: 'mon-b',
    fontSize: 18,
    marginBottom: 5,
  },
  listingImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Page;
