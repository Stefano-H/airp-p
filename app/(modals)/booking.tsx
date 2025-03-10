import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import { useState } from 'react';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { places } from '@/assets/data/places';
import { useRouter } from 'expo-router';
// @ts-ignore
import DatePicker from 'react-native-modern-datepicker';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const guestsGropus = [
  {
    name: 'Adultos',
    text: 'Edades 13 o más',
    count: 0,
  },
  {
    name: 'Niños',
    text: 'Edades 2-12',
    count: 0,
  },
  {
    name: 'Bebés',
    text: 'Menores de 2',
    count: 0,
  },
  {
    name: 'Mascotas',
    text: 'Se permiten mascotas',
    count: 0,
  },
];

const Page = () => {
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState(0);
  const [groups, setGroups] = useState(guestsGropus);
  const router = useRouter();
  const today = new Date().toISOString().substring(0, 10);

  const onClearAll = () => {
    setSelectedPlace(0);
    setOpenCard(null);
  };

  const toggleCard = (cardIndex: number) => {
    setOpenCard(openCard === cardIndex ? null : cardIndex);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View intensity={100} style={styles.container} tint="light">
          {/* Where */}
          <View style={styles.card}>
            <AnimatedTouchableOpacity
              onPress={() => toggleCard(0)}
              style={styles.cardPreview}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text style={styles.previewText}>Donde</Text>
              <Text style={styles.previewdDate}>Soy Flexible</Text>
            </AnimatedTouchableOpacity>
            {openCard === 0 && <Text style={styles.cardHeader}>¿Dónde?</Text>}
            {openCard === 0 && (
              <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.cardBody}>
                <View style={styles.searchSection}>
                  <Ionicons style={styles.searchIcon} name="search-outline" size={20} color="#000" />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Search destinations"
                    placeholderTextColor={Colors.grey}
                  />
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.placesContainer}
                >
                  {places.map((item, index) => (
                    <TouchableOpacity onPress={() => setSelectedPlace(index)} key={index}>
                      <Image
                        source={item.img}
                        style={selectedPlace === index ? styles.placeSelected : styles.place}
                      />
                      <Text style={{ fontFamily: 'mon', paddingTop: 6 }}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            )}
          </View>

          {/* When */}
          <View style={styles.card}>
            <AnimatedTouchableOpacity
              onPress={() => toggleCard(1)}
              style={styles.cardPreview}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text style={styles.previewText}>Cuando</Text>
              <Text style={styles.previewdDate}>Soy Flexible</Text>
            </AnimatedTouchableOpacity>
            {openCard === 1 && <Text style={styles.cardHeader}>¿Cuándo es tu viaje?</Text>}
            {openCard === 1 && (
              <Animated.View style={styles.cardBody}>
                <DatePicker
                  options={{
                    defaultFont: 'mon',
                    headerFont: 'mon-sb',
                    mainColor: Colors.primary,
                    borderColor: 'transparent',
                  }}
                  current={today}
                  selected={today}
                  mode={'calendar'}
                />
              </Animated.View>
            )}
          </View>

          {/* Who */}
          <View style={styles.card}>
            <AnimatedTouchableOpacity
              onPress={() => toggleCard(2)}
              style={styles.cardPreview}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text style={styles.previewText}>Quien</Text>
              <Text style={styles.previewdDate}>Añade Invitados</Text>
            </AnimatedTouchableOpacity>
            {openCard === 2 && <Text style={styles.cardHeader}>¿Quién viene?</Text>}
            {openCard === 2 && (
              <Animated.View style={styles.cardBody}>
                {groups.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.guestItem,
                      index + 1 < guestsGropus.length ? styles.itemBorder : null,
                    ]}
                  >
                    <View>
                      <Text style={{ fontFamily: 'mon-sb', fontSize: 14 }}>{item.name}</Text>
                      <Text style={{ fontFamily: 'mon', fontSize: 14, color: Colors.grey }}>
                        {item.text}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
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
                      <Text
                        style={{
                          fontFamily: 'mon',
                          fontSize: 16,
                          minWidth: 18,
                          textAlign: 'center',
                        }}
                      >
                        {item.count}
                      </Text>
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
              </Animated.View>
            )}
          </View>

          {/* Footer */}
          <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity onPress={onClearAll} style={{ justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'mon-sb', fontSize: 18, textDecorationLine: 'underline' }}>
                  Borrar todo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.back()}
                style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 50 }]}
              >
                <Ionicons name="search-outline" size={24} color={'#fff'} style={defaultStyles.btnIcon} />
                <Text style={defaultStyles.btnText}>Buscar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
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
    paddingTop: 100,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
    marginTop: 10, // Reduce el margen superior
  },
  cardHeader: {
    fontFamily: 'mon-b',
    fontSize: 24,
    paddingLeft: 20,
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
  searchSection: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
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
  placesContainer: {
    flexDirection: 'row',
    gap: 25,
  },
  place: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  placeSelected: {
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 10,
    width: 100,
    height: 100,
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
});

export default Page;