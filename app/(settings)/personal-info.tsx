import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useState } from 'react';

const PersonalInfo = () => {
  const { user, updateUser } = useUser();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumbers[0]?.phoneNumber || '');
  const [email, setEmail] = useState(user?.emailAddresses[0]?.emailAddress || '');

  const handleUpdate = async (field, value) => {
    try {
      await updateUser({ [field]: value });
      alert('Información actualizada correctamente');
    } catch (error) {
      console.error('Error actualizando la información:', error);
      alert('Hubo un error al actualizar la información');
    }
  };

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
        <Text style={styles.headerTitle}>Información personal</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Nombre completo</Text>
          <View style={defaultStyles.inputField}>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              onBlur={() => handleUpdate('fullName', fullName)}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Número de teléfono</Text>
            <TouchableOpacity onPress={() => handleUpdate('phoneNumbers', [{ phoneNumber }])}>
              <Text style={styles.linkText}>Guardar</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
          />
          <Text style={styles.hintText}>
            Añade un número para que los viajeros con reservas confirmadas y AlquilaTuEvento puedan ponerse en contacto contigo.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Correo electrónico</Text>
            <TouchableOpacity onPress={() => handleUpdate('emailAddresses', [{ emailAddress: email }])}>
              <Text style={styles.linkText}>Guardar</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Dirección</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Añadir</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hintText}>No se ha proporcionado</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    color: Colors.dark,
  },
  linkText: {
    fontFamily: 'mon',
    color: Colors.primary,
    fontSize: 16,
  },
  hintText: {
    fontFamily: 'mon',
    color: Colors.grey,
    fontSize: 14,
  },
  input: {
    fontFamily: 'mon',
    fontSize: 16,
    color: Colors.dark,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingVertical: 8,
  },
});

export default PersonalInfo;