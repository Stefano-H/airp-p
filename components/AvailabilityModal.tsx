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
} from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { format } from 'date-fns';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import API_BASE_URL from '@/utils/apiConfig';
import { useRouter } from 'expo-router';

interface AvailabilityModalProps {
  visible: boolean;
  onClose: () => void;
  listingId: string;
  pricePerNight: number;
}

// Modal de confirmación profesional
const PaymentSuccessModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.successOverlay}>
      <View style={styles.successCard}>
        <Ionicons name="checkmark-circle-outline" size={48} color={Colors.primary} />
        <Text style={styles.successTitle}>¡Pago Confirmado!</Text>
        <Text style={styles.successMessage}>
          Tu reserva se ha procesado correctamente.
        </Text>
        <TouchableOpacity style={styles.successButton} onPress={onClose}>
          <Text style={styles.successButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// Modal que simula tu propia pasarela de pago
const PaymentGatewayModal = (props: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (card: {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  }) => void;
}) => {
  const { visible, onClose, onSubmit } = props;
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
            <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onClose}>
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
  const [checkInTime] = useState({ hour: '14', minute: '00' });
  const [checkOutTime] = useState({ hour: '12', minute: '00' });
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showGateway, setShowGateway] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isLoaded) return null;

  if (!isSignedIn || !user) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.loginOverlay}>
          <View style={styles.loginCard}>
            <Ionicons name="alert-circle-outline" size={36} color={Colors.primary} />
            <Text style={styles.loginTitle}>Acceso Restringido</Text>
            <Text style={styles.loginMessage}>
              Para solicitar una reserva debes iniciar sesión.
            </Text>
            <View style={styles.loginButtons}>
              <TouchableOpacity
                style={[styles.button, styles.loginBtn]}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.loginBtnText}>Iniciar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onClose}>
                <Text style={styles.cancelText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // ocultar success + availability al cerrar
  const closeSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      setTotalAmount(days * pricePerNight);
    }
  }, [checkInDate, checkOutDate, pricePerNight]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const resp = await axios.get(`${API_BASE_URL}/getNotAvailability`, {
          params: { id: listingId },
        });
        const dates = Array.isArray(resp.data) ? resp.data : [];
        const marked = dates.reduce((acc: any, d: string) => {
          acc[d] = { disabled: true, disableTouchEvent: true, color: Colors.grey };
          return acc;
        }, {});
        setSelectedDates(marked);
      } catch {
        setSelectedDates({});
      }
    };
    if (visible) fetchAvailability();
  }, [visible, listingId]);

  const validate = () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert('Error', 'Selecciona fechas');
      return false;
    }
    if (!fullName.trim() || !phone.trim()) {
      Alert.alert('Error', 'Ingresa nombre y teléfono');
      return false;
    }
    return true;
  };

  const handlePayment = () => {
    if (!validate()) return;
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
        metadata: { listingId, userId: user.id, checkInDate, checkOutDate },
      });
      if (resp.data.status !== 'approved') throw new Error('Pago rechazado');

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

      setShowSuccess(true);
    } catch (err: any) {
      Alert.alert('Error en pago', err.message);
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
      <PaymentSuccessModal visible={showSuccess} onClose={closeSuccess} />

      <Modal transparent visible={visible && !showGateway && !showSuccess} animationType="slide">
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Completar Reserva</Text>

              {/* fechas */}
              <View style={styles.dateSection}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => { setIsCheckIn(true); setShowCalendar(true); }}
                >
                  <Ionicons name="calendar" size={20} color={Colors.grey} />
                  <Text style={styles.dateText}>{checkInDate || 'Check-in'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => { setIsCheckIn(false); setShowCalendar(true); }}
                >
                  <Ionicons name="calendar" size={20} color={Colors.grey} />
                  <Text style={styles.dateText}>{checkOutDate || 'Check-out'}</Text>
                </TouchableOpacity>
              </View>
              {showCalendar && (
                <Calendar
                  onDayPress={({ dateString }) => {
                    setSelectedDates(prev => {
                      const nxt = { ...prev };
                      if (isCheckIn) {
                        if (checkInDate) delete nxt[checkInDate];
                        setCheckInDate(dateString);
                      } else {
                        if (checkOutDate) delete nxt[checkOutDate];
                        setCheckOutDate(dateString);
                      }
                      nxt[dateString] = { selected: true, selectedColor: Colors.primary };
                      return nxt;
                    });
                  }}
                  markedDates={selectedDates}
                  minDate={format(new Date(), 'yyyy-MM-dd')}
                  theme={{ todayTextColor: Colors.primary }}
                />
              )}

              {/* datos usuario */}
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

              {/* resumen */}
              <Text style={styles.sectionTitle}>Resumen</Text>
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

              {/* botones */}
              <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payButtonText}>Pagar Ahora</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
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
  safeArea: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  scrollViewContent: { flexGrow: 1, justifyContent: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20, margin: 20 },
  title: { fontSize: 22, fontFamily: 'mon-b', textAlign: 'center', marginBottom: 20 },

  // date
  dateSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dateInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.grey, borderRadius: 8, padding: 10, flex: 1, marginHorizontal: 5 },
  dateText: { fontFamily: 'mon', color: Colors.dark, marginLeft: 8 },

  sectionTitle: { fontFamily: 'mon-sb', fontSize: 16, color: Colors.dark, marginTop: 20, marginBottom: 10 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.grey, borderRadius: 8, padding: 10, marginBottom: 15 },
  input: { flex: 1, fontFamily: 'mon', fontSize: 16, padding: 8 },

  paymentSummary: { backgroundColor: Colors.lightGrey, borderRadius: 8, padding: 10, marginVertical: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  summaryLabel: { fontFamily: 'mon', color: Colors.grey },
  summaryValue: { fontFamily: 'mon-b', color: Colors.dark },

  payButton: { backgroundColor: Colors.primary, borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 10 },
  payButtonText: { color: '#fff', fontFamily: 'mon-b', fontSize: 16 },
  cancelButton: { borderWidth: 1, borderColor: Colors.grey, borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 10 },
  cancelButtonText: { color: Colors.dark, fontFamily: 'mon-sb' },

  // gateway
  gatewayOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  gatewayCard: { width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 10 },
  gatewayTitle: { fontSize: 18, fontFamily: 'mon-b', color: Colors.primary, textAlign: 'center', marginBottom: 15 },
  gatewayInput: { fontFamily: 'mon', fontSize: 16, borderWidth: 1, borderColor: Colors.lightGrey, borderRadius: 6, padding: 10, backgroundColor: '#fafafa', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { flex: 1, marginHorizontal: 5 },
  cvcInput: { width: 100 },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  button: { borderRadius: 6, paddingVertical: 10, paddingHorizontal: 15, marginLeft: 10 },
  cancelBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.grey },
  payBtn: { backgroundColor: Colors.primary },
  cancelText: { color: Colors.dark, fontFamily: 'mon-sb', textAlign: 'center' },
  payText: { color: '#fff', fontFamily: 'mon-b', textAlign: 'center' },

  // success modal
  successOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  successCard: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', elevation: 12 },
  successTitle: { fontSize: 20, fontFamily: 'mon-b', color: Colors.primary, marginVertical: 8 },
  successMessage: { fontSize: 16, fontFamily: 'mon', color: Colors.dark, textAlign: 'center', marginBottom: 20 },
  successButton: { backgroundColor: Colors.primary, borderRadius: 6, paddingVertical: 12, paddingHorizontal: 30 },
  successButtonText: { color: '#fff', fontFamily: 'mon-b', fontSize: 16 },

  // login overlay
  loginOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  loginCard: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 25, alignItems: 'center', elevation: 12 },
  loginTitle: { fontSize: 20, fontFamily: 'mon-b', color: Colors.primary, marginBottom: 10 },
  loginMessage: { fontSize: 16, fontFamily: 'mon', color: Colors.dark, textAlign: 'center', marginBottom: 20 },
  loginButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  loginBtn: { flex: 1, backgroundColor: Colors.primary, marginRight: 10 },
  loginBtnText: { color: '#fff', fontFamily: 'mon-b', textAlign: 'center', paddingVertical: 10 },
});

export default AvailabilityModal;
