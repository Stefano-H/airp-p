// FilteredListings.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Listings from '@/components/Listings';
import API_BASE_URL from '@/utils/apiConfig';

const FilteredListings = () => {
  // Recupera el parámetro de búsqueda de la URL
  const { destino } = useLocalSearchParams<{ destino: string }>();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    console.log("🔍 Buscando destino:", destino); // ✅ Verificar qué destino se está enviando
    console.log("🔍 data:", data); // ✅ Verificar la data
    console.log("🔍 loading:", loading); // ✅ Verificar el estado de carga
    
    const fetchData = async () => {
      if (!destino) return;
      setLoading(true);
      try {
        // Reemplaza <TU_IP_LOCAL> por la IP de tu servidor
        const response = await fetch(
           `${API_BASE_URL}/api/search-listings?destino=${encodeURIComponent(destino)}`
        );
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error al obtener los listings:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [destino]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Listings listings={data} category="Todo" />;
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FilteredListings;
