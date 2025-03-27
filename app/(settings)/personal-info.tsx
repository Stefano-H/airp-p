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
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useState, useEffect } from 'react';

const PersonalInfo = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.emailAddresses?.[0]?.emailAddress || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailObj, setEmailObj] = useState<any>(null);
  const [address, setAddress] = useState(''); // Estado para Dirección
  const [phone, setPhone] = useState('');     // Estado para Teléfono

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.emailAddresses?.[0]?.emailAddress || '');
      // Si tuvieras valores previos de dirección o teléfono, los inicializas aquí.
      // setAddress(user.address || '');
      // setPhone(user.phone || '');
    }
  }, [user]);

  // Función para guardar todos los cambios en un único botón
  const handleUpdateUser = async () => {
    if (!user) return;
    
    // Actualizar nombre en Clerk
    try {
      await user.update({ firstName, lastName });
    } catch (error: any) {
      console.error('Error actualizando nombre en Clerk:', error);
      alert('Error actualizando nombre en Clerk');
      return;
    }
    
    // Si no existe un número de teléfono en Clerk y se ingresó uno, crearlo y preparar verificación
    try {
      console.log('user.phone_numbers:', user.phoneNumbers);
      if (phone && (!user.phoneNumbers || user.phoneNumbers.length === 0)) {
        console.log('Creando número de teléfono en Clerk:', phone);
        const newPhone = await user.createPhoneNumber({ phoneNumber: phone });
        console.log('Nuevo número de teléfono creado:', newPhone);
        await newPhone.prepareVerification();
      }
    } catch (error: any) {
      console.error('Error creando/verificando el número de teléfono en Clerk:', error.message, error.stack);
      alert('Error creando el número de teléfono en Clerk: ' + error.message);
      return;
    }
    

    const payload = {
      clerkId: user.id, // Suponemos que user.id es el clerkId
      fullName: `${firstName} ${lastName}`,
      email,
      direccion: address,
      telefono: phone,
    };

    try {
      console.log('Enviando payload:', payload);
      const response = await fetch('http://localhost:3000/api/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('Respuesta recibida:', response);
      const data = await response.json();
      console.log('Datos de respuesta:', data);
      
      if (response.ok) {
        alert('Datos actualizados correctamente');
      } else {
        console.error('Error en la actualización:', data);
        alert('Error al actualizar: ' + data.error);
      }
    } catch (error) {
      console.error('Error en la petición fetch:', error);
      alert('Error en la comunicación con el servidor');
    }
  };

  const handleVerify = async () => {
    try {
      if (emailObj) {
        const verificationResult = await emailObj.attemptVerification({ code: verificationCode });
        if (verificationResult.verification.status === 'verified') {
          alert('Correo electrónico verificado con éxito.');
          setIsVerifying(false);
        } else {
          alert('Código incorrecto. Intenta nuevamente.');
        }
      }
    } catch (error) {
      console.error('Error en la verificación:', error);
      alert('Error en la verificación: ' + error.toString());
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 24, gap: 24 }}>
        <Stack.Screen options={{ title: '', headerTitleStyle: { fontFamily: 'mon-b', fontSize: 20, marginTop: 20 } }} />
        <Text style={styles.headerTitle}>Información personal</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Nombre completo</Text>
          <TextInput 
            value={firstName} 
            onChangeText={setFirstName} 
            style={styles.input} 
          />
          <TextInput 
            value={lastName} 
            onChangeText={setLastName} 
            style={styles.input} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Correo electrónico</Text>
          <TextInput 
            value={email} 
            onChangeText={setEmail} 
            style={styles.input} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Dirección</Text>
          <TextInput 
            value={address} 
            onChangeText={setAddress} 
            style={styles.input} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Teléfono</Text>
          <TextInput 
            value={phone} 
            onChangeText={setPhone} 
            style={styles.input} 
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity onPress={handleUpdateUser}>
          <Text style={styles.linkText}>Guardar cambios</Text>
        </TouchableOpacity>

        {isVerifying && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Verificar Código</Text>
            <TextInput 
              value={verificationCode} 
              onChangeText={setVerificationCode} 
              style={styles.input} 
            />
            <TouchableOpacity onPress={handleVerify}>
              <Text style={styles.linkText}>Verificar</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontFamily: 'mon-b', fontSize: 24, color: Colors.dark },
  section: { gap: 8 },
  sectionLabel: { fontFamily: 'mon-sb', fontSize: 16, color: Colors.dark },
  linkText: { fontFamily: 'mon', color: Colors.primary, fontSize: 16 },
  input: { fontFamily: 'mon', fontSize: 16, color: Colors.dark, borderWidth: 1, borderColor: Colors.grey, borderRadius: 8, padding: 10 },
});

export default PersonalInfo;
