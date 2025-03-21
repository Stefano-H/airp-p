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

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.emailAddresses?.[0]?.emailAddress || '');
    }
  }, [user]);

  const handleUpdate = async (field: string, value: any) => {
    try {
      console.log(`Actualizando ${field} en Clerk:`, value);

      if (field === 'firstName' || field === 'lastName') {
        await user.update({ firstName, lastName });
      } else if (field === 'email') {
        if (!value || value.trim() === '') {
          alert('El correo electrónico no puede estar vacío.');
          return;
        }

        const existingEmail = user.emailAddresses.find(e => e.emailAddress === value);
        if (existingEmail) {
          await existingEmail.delete();
        }

        const newEmail = await user.createEmailAddress({ emailAddress: value });
        console.log('Correo electrónico creado:', newEmail);
        await newEmail.prepareVerification();
        setEmailObj(newEmail);
        setIsVerifying(true);
      }

      console.log(`${field} actualizado correctamente.`);
    } catch (error: any) {
      console.error('Error actualizando:', error.toString());
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
          <TextInput value={firstName} onChangeText={setFirstName} onBlur={() => handleUpdate('firstName', firstName)} style={styles.input} />
          <TextInput value={lastName} onChangeText={setLastName} onBlur={() => handleUpdate('lastName', lastName)} style={styles.input} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Correo electrónico</Text>
          <TextInput value={email} onChangeText={setEmail} style={styles.input} />
          <TouchableOpacity onPress={() => handleUpdate('email', email)}>
            <Text style={styles.linkText}>Guardar</Text>
          </TouchableOpacity>
        </View>

        {isVerifying && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Verificar Código</Text>
            <TextInput value={verificationCode} onChangeText={setVerificationCode} style={styles.input} />
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
