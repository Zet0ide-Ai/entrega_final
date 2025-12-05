// MovementsScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as SQLite from "expo-sqlite";

export default function MovementsScreen() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const db = await SQLite.openDatabaseAsync("Datos_Bancarios.db");

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS movimientos(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tipo TEXT NOT NULL,
          monto REAL NOT NULL,
          emailOrigen TEXT NOT NULL,
          emailDestino TEXT,
          fecha TEXT NOT NULL
        );
      `);

      const rows = await db.getAllAsync(
        "SELECT * FROM movimientos ORDER BY datetime(fecha) DESC;"
      );

      setMovements(rows);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando movimientos...</Text>
      </View>
    );
  }

  if (movements.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No hay movimientos registrados aún.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.type}>{item.tipo}</Text>
        <Text style={styles.amount}>${item.monto}</Text>
      </View>
      <Text style={styles.description}>
        De: {item.emailOrigen}
        {item.emailDestino ? `  →  Para: ${item.emailDestino}` : ""}
      </Text>
      <Text style={styles.date}>
        {new Date(item.fecha).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={movements}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  type: { fontWeight: "bold" },
  amount: { fontWeight: "bold" },
  description: { color: "#555" },
  date: { marginTop: 4, fontSize: 12, color: "#888" },
});
