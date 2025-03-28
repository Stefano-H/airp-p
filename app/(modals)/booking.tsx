import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-modern-datepicker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import API_BASE_URL from '@/utils/apiConfig';
import { router, useRouter } from 'expo-router';
import { Listing } from '@/interfaces/listing';

const guestsGroups = [
  { name: 'Adultos', text: 'Edades 13 o más', count: 0 },
  { name: 'Niños', text: 'Edades 2-12', count: 0 },
  { name: 'Bebés', text: 'Menores de 2', count: 0 },
  { name: 'Mascotas', text: 'Se permiten mascotas', count: 0 },
];

const today = new Date().toISOString().substring(0, 10);

const Page = () => {
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [groups, setGroups] = useState(guestsGroups);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleCard = (cardIndex: number) => {
    setOpenCard(openCard === cardIndex ? null : cardIndex);
  };

  const clearAll = () => {
    setSearchTerm('');
    setSelectedDate(today);
    setGroups(guestsGroups);
    setListings([]);
    setOpenCard(null);
  };

  const searchListings = async () => {
    if (!searchTerm.trim()) return; // Evita búsquedas vacías
    setLoading(true);
    try {
      // Actualiza la URL con la dirección IP de tu servidor si es necesario
      const response = await fetch(
        `${API_BASE_URL}/api/search-listings?destino=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setListings(data);
      // router.push(`/filtered-listings?destino=${encodeURIComponent(searchTerm)}`);
      // router.push(`/(pages)/FilteredListings?destino=${encodeURIComponent(searchTerm)}`);
    } catch (error) {
      console.error('Error al buscar listings:', error);
    }
    setLoading(false);
  };

  const renderListingItem = ({ item }: { item: any }) => (
    <View style={styles.listingItem}>
      <Image source={{ uri: item.foto1 }} style={styles.listingImage} />
      <View style={styles.listingInfo}>
        <Text style={styles.listingName}>{item.name}</Text>
        <Text style={styles.listingLocation}>
          {item.ciudad} - {item.distrito}
        </Text>
        <Text style={styles.listingPrice}>${item.price}</Text>
      </View>
    </View>
  );

  const renderRow: ListRenderItem<Listing> = ({ item }) => {
    console.log('📌 Renderizando apartamento:', item);
  
    return (
      <View style={styles.listing}>
        <Text>{item.nombre || 'Sin nombre'}</Text>
        <Image source={{ uri: item.miniatura || 'URL_FALLBACK' }} style={styles.image} />
      </View>
    );
  };
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.scrollViewContent, { paddingBottom: 100 }]}>
        <View style={styles.container}>
          {/* Sección "Donde" */}
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleCard(0)} style={styles.cardPreview}>
              <Text style={styles.previewText}>Donde</Text>
              <Text style={styles.previewdDate}>{searchTerm || 'Ingresa destino'}</Text>
            </TouchableOpacity>
            {openCard === 0 && (
              <View style={styles.cardBody}>
                <View style={styles.searchSection}>
                  <Ionicons style={styles.searchIcon} name="search-outline" size={20} color="#000" />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Buscar por ciudad"
                    placeholderTextColor={Colors.grey}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Sección "Cuando" */}
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleCard(1)} style={styles.cardPreview}>
              <Text style={styles.previewText}>Cuando</Text>
              <Text style={styles.previewdDate}>{selectedDate || 'Selecciona fecha'}</Text>
            </TouchableOpacity>
            {openCard === 1 && (
              <View style={styles.cardBody}>
                <Text style={styles.cardHeader}>¿Cuándo?</Text>
                <DatePicker
                  options={{
                    defaultFont: 'mon',
                    headerFont: 'mon-sb',
                    mainColor: Colors.primary,
                    borderColor: 'transparent',
                  }}
                  current={today}
                  selected={selectedDate}
                  mode="calendar"
                  onSelectedChange={(date: string) => setSelectedDate(date)}
                />
              </View>
            )}
          </View>

          {/* Sección "Quién" */}
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleCard(2)} style={styles.cardPreview}>
              <Text style={styles.previewText}>Quién</Text>
              <Text style={styles.previewdDate}>
                Invitados: {groups.reduce((acc, curr) => acc + curr.count, 0)}
              </Text>
            </TouchableOpacity>
            {openCard === 2 && (
              <View style={styles.cardBody}>
                <Text style={styles.cardHeader}>¿Quién viene?</Text>
                {groups.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.guestItem,
                      index + 1 < guestsGroups.length ? styles.itemBorder : null,
                    ]}
                  >
                    <View>
                      <Text style={{ fontFamily: 'mon-sb', fontSize: 14 }}>{item.name}</Text>
                      <Text style={{ fontFamily: 'mon', fontSize: 14, color: Colors.grey }}>
                        {item.text}
                      </Text>
                    </View>
                    <View style={styles.counterContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          const newGroups = [...groups];
                          newGroups[index].count =
                            newGroups[index].count > 0 ? newGroups[index].count - 1 : 0;
                          setGroups(newGroups);
                        }}
                      >
                        <Ionicons
                          name="remove-circle-outline"
                          size={26}
                          color={groups[index].count > 0 ? Colors.grey : '#cdcdcd'}
                        />
                      </TouchableOpacity>
                      <Text style={styles.counterText}>{item.count}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          const newGroups = [...groups];
                          newGroups[index].count++;
                          setGroups(newGroups);
                        }}
                      >
                        <Ionicons name="add-circle-outline" size={26} color={Colors.grey} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Resultados de la búsqueda */}
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
          ) : listings.length > 0 ? (
            <FlatList
              data={listings}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderListingItem}
              contentContainerStyle={{ marginTop: 20 }}
            />
          ) : (
            !loading &&
            searchTerm.trim() !== '' && (
              <Text style={styles.noResults}>No se encontraron resultados para "{searchTerm}"</Text>
            )
          )}
        </View>
          {/* Botones de acción */}
          <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
            <View style={styles.footerContainer}>
              <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                <Text style={styles.clearText}>Borrar todo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={searchListings} style={styles.searchButton}>
                <Ionicons name="search-outline" size={24} color="#fff" style={defaultStyles.btnIcon} />
                <Text style={defaultStyles.btnText}>Buscar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 },
    marginTop: 10,
    paddingBottom: 10,
  },
  cardHeader: {
    fontFamily: 'mon-b',
    fontSize: 24,
    paddingLeft: 20,
    marginTop: 10,
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  previewText: {
    fontFamily: 'mon-sb',
    fontSize: 14,
    color: Colors.grey,
  },
  previewdDate: {
    fontFamily: 'mon-sb',
    fontSize: 14,
    color: Colors.dark,
  },
  searchSection: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: 8,
    marginBottom: 16,
  },
  searchIcon: {
    padding: 10,
  },
  inputField: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  guestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.grey,
  },
  counterContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontFamily: 'mon',
    fontSize: 16,
    minWidth: 18,
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearButton: {
    justifyContent: 'center',
  },
  clearText: {
    fontFamily: 'mon-sb',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  searchButton: {
    ...defaultStyles.btn,
    paddingRight: 20,
    paddingLeft: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listingItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.grey,
    alignItems: 'center',
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  listingInfo: {
    flex: 1,
  },
  listingName: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    marginBottom: 4,
  },
  listingLocation: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.grey,
    marginBottom: 4,
  },
  listingPrice: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.primary,
  },
  noResults: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'mon',
    fontSize: 16,
    color: Colors.grey,
  },
});

export default Page;
