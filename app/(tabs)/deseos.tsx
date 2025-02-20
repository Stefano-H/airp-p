import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, Link } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import GlobalStyles from '@/Android-styles/GlobalStyles';

import ExploreHeader from '@/components/NoExploreHeader';
import API_BASE_URL from '@/utils/apiConfig';
import axios from 'axios';

const Deseos = () => {
  const [category, setCategory] = useState('Todas');
  const [items, setItems] = useState([]);
  const { isSignedIn } = useAuth();
  const { removeFromFavorites, favorites } = useFavorites();
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for category:', category);
        console.log('API_BASE_URL:', API_BASE_URL);
        const response = await axios.get(`${API_BASE_URL}/all-listings`, {
          params: { category }
        });
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [category]);

  const onCategoryChanged = (category: string) => {
    setCategory(category);
  };

  if (!isSignedIn) {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <View style={styles.container}>
          <Stack.Screen
            options={{
              header: () => <ExploreHeader onCategoryChanged={onCategoryChanged} />,
            }}
          />
          <View style={styles.messageContainer}>
            <Image
              source={require('../(tabs)/Favoritos.png')}
              style={styles.image2}
            />
            <Text style={styles.message}>Por favor, inicia sesión para ver tu lista de deseos.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <View style={styles.container}>
          <Stack.Screen
            options={{
              header: () => <ExploreHeader onCategoryChanged={onCategoryChanged} />,
            }}
          />
          <View style={styles.messageContainer}>
            <Image
              source={require('../(tabs)/Favoritos.png')}
              style={styles.image2}
            />
            <Text style={styles.message}>No tienes ningún favorito.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleRemoveFavorite = (itemId: string) => {
    removeFromFavorites(itemId);
    console.log('Quitado de favoritos');
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 100 }}>
        <Stack.Screen
          options={{
            title: 'Lista de deseos',
            headerTitleStyle: {
              fontFamily: 'mon-b',
              fontSize: 24,
              marginTop: 20,
            },
            header: () => <ExploreHeader onCategoryChanged={onCategoryChanged} />,
          }}
        />
        
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          {favorites.map((item, index) => (
            <Link key={index} href={`/listing/${item.id}`} asChild>
              <TouchableOpacity>
                <Animated.View 
                  style={styles.listing} 
                  entering={FadeInRight} 
                  exiting={FadeOutLeft}
                >
                  <Image source={{ uri: item.miniatura }} style={styles.image} />
                  <TouchableOpacity
                    style={{ position: 'absolute', right: 30, top: 30 }}
                    onPress={() => handleRemoveFavorite(item.id)}
                  >
                    <Ionicons name='close' size={32} color='#FF0000' />
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', maxWidth: '85%' }}>
                      {item.nombre}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      <Ionicons name='star' size={16} color='#000' />
                      <Text style={{ fontFamily: 'mon-sb' }}>
                        {item.review_scores_rating / 20}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontFamily: 'mon' }}>{item.tipo_de_habitación}</Text>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <Text style={{ fontFamily: 'mon-sb' }}>S/{item.precio}</Text>
                    <Text style={{ fontFamily: 'mon' }}> / noche</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image2: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  // Estilo de "listing" adaptado para ser responsivo y con apariencia de tarjeta
  listing: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 12,
    padding: 16,
    width: Dimensions.get('window').width * 0.9,
    // El ancho se define de forma dinámica en línea (width: width * 0.9)
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevación para Android
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
});

export default Deseos;
