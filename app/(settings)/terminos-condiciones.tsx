import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Stack } from 'expo-router';

const TerminosCondiciones = () => {
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
        <Text style={styles.title}>Términos y Condiciones</Text>
        <Text style={styles.text}>Última actualización: 28/03/2025</Text>

        <Text style={styles.text}>
          Al utilizar la aplicación "AlquilaTuEvento", aceptas cumplir con los siguientes términos y condiciones. Si no estás de acuerdo con estos términos, no utilices la aplicación.
        </Text>

        <Text style={styles.subtitle}>1. Aceptación de los términos</Text>
        <Text style={styles.text}>
          Al acceder y utilizar nuestra aplicación, aceptas estar sujeto a estos términos y condiciones, que pueden ser modificados en cualquier momento sin previo aviso. Es tu responsabilidad revisar regularmente estos términos.
        </Text>

        <Text style={styles.subtitle}>2. Uso de la aplicación</Text>
        <Text style={styles.text}>
          Nuestra aplicación está destinada exclusivamente a facilitar la reserva y gestión de espacios para eventos y fiestas. El uso de la aplicación para cualquier otro propósito está prohibido.
        </Text>

        <Text style={styles.subtitle}>3. Registro y cuenta de usuario</Text>
        <Text style={styles.text}>
          Para utilizar algunos servicios de nuestra aplicación, deberás registrarte con tu información personal, incluyendo tu nombre, correo electrónico y otros datos relevantes. Eres responsable de mantener la confidencialidad de tu cuenta y de toda la actividad que ocurra bajo tu cuenta.
        </Text>

        <Text style={styles.subtitle}>4. Responsabilidad del usuario</Text>
        <Text style={styles.text}>
          Eres responsable de la veracidad de la información que proporciones al usar la aplicación. Además, te comprometes a utilizar la plataforma de manera legal y ética, respetando los derechos de propiedad de otros usuarios y de "AlquilaTuEvento".
        </Text>

        <Text style={styles.subtitle}>5. Propiedad intelectual</Text>
        <Text style={styles.text}>
          Todos los derechos de propiedad intelectual sobre el contenido de la aplicación, incluidos logos, marcas, textos, imágenes y otros materiales, son propiedad de "AlquilaTuEvento" o de sus licenciantes. No se te concede ningún derecho sobre dicho contenido salvo para el uso personal y no comercial de la aplicación.
        </Text>

        <Text style={styles.subtitle}>6. Modificaciones y cancelaciones</Text>
        <Text style={styles.text}>
          Nos reservamos el derecho de modificar o descontinuar cualquier servicio ofrecido a través de la aplicación en cualquier momento sin previo aviso. Asimismo, podemos cancelar o suspender tu cuenta si se detecta un uso indebido o que contravenga estos términos.
        </Text>

        <Text style={styles.subtitle}>7. Limitación de responsabilidad</Text>
        <Text style={styles.text}>
          "AlquilaTuEvento" no será responsable por daños directos, indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de usar la aplicación, salvo que lo exija la ley aplicable.
        </Text>

        <Text style={styles.subtitle}>8. Protección de datos personales</Text>
        <Text style={styles.text}>
          Nuestra Política de Privacidad rige el tratamiento de tus datos personales. Al usar la aplicación, aceptas la recopilación y el uso de tus datos conforme a dicha política.
        </Text>

        <Text style={styles.subtitle}>9. Resolución de conflictos</Text>
        <Text style={styles.text}>
          Cualquier disputa que surja de estos términos será resuelta de acuerdo con las leyes aplicables del país o región correspondiente. Nos reservamos el derecho de modificar la jurisdicción de los tribunales en caso de conflicto.
        </Text>

        <Text style={styles.subtitle}>10. Modificaciones de los Términos y Condiciones</Text>
        <Text style={styles.text}>
          Nos reservamos el derecho de actualizar o modificar estos Términos y Condiciones en cualquier momento. Te notificaremos sobre cualquier cambio significativo a través de la aplicación o por correo electrónico.
        </Text>

        <Text style={styles.subtitle}>11. Contacto</Text>
        <Text style={styles.text}>
          Si tienes preguntas o inquietudes sobre estos Términos y Condiciones, puedes contactarnos a través de [correo de contacto].
        </Text>
      </View>
    </ScrollView>
  );
};

export default TerminosCondiciones;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  text: { fontSize: 16, marginBottom: 10 },
});
