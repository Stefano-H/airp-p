import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    StyleSheet,
  } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { useUser } from '@clerk/clerk-expo';
  import { Link, router, Stack } from 'expo-router';
  import { Ionicons } from '@expo/vector-icons';
  import Colors from '@/constants/Colors';
  import React, { useEffect, useState } from 'react';
  
  const Security = () => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView contentContainerStyle={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 24, gap: 24 }}>
            <Stack.Screen
                options={{
                title: 'Seguridad',
                headerTitleStyle: {
                    fontFamily: 'mon-b',
                    fontSize: 20,
                    marginTop: 20,
                },
                }}
            />
  
          <TouchableOpacity style={styles.securityItem}>
            <Text style={styles.securityTitle}>Configura la autenticación en 2 pasos</Text>
            <Text style={styles.securitySubtitle}>
              Tendrás que completar la autenticación para acceder a secciones importantes de tu cuenta
            </Text>
            <View style={styles.securityAction}>
              <Text style={styles.linkText}>Configúrala ahora</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
            </View>
          </TouchableOpacity>
  
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
    securityItem: {
      gap: 4,
      paddingVertical: 12,
    },
    securityTitle: {
      fontFamily: 'mon-sb',
      fontSize: 16,
      color: Colors.dark,
    },
    securitySubtitle: {
      fontFamily: 'mon',
      fontSize: 14,
      color: Colors.grey,
    },
    securityAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 8,
    },
    linkText: {
      color: Colors.primary,
      fontFamily: 'mon-sb',
    },
    section: {
      marginTop: 20,
      gap: 16,
    },
    sectionTitle: {
      fontFamily: 'mon-b',
      fontSize: 18,
      color: Colors.dark,
    },
  });
  
  export default Security;