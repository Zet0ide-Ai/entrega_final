import React,{useEffect,useState}from"react";
import{Text,View,Button,Image}from"react-native";
import{auth,db}from"../firebase";
import{doc,getDoc,updateDoc}from"firebase/firestore";
import* as ImagePicker from"expo-image-picker";

export default function ProfileScreen({navigation}){
 const u=auth.currentUser;
 const [p,setP]=useState(null),[photo,setPhoto]=useState(null);

 useEffect(()=>{(async()=>{
   if(!u)return;
   const d=await getDoc(doc(db,"users",u.uid));
   if(d.exists()){setP(d.data());setPhoto(d.data().photoURL);}
 })();},[]);

 const pick=async(cam)=>{
   const r=await(cam?ImagePicker.launchCameraAsync():ImagePicker.launchImageLibraryAsync())
   if(!r.canceled){const uri=r.assets[0].uri;setPhoto(uri);await updateDoc(doc(db,"users",u.uid),{photoURL:uri});}
 };

 if(!p)return(<View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Text>Cargando...</Text></View>);

 return(
 <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
   <Text style={{fontSize:22}}>Perfil</Text>
   {photo?<Image source={{uri:photo}} style={{width:120,height:120,borderRadius:60}}/>:
   <View style={{width:120,height:120,borderRadius:60,backgroundColor:"#ccc",justifyContent:"center",alignItems:"center"}}>
     <Text style={{fontSize:32}}>{p.email[0].toUpperCase()}</Text></View>}
   <Text>{p.email}</Text><Text>Saldo: ${p.saldo}</Text>
   <View style={{flexDirection:"row",margin:10}}><Button title="Galería" onPress={()=>pick(false)}/>
     <Button title="Cámara" onPress={()=>pick(true)}/></View>
   <Button title="Volver" onPress={()=>navigation.goBack()}/>
 </View>);
}
