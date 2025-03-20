import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StyleSheet,
  } from 'react-native';
    import { Stack } from 'expo-router';

const PoliticaPrivacidad = () => {
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
            <Text style={styles.title}>Política de Privacidad</Text>
            <Text style={styles.text}>
            Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos,
            usamos y protegemos tu información.
            </Text>
            <Text style={styles.subtitle}>1. Información que recopilamos</Text>
            <Text style={styles.text}>
            Recopilamos información personal como nombre, correo electrónico y datos de uso
            cuando utilizas nuestra aplicación.
            </Text>
            <Text style={styles.subtitle}>2. Uso de la información</Text>
            <Text style={styles.text}>
            Utilizamos tu información para mejorar nuestros servicios, procesar transacciones
            y ofrecer soporte al cliente.
            </Text>
            <Text style={styles.subtitle}>3. Protección de la información</Text>
            <Text style={styles.text}>
            Implementamos medidas de seguridad para proteger tu información personal contra
            accesos no autorizados.
            </Text>
        </View>
      </ScrollView>
    );
  };
  
  export default PoliticaPrivacidad;
  
  const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
    text: { fontSize: 16, marginBottom: 10 },
  });
  