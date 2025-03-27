import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useState } from 'react';

const Orders = () => {
  const [refundReason, setRefundReason] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);

  // Datos de ejemplo actualizados
  const orders = [
    {
      id: '1',
      event: 'Fiesta de Cumpleaños',
      date: '2025-04-25', // Más de 48h restantes (reembolsable)
      location: 'Barcelona, España',
      price: '€1,200',
      status: 'Confirmado'
    },
    {
      id: '2',
      event: 'Conferencia Corporativa',
      date: '2025-03-15', // Evento pasado (no reembolsable)
      location: 'Madrid, España',
      price: '€2,500',
      status: 'Finalizado'
    },
    {
      id: '3',
      event: 'Boda en la Playa',
      date: '2025-03-28', // Menos de 48h restantes (no reembolsable)
      location: 'Valencia, España',
      price: '€3,000',
      status: 'Confirmado'
    },
    {
      id: '4',
      event: 'Cena de Gala',
      date: '2025-05-01', // Más de 48h restantes (reembolsable)
      location: 'Sevilla, España',
      price: '€1,800',
      status: 'Pendiente'
    }
  ];

  const isRefundable = (eventDate: string) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diffHours = (event.getTime() - now.getTime()) / 36e5; // Horas restantes
    return diffHours > 48; // Solo reembolsable si hay más de 48h restantes
  };

  const handleRefundRequest = () => {
    console.log('Solicitud para:', selectedOrder);
    console.log('Motivo:', refundReason);
    setShowRefundModal(false);
    setRefundReason('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGrey }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            title: '',
            headerTitleStyle: styles.headerTitle
          }}
        />
        
        <Text style={styles.mainTitle}>Tus Reservas Activas</Text>

        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.eventName}>{order.event}</Text>
              <Text style={styles.orderPrice}>{order.price}</Text>
            </View>
            
            <View style={styles.orderDetails}>
              <Ionicons name="calendar" size={16} color={Colors.grey} />
              <Text style={styles.detailText}>{order.date}</Text>
              
              <Ionicons 
                name="location" 
                size={16} 
                color={Colors.grey} 
                style={styles.iconSpacing} 
              />
              <Text style={styles.detailText}>{order.location}</Text>
            </View>

            <View style={styles.orderFooter}>
              <View style={[
                styles.statusBadge, 
                { 
                  backgroundColor: order.status === 'Finalizado' 
                    ? Colors.lightGrey 
                    : Colors.lightPrimary 
                }
              ]}>
                <Text style={[
                  styles.statusText,
                  { 
                    color: order.status === 'Finalizado' 
                      ? Colors.grey 
                      : Colors.primary 
                  }
                ]}>
                  {order.status}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.refundButton,
                  !isRefundable(order.date) && styles.disabledButton
                ]}
                onPress={isRefundable(order.date) 
                  ? () => {
                      setSelectedOrder(order.id);
                      setShowRefundModal(true);
                    } 
                  : undefined}
                disabled={!isRefundable(order.date)}
              >
                <Text style={[
                  styles.refundButtonText,
                  !isRefundable(order.date) && styles.disabledText
                ]}>
                  {isRefundable(order.date) 
                    ? 'Solicitar Reembolso' 
                    : 'No disponible'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Modal visible={showRefundModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Solicitud de Reembolso</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Motivo de la solicitud..."
                placeholderTextColor={Colors.grey}
                multiline
                numberOfLines={4}
                value={refundReason}
                onChangeText={setRefundReason}
              />
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowRefundModal(false)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleRefundRequest}>
                  <Text style={styles.buttonText}>Enviar Solicitud</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 20
  },
  mainTitle: {
    fontFamily: 'mon-b',
    fontSize: 26,
    color: Colors.dark,
    marginBottom: 16
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  eventName: {
    fontFamily: 'mon-sb',
    fontSize: 18,
    color: Colors.dark
  },
  orderPrice: {
    fontFamily: 'mon-b',
    fontSize: 16,
    color: Colors.primary
  },
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  detailText: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.grey
  },
  iconSpacing: {
    marginLeft: 12
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12
  },
  statusText: {
    fontFamily: 'mon-sb',
    fontSize: 14,
    color: Colors.primary
  },
  refundButton: {
    backgroundColor: Colors.lightPrimary,
    borderRadius: 8,
    padding: 10
  },
  refundButtonText: {
    fontFamily: 'mon-sb',
    color: Colors.primary,
    fontSize: 14
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 24
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24
  },
  modalTitle: {
    fontFamily: 'mon-b',
    fontSize: 20,
    color: Colors.dark,
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  cancelButton: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    padding: 12
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12
  },
  buttonText: {
    fontFamily: 'mon-sb',
    color: '#fff',
    fontSize: 14
  },
  headerTitle: {
    fontFamily: 'mon-b',
    fontSize: 20,
    marginTop: 20
  },
  disabledButton: {
    backgroundColor: Colors.lightGrey,
    opacity: 0.7
  },
  disabledText: {
    color: Colors.grey
  }
});

export default Orders;