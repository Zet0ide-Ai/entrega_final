// screens/MainScreen.js (o PantallaInicio.js, pero que coincida con el import)
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function MainScreen({ navigation }) {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Al cerrar sesión, user = null en App.js → se muestra LoginScreen
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  };

  return(
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>

      <View style={styles.buttonContainer}>
        <Button
          title='Transferencias'
          onPress={() => navigation.navigate('Transferencias')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title='Perfil'
          onPress={() => navigation.navigate('Perfil')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title='Localización de la cuenta'
          onPress={() => navigation.navigate('Localizacion')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title='Últimos Movimientos'
          onPress={() => navigation.navigate('Movimientos')}
        />
      </View>

      <View style={styles.logoutContainer}>
        <Button
          title='Cerrar sesión'
          color="red"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff',
    paddingHorizontal:20,
  },
  title:{
    fontSize:26,
    fontWeight:'bold',
    marginBottom:30,
    textAlign:'center',
  },
  buttonContainer:{
    width:'80%',
    marginVertical:10,
  },
  logoutContainer:{
    width:'80%',
    marginTop:30,
  }
});
