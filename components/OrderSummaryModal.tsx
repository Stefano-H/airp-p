import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Colors from '@/constants/Colors';
import API_BASE_URL from '@/utils/apiConfig';

interface OrderSummaryModalProps {
    visible: boolean;
    onClose: () => void;
    orderData: {
        nombre_apellido: string;
        check_in: string;
        check_out: string;
        numero_telefono: string;
        notas_adicionales: string;
        id_clerk_cliente: string;
        nombre_apartamento: string; // Nuevo campo para el nombre del apartamento
        id_apartamento: string; // Nuevo campo para el ID del apartamento
    };
}

const OrderSummaryModal = ({ visible, onClose, orderData }: OrderSummaryModalProps) => {
    const [apartmentName, setApartmentName] = useState('');

    useEffect(() => {
        console.log('Apartment ID:', orderData.id_apartamento);
        const fetchApartmentName = async () => {
            try {
                console.log('Fetching apartment name...');
                const response = await axios.post(`${API_BASE_URL}/obtenerApartamento`, {
                    listingId: orderData.id_apartamento,
                });
                console.log('Apartment name:', response.data.name);
                setApartmentName(response.data.name);
            } catch (error) {
                console.error('Error fetching apartment name:', error);
            }
        };
        

        if (orderData.id_apartamento) {
            fetchApartmentName();
        }
    }, [orderData.id_apartamento]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>¡Gracias por tu solicitud de reserva!</Text>
                    <Text style={styles.subtitle}>Resumen de tu orden:</Text>
                    <Text style={styles.text}>Nombre y Apellido: {orderData.nombre_apellido}</Text>
                    <Text style={styles.text}>Check-In: {orderData.check_in}</Text>
                    <Text style={styles.text}>Check-Out: {orderData.check_out}</Text>
                    <Text style={styles.text}>Teléfono: {orderData.numero_telefono}</Text>
                    <Text style={styles.text}>Notas adicionales: {orderData.notas_adicionales}</Text>
                    <Text style={styles.text}>Nombre del apartamento: {apartmentName}</Text>
                    <Text style={styles.message}>Pronto serás contactado por teléfono o email para finalizar la reserva. Si deseas finalizar la reserva antes, puedes contactar al gestor con el ID del cliente proporcionado.</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    message: {
        fontSize: 16,
        marginVertical: 20,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});


export default OrderSummaryModal;