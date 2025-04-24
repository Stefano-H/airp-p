import { View, Text, Image, StyleSheet, ListRenderItem, TouchableOpacity, FlatList, Dimensions, useWindowDimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import { Link } from 'expo-router';
import { Listing } from '@/interfaces/listing';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInRight, FadeOut, FadeOutLeft } from 'react-native-reanimated';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@clerk/clerk-expo';

interface Props {
  listings: Listing[];
  category: string;
}

const Listings = ({ listings: items, category }: Props) => {
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const listRef = useRef<FlatList>(null);
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const { width } = useWindowDimensions();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    console.log('RELOAD LISTINGS', items.length);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  const handleFavoritePress = (item: Listing) => {
    if (!isSignedIn) {
      // Si el usuario no está autenticado, muestra el mensaje y no ejecuta ninguna animación
      setMessageText('Logueate para poder añadir lugares favoritos');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      return;
    }
    
    const isFavorite = favorites.some(fav => fav.id === item.id);
    if (isFavorite) {
      removeFromFavorites(item.id);
      // setMessageText('Quitando de tu lista de Deseos!');
    } else {
      addToFavorites(item);
      // setMessageText('Añadido a tu lista de Deseos!');
    }
    // setShowMessage(true);
    // setTimeout(() => {
    //   setShowMessage(false);
    // }, 3000);
  };

  const renderRow: ListRenderItem<Listing> = ({ item }) => (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View style={[styles.listing, { width: width * 0.9 }]} entering={FadeInRight} exiting={FadeOutLeft}>
          <Image source={{ uri: item.miniatura }} style={styles.image} />
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={() => handleFavoritePress(item)}
          >
            <Ionicons name='heart' size={32} color={favorites.some(fav => fav.id === item.id) ? '#FF0000' : '#000'} />
          </TouchableOpacity>

          <View style={styles.detailsContainer}>
            <Text style={styles.listingTitle}>{item.nombre}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name='star' size={16} color='#000' />
              <Text style={styles.ratingText}>{item.review_scores_rating / 20}</Text>
            </View>
          </View>

          <Text style={styles.roomType}>{item.tipo_de_habitación}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>€{item.precio}</Text>
            <Text style={styles.priceText}> / noches</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={defaultStyles.container}>
      {showMessage && (
        <TouchableOpacity onPress={() => setShowMessage(false)} style={styles.messageContainer}>
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.message}>
            <Text style={styles.messageText}>{messageText}</Text>
          </Animated.View>
        </TouchableOpacity>
      )}
      <FlatList
        renderItem={renderRow}
        ref={listRef}
        data={loading ? [] : items}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: '#F5F5F5',
  },
  listing: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 12,
    padding: 16,
    width: Dimensions.get('window').width * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  favoriteIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listingTitle: {
    color: '#333',
    flex: 1,
    fontSize: 16, fontWeight: 'bold', maxWidth: '85%'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#777',
    fontFamily: 'mon-sb',
  },
  roomType: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
    fontFamily: 'mon',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  priceText: {
    fontSize: 14,
    color: '#000',
  },
  messageContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -50 }],
    zIndex: 1000,
  },
  message: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});


export default Listings;
