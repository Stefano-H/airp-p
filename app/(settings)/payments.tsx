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

const Payments = () => {
  // Datos actualizados con depósitos retornados
  const payments = [
    {
      id: 'VL-0424',
      date: '15 Abr 2024',
      amount: '€2,850',
      description: 'Alquiler completo - Temporada alta',
      status: 'Disponible 20/Abr',
      earnings: '€2,565',
      fees: '€285 (10%)',
      property: 'Villa Los Olivos (Marbella)',
      type: 'ingreso'
    },
    {
      id: 'AP-0325',
      date: '10 Abr 2024',
      amount: '-€600',
      description: 'Devolución depósito seguridad',
      status: 'Procesado 12/Abr',
      earnings: '-€600',
      fees: '€0',
      property: 'Ático Panorámico (Barcelona)',
      type: 'devolucion'
    },
    {
      id: 'CR-0318',
      date: '05 Abr 2024',
      amount: '€1,980',
      description: 'Alquiler fin de semana',
      status: 'Retirado 08/Abr',
      earnings: '€1,782',
      fees: '€198 (10%)',
      property: 'Casa Rural La Vega (Girona)',
      type: 'ingreso'
    }
  ];

  const availableBalance = '€4,615';
  const nextPayoutDate = '20 de Abril 2024';
  const mainAccount = 'BBVA •••• 3456';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGrey }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            title: 'Tus Ingresos',
            headerTitleStyle: styles.headerTitle
          }}
        />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Saldo Disponible</Text>
          <Text style={styles.summaryAmount}>{availableBalance}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>
              Próximo retiro: {nextPayoutDate}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="card" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>
              Cuenta principal: {mainAccount}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawButtonText}>Solicitar Retiro</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Movimientos Recientes</Text>
        
        {payments.map((payment) => (
          <View key={payment.id} style={[
            styles.paymentCard,
            payment.type === 'devolucion' && styles.refundCard
          ]}>
            <View style={styles.paymentHeader}>
              <Text style={styles.propertyName}>{payment.property}</Text>
              <Text style={[
                styles.paymentAmount,
                payment.type === 'devolucion' && styles.refundAmount
              ]}>
                {payment.amount}
              </Text>
            </View>
            
            <Text style={styles.paymentDescription}>{payment.description}</Text>
            
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentDate}>{payment.date}</Text>
              <View style={[
                styles.statusBadge,
                payment.type === 'devolucion' ? styles.refundStatus : 
                payment.status.includes('Disponible') ? styles.availableStatus :
                styles.withdrawnStatus
              ]}>
                <Text style={[
                  styles.statusText,
                  payment.type === 'devolucion' && styles.refundStatusText
                ]}>
                  {payment.status}
                </Text>
              </View>
            </View>
            
            {payment.type === 'ingreso' && (
              <View style={styles.breakdown}>
                <Text style={styles.breakdownText}>Líquido: {payment.earnings}</Text>
                <Text style={styles.breakdownText}>Comisión: {payment.fees}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'mon-b',
    fontSize: 20,
    color: Colors.dark,
    marginBottom: 16,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  refundCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  propertyName: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    color: Colors.dark,
    flex: 1,
    marginRight: 8,
  },
  paymentAmount: {
    fontFamily: 'mon-b',
    fontSize: 16,
    color: Colors.dark,
  },
  refundAmount: {
    color: Colors.error,
  },
  paymentDescription: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.grey,
    marginBottom: 8,
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentDate: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.grey,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  availableStatus: {
    backgroundColor: Colors.lightPrimary,
  },
  withdrawnStatus: {
    backgroundColor: Colors.lightGreen,
  },
  refundStatus: {
    backgroundColor: Colors.lightError,
  },
  statusText: {
    fontFamily: 'mon-sb',
    fontSize: 12,
  },
  refundStatusText: {
    color: Colors.error,
  },
  breakdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  breakdownText: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.dark,
  },
  headerTitle: {
    fontFamily: 'mon-b',
    fontSize: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 12,
  },
  summaryTitle: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.grey,
    marginBottom: 6,
  },
  summaryAmount: {
    fontFamily: 'mon-b',
    fontSize: 26,
    color: Colors.dark,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  infoText: {
    fontFamily: 'mon',
    fontSize: 13,
    color: Colors.dark,
  },
  withdrawButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  withdrawButtonText: {
    color: '#fff',
    fontFamily: 'mon-b',
    fontSize: 16,
  },
});

export default Payments;