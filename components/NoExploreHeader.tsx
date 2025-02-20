import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import GlobalStyles from '../Android-styles/GlobalStyles';
import logo from '@/assets/images/inca3.1.1.png';

const categories = [
  {
    name: 'Todas',
    icon: 'apps', // Puedes elegir cualquier icono que prefieras
  },
  {
    name: 'Bodas',
    icon: 'ring',
  },
  {
    name: 'Fiestas',
    icon: 'glass-cheers',
  },
  {
    name: 'Frente a la playa',
    icon: 'beach-access',
  },
  {
    name: 'Campo',
    icon: 'nature-people',
  },
  {
    name: 'Eventos corporativos',
    icon: 'briefcase', // FontAwesome5
  },
];

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Text style={styles.headerTitle}>Lista de deseos</Text>
          <TouchableOpacity onPress={() => {/* Acción del logo */}}>
            <Image source={logo} style={styles.logo} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            gap: 20,
            paddingHorizontal: 16,
          }}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => selectCategory(index)}>
              {item.icon === 'ring' || item.icon === 'glass-cheers' || item.icon === 'briefcase' ? (
                <FontAwesome5
                  name={item.icon as any}
                  size={15}
                  color={activeIndex === index ? '#ff0000' : Colors.grey}
                />
              ) : (
                <MaterialIcons
                  name={item.icon as any}
                  size={15}
                  color={activeIndex === index ? '#ff0000' : Colors.grey}
                />
              )}
              <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 140,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  logo: {
    left: 7,
    width: 80, // Ajusta el tamaño según sea necesario
    height: 80, // Ajusta el tamaño según sea necesario
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'mon-b',
    color: '#000',
    textAlign: 'center',
    flex: 1, // Centra el texto en la pantalla
    marginTop: 0,
    marginRight: 50,
  },
  categoriesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: '#fff',
    paddingTop: 5,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderTopColor: '#ff0000',
    borderTopWidth: 3,
    paddingBottom: 8,
    paddingTop: 10,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: Colors.grey,
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: '#ff0000',
  },
});

export default ExploreHeader;
