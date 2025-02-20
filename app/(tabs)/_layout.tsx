import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { FavoritesProvider } from '@/context/FavoritesContext';

const Layout = () => {
    return (
     <FavoritesProvider>
        <Tabs 
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,  // Color de los íconos activos
                tabBarInactiveTintColor: Colors.dark,  // Color de los íconos inactivos
                tabBarLabelStyle: {
                    fontFamily: 'mon-sb',
                },
                tabBarStyle: {
                    backgroundColor: '#fff', // Color de fondo
                    height: 60, // Tamaño de la barra de pestañas
                    borderTopWidth: 1, // Borde superior de la barra
                    borderTopColor: '#000', // Color del borde superior de la barra
                    paddingBottom: 5,
                },
             }}>
            <Tabs.Screen 
                name="index" 
                options={{
                    tabBarLabel: 'Explorar',
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons 
                                name="search" 
                                color={color} 
                                size={35} 
                                style={{
                                    borderTopWidth: color === Colors.primary ? 3 : 0,  // Aplica borde superior si está activo
                                    borderTopColor: 'red',  // Color del borde superior
                                    paddingLeft: 8,
                                    width: 50,  // Ancho del borde superior (puedes ajustar el valor)
                                    paddingTop: color === Colors.primary ? 5 : 0,  // Espaciado adicional para el borde
                                }} 
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen 
                name="deseos" 
                options={{
                    tabBarLabel: 'Deseos',
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons 
                                name="heart-outline" 
                                color={color} 
                                size={35} 
                                style={{
                                    borderTopWidth: color === Colors.primary ? 3 : 0,  
                                    borderTopColor: 'red',
                                    paddingLeft: 8,  
                                    width: 50,  // Ajusta el ancho del borde superior
                                    paddingTop: color === Colors.primary ? 5 : 0,  
                                }} 
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="Crear"
                options={{
                    tabBarLabel: 'Crear',
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <MaterialCommunityIcons 
                                name="plus-circle-outline" 
                                color={color} 
                                size={35} 
                                style={{
                                    borderTopWidth: color === Colors.primary ? 3 : 0, 
                                    borderTopColor: 'red',
                                    paddingLeft: 8,
                                    width: 50,  // Ancho ajustado para el borde superior
                                    paddingTop: color === Colors.primary ? 5 : 0,
                                }} 
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen 
                name="profile" 
                options={{
                    tabBarLabel: 'Perfil',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons 
                                name="person-circle-outline" 
                                color={color} 
                                size={35} 
                                style={{
                                    borderTopWidth: color === Colors.primary ? 3 : 0, 
                                    borderTopColor: 'red',
                                    paddingLeft: 8,
                                    width: 50,  // Ajuste en el ancho del borde
                                    paddingTop: color === Colors.primary ? 5 : 0, 
                                }} 
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
     </FavoritesProvider>
    );
};

export default Layout;
