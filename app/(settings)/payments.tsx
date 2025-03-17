import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
  } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { router, Stack } from 'expo-router';
  import { Ionicons } from '@expo/vector-icons';
  import Colors from '@/constants/Colors';
  
  const Payments = () => {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView contentContainerStyle={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 24, gap: 24 }}>
            <Stack.Screen
                options={{
                title: '',
                headerTitleStyle: {
                    fontFamily: 'mon-b',
                    fontSize: 20,
                    marginTop: 20,
                },
                }}
            />
          <Text style={styles.headerTitle}>Pagos y Cobros</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Viajes</Text>
            <PaymentItem title="Métodos de pago" />
            <PaymentItem title="Tus pagos" checked />
            <PaymentItem title="Créditos y cupones" />
          </View>
  
          <View style={styles.separator} />
  
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actividad de anfitrión</Text>
            <PaymentItem title="Métodos de cobro" />
            <PaymentItem title="Historial de transacciones" checked />
            <PaymentItem title="Donativos" />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  const PaymentItem = ({ title, checked = false }: { title: string; checked?: boolean }) => (
    <TouchableOpacity style={styles.paymentItem}>
      <Text style={styles.paymentText}>{title}</Text>
      {checked && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
    </TouchableOpacity>
  );
  
  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      marginBottom: 20,
    },
    headerTitle: {
      fontFamily: 'mon-b',
      fontSize: 24,
      color: Colors.dark,
    },
    section: {
      gap: 16,
    },
    sectionTitle: {
      fontFamily: 'mon-b',
      fontSize: 18,
      color: Colors.dark,
    },
    paymentItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    paymentText: {
      fontFamily: 'mon',
      fontSize: 16,
      color: Colors.dark,
    },
    separator: {
      height: 1,
      backgroundColor: Colors.grey,
      marginVertical: 24,
    },
  });
  
  export default Payments;