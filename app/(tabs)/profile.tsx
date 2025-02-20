import {
    View,
    Text,
    Button,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { useAuth, useUser } from '@clerk/clerk-expo';
  import { defaultStyles } from '@/constants/Styles';
  import { Ionicons } from '@expo/vector-icons';
  import Colors from '@/constants/Colors';
  import { Link } from 'expo-router';
  import * as ImagePicker from 'expo-image-picker';
  import GlobalStyles from '../../Android-styles/GlobalStyles';
  
  const Page = () => {
    const { signOut, isSignedIn } = useAuth();
    const { user } = useUser();
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.emailAddresses[0]?.emailAddress || '');
    const [phone, setPhone] = useState(user?.primaryPhoneNumber || '');
    const [location, setLocation] = useState(user?.publicMetadata?.location || '');
    const [bio, setBio] = useState(user?.publicMetadata?.bio || '');
    const [edit, setEdit] = useState(false);
    const [isHost, setIsHost] = useState(user?.publicMetadata?.isHost || false);
  
    useEffect(() => {
      if (user) {
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.emailAddresses[0]?.emailAddress || '');
        setPhone(user.primaryPhoneNumber || '');
        setLocation(user.publicMetadata?.location || '');
        setBio(user.publicMetadata?.bio || '');
        setIsHost(user.publicMetadata?.isHost || false);
      }
    }, [user]);
  
    const onSaveUser = async () => {
      try {
        await user?.update({
          firstName,
          lastName,
          publicMetadata: { location, bio, isHost },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setEdit(false);
      }
    };
  
    const onCaptureImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.75,
        base64: true,
      });
  
      if (!result.canceled) {
        const base64 = `data:image/png;base64,${result.assets[0].base64}`;
        user?.setProfileImage({ file: base64 });
      }
    };
  
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Perfil</Text>
            {isSignedIn && <Ionicons name="notifications-outline" size={26} />}
          </View>
  
          {isSignedIn && user ? (
            <View style={styles.card}>
              <TouchableOpacity onPress={onCaptureImage}>
                <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
              </TouchableOpacity>
              <View style={styles.editRow}>
                <Text style={{ fontFamily: 'mon-b', fontSize: 22 }}>{firstName} {lastName}</Text>
                <TouchableOpacity onPress={() => setEdit(true)}>
                  <Ionicons name="create-outline" size={24} color={Colors.dark} />
                </TouchableOpacity>
              </View>
              <Text>{email}</Text>
              <TextInput placeholder="Ubicación" value={location} onChangeText={setLocation} editable={edit} style={defaultStyles.inputField} />
              <TextInput placeholder="Teléfono" value={phone} onChangeText={setPhone} editable={edit} style={defaultStyles.inputField} />
              <TextInput placeholder="Descripción" value={bio} onChangeText={setBio} editable={edit} multiline style={[defaultStyles.inputField, { height: 80 }]} />
              {isHost && (
                <Link href={'/admin/properties'} asChild>
                  <Button title="Administrar Propiedades" color={Colors.dark} />
                </Link>
              )}
            </View>
          ) : (
            <View style={styles.noUserContainer}>
              <Ionicons name="person-circle-outline" size={100} color={Colors.dark} />
              <Text style={styles.noUserText}>¡Inicia sesión para gestionar tu perfil!</Text>
              <Link href={'/(modals)/login'} asChild>
                <TouchableOpacity style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
  
          <View style={styles.logbutton}>
            {isSignedIn && <Button title="Cerrar sesión" onPress={() => signOut()} color={Colors.dark} />}
          </View>
        </ScrollView>
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
    card: {
      backgroundColor: '#fff',
      padding: 24,
      borderRadius: 16,
      marginHorizontal: 24,
      marginTop: 24,
      elevation: 2,
      alignItems: 'center',
      gap: 14,
      marginBottom: 24,
    },
    noUserContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      marginTop: 50,
    },
    noUserText: {
      fontSize: 18,
      textAlign: 'center',
      marginTop: 10,
      color: Colors.dark,
    },
    loginButton: {
      marginTop: 20,
      backgroundColor: Colors.dark,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    editRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    logbutton: {
      padding: 24,
    },
  });
  
  export default Page;
  