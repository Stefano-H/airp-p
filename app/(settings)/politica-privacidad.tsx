import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Stack } from 'expo-router';

const PoliticaPrivacidad = () => {
  return (
  <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: '',
          headerTitleStyle: {
            fontFamily: 'mon-b',
            fontSize: 20,
            marginTop: 20,
          },
        }}
      />
      <View style={styles.container}>
          <Text style={styles.title}>Política de Privacidad</Text>
          <Text style={styles.text}>Última actualización: 28/03/2025</Text>

          <Text style={styles.text}>
          En "AlquilaTuEvento", valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos tu información cuando utilizas nuestra aplicación.
          </Text>

          <Text style={styles.subtitle}>1. Información que recopilamos</Text>
          <Text style={styles.text}>
          Recopilamos diferentes tipos de información para mejorar nuestros servicios, incluyendo:
          </Text>
          <Text style={styles.bullet}>• Información personal: Nombre, correo electrónico, número de teléfono, dirección.</Text>
          <Text style={styles.bullet}>• Información de uso: Datos sobre cómo interactúas con la aplicación.</Text>
          <Text style={styles.bullet}>• Información de pago: Si realizas transacciones dentro de la aplicación, recopilamos datos necesarios para procesarlas de manera segura.</Text>

          <Text style={styles.subtitle}>2. Uso de la información</Text>
          <Text style={styles.text}>
          Utilizamos tu información para los siguientes fines:
          </Text>
          <Text style={styles.bullet}>• Proveer y mejorar nuestros servicios.</Text>
          <Text style={styles.bullet}>• Procesar pagos y transacciones.</Text>
          <Text style={styles.bullet}>• Brindar soporte y atención al cliente.</Text>
          <Text style={styles.bullet}>• Enviar notificaciones relevantes sobre tu actividad en la aplicación.</Text>
          <Text style={styles.bullet}>• Cumplir con obligaciones legales y de seguridad.</Text>

          <Text style={styles.subtitle}>3. Protección de la información</Text>
          <Text style={styles.text}>
          Implementamos medidas de seguridad adecuadas para proteger tus datos personales contra accesos no autorizados, alteraciones o divulgaciones. Sin embargo, recuerda que ninguna transmisión de datos por Internet es completamente segura.
          </Text>

          <Text style={styles.subtitle}>4. Compartición de información</Text>
          <Text style={styles.text}>
          No vendemos ni alquilamos tu información personal. Podemos compartir datos con:
          </Text>
          <Text style={styles.bullet}>• Proveedores de servicios que nos ayudan a operar la aplicación.</Text>
          <Text style={styles.bullet}>• Autoridades legales en caso de requerimiento.</Text>
          <Text style={styles.bullet}>• Otros usuarios, solo cuando sea necesario para la interacción dentro de la plataforma.</Text>

          <Text style={styles.subtitle}>5. Tus derechos</Text>
          <Text style={styles.text}>
          Tienes derecho a acceder, corregir o eliminar tu información personal. Si deseas ejercer estos derechos, contáctanos a alquilatuevento@gmail.com.
          </Text>

          <Text style={styles.subtitle}>6. Cambios en la política</Text>
          <Text style={styles.text}>
          Podemos actualizar esta Política de Privacidad ocasionalmente. Notificaremos cualquier cambio importante dentro de la aplicación.
          </Text>

          <Text style={styles.subtitle}>7. Contacto</Text>
          <Text style={styles.text}>
          Si tienes preguntas sobre esta política, puedes contactarnos en alquilatuevento@gmail.com.
          </Text>
      </View>
  </ScrollView>
  );
};

export default PoliticaPrivacidad;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  text: { fontSize: 16, marginBottom: 10 },
  bullet: { fontSize: 16, marginLeft: 15, marginBottom: 5 },
});
