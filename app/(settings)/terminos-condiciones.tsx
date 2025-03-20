import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StyleSheet,
  } from 'react-native';
    import { Stack } from 'expo-router';

const TerminosCondiciones = () => {
    return (
    <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            title: '',
            headerTitleStyle: {
              fontFamily: 'mon-b',
              fontSize: 20,
              marginTop: 20,
            },
          }}
        />
        <View style={styles.container}>
            <Text style={styles.title}>Términos y Condiciones</Text>
            <Text style={styles.text}>
            Al utilizar nuestra aplicación, aceptas cumplir con los siguientes términos y condiciones.
            </Text>
            <Text style={styles.subtitle}>1. Uso de la aplicación</Text>
            <Text style={styles.text}>
            Nuestra aplicación está diseñada para facilitar la reserva y gestión de propiedades.
            </Text>
            <Text style={styles.subtitle}>2. Responsabilidad del usuario</Text>
            <Text style={styles.text}>
            Eres responsable de la veracidad de la información que proporciones y del uso adecuado
            de la plataforma.
            </Text>
            <Text style={styles.subtitle}>3. Modificaciones</Text>
            <Text style={styles.text}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento.
            </Text>
        </View>
      </ScrollView>
    );
  };
  
  export default TerminosCondiciones;
  
  const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
    text: { fontSize: 16, marginBottom: 10 },
  });
  