import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useForm } from '@/context/FormContext'; // Importar el contexto

export default function Paso1_3() {
  const router = useRouter();
  const { formData, updateFormData } = useForm(); // Usar el contexto

  // Estados numéricos
  const [huespedes, setHuespedes] = useState(formData.paso1_3?.huespedes || 1);
  const [dormitorios, setDormitorios] = useState(formData.paso1_3?.dormitorios || 1);
  const [camas, setCamas] = useState(formData.paso1_3?.camas || 1);
  const [baños, setBaños] = useState(formData.paso1_3?.baños || 1);

  // Estados booleanos para cochera, parking, piscina y gimnasio (1 = Sí, 0 = No)
  const [cochera, setCochera] = useState(formData.paso1_3?.cochera || 0);
  const [parking, setParking] = useState(formData.paso1_3?.parking || 0);
  const [piscina, setPiscina] = useState(formData.paso1_3?.piscina || 0);
  const [gimnasio, setGimnasio] = useState(formData.paso1_3?.gimnasio || 0);
  const [cancelación, setCancelación] = useState(formData.paso1_3?.cancelación || 0);

  useEffect(() => {
    console.log('Valores actuales en paso1.3:', formData.paso1_3);
  }, [formData]);

  const handleIncrement = setter => setter(prev => prev + 1);
  const handleDecrement = (setter, value) => {
    if (value > 1) setter(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Se incluyen todos los campos en el objeto enviado al contexto
    updateFormData('paso1_3', { 
      huespedes, 
      dormitorios, 
      camas, 
      baños, 
      cochera, 
      parking, 
      piscina, 
      gimnasio,
      cancelación,
    });
    router.push('/paso1.4'); // Redirigir al siguiente paso
  };

  // Arreglo para contadores numéricos
  const numericCounters = [
    { label: 'Nº Maximo Huéspedes', value: huespedes, setter: setHuespedes },
    { label: 'Nº Dormitorios', value: dormitorios, setter: setDormitorios },
    { label: 'Nº Camas', value: camas, setter: setCamas },
    { label: 'Nº Baños', value: baños, setter: setBaños },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Paso 1.3',
          headerTitleStyle: { fontFamily: 'mon-b', fontSize: 24, marginTop: 20 },
        }} 
      />
      
      <Text style={styles.title}>Añade información sobre tu espacio</Text>

      {numericCounters.map((item, index) => (
        <View key={index} style={styles.rowContainer}>
          <Text style={styles.label}>{item.label}</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity 
              onPress={() => handleDecrement(item.setter, item.value)} 
              style={styles.counterButton}
            >
              <Text style={styles.counterButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{item.value}</Text>
            <TouchableOpacity 
              onPress={() => handleIncrement(item.setter)} 
              style={styles.counterButton}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Sección para opciones booleanas */}
      <View style={styles.booleanContainer}>
        <View style={styles.booleanRow}>
          <Text style={styles.label}>Cochera</Text>
          <Switch
            value={cochera === 1}
            onValueChange={(newValue) => setCochera(newValue ? 1 : 0)}
          />
        </View>
        <View style={styles.booleanRow}>
          <Text style={styles.label}>Parking</Text>
          <Switch
            value={parking === 1}
            onValueChange={(newValue) => setParking(newValue ? 1 : 0)}
          />
        </View>
        <View style={styles.booleanRow}>
          <Text style={styles.label}>Piscina</Text>
          <Switch
            value={piscina === 1}
            onValueChange={(newValue) => setPiscina(newValue ? 1 : 0)}
          />
        </View>
        <View style={styles.booleanRow}>
          <Text style={styles.label}>Gimnasio</Text>
          <Switch
            value={gimnasio === 1}
            onValueChange={(newValue) => setGimnasio(newValue ? 1 : 0)}
          />
        </View>
        <View style={styles.booleanRow}>
          <Text style={styles.label}>Cancelación gratuita</Text>
          <Switch
            value={cancelación === 1}
            onValueChange={(newValue) => setCancelación(newValue ? 1 : 0)}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleSubmit} // Guardar datos en contexto antes de pasar al siguiente paso
      >
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backContainer}
      >
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  rowContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  counterValue: {
    fontSize: 18,
    minWidth: 30,
    textAlign: 'center',
  },
  booleanContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  booleanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
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
});
