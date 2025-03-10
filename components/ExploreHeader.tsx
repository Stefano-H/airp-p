import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  useWindowDimensions, 
} from 'react-native';
import { useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import GlobalStyles from '../Android-styles/GlobalStyles';
import { ScrollView } from 'react-native-gesture-handler';
import logo from '@/assets/images/inca3.1.1.png';

const categories = [
  { name: 'Todas', icon: 'apps' },
  { name: 'Bodas', icon: 'ring' },
  { name: 'Fiestas', icon: 'glass-cheers' },
  { name: 'Frente a la playa', icon: 'beach-access' },
  { name: 'Campo', icon: 'nature-people' },
  { name: 'Eventos corporativos', icon: 'briefcase' },
];

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();

  // Definimos un ancho base (por ejemplo, 375) de nuestro diseño original.
  const baseWidth = 375;
  const scale = width / baseWidth;

  // Usamos las dimensiones originales y las escalamos
  const searchBtnWidth = 290 * scale; 
  const logoSize = 80 * scale;

  const selectCategory = (index: number) => {
    setActiveIndex(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={'/(modals)/booking'} asChild>
            <TouchableOpacity onPress={() => console.log('Button pressed')}>
              <View style={[styles.searchBtn, { width: searchBtnWidth }]}>
                <Ionicons name="search" size={20} color={Colors.grey} />
                <View>
                  <Text style={{ fontFamily: 'mon-sb' }}>¿A dónde?</Text>
                  <Text style={styles.searchText}>Cualquier lugar · Cualquier semana</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity onPress={() => { /* Acción del botón */ }}>
            <Image 
              source={logo} 
              style={[styles.logo, { width: logoSize, height: logoSize }]} 
            />
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
    left: 1,
    width: 40, // Ajusta el tamaño según sea necesario
    height: 40, // Ajusta el tamaño según sea necesario
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  searchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    alignItems: 'center',
    height: 60,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 5.0,
    shadowRadius: 10,
    shadowOffset: {
      width: 5,
      height: 8,
    },
    borderRadius: 30,
  },
  searchText: {
    color: Colors.grey,
    fontFamily: 'mon',
    fontSize: 10,
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
});

export default ExploreHeader;
