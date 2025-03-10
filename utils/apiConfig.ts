// utils/apiConfig.ts
import Constants from 'expo-constants';

const { manifest } = Constants;

const API_IP = manifest?.extra?.EXPO_PUBLIC_API_IP || process.env.EXPO_PUBLIC_API_IP;
const API_BASE_URL = `http://${API_IP}:3000`;

export default API_BASE_URL;