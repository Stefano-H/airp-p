import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

const Ayuda = () => {
  const [selectedTab, setSelectedTab] = useState<'faq' | 'contact'>('faq');
  const [question, setQuestion] = useState('');

  const handleSubmit = async () => {
    if (question.trim()) {
      const email = 'alquilatueventonline@gmail.com';
      const subject = 'Pregunta desde el Centro de Ayuda';
      const body = question;
      const url = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      try {
        await Linking.openURL(url);
        setQuestion('');
      } catch (error) {
        console.error('Error al abrir el cliente de correo', error);
        alert('Hubo un error al abrir el cliente de correo. Intenta de nuevo.');
      }
    } else {
      alert('Por favor, escribe tu pregunta.');
    }
  };

  const renderFaq = () => {
    return (
      <View style={styles.faqContainer}>
        <Text style={styles.faqTitle}>FAQ</Text>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>¿Cómo puedo crear una cuenta?</Text>
          <Text style={styles.faqAnswer}>
            Para crear una cuenta, dirígete a la página de "Perfil" y haz clic en el botón "Iniciar sesión". Luego, selecciona cómo quieres iniciar sesión/registrarte.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>¿Qué métodos de inicio de sesión puedo utilizar?</Text>
          <Text style={styles.faqAnswer}>
            Para iniciar sesión o registrarte, puedes usar por ahora tu cuenta de Google, Facebook o Apple (en el futuro se añadirán más métodos).
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>¿Cómo puedo contactar con el soporte?</Text>
          <Text style={styles.faqAnswer}>
            Puedes contactar con el soporte en la sección de "Contáctanos", donde podrás comunicarte por email o por teléfono.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>¿Cómo puedo listar mi propiedad?</Text>
          <Text style={styles.faqAnswer}>
            Para listar tu propiedad, simplemente ve a la sección de "Crear". Si es la primera vez que creas un apartamento, te pedirá transformar tu cuenta a una de propietario. Una vez hecho, ya podrás seguir los pasos para listar tu propiedad en la app.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>¿Cómo puedo reservar una propiedad?</Text>
          <Text style={styles.faqAnswer}>
            Para reservar una propiedad, simplemente selecciona la propiedad que deseas reservar, haz clic en "Solicitar Reserva" y sigue todos los pasos que se te indican para pagar y completar la reserva.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>¿Qué información muestra cada pago?</Text>
          <Text style={styles.faqAnswer}>
            Cada movimiento incluye: 1) Nombre de la propiedad, 2) Tipo de transacción, 3) Fechas clave, 4) Monto bruto/neto, 5) Comisiones, 6) Estado del dinero, y 7) Cuenta bancaria afectada.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>¿Cómo sé cuánto gané realmente por un alquiler?</Text>
          <Text style={styles.faqAnswer}>
            Busca el campo "Líquido" que muestra tu ganancia después de comisiones. Por ejemplo, si cobraste €1,000 con 10% de comisión, verás: "Líquido: €900" y "Comisión: €100 (10%)".
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>¿Puedo ver el historial completo de una propiedad?</Text>
          <Text style={styles.faqAnswer}>
            Sí, al tocar el nombre de cualquier propiedad en el historial, verás todos sus movimientos ordenados por fecha, incluyendo alquileres, depósitos y devoluciones.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>¿Qué significa "Depósito retornado" en mi historial?</Text>
          <Text style={styles.faqAnswer}>
            Es la devolución del depósito de seguridad que cobraste al inquilino al inicio. Aparece en negativo (ej: -€600) porque es dinero que sale de tu cuenta cuando lo devuelves al finalizar el alquiler si no hay daños.
          </Text>
        </View>
      </View>
    );
  };

  const renderContact = () => {
    return (
      <View style={styles.contactContainer}>
        <Text style={styles.sectionLabel}>¿En qué te podemos ayudar?</Text>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          style={styles.input}
          placeholder="Escribe tu pregunta..."
          multiline
          numberOfLines={4}
          textAlign="left"
          textAlignVertical="top"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Enviar pregunta</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.infoLabel}>O contáctanos por:</Text>
          <Text style={styles.infoText}>alquilatueventonline@gmail.com</Text>
          <Text style={styles.infoText}>Teléfono: +34561684369</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            title: '',
            headerTitleStyle: {
              fontFamily: 'mon-b',
              fontSize: 20,
            },
          }}
        />
        <Text style={styles.headerTitle}>Centro de Ayuda</Text>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'faq' && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab('faq')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'faq' && styles.tabTextActive,
              ]}
            >
              FAQ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'contact' && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab('contact')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'contact' && styles.tabTextActive,
              ]}
            >
              Contáctanos
            </Text>
          </TouchableOpacity>
        </View>
        {selectedTab === 'faq' ? renderFaq() : renderContact()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 22,
    paddingRight: 22,
    paddingBottom: 22,
    gap: 22,
  },
  headerTitle: {
    fontFamily: 'mon-b',
    fontSize: 24,
    color: Colors.dark,
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    color: Colors.dark,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  sectionLabel: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    color: Colors.dark,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'mon',
    fontSize: 16,
    color: Colors.dark,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'mon-b',
    color: '#fff',
    fontSize: 16,
  },
  contactInfo: {
    marginTop: 24,
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'mon-b',
    fontSize: 16,
    color: Colors.dark,
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.grey,
  },
  faqContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  faqTitle: {
    fontFamily: 'mon-b',
    fontSize: 20,
    color: Colors.dark,
    marginBottom: 16,
    textAlign: 'center',
  },
  faqItem: {
    marginBottom: 12,
  },
  faqQuestion: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    color: Colors.dark,
  },
  faqAnswer: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.grey,
    marginLeft: 8,
  },
});

export default Ayuda;
