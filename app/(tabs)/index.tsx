import { View, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import Listings from '@/components/Listings';
import axios from 'axios';
import ListingsMap from '@/components/ListingsMap';
import { LogBox } from 'react-native';
import API_BASE_URL from '@/utils/apiConfig';
import GlobalStyles from '@/Android-styles/GlobalStyles';

LogBox.ignoreAllLogs(true);

const Page = () => {
    const [category, setCategory] = useState('Todas');
    const [items, setItems] = useState([]);

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

    return (
        <SafeAreaView style={GlobalStyles.droidSafeArea}>
            <View style={{ flex: 1, marginTop: 90 }}>
                <Stack.Screen
                    options={{
                        header: () => <ExploreHeader onCategoryChanged={onCategoryChanged} />,
                    }}
                />
                <Listings listings={items} category={category} />
                {/* <ListingsMap listings={listingDataGeo} /> */}
            </View>
        </SafeAreaView>
    );
};

export default Page;