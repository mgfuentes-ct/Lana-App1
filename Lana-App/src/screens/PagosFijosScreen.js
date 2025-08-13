// src/screens/PagosFijosScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { listarPagosFijos, eliminarPagoFijo, marcarComoCompletado, toggleActivo } from '../services/pagosFijos';

export default function PagosFijosScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await listarPagosFijos();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los pagos fijos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', cargar);
    return unsub;
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargar();
    setRefreshing(false);
  }, []);

  const handleDelete = (id) => {
    Alert.alert('Confirmar', '¿Eliminar este pago fijo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarPagoFijo(id);
            setItems(prev => prev.filter(p => p.id !== id));
          } catch {
            Alert.alert('Error', 'No se pudo eliminar.');
          }
        }
      }
    ]);
  };

  const handleCompletar = async (id) => {
    try {
      await marcarComoCompletado(id);
      setItems(prev => prev.map(p => p.id === id ? { ...p, estado: 'Completado' } : p));
    } catch {
      Alert.alert('Error', 'No se pudo marcar como completado.');
    }
  };

  const handleToggleActivo = async (id, activoActual) => {
    try {
      await toggleActivo(id, !activoActual);
      setItems(prev => prev.map(p => p.id === id ? { ...p, activo: !activoActual } : p));
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado.');
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{item.nombre}</Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.delete}>Eliminar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Categoría: {item.categoria}</Text>
        <Text style={styles.amount}>Monto: ${Number(item.monto || 0).toFixed(2)}</Text>
        <Text style={styles.subtitle}>Frecuencia: {item.frecuencia}</Text>
        <Text style={styles.subtitle}>Inicio: {item.fecha_inicio}</Text>

        <View style={[styles.rowBetween, { marginTop: 10 }]}>
          <Text style={[styles.badge, item.estado === 'Completado' ? styles.badgeOk : styles.badgeWarn]}>
            {item.estado}
          </Text>
          <Text style={[styles.badge, item.activo ? styles.badgeOk2 : styles.badgeOff]}>
            {item.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#444' }]}
            onPress={() => navigation.navigate('PagoFijoForm', { mode: 'edit', id: item.id })}
          >
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[stylesbtnSmall, { backgroundColor: '#0a7' }]}
            onPress={() => handleCompletar(item.id)}
          >
            <Text style={styles.btnText}>Completar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[stylesbtnSmall, { backgroundColor: item.activo ? '#c60' : '#06c' }]}
            onPress={() => handleToggleActivo(item.id, item.activo)}
          >
            <Text style={styles.btnText}>{item.activo ? 'Desactivar' : 'Activar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando pagos fijos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ marginBottom: 12 }}>No hay pagos fijos.</Text>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('PagoFijoForm', { mode: 'create' })}
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
            style={[styles.fab, { position: 'absolute', bottom: 24, right: 24 }]}
            onPress={() => navigation.navigate('PagoFijoForm', { mode: 'create' })}
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
  delete: { color: '#c00', fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, color: '#fff', overflow: 'hidden' },
  badgeOk: { backgroundColor: '#0a7' },
  badgeWarn: { backgroundColor: '#c90' },
  badgeOk2: { backgroundColor: '#06c' },
  badgeOff: { backgroundColor: '#666' },
  fab: {
    backgroundColor: '#0066ff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 28
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});

// Nota: stylesbtnSmall es un estilo compacto reutilizable:
const stylesbtnSmall = { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 };
