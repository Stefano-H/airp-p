import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import axios from 'axios';
import API_BASE_URL from '@/utils/apiConfig';
import { TouchableWithoutFeedback } from 'react-native';

interface Order {
  id: number;
  id_clerk_cliente: string;
  id_apartamento: number;
  nombre_apellido: string;
  fecha_check_in: string;
  fecha_check_out: string;
  telefono: string;
  notas_adicionales: string | null;
  confirmado: number;
  monto_total: number;
  moneda: string;
  stripe_payment_id: string;
  estado_pago: 'pendiente' | 'completado' | 'fallido';
  metodo_pago: string;
  // campos extra traídos del JOIN con listings:
  listing_name: string;
  listing_miniatura: string;
  listing_price: number;
}

const Orders = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const resp = await axios.get<Order[]>(
          `${API_BASE_URL}/api/ordenes-by-user`,
          { params: { clerkId: user!.id } }
        );
        setOrders(resp.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return (
      <SafeAreaView style={styles.loginOverlay}>
        <Text style={styles.loginTitle}>Debes iniciar sesión para ver tu historial.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGrey }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            title: 'Historial de pagos',
            headerTitleStyle: styles.headerTitle
          }}
        />

        <Text style={styles.mainTitle}>Transacciones Recientes</Text>

        {loading && (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }}/>
        )}

        {!loading && orders.map(order => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => {
              setSelectedOrder(order);
              setShowDetailModal(true);
            }}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.eventName} numberOfLines={1} ellipsizeMode="tail">
                {order.listing_name}
              </Text>
              <Text style={styles.orderPrice}>€{order.monto_total}</Text>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar" size={14} color={Colors.grey} />
                <Text style={styles.detailText}>
                  {order.fecha_check_in.split(' ')[0]}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={14} color={Colors.grey} />
                <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
                  ID Apt: {order.id_apartamento}
                </Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <View style={[
                  styles.statusBadge,
                  { backgroundColor: order.estado_pago === 'completado' ? Colors.lightPrimary : Colors.lightGrey }
                ]}>
                <Text style={[
                    styles.statusText,
                    { color: order.estado_pago === 'completado' ? Colors.primary : Colors.grey }
                  ]}>
                  {order.estado_pago.charAt(0).toUpperCase() + order.estado_pago.slice(1)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Detalle de la orden */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDetailModal(false)}>
          <View style={styles.detailOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.detailCard}>
                {selectedOrder && (
                  <>
                    <Text style={styles.detailTitle}>
                      {selectedOrder.listing_name}
                    </Text>
                    <Image
                      source={{ uri: selectedOrder.listing_miniatura }}
                      style={styles.detailImage}
                    />
                    <Text style={styles.detailLabel}>
                      Check-in: {selectedOrder.fecha_check_in.replace('T', ' ').substring(0,16)}
                    </Text>
                    <Text style={styles.detailLabel}>
                      Check-out: {selectedOrder.fecha_check_out.replace('T', ' ').substring(0,16)}
                    </Text>
                    <Text style={styles.detailLabel}>
                      Huésped: {selectedOrder.nombre_apellido}
                    </Text>
                    <Text style={styles.detailLabel}>
                      Teléfono: {selectedOrder.telefono}
                    </Text>
                    {selectedOrder.notas_adicionales ? (
                      <Text style={styles.detailLabel}>
                        Notas: {selectedOrder.notas_adicionales}
                      </Text>
                    ) : null}
                    <Text style={styles.detailLabel}>
                      Monto: €{selectedOrder.monto_total}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowDetailModal(false)}
                    >
                      <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
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
    flex: 1
  },
  orderPrice: {
    fontFamily: 'mon-b',
    fontSize: 14,
    color: Colors.primary
  },
  orderDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  detailText: {
    fontFamily: 'mon',
    fontSize: 12,
    color: Colors.grey
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  // detalle modal
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  detailCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20
  },
  detailTitle: {
    fontFamily: 'mon-b',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center'
  },
  detailImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12
  },
  detailLabel: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.dark,
    marginBottom: 6
  },
  closeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontFamily: 'mon-b',
    fontSize: 14
  },
  loginOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey
  },
  loginTitle: {
    fontFamily: 'mon-b',
    fontSize: 18,
    color: Colors.dark
  },
  headerTitle: {
    fontFamily: 'mon-b',
    fontSize: 18
  }
});

export default Orders;
