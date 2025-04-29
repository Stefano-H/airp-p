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
  Alert,
  Button,
} from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { format } from 'date-fns';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import API_BASE_URL from '@/utils/apiConfig';
import { useRouter } from 'expo-router';

interface AvailabilityModalProps {
  visible: boolean;
  onClose: () => void;
  listingId: string;
  pricePerNight: number;
}

// Modal que simula tu propia pasarela de pago
const PaymentGatewayModal = ({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (card: {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  }) => void;
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.gatewayOverlay}>
        <View style={styles.gatewayCard}>
          <Text style={styles.gatewayTitle}>
            <Ionicons name="lock-closed-outline" size={20} /> Pago Seguro
          </Text>

          <TextInput
            placeholder="Número de tarjeta"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
            style={styles.gatewayInput}
          />

          <View style={styles.row}>
            <TextInput
              placeholder="MM"
              value={expMonth}
              onChangeText={setExpMonth}
              keyboardType="number-pad"
              style={[styles.gatewayInput, styles.halfInput]}
            />
            <TextInput
              placeholder="YYYY"
              value={expYear}
              onChangeText={setExpYear}
              keyboardType="number-pad"
              style={[styles.gatewayInput, styles.halfInput]}
            />
          </View>

          <TextInput
            placeholder="CVC"
            secureTextEntry
            value={cvc}
            onChangeText={setCvc}
            keyboardType="number-pad"
            style={[styles.gatewayInput, styles.cvcInput]}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelBtn]}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.payBtn]}
              onPress={() =>
                onSubmit({
                  cardNumber,
                  expMonth: parseInt(expMonth, 10),
                  expYear: parseInt(expYear, 10),
                  cvc,
                })
              }
            >
              <Text style={styles.payText}>Pagar ahora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const AvailabilityModal = ({
  visible,
  onClose,
  listingId,
  pricePerNight,
}: AvailabilityModalProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

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
  const [showGateway, setShowGateway] = useState(false);

  if (!isLoaded || !isSignedIn || !user) {
    return null; // o un spinner
  }

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const dayDifference = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
      );
      setTotalAmount(dayDifference * pricePerNight);
    }
  }, [checkInDate, checkOutDate, pricePerNight]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getNotAvailability`, {
          params: { id: listingId },
        });
        let availability = Array.isArray(response.data) ? response.data : [];
        const newDates = availability.reduce((acc: any, date: string) => {
          acc[date] = { disabled: true, disableTouchEvent: true, color: Colors.grey };
          return acc;
        }, {});
        setSelectedDates(newDates);
      } catch {
        setSelectedDates({});
      }
    };
    if (visible) fetchAvailability();
  }, [visible, listingId]);

  const validateFields = () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert('Error', 'Selecciona check-in y check-out');
      return false;
    }
    if (!fullName.trim()) {
      Alert.alert('Error', 'Ingresa tu nombre completo');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Ingresa un teléfono válido');
      return false;
    }
    return true;
  };

  const handlePayment = () => {
    if (!validateFields()) return;
    setShowGateway(true);
  };

  const onGatewaySubmit = async (card: {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  }) => {
    setShowGateway(false);
    setLoading(true);
    try {
      const resp = await axios.post(`${API_BASE_URL}/mock-payment`, {
        ...card,
        amount: totalAmount * 100,
        metadata: { listingId, userId: user?.id, checkInDate, checkOutDate },
      });
      if (resp.data.status !== 'approved') {
        throw new Error(resp.data.error || 'Pago rechazado');
      }

      await axios.post(`${API_BASE_URL}/ordenes`, {
        id_clerk_cliente: user.id,
        id_apartamento: listingId,
        nombre_apellido: fullName,
        check_in: `${checkInDate} ${checkInTime.hour}:${checkInTime.minute}:00`,
        check_out: `${checkOutDate} ${checkOutTime.hour}:${checkOutTime.minute}:00`,
        numero_telefono: phone,
        notas_adicionales: notes,
        confirmado: 1,
        monto_total: totalAmount,
        moneda: 'EUR',
        estado_pago: 'completado',
        metodo_pago: 'mock',
      });

    //   router.push('/reserva-confirmada');
    
      onClose();
    } catch (e: any) {
      Alert.alert('Error en pago', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PaymentGatewayModal
        visible={showGateway}
        onClose={() => setShowGateway(false)}
        onSubmit={onGatewaySubmit}
      />

      <Modal
        animationType="slide"
        transparent
        visible={visible && !showGateway}
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Completar Reserva</Text>

              <View style={styles.dateSection}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => {
                    setIsCheckIn(true);
                    setShowCalendar(true);
                  }}
                >
                  <Ionicons name="calendar" size={20} color={Colors.grey} />
                  <Text style={styles.dateText}>{checkInDate || 'Seleccionar Check-in'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => {
                    setIsCheckIn(false);
                    setShowCalendar(true);
                  }}
                >
                  <Ionicons name="calendar" size={20} color={Colors.grey} />
                  <Text style={styles.dateText}>{checkOutDate || 'Seleccionar Check-out'}</Text>
                </TouchableOpacity>
              </View>

              {showCalendar && (
                <Calendar
                  onDayPress={({ dateString }) => {
                    if (selectedDates[dateString]?.disabled) return;
                    setSelectedDates(prev => {
                      const next = { ...prev };
                      if (isCheckIn) {
                        if (checkInDate) delete next[checkInDate];
                        setCheckInDate(dateString);
                      } else {
                        if (checkOutDate) delete next[checkOutDate];
                        setCheckOutDate(dateString);
                      }
                      next[dateString] = { selected: true, selectedColor: Colors.primary };
                      return next;
                    });
                  }}
                  markedDates={selectedDates}
                  minDate={format(new Date(), 'yyyy-MM-dd')}
                  theme={{
                    todayTextColor: Colors.primary,
                    selectedDayBackgroundColor: Colors.primary,
                  }}
                />
              )}

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
                      (new Date(checkOutDate).getTime() -
                        new Date(checkInDate).getTime()) /
                        (1000 * 3600 * 24)
                    )}
                  </Text>
                </View>
              </View>

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
    </>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
      },
      modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
      },
      title: {
        fontSize: 22,
        fontFamily: 'mon-b',
        textAlign: 'center',
        marginBottom: 20,
      },
      gateway: {
        width: '90%',             // ahora ocupa el 90% del ancho de pantalla
        maxWidth: 400,            // y no supere 400px
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
      },
      marginRight: {
        marginRight: 10,          // espaciado entre MM y YYYY
      },
      input: {
        fontFamily: 'mon',
        fontSize: 16,
        borderWidth: 1,
        borderColor: Colors.lightGrey,
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 15,
      },
      payButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 10,
        padding: 15,
        marginTop: 20,
      },
      payButtonText: {
        color: '#fff',
        fontFamily: 'mon-b',
        fontSize: 16,
      },
    dateSection: {
      gap: 10,
      marginBottom: 20,
    },
    dateInput: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.grey,
      borderRadius: 10,
      padding: 15,
      gap: 10,
    },
    dateText: {
      fontFamily: 'mon',
      color: Colors.dark,
    },
    sectionTitle: {
      fontFamily: 'mon-sb',
      fontSize: 16,
      color: Colors.dark,
      marginVertical: 15,
    },
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.grey,
      borderRadius: 10,
      padding: 15,
      gap: 10,
      marginBottom: 15,
    },
    paymentSummary: {
      backgroundColor: Colors.lightGrey,
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    summaryLabel: {
      fontFamily: 'mon',
      color: Colors.grey,
    },
    summaryValue: {
      fontFamily: 'mon-b',
      color: Colors.dark,
    },
    cancelButton: {
      borderWidth: 1,
      borderColor: Colors.grey,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginTop: 10,
    },
    cancelButtonText: {
      color: Colors.dark,
      fontFamily: 'mon-sb',
    },
    gatewayOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      gatewayCard: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        // sombra iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // elevación Android
        elevation: 10,
      },
      gatewayTitle: {
        fontSize: 18,
        fontFamily: 'mon-b',
        textAlign: 'center',
        marginBottom: 20,
        color: Colors.primary,
      },
      gatewayInput: {
        fontFamily: 'mon',
        fontSize: 16,
        borderWidth: 1,
        borderColor: Colors.lightGrey,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#fafafa',
        marginBottom: 15,
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      halfInput: {
        flex: 1,
        marginRight: 10,
      },
      cvcInput: {
        width: 100,
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
      },
      button: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginLeft: 10,
      },
      cancelBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
      },
      payBtn: {
        backgroundColor: Colors.primary,
      },
      cancelText: {
        color: Colors.dark,
        fontFamily: 'mon-sb',
      },
      payText: {
        color: '#fff',
        fontFamily: 'mon-b',
      },      
  });
  
export default AvailabilityModal;
