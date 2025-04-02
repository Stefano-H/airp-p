import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter, Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';

enum Strategy {
  Google = 'oauth_google',
  Apple = 'oauth_apple',
  Facebook = 'oauth_facebook',
}

const LoginPage = () => {
  const router = useRouter();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
  const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: 'oauth_facebook' });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Stack.Screen 
          options={{
            headerShown: true,
          }}
        />
        {/* Encabezado de la pantalla */}
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/inca3.1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Bienvenido a AlquilaTuEvento</Text>
          <Text style={styles.subtitle}>
            Accede de forma segura usando tu cuenta de Google, Apple o Facebook.
          </Text>
        </View>

        {/* Botones de autenticación */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Google)}>
            <Ionicons name="logo-google" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Apple)}>
            <Ionicons name="logo-apple" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continuar con Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Facebook)}>
            <Ionicons name="logo-facebook" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continuar con Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* Pie de página o texto adicional */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Al continuar, aceptas nuestros Términos y Condiciones.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15,
  },
  scroll: {
    paddingHorizontal: 24,
    // paddingVertical: 40,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'mon-b',
    fontSize: 28,
    color: Colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'mon',
    fontSize: 16,
    color: Colors.grey,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap: 20,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ABABAB',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'mon-sb',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontFamily: 'mon',
    fontSize: 12,
    color: Colors.grey,
    textAlign: 'center',
  },
});

