import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Solo ejecuta el warmUpAsync si no estamos en la web
    if (Platform.OS !== 'web') {
      void WebBrowser.warmUpAsync();
    }

    // Al desmontar, hace coolDownAsync si no estamos en la web
    return () => {
      if (Platform.OS !== 'web') {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};
