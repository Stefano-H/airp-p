import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Share, ScrollView } from 'react-native';
import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Listing } from "@/interfaces/listing";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useSharedValue, useAnimatedScrollHandler, SlideInDown } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { defaultStyles } from '@/constants/Styles';
import AvailabilityModal from '@/components/AvailabilityModal';
import { MaterialIcons } from '@expo/vector-icons';
import API_BASE_URL from '@/utils/apiConfig';
import { Video, ResizeMode } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

const IMG_HEIGHT = 300;
const { width } = Dimensions.get('window');

const Page = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [listing, setListing] = useState<Listing | undefined>(undefined);
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const videoRef = useRef<Video>(null);
    const [orientation, setOrientation] = useState(ScreenOrientation.Orientation.PORTRAIT_UP);

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useSharedValue(0);

    const scrollHandler = (e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };


    useEffect(() => {
        const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
            setOrientation(event.orientationInfo.orientation);
        });

        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);
        };
    }, []);

    const togglePlayback = async () => {
        if (isPlaying) {
            await videoRef.current?.pauseAsync();
        } else {
            await videoRef.current?.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleFullScreen = async () => {
        if (isFullScreen) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
        setIsFullScreen(!isFullScreen);
    };

    const isLandscape = orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

    console.log('ID recibido:', id);


    useEffect(() => {
        const fetchListing = async () => {
            if (!id) {
                console.error('ID is undefined');
                return;
            }

            try {
                console.log('Fetching listing with ID:', id);
                const response = await axios.get(`${API_BASE_URL}/all-listings`);
                if (response.data && Array.isArray(response.data)) {
                    console.log('Response data is an array:', response.data);
                    const foundListing = response.data.find((item: Listing) => item.id === parseInt(id));
                    console.log('Found listing:', foundListing);
                    if (foundListing) {
                        setListing(foundListing);
                        console.log('Fetched listing:', foundListing);
                    } else {
                        console.error('Listing not found');
                    }
                } else {
                    console.error('Invalid response data:', response.data);
                }
            } catch (error) {
                console.error('Error fetching listing:', error);
            }
        };

        fetchListing();
    }, [id]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerTransparent: true,
            headerBackground: () => (
                <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
            ),
            headerRight: () => (
                <View style={styles.bar}>
                    <TouchableOpacity style={styles.roundButton}>
                        <Ionicons name="share-outline" size={22} color={'#000'} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.roundButton}>
                        <Ionicons name="heart-outline" size={22} color={'#000'} />
                    </TouchableOpacity> */}
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={'#000'} />
                </TouchableOpacity>
            ),
        });
    }, []);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [2, 1, 1]
                    )
                }
            ]
        };
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
        };
    }, []);

    if (!listing) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Apartamento no encontrado</Text>
            </View>
        );
    }

    const ruleIcons = {
        no_smoking: 'color-wand-outline',
        no_parties: 'ban',
        quiet_hours: 'volume-mute',
        no_pets: 'paw',
        check_in_out_strict: 'time',
        max_guests_allowed: 'people',
        respect_community_rules: 'people-outline',
        no_furniture_moving: 'move',
        basic_cleaning_required: 'thumbs-up-outline',
        restricted_areas: 'lock-closed',
    };
    
    const amenities = [
        { key: 'wifi', text: 'Wifi' },
        { key: 'kitchen', text: 'Cocina'},
        { key: 'parking', text: 'Estacionamiento'},
        { key: 'tv', text: 'TV', icon: 'tv-outline' },
        { key: 'air_conditioning', text: 'Aire acondicionado' },
        { key: 'heating', text: 'Calefacción'},
        { key: 'washer_dryer', text: 'Lavadora/Secadora'},
        { key: 'pool', text: 'Piscina'},
        { key: 'gym', text: 'Gimnasio'},
        { key: 'hair_dryer', text: 'Secador de pelo'},
        { key: 'iron', text: 'Plancha' },
        { key: 'towels_and_linen', text: 'Toallas y ropa de cama'},
        { key: 'smoke_detector', text: 'Detector de humo'},
        { key: 'carbon_monoxide_detector', text: 'Detector de monóxido de carbono'},
    ];

    const amenitiesIcons = {
        wifi: 'wifi-outline',
        air_conditioning: 'airplane-outline',
        tv: 'tv-outline',
        kitchen: 'restaurant-outline',
        bed: 'bed-outline',
        parking: 'car-outline',
        heating: 'thermometer-outline',
        washer_dryer: 'cloud-upload-outline',
        pool: 'water-outline',
        gym: 'fitness-outline',
        hair_dryer: 'umbrella-outline',
        iron: 'hammer-outline',
        towels_and_linen: 'shirt-outline',
        smoke_detector: 'flame-outline',
        carbon_monoxide_detector: 'flame-outline',
        dishwasher: 'dishwasher-outline', // Lavavajillas
        microwave: 'microwave-outline', // Microondas
        refrigerator: 'fridge-outline', // Refrigerador
        coffee_maker: 'coffee-outline', // Cafetera
        fireplace: 'fireplace-outline', // Chimenea
        balcony: 'balcony-outline', // Balcón
        hot_tub: 'hot-tub-outline', // Jacuzzi
        pet_friendly: 'paw-outline', // Admite mascotas
        breakfast: 'restaurant-outline', // Desayuno
        workspace: 'briefcase-outline', // Espacio de trabajo
        security: 'shield-outline', // Seguridad
        elevator: 'elevator-outline', // Ascensor
        accessible: 'accessible-outline', // Accesible
    };
    

    const images = [listing.foto1, listing.foto2, listing.foto3].filter(url => url);

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                ref={scrollRef}
                onScroll={scrollHandler}
                contentContainerStyle={{ paddingBottom: 100 }}
                scrollEventThrottle={16}
            >
                <View>
                <ScrollView
                        horizontal
                        pagingEnabled
                        onScroll={scrollHandler}
                        showsHorizontalScrollIndicator={false}
                    >
                        {images.map((image, index) => (
                            <View key={index} style={styles.imageContainer}>
                                <Animated.Image source={{ uri: image }} style={[styles.image]} />
                                {images.length > 1 && (
                                    <>
                                        {index === 0 && (
                                            <MaterialIcons name="arrow-forward" size={30} color="#fff" style={styles.rightArrow} />
                                        )}
                                        {index > 0 && index < images.length - 1 && (
                                            <>
                                                <MaterialIcons name="arrow-back" size={30} color="#fff" style={styles.leftArrow} />
                                                <MaterialIcons name="arrow-forward" size={30} color="#fff" style={styles.rightArrow} />
                                            </>
                                        )}
                                        {index === images.length - 1 && (
                                            <MaterialIcons name="arrow-back" size={30} color="#fff" style={styles.leftArrow} />
                                        )}
                                    </>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.counterContainer}>
                        <Text style={styles.counterText}>{`${activeIndex + 1}/${images.length}`}</Text>
                    </View>
                </View>
                
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{listing.nombre}</Text>
                    <Text style={styles.location}>
                        {listing.tipo_de_habitación} en {listing.ciudad}, {listing.país}
                    </Text>
                    <Text style={styles.rooms}>
                        {listing.habitaciones} habitaciones · {listing.camas} cama ·{' '}
                        {listing.baños} baños
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Ionicons name="star" size={16} />
                        <Text style={styles.ratings}>
                            {listing.review_scores_rating / 20} · {listing.number_of_reviews} reseñas
                        </Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.hostView}>
                        <Image source={{ uri: listing.foto_url }} style={styles.host} />

                        <View>
                            <Text style={{ fontWeight: '500', fontSize: 16 }}>Anfitrión: {listing.nombre_propietario}</Text>
                            {/* <Text>Anfitrión desde {listing.host_since}</Text> */}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.reviewSection}>

                        {listing.video1 && (
                            <>
                                <View style={styles.divider} />
                                <Text style={styles.sectionTitle}>Tour del Apartamento</Text>
                                <View>
                                <Video
                                    ref={videoRef}
                                    source={{ uri: listing.video1 }}
                                    rate={1.0}
                                    volume={1.0}
                                    isMuted={false}
                                    resizeMode={ResizeMode.COVER}
                                    shouldPlay={false} // No iniciar automáticamente
                                    isLooping
                                    style={isLandscape ? styles.fullScreenVideo : styles.video}
                                    useNativeControls
                                />
                                    {/* <TouchableOpacity onPress={togglePlayback} style={styles.playbackButton}>
                                        <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#fff" />
                                    </TouchableOpacity> */}
                                    {/* <TouchableOpacity onPress={toggleFullScreen} style={styles.fullScreenButton}>
                                        <Ionicons name={isFullScreen ? "contract" : "expand"} size={24} color="#fff" />
                                    </TouchableOpacity> */}
                                </View>
                            </>
                        )}

                        {Number(listing.cancelación) === 1 && (
                            <View style={styles.infoSection}>
                                <Text style={styles.highlightText}>¡Qué suerte! El alojamiento de {listing.host_name} tiene Cancelación gratuita 48 horas antes</Text>
                            </View>
                        )}

                        <View style={styles.divider} />
                        <Text style={styles.sectionTitle}>Descripción</Text>
                        <Text style={styles.description}>
                            
                            {listing.descripción}
                        </Text>

                        <View style={styles.divider} />
                        <Text style={styles.sectionTitle}>Reglas de la Casa</Text>
                        <View style={styles.infoSection2}>
                            {listing.no_smoking === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={ruleIcons.no_smoking} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Prohibido fumar</Text>
                                </View>
                            )}
                            {listing.no_fiestas === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={ruleIcons.no_parties} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Prohibición de fuegos artificiales y pirotecnia</Text>
                                </View>
                            )}
                            {listing.horas_de_silencio === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={ruleIcons.quiet_hours} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Hay Horas de silencio</Text>
                                </View>
                            )}
                            {listing.no_mascotas === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={ruleIcons.no_pets} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>No se permiten mascotas</Text>
                                </View>
                            )}
                            {listing.estrictos_en_el_check_in === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={ruleIcons.check_in_out_strict} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Estrictos en el check-in/check-out</Text>
                                </View>
                            )}
                            {listing.maximos_invitados_permitidos === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={ruleIcons.max_guests_allowed} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Hay un máximo de huéspedes permitidos</Text>
                                </View>
                            )}
                            {listing.respectar_las_reglas_de_la_comunidad === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={ruleIcons.respect_community_rules} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Respetar las normas de la comunidad</Text>
                                </View>
                            )}
                            {listing.no_mover_los_muebles === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={ruleIcons.no_furniture_moving} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>No mover los muebles</Text>
                                </View>
                            )}
                            {listing.limpieza_basica === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={ruleIcons.basic_cleaning_required} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Se requiere limpieza básica</Text>
                                </View>
                            )}
                            {listing.areas_restringidas === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={ruleIcons.restricted_areas} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Hay áreas restringidas</Text>
                                </View>
                            )}
                        </View>

                        
                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>¿Qué hay en este alojamiento?</Text>
                        <View style={styles.infoSection2}>
                            {listing.wifi === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={amenitiesIcons.wifi} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Wifi</Text>
                                </View>
                            )}
                            {listing.aire_acondicionado === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={amenitiesIcons.air_conditioning} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Aire acondicionado</Text>
                                </View>
                            )}
                            {listing.parking === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={amenitiesIcons.parking} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Estacionamiento</Text>
                                </View>
                            )}
                            {listing.calefacción === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={amenitiesIcons.heating} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Calefacción</Text>
                                </View>
                            )}
                            {listing.lavadora === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={amenitiesIcons.washer_dryer} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Lavadora/Secadora</Text>
                                </View>
                            )}
                            {listing.pool === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={amenitiesIcons.pool} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Piscina</Text>
                                </View>
                            )}
                            {listing.hair_dryer === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={amenitiesIcons.hair_dryer} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Secador de pelo</Text>
                                </View>
                            )}
                            {listing.plancha === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={amenitiesIcons.iron} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Plancha</Text>
                                </View>
                            )}
                            {listing.toallas === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={amenitiesIcons.towels_and_linen} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Toallas y ropa de cama</Text>
                                </View>
                            )}
                            {listing.detector_de_humo === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={amenitiesIcons.smoke_detector} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Detector de humo</Text>
                                </View>
                            )}
                            {listing.detector_de_monoxido_de_carbono === 1 && (
                                <View style={styles.ruleItem}>
                                    <Ionicons name={amenitiesIcons.carbon_monoxide_detector} size={24} color={Colors.grey} />
                                    <Text style={styles.ruleText}>Detector de monóxido de carbono</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </Animated.ScrollView>
            <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.footerText}>
                        <Text style={styles.footerPrice}>€{listing.precio}</Text>
                        <Text>noche</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]} onPress={() => setModalVisible(true)}>
                        <Text style={defaultStyles.btnText}>Solicitar Reserva</Text>
                    </TouchableOpacity>
                    <AvailabilityModal visible={modalVisible} onClose={() => setModalVisible(false)} listingId={id} />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        height: IMG_HEIGHT,
        width,
    },
    leftArrow: {
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: [{ translateY: -16 }],
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo negro semitransparente
    },
    rightArrow: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -16 }],
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo negro semitransparente
    },
    counterContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 5,
    },
    counterText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'mon-sb',
    },
    infoContainer: {
        padding: 24,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: 'mon-sb',
    },
    location: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'mon-sb',
    },
    rules: {
        fontSize: 14,
        color: Colors.grey,
        fontFamily: 'mon',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    rooms: {
        fontSize: 16,
        color: Colors.grey,
        marginVertical: 4,
        fontFamily: 'mon',
    },
    ratings: {
        fontSize: 16,
        fontFamily: 'mon-sb',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.grey,
        marginVertical: 16,
    },
    host: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.grey,
    },
    hostView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    footerText: {
        height: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    footerPrice: {
        fontSize: 18,
        fontFamily: 'mon-sb',
    },
    roundButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.primary,
    },
    roundButton2: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.primary,
        position: 'relative',
    },
    contentContainer: {
        paddingHorizontal: 16,
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    header: {
        backgroundColor: '#fff',
        height: 100,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey,
    },
    description: {
        fontSize: 16,
        marginTop: 5,
        fontFamily: 'mon',
    },
    reviewSection: {
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey,
    },
    reviewScore: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'mon-sb',
    },
    highlightText: {
        fontSize: 16,
        color: 'red',
        marginVertical: 8,
        fontFamily: 'mon-sb',
    },
    hostInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    hostExperience: {
        marginHorizontal: 8,
        fontSize: 16,
        fontFamily: 'mon',
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    infoSection2: {
        flexDirection: 'column',
        alignItems: 'baseline',
        marginVertical: 8,
    },
    infoText: {
        marginHorizontal: 8,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'mon',
    },
    infoDetail: {
        marginHorizontal: 8,
        fontSize: 14,
        color: Colors.grey,
        fontFamily: 'mon',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        fontFamily: 'mon-sb',
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    ruleText: {
        marginLeft: 8,
        fontSize: 14,
        fontFamily: 'mon',
        color: Colors.grey,
    },
    video: {
        width: '100%',
        height: 200,
    },
    playbackButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        padding: 10,
    },
    fullScreenVideo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    fullScreenButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 10,
    },
});

export default Page;