import { View, Text, Image, StyleSheet, ListRenderItem, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import { Link } from 'expo-router';
import { Listing } from '@/interfaces/listing';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInRight, FadeOut, FadeOutLeft } from 'react-native-reanimated';
import { useFavorites } from '@/context/FavoritesContext';
import { useWindowDimensions } from 'react-native';

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

    useEffect(() => {
        console.log('RELOAD LISTINGS', items.length);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 200);
    }, [category]);

    const handleFavoritePress = (item: Listing) => {
        const isFavorite = favorites.some(fav => fav.id === item.id);
        if (isFavorite) {
            removeFromFavorites(item.id);
            setMessageText('Quitando de tu lista de Deseos!');
        } else {
            addToFavorites(item);
            setMessageText('Añadido a tu lista de Deseos!');
        }
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
        }, 3000);
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
                        <Text style={styles.priceText}> / noche</Text>
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
        alignItems: 'center', // Centra los elementos de la lista
        paddingBottom: 20,
        paddingTop: 20,       // Espacio adicional en la parte superior
        backgroundColor: '#F5F5F5', // Fondo neutro para la pantalla
    },
    listing: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 12,
        padding: 16,
        width: Dimensions.get('window').width * 0.9,
        // Sombras para iOS
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
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#777',
    },
    roomType: {
        fontSize: 14,
        color: '#777',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#007AFF', // Puedes usar un color primario que combine con tu app
    },
    priceText: {
        fontSize: 14,
        color: '#777',
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