import React,{useEffect,useState}from"react";
import{View,Text,TextInput,Button,StyleSheet,Alert}from"react-native";
import*as SQLite from"expo-sqlite";
import{auth,db as fs}from"../firebase";
import{doc,setDoc,updateDoc,getDoc}from"firebase/firestore";

export default function TransferScreen({navigation}){
 const u=auth.currentUser;
 const[db,setDb]=useState(null);
 const[saldo,setSaldo]=useState(0);
 const[destEmail,setDestEmail]=useState("");
 const[monto,setMonto]=useState("");

 useEffect(()=>{
  if(!u)return;
  (async()=>{
   const dbLocal = await SQLite.openDatabaseAsync("Datos_Bancarios.db");
   setDb(dbLocal);

   await dbLocal.execAsync(`
     CREATE TABLE IF NOT EXISTS cuentas(
       id TEXT PRIMARY KEY NOT NULL,
       email TEXT UNIQUE NOT NULL,
       saldo REAL NOT NULL,
       fechaCreacion TEXT NOT NULL
     );
   `);

   await dbLocal.execAsync(`
     CREATE TABLE IF NOT EXISTS movimientos(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       tipo TEXT NOT NULL,
       monto REAL NOT NULL,
       emailOrigen TEXT NOT NULL,
       emailDestino TEXT,
       fecha TEXT NOT NULL
     );
   `);

   // Ver si existe la cuenta del usuario actual
   const row=await dbLocal.getFirstAsync(
     "SELECT saldo FROM cuentas WHERE id=?;",
     [u.uid]
   );

   if(!row){
     const fecha=new Date().toISOString(), saldoIni=200000;
     await dbLocal.runAsync(
       "INSERT INTO cuentas(id,email,saldo,fechaCreacion)VALUES(?,?,?,?);",
       [u.uid,u.email,saldoIni,fecha]
     );
     setSaldo(saldoIni);
     await setDoc(doc(fs,"Datos_Bancarios",u.uid),{
       email:u.email,saldo:saldoIni,fechaCreacion:fecha
     });
   }else{
     const s=row.saldo;
     setSaldo(s);
     const ref=doc(fs,"Datos_Bancarios",u.uid);
     const snap=await getDoc(ref);
     if(!snap.exists()){
       await setDoc(ref,{
         email:u.email,
         saldo:s,
         fechaCreacion:new Date().toISOString()
       });
     }
   }
  })();
 },[u]);

 const handleTransfer=async()=>{
  const m=parseFloat(monto);
  if(!destEmail||isNaN(m)||m<=0)
    return Alert.alert("Error","Ingresa email y monto válido.");
  if(!u)return Alert.alert("Error","No hay usuario autenticado.");
  if(!db)return Alert.alert("Error","Base de datos no lista.");

  // Saldo del emisor
  const emRow=await db.getFirstAsync(
    "SELECT saldo FROM cuentas WHERE id=?;",
    [u.uid]
  );
  if(!emRow)return Alert.alert("Error","No existe tu cuenta.");
  const sActual=emRow.saldo;
  if(sActual<=0||sActual<m)
    return Alert.alert("Error","Saldo insuficiente.");

  // Destinatario por email
  const destRow=await db.getFirstAsync(
    "SELECT id,saldo FROM cuentas WHERE email=?;",
    [destEmail]
  );
  if(!destRow)
    return Alert.alert("Error","El destinatario no existe.");

  const nuevoEm=sActual-m;
  const nuevoDest=destRow.saldo+m;

  // Actualizar en SQLite
  await db.runAsync(
    "UPDATE cuentas SET saldo=? WHERE id=?;",
    [nuevoEm,u.uid]
  );
  await db.runAsync(
    "UPDATE cuentas SET saldo=? WHERE id=?;",
    [nuevoDest,destRow.id]
  );
  setSaldo(nuevoEm);

  // Actualizar en Firestore emisor
  try{
    await updateDoc(doc(fs,"Datos_Bancarios",u.uid),{saldo:nuevoEm});
  }catch{
    await setDoc(doc(fs,"Datos_Bancarios",u.uid),{
      email:u.email,saldo:nuevoEm,fechaCreacion:new Date().toISOString()
    });
  }

  // Actualizar en Firestore destinatario
  try{
    await updateDoc(doc(fs,"Datos_Bancarios",destRow.id),{saldo:nuevoDest});
  }catch{
    await setDoc(doc(fs,"Datos_Bancarios",destRow.id),{
      email:destEmail,saldo:nuevoDest,fechaCreacion:new Date().toISOString()
    });
  }

  Alert.alert("Éxito",`Transferiste $${m} a ${destEmail}.`);
  setMonto("");
  setDestEmail("");
 };

 return(
  <View style={styles.container}>
   <Text style={styles.title}>Transferencias</Text>
   <Text style={styles.saldo}>Saldo actual: ${saldo}</Text>

   <Text style={styles.label}>Email destinatario</Text>
   <TextInput
    style={styles.input}
    value={destEmail}
    onChangeText={setDestEmail}
    placeholder="destinatario@correo.com"
    autoCapitalize="none"
   />

   <Text style={styles.label}>Monto a transferir</Text>
   <TextInput
    style={styles.input}
    value={monto}
    onChangeText={setMonto}
    placeholder="Ej: 50000"
    keyboardType="numeric"
   />

   <View style={styles.btn}>
    <Button title="Transferir" onPress={handleTransfer}/>
   </View>
   <View style={styles.btn}>
    <Button title="Volver al menú" onPress={()=>navigation.goBack()}/>
   </View>
  </View>
 );
}

const styles=StyleSheet.create({
 container:{flex:1,padding:20,backgroundColor:"#fff"},
 title:{fontSize:24,fontWeight:"bold",textAlign:"center",marginBottom:20},
 saldo:{fontSize:18,marginBottom:20,textAlign:"center"},
 label:{fontSize:14,marginBottom:5},
 input:{borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:10,marginBottom:15},
 btn:{marginTop:10}
});
