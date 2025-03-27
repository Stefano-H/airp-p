import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useUser } from '@clerk/clerk-expo';

const Payments = () => {
  const { user } = useUser();
  const isHost = true; // Cambiar a false para ver la vista de usuario

  // Datos de ejemplo para usuarios
  const userPayments = [
    {
      id: '1',
      date: '15 Mar 2024',
      amount: '€1,200',
      description: 'Reserva Fiesta de Cumpleaños',
      status: 'Pagado',
      method: 'Visa •••• 1234'
    },
    {
      id: '2',
      date: '12 Mar 2024',
      amount: '€850',
      description: 'Depósito de Seguridad',
      status: 'Reembolsado',
      method: 'Mastercard •••• 5678'
    }
  ];

  // Datos específicos para propietarios
  const hostPayments = [
    {
      id: 'H1',
      date: '20 Mar 2024',
      amount: '€2,450',
      description: 'Evento Corporativo XYZ',
      status: 'Disponible 15/Abr',
      earnings: '€2,150',
      fees: '€300'
    },
    {
      id: 'H2',
      date: '5 Mar 2024',
      amount: '€1,800',
      description: 'Boda en Jardín',
      status: 'Retirado 10/Mar',
      earnings: '€1,600',
      fees: '€200'
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGrey }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            title: '',
            headerTitleStyle: styles.headerTitleStyle,
          }}
        />
        
        <View style={styles.header}>
          <Text style={styles.title}>
            {isHost ? 'Gestión de Ingresos' : 'Historial de Pagos'}
          </Text>
          {isHost && (
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="cash-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {isHost && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Saldo Disponible</Text>
            <Text style={styles.summaryAmount}>€4,750</Text>
            
            <View style={styles.withdrawalInfo}>
              <Ionicons name="calendar" size={18} color={Colors.primary} />
              <Text style={styles.withdrawalText}>
                Próxima fecha de retiro: 5 de Abril
              </Text>
            </View>
            
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawButtonText}>Solicitar Retiro</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {isHost ? 'Eventos Recientes' : 'Tus Transacciones'}
        </Text>
        
        {(isHost ? hostPayments : userPayments).map((payment) => (
          <View key={payment.id} style={styles.paymentCard}>
            <View style={styles.paymentIcon}>
              <Ionicons 
                name={isHost ? 'business' : 'card'} 
                size={28} 
                color={Colors.primary} 
              />
            </View>
            
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentDescription}>{payment.description}</Text>
              <Text style={styles.paymentDate}>{payment.date}</Text>
              {!isHost && (
                <Text style={styles.paymentMethod}>{payment.method}</Text>
              )}
            </View>
            
            <View style={styles.paymentAmountContainer}>
              <Text style={styles.paymentAmount}>{payment.amount}</Text>
              <View style={[
                styles.statusBadge,
                { 
                  backgroundColor: payment.status.includes('Disponible') 
                    ? Colors.lightPrimary 
                    : Colors.lightGrey 
                }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: payment.status.includes('Disponible') 
                    ? Colors.primary 
                    : Colors.dark 
                  }
                ]}>
                  {payment.status}
                </Text>
              </View>
              {isHost && (
                <View style={styles.breakdown}>
                  <Text style={styles.breakdownText}>Líquido: {payment.earnings}</Text>
                  <Text style={styles.breakdownText}>Comisiones: {payment.fees}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'mon-b',
    fontSize: 28,
    color: Colors.dark,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.lightPrimary,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontFamily: 'mon',
    fontSize: 16,
    color: Colors.grey,
    marginBottom: 8,
  },
  summaryAmount: {
    fontFamily: 'mon-b',
    fontSize: 32,
    color: Colors.dark,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.grey,
  },
  summaryValue: {
    fontFamily: 'mon-b',
    fontSize: 18,
  },
  sectionTitle: {
    fontFamily: 'mon-b',
    fontSize: 20,
    color: Colors.dark,
    marginTop: 8,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  paymentIcon: {
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDescription: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    color: Colors.dark,
    marginBottom: 4,
  },
  paymentDate: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.grey,
  },
  paymentAmountContainer: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontFamily: 'mon-b',
    fontSize: 16,
    marginBottom: 4,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: 'mon-sb',
    fontSize: 12,
  },
  headerTitleStyle: {
    fontFamily: 'mon-b',
    fontSize: 20,
    marginTop: 20,
  },
  withdrawalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
  },
  withdrawalText: {
    fontFamily: 'mon',
    color: Colors.grey,
    fontSize: 14,
  },
  withdrawButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  withdrawButtonText: {
    color: '#fff',
    fontFamily: 'mon-b',
    fontSize: 16,
  },
  paymentMethod: {
    fontFamily: 'mon',
    color: Colors.grey,
    fontSize: 14,
    marginTop: 4,
  },
  breakdown: {
    marginTop: 8,
  },
  breakdownText: {
    fontFamily: 'mon',
    fontSize: 12,
    color: Colors.grey,
  },
});

export default Payments;