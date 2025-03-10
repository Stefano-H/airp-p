import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import ModalHeaderText from '@/components/ModalHeaderText';
import Colors from '@/constants/Colors';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { EventProvider } from '@/context/EventContext'; 
import { FormProvider } from '@/context/FormContext'; 
import { StatusBar } from 'expo-status-bar';
import Resumen from '@/app/(pages)/(+apartamento)/resumen'; 

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },

  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('Error saving token:', err);
    }
  },
};

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'mon': require('@/assets/fonts/Montserrat-Regular.ttf'),
    'mon-sb': require('@/assets/fonts/Montserrat-SemiBold.ttf'),
    'mon-b': require('@/assets/fonts/Montserrat-Bold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
        <FavoritesProvider>
          <FormProvider>
            <EventProvider> 
              {/* ✅ Envolvemos aquí para que todos los componentes puedan acceder a este contexto */}
                <RootLayoutNav />
            </EventProvider>
          </FormProvider>
        </FavoritesProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}


function RootLayoutNav() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.push('/(tabs)');
      } else {
        router.push('/(modals)/login');
      }
    }
  }, [isLoaded, isSignedIn]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/login"
        options={{
          title: 'Log in or sign up',
          headerTitleStyle: {
            fontFamily: 'mon-sb',
          },
          presentation: 'modal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="listing/[id]" options={{ headerTitle: '', headerTransparent: true }} />
      <Stack.Screen
        name="(modals)/booking"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerTransparent: true,
          headerTitle: () => <ModalHeaderText />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: '#fff',
                borderColor: Colors.grey,
                borderRadius: 20,
                borderWidth: 1,
                padding: 0,
              }}
            >
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}