import React, { useState, } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useForm } from '@/context/FormContext'; // Importar el contexto

export default function Paso1_6() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const router = useRouter();
  const { formData, updateFormData } = useForm(); // Accede a los datos y funciones del contexto

  const handleTituloChange = (text: string) => setTitulo(text);
  const handleDescripcionChange = (text: string) => setDescripcion(text);
  
  const handlePrecioChange = (text: string) => {
    const formattedText = text.replace(/[^0-9]/g, ''); // Solo permite números
    setPrecio(formattedText);
  };

  // Comprobar si todos los campos están llenos
  const isNextButtonEnabled = titulo && descripcion && precio && parseFloat(precio) > 0;

  const handleSubmit = () => {
    updateFormData('paso1_6', { titulo, descripcion, precio });
    router.push('/paso1.7');
  };

  const handleBack = () => {
    router.push('/paso1.5'); // Redirige a paso1.5
  };

  console.log('Valores de paso 1.6:', { titulo, descripcion, precio });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{
        title: 'Paso 1.6',
        headerTitleStyle: { fontFamily: 'mon-b', fontSize: 24, marginTop: 20 },
      }} />

      <Text style={styles.title}>Detalles del Apartamento</Text>
      <Text style={styles.subtitle}>
        Completa los detalles de tu apartamento para que los huéspedes lo conozcan mejor.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Título del Apartamento</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={handleTituloChange}
          placeholder="Introduce un título para tu apartamento"
        />
      </View>

      {/* Contenedor de Descripción */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]} // Contenedor más ancho y borde negro
          value={descripcion}
          onChangeText={handleDescripcionChange}
          placeholder="Describe tu apartamento"
          multiline
        />
      </View>

      {/* Contenedor de Precio por Noche */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Precio por Noche</Text>
        <TextInput
          style={styles.precioInput}
          value={precio}
          onChangeText={handlePrecioChange}
          placeholder="Precio"
          keyboardType="numeric"
          maxLength={6}
        />
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !isNextButtonEnabled && styles.disabledButton]}
        disabled={!isNextButtonEnabled}
        onPress={handleSubmit}
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
  // Contenedor principal
  container: { 
    padding: 20, 
    backgroundColor: '#FCFAFA', 
    flexGrow: 1 
  },

  // Título
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10 
  },

  // Subtítulo
  subtitle: { 
    fontSize: 14, 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#555' 
  },

  // Contenedor del input
  inputContainer: { 
    marginBottom: 15 
  },

  // Etiquetas (labels) visibles
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },

  // Estilo del input de Título
  input: { 
    height: 40, 
    borderRadius: 8, 
    paddingLeft: 10, 
    marginBottom: 10, 
    borderWidth: 2, 
    borderColor: '#000' 
  },

  // Estilo del input de Precio por Noche (más estrecho)
  precioInput: {
    height: 40,
    width: '30%', // Contenedor más pequeño solo para número
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 15,
  },

  // Estilo del input de Descripción (más ancho y con borde negro)
  descriptionInput: {
    height: 100,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 15,
  },

  // Pie de página (footer) con botones de navegación
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20 
  },

  // Estilo de los botones de navegación
  navButton: { 
    padding: 10, 
    backgroundColor: '#007AFF', 
    borderRadius: 8, 
    width: '45%', 
    alignItems: 'center' 
  },

  navButtonText: { 
    color: '#fff', 
    fontSize: 16 
  },

  // Estilo del botón "Siguiente"
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

  // Estilo del botón deshabilitado
  disabledButton: {
    backgroundColor: '#ccc'
  },

  // Contenedor del botón "Atrás"
  backContainer: {
    alignItems: 'center',
    marginTop: 10
  },

  // Estilo del texto "Atrás"
  backText: {
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: '#000'
  },
});

