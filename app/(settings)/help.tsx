import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StyleSheet,
  } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { Stack } from 'expo-router';
  import Colors from '@/constants/Colors';
  import { useState } from 'react';
  
  const Ayuda = () => {
    const [selectedTab, setSelectedTab] = useState<'faq' | 'contact'>('faq');
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
  
    const handleSubmit = () => {
      if (question.trim()) {
        // Aquí se podría integrar un llamado a una API para enviar la pregunta
        setResponse(`Gracias por tu pregunta: "${question}". Te responderemos pronto.`);
        setQuestion('');
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
                Para crear una cuenta, haz clic en el botón de registro en la parte superior derecha y sigue las instrucciones.
              </Text>
            </View>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>¿Cómo puedo restablecer mi contraseña?</Text>
              <Text style={styles.faqAnswer}>
                Para restablecer tu contraseña, haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión y sigue las instrucciones.
              </Text>
            </View>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>¿Cómo puedo contactar con el soporte?</Text>
              <Text style={styles.faqAnswer}>
                Puedes contactar con el soporte a través de la sección de ayuda en nuestra aplicación o enviando un correo electrónico a AlquilaTuEvento@gmail.com.
              </Text>
            </View>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>¿Como puedo listar mi propiedad?</Text>
              <Text style={styles.faqAnswer}>
                Para listar tu propiedad tendras que descargar la app de AlquilaTuEvento Owner y seguir las instrucciones.
              </Text>
            </View>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>¿Cómo puedo reservar una propiedad?</Text>
              <Text style={styles.faqAnswer}>
                Para reservar una propiedad, simplemente haz clic en el botón de reserva en la página de la propiedad y sigue las instrucciones.
              </Text>
            </View>
          </View>
        );
      };
      
  
    const renderContact = () => {
      return (
        <View style={styles.contactContainer}>
          <Text style={styles.sectionLabel}>¿En qué te podemos ayudar?</Text>
          {/* Se eliminó el contenedor extra para evitar el recuadro negro */}
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
          {response ? (
            <View style={styles.responseContainer}>
              <Text style={styles.responseText}>{response}</Text>
            </View>
          ) : null}
          <View style={styles.contactInfo}>
            <Text style={styles.infoLabel}>O contáctanos por:</Text>
            <Text style={styles.infoText}>Email: AlquilaTuEvento@gmail.com</Text>
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
                marginTop: 20,
              },
            }}
          />
          <Text style={styles.headerTitle}>Centro de Ayuda</Text>
          {/* Pestañas de navegación */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'faq' && styles.tabButtonActive]}
              onPress={() => setSelectedTab('faq')}
            >
              <Text style={[styles.tabText, selectedTab === 'faq' && styles.tabTextActive]}>
                FAQ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'contact' && styles.tabButtonActive]}
              onPress={() => setSelectedTab('contact')}
            >
              <Text style={[styles.tabText, selectedTab === 'contact' && styles.tabTextActive]}>
                Contáctanos
              </Text>
            </TouchableOpacity>
          </View>
          {/* Renderizado condicional de contenido */}
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
    responseContainer: {
      marginTop: 20,
    },
    responseText: {
      fontFamily: 'mon',
      color: Colors.dark,
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
    // Estilos para sección FAQ
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
  