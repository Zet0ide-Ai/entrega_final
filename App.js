// App.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import TransferScreen from './screens/TransferScreen';
import ProfileScreen from './screens/ProfileScreen';
import LocationScreen from './screens/LocationScreen';
import MovementsScreen from './screens/MovementsScreen';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ title: 'Menú principal' }}
      />
      <Stack.Screen
        name="Transferencias"
        component={TransferScreen}
        options={{ title: 'Transferencias' }}
      />
      <Stack.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <Stack.Screen
        name="Localizacion"
        component={LocationScreen}
        options={{ title: 'Localización de la cuenta' }}
      />
      <Stack.Screen
        name="Movimientos"
        component={MovementsScreen}
        options={{ title: 'Últimos movimientos' }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const unsuscribe = onAuthStateChanged(auth, (currentuser)=>{
      setUser(currentuser);
      setLoading(false);
    });
    return () => unsuscribe();
  },[]);

  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex:1}}>
        {user ? <AppStack /> : <AuthStack />}
      </SafeAreaView>
    </NavigationContainer>
  );
}
