import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  ScrollView,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { format, parseISO } from 'date-fns';
import { useUser } from '@clerk/clerk-expo';
import OrderSummaryModal from './OrderSummaryModal';
import { Ionicons } from '@expo/vector-icons';
import API_BASE_URL from '@/utils/apiConfig';
import { useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';

interface AvailabilityModalProps {
    visible: boolean;
    onClose: () => void;
    listingId: string;
    pricePerNight: number;
}

const AvailabilityModal = ({ visible, onClose, listingId, pricePerNight }: AvailabilityModalProps) => {
    const { user } = useUser();
    const router = useRouter();
    const stripe = useStripe();
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>({});
    const [showCalendar, setShowCalendar] = useState(false);
    const [isCheckIn, setIsCheckIn] = useState(true);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [checkInTime, setCheckInTime] = useState({ hour: '14', minute: '00' });
    const [checkOutTime, setCheckOutTime] = useState({ hour: '12', minute: '00' });
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchAvailability = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/getNotAvailability`, {
              params: { id: listingId },
            });
            let availability = response.data;
            // Si availability no es un arreglo, lo forzamos a vacío.
            if (!Array.isArray(availability)) {
              availability = [];
            }
            const newSelectedDates = availability.reduce((acc: any, date: string) => {
              acc[date] = { disabled: true, disableTouchEvent: true, color: Colors.grey };
              return acc;
            }, {});
            setSelectedDates(newSelectedDates);
          } catch (error) {
            console.error('Error fetching availability:', error);
            setSelectedDates({});
          }
        };
      
        if (visible) fetchAvailability();
      }, [visible, listingId]);

    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const start = new Date(checkInDate);
            const end = new Date(checkOutDate);
            
            // Calcular diferencia exacta en días
            const timeDifference = end.getTime() - start.getTime();
            const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
            
            // Validar que el precio sea un número válido
            if (isNaN(pricePerNight) || pricePerNight <= 0) {
                console.error('Precio por noche inválido:', pricePerNight);
                return;
            }
            
            setTotalAmount(dayDifference * pricePerNight);
            
            // Debug: Mostrar valores de cálculo
            console.log('Días:', dayDifference);
            console.log('Precio noche:', pricePerNight);
            console.log('Total:', dayDifference * pricePerNight);
        }
    }, [checkInDate, checkOutDate, pricePerNight]);

    const handleDayPress = (day: DateObject) => {
        if (selectedDates[day.dateString]?.disabled) return;

        setSelectedDates(prev => {
            const newDates = { ...prev };
            if (isCheckIn) {
                if (checkInDate) delete newDates[checkInDate];
                setCheckInDate(day.dateString);
                newDates[day.dateString] = { selected: true, selectedColor: Colors.primary };
            } else {
                if (checkOutDate) delete newDates[checkOutDate];
                setCheckOutDate(day.dateString);
                newDates[day.dateString] = { selected: true, selectedColor: Colors.primary };
            }
            return newDates;
        });
    };

    const validateFields = () => {
        if (!checkInDate || !checkOutDate) {
            Alert.alert('Error', 'Por favor selecciona fechas de check-in y check-out');
            return false;
        }
        if (!fullName.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu nombre completo');
            return false;
        }
        if (!phone.trim()) {
            Alert.alert('Error', 'Por favor ingresa un número de teléfono válido');
            return false;
        }
        return true;
    };

    const handlePayment = async () => {
        if (!validateFields()) return;
        setLoading(true);
      
        try {
            // 1. Crear intención de pago en el backend
            const paymentResponse = await axios.post(`${API_BASE_URL}/create-payment-intent`, {
                amount: totalAmount * 100, // Stripe requiere centavos
                currency: 'eur',
                listingId,
                metadata: {
                    checkIn: `${checkInDate} ${checkInTime.hour}:${checkInTime.minute}:00`,
                    checkOut: `${checkOutDate} ${checkOutTime.hour}:${checkOutTime.minute}:00`,
                    userId: user?.id
                }
            });
            console.log('Payment Response:', paymentResponse.data);
      
            // 2. Inicializar Stripe Payment Sheet
            const { error: initError } = await stripe.initPaymentSheet({
                paymentIntentClientSecret: paymentResponse.data.clientSecret,
                merchantDisplayName: "AlquilaTuEvento",
                returnURL: 'tuapp://stripe-redirect', 
              });
              
            if (initError) {
                console.error('Error initializing PaymentSheet:', initError);
                throw new Error(initError.message || 'Error al iniciar el Payment Sheet');
            }
            console.log('PaymentSheet inicializado');
      
            // 3. Mostrar el Payment Sheet
            console.log('Mostrando PaymentSheet...');

            const { error: paymentError } = await stripe.presentPaymentSheet();
            
            console.log('PaymentSheet presentado');
            if (paymentError) {
                console.error('Error presentando PaymentSheet:', paymentError);
                throw new Error(paymentError.message || 'Error al presentar el Payment Sheet');
            }
            console.log('PaymentSheet completado, PaymentIntent debería actualizarse');
      
            // 4. Confirmar el pago en el backend
            const confirmResponse = await axios.post(`${API_BASE_URL}/confirm-payment`, {
                paymentId: paymentResponse.data.paymentId,
                orderData: {
                    id_clerk_cliente: user?.id,
                    id_apartamento: listingId,
                    nombre_apellido: fullName,
                    check_in: `${checkInDate} ${checkInTime.hour}:${checkInTime.minute}:00`,
                    check_out: `${checkOutDate} ${checkOutTime.hour}:${checkOutTime.minute}:00`,
                    numero_telefono: phone,
                    notas_adicionales: notes,
                    monto_total: totalAmount,
                    stripe_payment_id: paymentResponse.data.paymentId
                }
            });
            console.log('Confirm payment response:', confirmResponse.data);
      
            // 5. Redirigir a confirmación
            router.push('/reserva-confirmada');
            onClose();
      
        } catch (error) {
            console.error('Error en el pago:', error);
            Alert.alert('Error en el pago', error.message || 'Ocurrió un error al procesar el pago');
        } finally {
            setLoading(false);
        }
      };      

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Completar Reserva</Text>

                        {/* Sección de fechas */}
                        <View style={styles.dateSection}>
                            <TouchableOpacity 
                                style={styles.dateInput} 
                                onPress={() => { setIsCheckIn(true); setShowCalendar(true); }}
                            >
                                <Ionicons name="calendar" size={20} color={Colors.grey} />
                                <Text style={styles.dateText}>
                                    {checkInDate || 'Seleccionar Check-in'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.dateInput} 
                                onPress={() => { setIsCheckIn(false); setShowCalendar(true); }}
                            >
                                <Ionicons name="calendar" size={20} color={Colors.grey} />
                                <Text style={styles.dateText}>
                                    {checkOutDate || 'Seleccionar Check-out'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {showCalendar && (
                            <Calendar
                                onDayPress={handleDayPress}
                                markedDates={selectedDates}
                                minDate={format(new Date(), 'yyyy-MM-dd')}
                                theme={{
                                    todayTextColor: Colors.primary,
                                    selectedDayBackgroundColor: Colors.primary
                                }}
                            />
                        )}

                        {/* Campos de información personal */}
                        <Text style={styles.sectionTitle}>Tus Datos</Text>
                        <View style={styles.inputGroup}>
                            <Ionicons name="person" size={20} color={Colors.grey} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre Completo"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Ionicons name="call" size={20} color={Colors.grey} />
                            <TextInput
                                style={styles.input}
                                placeholder="Teléfono"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>

                        {/* Resumen de pago */}
                        <Text style={styles.sectionTitle}>Resumen del Pago</Text>
                        <View style={styles.paymentSummary}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>{pricePerNight}€ x noche</Text>
                                <Text style={styles.summaryValue}>{totalAmount}€</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Noches:</Text>
                                <Text style={styles.summaryValue}>
                                    {Math.ceil(
                                        (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 
                                        (1000 * 3600 * 24)
                                    )}
                                </Text>
                            </View>
                        </View>

                        {/* Botones */}
                        <TouchableOpacity 
                            style={styles.payButton} 
                            onPress={handlePayment}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="lock-closed" size={18} color="#fff" />
                                    <Text style={styles.payButtonText}>Pagar Ahora</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20
    },
    title: {
        fontSize: 22,
        fontFamily: 'mon-b',
        textAlign: 'center',
        marginBottom: 20
    },
    dateSection: {
        gap: 10,
        marginBottom: 20
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 10,
        padding: 15,
        gap: 10
    },
    dateText: {
        fontFamily: 'mon',
        color: Colors.dark
    },
    sectionTitle: {
        fontFamily: 'mon-sb',
        fontSize: 16,
        color: Colors.dark,
        marginVertical: 15
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 10,
        padding: 15,
        gap: 10,
        marginBottom: 15
    },
    input: {
        flex: 1,
        fontFamily: 'mon',
        fontSize: 16
    },
    paymentSummary: {
        backgroundColor: Colors.lightGrey,
        borderRadius: 10,
        padding: 15,
        marginVertical: 10
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    summaryLabel: {
        fontFamily: 'mon',
        color: Colors.grey
    },
    summaryValue: {
        fontFamily: 'mon-b',
        color: Colors.dark
    },
    payButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 10,
        padding: 15,
        marginTop: 20,
        gap: 10
    },
    payButtonText: {
        color: '#fff',
        fontFamily: 'mon-b',
        fontSize: 16
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 10
    },
    cancelButtonText: {
        color: Colors.dark,
        fontFamily: 'mon-sb'
    }
});

export default AvailabilityModal;