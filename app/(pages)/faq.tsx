import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const faqData = [
    {
        question: '¿Cómo puedo crear una cuenta?',
        answer: 'Para crear una cuenta, haz clic en el botón de registro en la parte superior derecha y sigue las instrucciones.',
    },
    {
        question: '¿Cómo puedo restablecer mi contraseña?',
        answer: 'Para restablecer tu contraseña, haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión y sigue las instrucciones.',
    },
    {
        question: '¿Cómo puedo contactar con el soporte?',
        answer: 'Puedes contactar con el soporte a través de la sección de ayuda en nuestra aplicación o enviando un correo electrónico a soporte@ejemplo.com.',
    },
    {
        question: '¿Como puedo listar mi propiedad?',
        answer: 'Para listar tu propiedad tendras que descargar la app de Airpnp Owner y seguir las instrucciones.',
    },
    {
        question: '¿Cómo puedo reservar una propiedad?',
        answer: 'Para reservar una propiedad, simplemente haz clic en el botón de reserva en la página de la propiedad y sigue las instrucciones.',
    },
    // Agrega más preguntas y respuestas aquí
];

const FAQPage = () => {
    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    title: 'Preguntas Frecuentes',
                    headerTitleStyle: {
                        fontFamily: 'mon-b',
                        fontSize: 24,
                        marginTop: 20,
                    },
                }}
            />
            <ScrollView style={styles.container}>
                {faqData.map((item, index) => (
                    <View key={index} style={styles.faqItem}>
                        <Text style={styles.question}>{item.question}</Text>
                        <Text style={styles.answer}>{item.answer}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    faqItem: {
        marginBottom: 16,
        marginTop: 16,
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    answer: {
        fontSize: 16,
        color: '#555',
    },
    header: {
        fontFamily: 'mon-b',
        fontSize: 24,
    },
});

export default FAQPage;