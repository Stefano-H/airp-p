import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Switch, TouchableOpacity, ScrollView, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import * as Location from 'expo-location';
import { useForm } from '@/context/FormContext';

export default function Paso1_2() {
  const router = useRouter();
  const [exactLocation, setExactLocation] = useState(false);
  const { formData, updateFormData } = useForm();
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [form, setForm] = useState({
    address: '',
    door: '',
    postalCode: '',
    city: '',
    provincia: '',
    pais: '',
    district: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Estado para la búsqueda y sugerencias
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    // Solicitar permisos y obtener la ubicación cuando el componente se monta
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    };
    getLocation();
  }, []);

  useEffect(() => {
    // Si hay datos previos en el contexto, se llenan automáticamente en el formulario
    setForm(prev => ({
      ...prev,
      ...formData.paso1_2,
    }));
  }, [formData]);

  useEffect(() => {
    setIsFormValid(
      form.address.trim() !== '' &&
      form.door.trim() !== '' &&
      form.postalCode.trim() !== '' &&
      form.city.trim() !== '' &&
      form.provincia.trim() !== '' &&
      form.pais.trim() !== '' &&
      form.district.trim() !== ''
    );
  }, [form]);

  // Función para manejar los cambios en los inputs
  const handleInputChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if(name === 'address'){
      setQuery(value);
    }
  };

  // Función para manejar la selección de una sugerencia
  const handleSuggestionSelect = (suggestion: any) => {
    const addr = suggestion.address;
    setForm({
      address: addr.road || suggestion.display_name, // Si no hay 'road', se usa el display_name
      door: addr.house_number || '',
      postalCode: addr.postcode || '',
      city: addr.city || addr.town || addr.village || '',
      provincia: addr.state || '',
      pais: addr.country || '',
      district: addr.county || addr.suburb || '',
    });
    setQuery(''); // Limpiar el query
    setSuggestions([]); // Limpiar sugerencias
  };

  // Efecto para buscar sugerencias (debounce de 500ms)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error al obtener sugerencias:', error);
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = () => {
    updateFormData('paso1_2', {
      ...form,
      location, // Guarda la ubicación en el contexto
    });
    console.log('Formulario enviado:', { ...form, location });
    router.push('/paso1.3');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{
        title: 'Paso 1.2',
        headerTitleStyle: styles.headerTitle,
      }} />
      {/* Título y subtítulo */}
      <Text style={styles.title}>Confirma tu dirección</Text>
      <Text style={styles.subtitle}>Solo compartiremos la dirección con los huéspedes después de que hayan hecho la reserva.</Text>
      
      <Text style={styles.label}>País/región</Text>
      <TextInput 
        style={styles.input}
        placeholder='Ejemplo: España'
        value={form.pais}
        onChangeText={value => handleInputChange('pais', value)}
      />

      <Text style={styles.label}>Dirección postal</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: Avinguda d'Isabel la Catòlica, 38"
        value={form.address}
        onChangeText={value => handleInputChange('address', value)}
      />
      {/* Mostrar sugerencias debajo del input */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => handleSuggestionSelect(item)}>
              <View style={styles.suggestionItem}>
                <Text>{item.display_name}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      )}

      <Text style={styles.label}>Puerta, piso, escalera (si procede)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: 2ºA"
        value={form.door}
        onChangeText={value => handleInputChange('door', value)}
      />

      <Text style={styles.label}>Código postal</Text>
      <TextInput
        style={styles.input}
        placeholder="08905"
        keyboardType="numeric"
        value={form.postalCode}
        onChangeText={value => handleInputChange('postalCode', value)}
      />

      <Text style={styles.label}>Ciudad</Text>
      <TextInput 
        style={styles.input}
        placeholder='Ejemplo: Barcelona'
        value={form.city}
        onChangeText={value => handleInputChange('city', value)}
      />

      <Text style={styles.label}>Distrito</Text>
      <TextInput 
        style={styles.input}
        placeholder='Ejemplo: Eixample'
        value={form.district}
        onChangeText={value => handleInputChange('district', value)}
      />

      <Text style={styles.label}>Provincia</Text>
      <TextInput 
        style={styles.input}
        placeholder='Ejemplo: Cataluña'
        value={form.provincia}
        onChangeText={value => handleInputChange('provincia', value)}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Mostrar tu ubicación exacta</Text>
        <Switch value={exactLocation} onValueChange={setExactLocation} />
      </View>
      <Text style={styles.infoText}>Indica claramente a los huéspedes dónde se encuentra tu alojamiento. Solo les facilitaremos tu dirección cuando su reserva esté confirmada.</Text>

      <TouchableOpacity
        style={[styles.nextButton, !isFormValid && styles.disabledButton]}
        disabled={!isFormValid}
        onPress={handleSubmit}
      >
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.backContainer}>
        <Text style={styles.backText}>Atrás</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FCFAFA',
    flexGrow: 1,
  },
  headerTitle: {
    fontFamily: 'mon-b',
    fontSize: 24,
    marginTop: 20,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 20,
  },
  backContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  backText: {
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: '#000',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButton: {
    backgroundColor: '#6E8387',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
