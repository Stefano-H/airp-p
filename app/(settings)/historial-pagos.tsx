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
import { TouchableWithoutFeedback } from 'react-native';

const Orders = () => {
  const [refundReason, setRefundReason] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const orders = [
    {
      id: '1',
      event: 'Fiesta de Cumpleaños',
      date: '2025-04-25',
      location: 'Barcelona, España',
      price: '€1,200',
      status: 'Confirmado'
    },
    {
      id: '2',
      event: 'Conferencia Corporativa',
      date: '2025-03-15',
      location: 'Madrid, España',
      price: '€2,500',
      status: 'Finalizado'
    },
    {
      id: '3',
      event: 'Boda en la Playa',
      date: '2025-03-28',
      location: 'Valencia, España',
      price: '€3,000',
      status: 'Confirmado'
    },
    {
      id: '4',
      event: 'Cena de Gala',
      date: '2025-05-01',
      location: 'Sevilla, España',
      price: '€1,800',
      status: 'Pendiente'
    }
  ];

  const isRefundable = (eventDate: string) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diffHours = (event.getTime() - now.getTime()) / 36e5;
    return diffHours > 48;
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
            title: 'Historial de pagos',
            headerTitleStyle: styles.headerTitle
          }}
        />
        
        <Text style={styles.mainTitle}>Transacciónes Recientes</Text>

        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text 
                style={styles.eventName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {order.event}
              </Text>
              <Text 
                style={styles.orderPrice}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {order.price}
              </Text>
            </View>
            
            <View style={styles.orderDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar" size={14} color={Colors.grey} />
                <Text style={styles.detailText}>{order.date}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="location" size={14} color={Colors.grey} />
                <Text 
                  style={styles.detailText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {order.location}
                </Text>
              </View>
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
          <TouchableWithoutFeedback 
            onPress={() => setShowRefundModal(false)}
            style={styles.modalOverlay}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
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
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight : 16,
    paddingLeft: 16,
    paddingBottom: 20,
    gap: 12
  },
  mainTitle: {
    fontFamily: 'mon-b',
    fontSize: 20,
    color: Colors.dark,
    marginBottom: 12
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8
  },
  eventName: {
    fontFamily: 'mon-sb',
    fontSize: 14,
    color: Colors.dark,
    flex: 1,
    marginRight: 8
  },
  orderPrice: {
    fontFamily: 'mon-b',
    fontSize: 14,
    color: Colors.primary,
    maxWidth: '40%'
  },
  orderDetails: {
    gap: 8,
    marginBottom: 12
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1
  },
  detailText: {
    fontFamily: 'mon',
    fontSize: 12,
    color: Colors.grey,
    flexShrink: 1,
    maxWidth: '85%'
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  statusBadge: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  statusText: {
    fontFamily: 'mon-sb',
    fontSize: 12,
  },
  refundButton: {
    backgroundColor: Colors.lightPrimary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12
  },
  refundButtonText: {
    fontFamily: 'mon-sb',
    color: Colors.primary,
    fontSize: 12
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  modalTitle: {
    fontFamily: 'mon-b',
    fontSize: 18,
    color: Colors.dark,
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
    fontSize: 14
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
  cancelButton: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 6,
    padding: 10
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    padding: 10
  },
  buttonText: {
    fontFamily: 'mon-sb',
    color: '#fff',
    fontSize: 14
  },
  headerTitle: {
    fontFamily: 'mon-b',
    fontSize: 18
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