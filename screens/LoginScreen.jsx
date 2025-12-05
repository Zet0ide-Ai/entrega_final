import React,{useState,useEffect} from "react";
import{
  StyleSheet,
  Text, 
  TextInput,
  View,
  Button,
  TouchableOpacity
} from 'react-native'
import {auth, db} from '../firebase'
import { createUserWithEmailAndPassword, 
         signInWithEmailAndPassword} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function LoginScreen(){
  const[email, setEmail]= useState('')
  const[password, setPassword]= useState('')
  const[error, setError]= useState(null)

 const handleRegister = async () => {
  if (email === '' || password === '') {
    setError('Complete los campos');
    return;
  }

  try {
    setError(null);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      photoURL: null,
      saldo: 0,
      createdAt: serverTimestamp()
    });

  } catch (err) {
    setError(err.message);
  }
};

  const handleLogin= async()=>{
    if(email==='' || password ==''){
      setError('Complete los campos');
      return
    }

    try{
      setError(null)
      await signInWithEmailAndPassword(auth,email,password)
    }catch(err){
      setError(err.message)
    }
  }

  return(
    <View style={styles.container}>
      <Text style={styles.title}>Zeta Bank</Text>

      <TextInput
        style={styles.input}
        placeholder='E-mail'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder='Contraseña'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20,
    backgroundColor:'#fff'
  },
  title:{
    fontSize:24,
    marginBottom:20,
    textAlign:'center',
  },
  input:{
    width:'80%',
    padding:10,
    marginVertical:10,
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:8,
    textAlign:'center',
  },
  error:{
    color:'red',
    marginVertical:10,
    textAlign:'center',
  },
  buttonContainer:{
    width:'80%',
    marginVertical:5,
  },
  buttonPrimary:{
  backgroundColor:'#4A90E2',
  paddingVertical:12,
  width:'80%',
  borderRadius:10,
  alignItems:'center',
  marginTop:10,
},
buttonSecondary:{
  backgroundColor:'#50C878',
  paddingVertical:12,
  width:'80%',
  borderRadius:10,
  alignItems:'center',
  marginTop:10,
},
buttonText:{
  color:'#fff',
  fontSize:16,
  fontWeight:'bold'
}
})
