// src/screens/PresupuestoFormScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { crearPresupuesto, obtenerPresupuesto, actualizarPresupuesto } from '../services/presupuestos';

export default function PresupuestoFormScreen({ route, navigation }) {
  const { mode = 'create', id } = route.params || {};
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    categoria_id: '',
    nombre: '',
    monto_total: '',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const data = await obtenerPresupuesto(id);
          setForm({
            categoria_id: String(data.categoria_id ?? ''),
            nombre: data.nombre ?? '',
            monto_total: String(data.monto_total ?? ''),
            fecha_inicio: data.fecha_inicio ?? '',
            fecha_fin: data.fecha_fin ?? ''
          });
        } catch {
          Alert.alert('Error', 'No se pudo cargar el presupuesto.');
          navigation.goBack();
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit, navigation]);

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    if (!form.categoria_id || !form.nombre || !form.monto_total || !form.fecha_inicio || !form.fecha_fin) {
      Window.alert('Faltan campos', 'Completa todos los campos.');
      return false;
    }
    if (isNaN(Number(form.monto_total))) {
      Window.alert('Monto inválido', 'Escribe un número válido en monto total.');
      return false;
    }
    // formato simple AAAA-MM-DD (no estricto)
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = {
      categoria_id: Number(form.categoria_id),
      nombre: form.nombre.trim(),
      monto_total: Number(parseFloat(form.monto_total).toFixed(2)),
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin
    };

    try {
      if (isEdit) {
        await actualizarPresupuesto(id, payload);
        Window.alert('Éxito', 'Presupuesto actualizado.');
      } else {
        await crearPresupuesto(payload);
        Window.alert('Éxito', 'Presupuesto creado.');
      }
      navigation.goBack();
    } catch (e) {
      Window.alert('Error', e?.response?.data?.detail || 'No se pudo guardar.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{isEdit ? 'Editar' : 'Nuevo'} Presupuesto</Text>

        <Text style={styles.label}>Categoría ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 1"
          keyboardType="numeric"
          value={form.categoria_id}
          onChangeText={(t) => onChange('categoria_id', t)}
        />

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Supermercado mensual"
          value={form.nombre}
          onChangeText={(t) => onChange('nombre', t)}
        />

        <Text style={styles.label}>Monto total</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 2500.00"
          keyboardType="decimal-pad"
          value={form.monto_total}
          onChangeText={(t) => onChange('monto_total', t)}
        />

        <Text style={styles.label}>Fecha inicio (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2025-08-01"
          value={form.fecha_inicio}
          onChangeText={(t) => onChange('fecha_inicio', t)}
        />

        <Text style={styles.label}>Fecha fin (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2025-08-31"
          value={form.fecha_fin}
          onChangeText={(t) => onChange('fecha_fin', t)}
        />

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>{isEdit ? 'Guardar cambios' : 'Crear presupuesto'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  label: { marginTop: 12, marginBottom: 6, color: '#555' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  btn: {
    marginTop: 18,
    backgroundColor: '#0066ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  btnText: { color: '#fff', fontWeight: '700' }
});
