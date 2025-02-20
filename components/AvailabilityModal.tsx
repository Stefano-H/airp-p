import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { format, eachDayOfInterval, parseISO } from 'date-fns';
import { useUser } from '@clerk/clerk-expo';
import OrderSummaryModal from './OrderSummaryModal';
import { Ionicons } from '@expo/vector-icons';
import API_BASE_URL from '@/utils/apiConfig';

interface AvailabilityModalProps {
    visible: boolean;
    onClose: () => void;
    listingId: string;
}

const AvailabilityModal = ({ visible, onClose, listingId }: AvailabilityModalProps) => {
    const { user } = useUser();
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { disabled?: boolean, disableTouchEvent?: boolean, color?: string, marked?: boolean, dotColor?: string, selected?: boolean, selectedColor?: string } }>({});
    const [showCalendar, setShowCalendar] = useState(false);
    const [isCheckIn, setIsCheckIn] = useState(true);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [checkInTime, setCheckInTime] = useState({ hour: '', minute: '' });
    const [checkOutTime, setCheckOutTime] = useState({ hour: '', minute: '' });
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [orderSummaryVisible, setOrderSummaryVisible] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [datesUpdated, setDatesUpdated] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/getNotAvailability`, {
                    params: { id: listingId }
                });
                const availability = response.data;
                const newSelectedDates = availability.reduce((acc: any, date: string) => {
                    acc[date] = { disabled: true, disableTouchEvent: true, color: Colors.grey };
                    return acc;
                }, {});
                setSelectedDates(newSelectedDates);
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        if (visible) {
            fetchAvailability();
        }
    }, [visible, listingId]);

    const handleDayPress = (day: DateObject) => {
        if (selectedDates[day.dateString]?.disabled) {
            return; // No permitir la selección de fechas no disponibles
        }
    
        setSelectedDates(prevDates => {
            const newDates = { ...prevDates };
    
            if (isCheckIn) {
                // Deseleccionar el día anterior de check-in si existe
                if (checkInDate) {
                    delete newDates[checkInDate];
                }
                // Seleccionar el nuevo día de check-in
                setCheckInDate(day.dateString);
                newDates[day.dateString] = { selected: true, selectedColor: Colors.primary };
            } else {
                // Deseleccionar el día anterior de check-out si existe
                if (checkOutDate) {
                    delete newDates[checkOutDate];
                }
                // Seleccionar el nuevo día de check-out
                setCheckOutDate(day.dateString);
                newDates[day.dateString] = { selected: true, selectedColor: Colors.primary };
            }
    
            return newDates;
        });
    
        // Forzar una actualización del estado de las fechas seleccionadas
        setSelectedDates(prevDates => ({ ...prevDates }));
        setDatesUpdated(true);
    };

    // Obtener la fecha actual y formatearla
    const today = format(new Date(), 'yyyy-MM-dd');

    // Marcar la fecha actual como deshabilitada y resaltada
    useEffect(() => {
        if (datesUpdated) {
            setSelectedDates(prevDates => {
                const newDates = { ...prevDates };
    
                // Limpiar los puntos rojos excedentes
                Object.keys(newDates).forEach(date => {
                    if (newDates[date].marked && !newDates[date].selected) {
                        delete newDates[date].marked;
                        delete newDates[date].dotColor;
                    }
                });
    
                // Resaltar los días entre check-in y check-out
                if (checkInDate && checkOutDate) {
                    const interval = eachDayOfInterval({
                        start: parseISO(checkInDate),
                        end: parseISO(checkOutDate),
                    });
    
                    interval.forEach(date => {
                        const dateString = format(date, 'yyyy-MM-dd');
                        if (dateString !== checkInDate && dateString !== checkOutDate) {
                            newDates[dateString] = { ...newDates[dateString], color: 'rgba(255, 56, 92, 0.3)', marked: true, dotColor: Colors.primary };
                        }
                    });
                }
    
                console.log('Fechas seleccionadas después de actualizar:', newDates);
                return newDates;
            });
    
            setDatesUpdated(false);
        }
    }, [datesUpdated, checkInDate, checkOutDate]);

    const toggleCalendar = (isCheckInSelected: boolean) => {
        if (isCheckInSelected === isCheckIn && showCalendar) {
            setShowCalendar(false);
        } else {
            setIsCheckIn(isCheckInSelected);
            setShowCalendar(true);
        }
    };

    const handleSave = async () => {
        if (!user) {
            alert('Usuario no autenticado');
            return;
        }

        const checkInDateTime = `${checkInDate} ${checkInTime.hour}:${checkInTime.minute}:00`;
        const checkOutDateTime = `${checkOutDate} ${checkOutTime.hour}:${checkOutTime.minute}:00`;

        const orderData = {
            id_clerk_cliente: user.id,
            id_apartamento: listingId,
            nombre_apellido: fullName,
            check_in: checkInDateTime,
            check_out: checkOutDateTime,
            numero_telefono: phone,
            notas_adicionales: notes,
            confirmado: false,
        };

        try {
            await axios.post(`${API_BASE_URL}/ordenes`, orderData);
            setOrderData(orderData);
            setOrderSummaryVisible(true);
        } catch (error) {
            console.error('Error saving order:', error);
            alert('Error al guardar la orden');
        }
    };

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Configura Disponibilidad</Text>
                            <TouchableOpacity onPress={() => toggleCalendar(true)} style={styles.checkInContainer}>
                                <Ionicons name="calendar-outline" size={24} color={Colors.grey} style={styles.checkInIcon} />
                                <TextInput
                                    style={styles.checkInInput}
                                    placeholder="Check-in"
                                    value={`Check-In: ${checkInDate}`}
                                    editable={false}
                                />
                            </TouchableOpacity>
                            {showCalendar && isCheckIn && (
                                <>
                                    <Calendar
                                        onDayPress={handleDayPress}
                                        markedDates={selectedDates}
                                        minDate={today} // Deshabilitar todas las fechas anteriores a hoy
                                    />
                                    {checkInDate && (
                                        <View style={styles.timeContainer}>
                                            <View style={styles.timeInputContainer}>
                                                <Text style={styles.timeLabel}>Hora</Text>
                                                <TextInput
                                                    style={styles.timeInput}
                                                    placeholder="Hora"
                                                    keyboardType="numeric"
                                                    value={checkInTime.hour}
                                                    onChangeText={(text) => setCheckInTime({ ...checkInTime, hour: text })}
                                                />
                                            </View>
                                            <View style={styles.timeInputContainer}>
                                                <Text style={styles.timeLabel}>Minuto</Text>
                                                <TextInput
                                                    style={styles.timeInput}
                                                    placeholder="Minuto"
                                                    keyboardType="numeric"
                                                    value={checkInTime.minute}
                                                    onChangeText={(text) => setCheckInTime({ ...checkInTime, minute: text })}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </>
                            )}
                            <TouchableOpacity onPress={() => toggleCalendar(false)} style={styles.checkOutContainer}>
                                <Ionicons name="calendar-outline" size={24} color={Colors.grey} style={styles.checkOutIcon} />
                                <TextInput
                                    style={styles.checkOutInput}
                                    placeholder="Check-out"
                                    value={`Check-Out: ${checkOutDate}`}
                                    editable={false}
                                />
                            </TouchableOpacity>
                            {showCalendar && !isCheckIn && (
                                <>
                                    <Calendar
                                        onDayPress={handleDayPress}
                                        markedDates={selectedDates}
                                        minDate={today} // Deshabilitar todas las fechas anteriores a hoy
                                    />
                                    {checkOutDate && (
                                        <View style={styles.timeContainer}>
                                            <View style={styles.timeInputContainer}>
                                                <Text style={styles.timeLabel}>Hora</Text>
                                                <TextInput
                                                    style={styles.timeInput}
                                                    placeholder="Hora"
                                                    keyboardType="numeric"
                                                    value={checkOutTime.hour}
                                                    onChangeText={(text) => setCheckOutTime({ ...checkOutTime, hour: text })}
                                                />
                                            </View>
                                            <View style={styles.timeInputContainer}>
                                                <Text style={styles.timeLabel}>Minuto</Text>
                                                <TextInput
                                                    style={styles.timeInput}
                                                    placeholder="Minuto"
                                                    keyboardType="numeric"
                                                    value={checkOutTime.minute}
                                                    onChangeText={(text) => setCheckOutTime({ ...checkOutTime, minute: text })}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </>
                            )}
                            <Text style={styles.sectionTitle}>Datos Personales</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={24} color={Colors.grey} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre y Apellido"
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={24} color={Colors.grey} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Teléfono (WhatsApp)"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name="chatbubble-outline" size={24} color={Colors.grey} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Notas adicionales"
                                    value={notes}
                                    onChangeText={setNotes}
                                    multiline
                                />
                            </View>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Ionicons name="send-outline" size={24} color="#fff" style={styles.buttonIcon} />
                                <Text style={styles.saveButtonText}>Enviar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Ionicons name="close-outline" size={24} color="#fff" style={styles.buttonIcon} />
                                <Text style={styles.closeButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
            {orderData && (
                <OrderSummaryModal
                    visible={orderSummaryVisible}
                    onClose={() => setOrderSummaryVisible(false)}
                    orderData={orderData}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    timeInputContainer: {
        width: '48%',
    },
    timeLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    timeInput: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20,
        alignSelf: 'center',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#22ab49',
        borderRadius: 8,
        width: '90%', // Ajusta el ancho del botón
        alignSelf: 'center', // Centra el botón horizontalmente
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'mon-sb',
    },
    closeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 8,
        width: '90%', // Ajusta el ancho del botón
        alignSelf: 'center', // Centra el botón horizontalmente
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'mon-sb',
    },
    checkInContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
    checkInIcon: {
        marginRight: 10,
    },
    checkInInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        fontFamily: 'mon-sb',
    },
    checkOutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
    checkOutIcon: {
        marginRight: 10,
    },
    checkOutInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        fontFamily: 'mon-sb',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    buttonIcon: {
        marginRight: 10,
    },
});

export default AvailabilityModal;