import { StyleSheet, Platform, StatusBar } from 'react-native';

export default StyleSheet.create({
    droidSafeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});