// src/screens/PresupuestosScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { listarPresupuestos, eliminarPresupuesto } from '../services/presupuestos';

// 👇 Shim: usa window.alert/confirm en web; en móvil cae a Alert.alert/confirm equivalente
const Window = typeof window !== 'undefined' && window?.alert
  ? window
  : {
      alert: (msg) => Alert.alert('Aviso', String(msg)),
      confirm: async (msg) =>
        new Promise((resolve) => {
          Alert.alert('Confirmar', String(msg), [
            { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Aceptar', onPress: () => resolve(true) },
          ]);
        }),
    };

export default function PresupuestosScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await listarPresupuestos();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      Window.alert('No se pudieron cargar los presupuestos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', cargar);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargar();
    setRefreshing(false);
  }, []);

  const handleDelete = async (id) => {
    const ok = await Window.confirm('¿Eliminar este presupuesto?');
    if (!ok) return;
    try {
      await eliminarPresupuesto(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch {
      Window.alert('No se pudo eliminar.');
    }
  };

  const renderItem = ({ item }) => {
    const usado = Number(item.monto_usado || 0); // por si tu backend manda este campo
    const total = Number(item.monto_total || 0);
    const restante = total - usado;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PresupuestoForm', { mode: 'edit', id: item.id })}
      >
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{item.nombre}</Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.delete}>Eliminar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Categoría: {item.categoria_id}</Text>
        <Text style={styles.amount}>Total: ${total.toFixed(2)}</Text>
        <Text style={restante >= 0 ? styles.ok : styles.warn}>
          Restante: ${restante.toFixed(2)}
        </Text>
        <Text style={styles.dates}>
          {item.fecha_inicio} → {item.fecha_fin}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando presupuestos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ marginBottom: 12 }}>No hay presupuestos.</Text>
          <TouchableOpacity
            style={[styles.fab, { bottom: 80 }]} // ← un poco más arriba
            onPress={() => navigation.navigate('PresupuestoForm', { mode: 'create' })}
          >
            <Text style={styles.fabText}>+ Nuevo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(it) => String(it.id)}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 12 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
          <TouchableOpacity
            style={[styles.fab, { position: 'absolute', bottom: 80, right: 24 }]} // ← más arriba
            onPress={() => navigation.navigate('PresupuestoForm', { mode: 'create' })}
          >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { color: '#666', marginTop: 6 },
  amount: { marginTop: 6, fontWeight: '600' },
  ok: { marginTop: 4, color: '#0a7' },
  warn: { marginTop: 4, color: '#c00' },
  dates: { marginTop: 4, fontSize: 12, color: '#666' },
  delete: { color: '#c00', fontWeight: '600' },
  fab: {
    backgroundColor: '#0066ff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 28
    // bottom se ajusta inline arriba (80)
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});
