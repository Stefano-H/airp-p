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
import API_BASE_URL from '@/utils/apiConfig';
import CustomAlert from '@/components/CustomAlert';

const PersonalInfo = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.emailAddresses?.[0]?.emailAddress || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailObj, setEmailObj] = useState<any>(null);
  const [address, setAddress] = useState(''); 
  const [phone, setPhone] = useState('');    
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.emailAddresses?.[0]?.emailAddress || '');
    }
  }, [user]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/get-user?clerkId=${user.id}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setAddress(data.dirección || '');
        setPhone(data.telefono || '');

      } catch (error) {
        console.error('Error cargando datos:', error);
        alert('Error al cargar datos. Verifica la consola.');
      }
    };

    loadUserData();
  }, [user]);

  const handleUpdateUser = async () => {
    if (!user) return;

    try {
      await user.update({ firstName, lastName });
    } catch (error: any) {
      console.error('Error actualizando nombre:', error);
      alert('Error actualizando nombre');
      return;
    }

    const payload = {
      clerkId: user.id,
      fullName: `${firstName} ${lastName}`,
      email,
      direccion: address,
      telefono: phone,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/update-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAlertTitle('¡Éxito!');
        setAlertMessage('Tus datos se han actualizado correctamente.');
        setAlertVisible(true);
        
        const refreshResponse = await fetch(`${API_BASE_URL}/api/get-user?clerkId=${user.id}`);
        const refreshData = await refreshResponse.json();
        setAddress(refreshData.dirección || '');
        setPhone(refreshData.telefono || '');
        
      } else {
        setAlertTitle('Error');
        setAlertMessage('No se pudo guardar la información. Inténtalo de nuevo.');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertTitle('Error crítico');
      setAlertMessage(typeof error === 'string' ? error : 'Ocurrió un error inesperado');
      setAlertVisible(true);
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
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            title: 'Información personal',
            headerTitleStyle: {
              fontFamily: 'mon-b',
              fontSize: 20,
            },
          }}
        />

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

        <TouchableOpacity onPress={handleUpdateUser} style={styles.button}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
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

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    paddingLeft: 24,
    paddingRight: 24,
    gap: 24 
  },
  section: { 
    gap: 8 
  },
  sectionLabel: { 
    fontFamily: 'mon-sb', 
    fontSize: 16, 
    color: Colors.dark 
  },
  linkText: { 
    fontFamily: 'mon', 
    color: Colors.primary, 
    fontSize: 16 
  },
  input: { 
    fontFamily: 'mon', 
    fontSize: 16, 
    color: Colors.dark, 
    borderWidth: 1, 
    borderColor: Colors.grey, 
    borderRadius: 8, 
    padding: 10 
  },
  button: {
    backgroundColor: Colors.primary, 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 8, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontFamily: 'mon-sb',
    color: '#fff', 
    fontSize: 16,
  },
});

export default PersonalInfo;