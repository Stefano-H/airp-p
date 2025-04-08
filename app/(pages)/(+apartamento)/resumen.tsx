import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useForm } from '@/context/FormContext';
import API_BASE_URL from '@/utils/apiConfig';
import CustomAlert from '@/components/CustomAlert';
import { useUser } from '@clerk/clerk-expo';

export default function Resumen() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();
  const { formData, resetFormData } = useForm();
  const photos: string[] = formData.paso1_7?.photos || [];
  const { user } = useUser();

  const handleCreateListing = async () => {
    try {
      console.log('API:', API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/create-listing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id_clerk: user?.id,
          nombre_usuario: user?.fullName || user?.firstName || 'Usuario desconocido',
          imagen_url: user?.imageUrl || null,
        }),
      });
      if (response.ok) {
        setAlertMessage('Listado creado correctamente');
        setAlertVisible(true);
        resetFormData();
  
        // Esperamos 3 segundos antes de navegar
        setTimeout(() => {
          setAlertVisible(false);
          router.push('/(tabs)/Crear');
        }, 3000);
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
      <Stack.Screen
        options={{
          title: '',
          headerTitleStyle: { fontFamily: 'mon-b', fontSize: 22, marginTop: 20 },
        }}
      />

      <Text style={styles.header}>Resumen del Apartamento</Text>

      <Card>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Categoría del evento:</Text>
          <View style={styles.cardContent}>
            {formData.paso1_1?.length > 0 ? (
              formData.paso1_1.map((item, index) => (
                <Text key={index} style={styles.cardItem}>✅ {item}</Text>
              ))
            ) : (
              <Text style={styles.cardItem}>No se seleccionó ninguna categoría.</Text>
            )}
          </View>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Dirección Confirmada:</Text>
          <Text style={styles.cardItem}>
            {formData.paso1_2
              ? `País: ${formData.paso1_2.pais}\nDirección: ${formData.paso1_2.address}\nPuerta: ${formData.paso1_2.door}\nCódigo Postal: ${formData.paso1_2.postalCode}\nCiudad: ${formData.paso1_2.city}\nProvincia: ${formData.paso1_2.provincia}\nDistrito: ${formData.paso1_2.district}`
              : 'No hay dirección confirmada.'}
          </Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Información del espacio:</Text>
          {formData.paso1_3 ? (
            <Text style={styles.cardItem}>
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
            <Text style={styles.cardItem}>No se ha registrado la información del espacio.</Text>
          )}
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Servicios Incluidos:</Text>
          {formData.paso1_4 ? (
            <View style={styles.cardContent}>
              {Object.keys(formData.paso1_4)
                .filter(key => formData.paso1_4[key])
                .map((key, index) => (
                  <Text key={index} style={styles.cardItem}>✅ {key.replace(/_/g, ' ')}</Text>
                ))}
            </View>
          ) : (
            <Text style={styles.cardItem}>No se han seleccionado servicios.</Text>
          )}
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Reglas de la casa:</Text>
          {formData.paso1_5 ? (
            <View style={styles.cardContent}>
              {Object.keys(formData.paso1_5).map((key, index) => (
                <Text key={index} style={styles.cardItem}>
                  {formData.paso1_5[key] ? `✅ ${key.replace(/_/g, ' ')}` : `❌ ${key.replace(/_/g, ' ')}`}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.cardItem}>No se han seleccionado reglas.</Text>
          )}
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Detalles Adicionales:</Text>
          {formData.paso1_6 ? (
            <Text style={styles.cardItem}>
              Título: {formData.paso1_6.titulo}{"\n"}
              Descripción: {formData.paso1_6.descripcion}{"\n"}
              Precio: {formData.paso1_6.precio}
            </Text>
          ) : (
            <Text style={styles.cardItem}>No se han registrado detalles adicionales.</Text>
          )}
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Fotos:</Text>
          <View style={styles.photosContainer}>
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.photo} />
              ))
            ) : (
              <Text style={styles.cardItem}>No hay fotos seleccionadas.</Text>
            )}
          </View>
        </View>
      </Card>

      <TouchableOpacity style={styles.confirmButton} onPress={handleCreateListing}>
        <Text style={styles.confirmButtonText}>Confirmar y crear listado</Text>
      </TouchableOpacity>

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
}

// Componente Card para encapsular el contenido con estilo de tarjeta
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={cardStyles.card}>{children}</View>;
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 26,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardRow: {
    marginBottom: 16,
  },
  cardLabel: {
    fontFamily: 'mon-sb',
    fontSize: 18,
    color: '#444',
    marginBottom: 4,
  },
  cardItem: {
    fontFamily: 'mon',
    fontSize: 16,
    color: '#555',
  },
  cardContent: {
    marginLeft: 12,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  photo: {
    width: '48%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#6E8387',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    fontFamily: 'mon-b',
    fontSize: 16,
    color: '#fff',
  },
});

export { Resumen };
