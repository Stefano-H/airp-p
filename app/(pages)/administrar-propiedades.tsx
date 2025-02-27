import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import Listings from '@/components/Listings';
import axios from 'axios';
import ListingsMap from '@/components/ListingsMap';
import { LogBox } from 'react-native';
import API_BASE_URL from '@/utils/apiConfig';
import GlobalStyles from '@/Android-styles/GlobalStyles';
import { useAuth, useUser } from '@clerk/clerk-expo';

LogBox.ignoreAllLogs(true);

const Page = () => {
    const [category, setCategory] = useState('Todas');
    const [items, setItems] = useState([]);
    const { signOut, isSignedIn } = useAuth();
    const { user } = useUser();

    console.log('user:', user.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data for category:', category);
                console.log('API_BASE_URL:', API_BASE_URL);
                const response = await fetch(`${API_BASE_URL}/prop-listings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ category: category, propietario_id: user.id }),
                  });
                
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [category]);

    return (
        <SafeAreaView style={GlobalStyles.droidSafeArea}>
                  <Stack.Screen
                    options={{
                    title: 'Administrar Propiedades',
                    headerTitleStyle: {
                        fontFamily: 'mon-b',
                        fontSize: 18,
                        marginTop: 20,
                    },
                    }}
                />
            <View style={{ flex: 1 }}>
                <Listings listings={items} category={category} />
                {/* <ListingsMap listings={listingDataGeo} /> */}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 24,
    },
    header: {
      fontFamily: 'mon-b',
      fontSize: 24,
    },
  });

export default Page;