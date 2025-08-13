// src/screens/PagoFijoFormScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { crearPagoFijo, obtenerPagoFijo, actualizarPagoFijo } from '../services/pagosFijos';

const FRECUENCIAS = ['Diario', 'Semanal', 'Mensual', 'Anual'];
const ESTADOS = ['Pendiente', 'Completado'];

export default function PagoFijoFormScreen({ route, navigation }) {
  const { mode = 'create', id } = route.params || {};
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    nombre: '',
    monto: '',
    categoria: '',
    frecuencia: 'Mensual',
    fecha_inicio: '',
    estado: 'Pendiente',
    activo: true
  });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const data = await obtenerPagoFijo(id);
          setForm({
            nombre: data.nombre ?? '',
            monto: String(data.monto ?? ''),
            categoria: data.categoria ?? '',
            frecuencia: data.frecuencia ?? 'Mensual',
            fecha_inicio: data.fecha_inicio ?? '',
            estado: data.estado ?? 'Pendiente',
            activo: Boolean(data.activo ?? true)
          });
        } catch {
        //   Window.alert('Error No se pudo cargar el pago fijo.');
          navigation.goBack();
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit, navigation]);

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    if (!form.nombre || !form.monto || !form.categoria || !form.frecuencia || !form.fecha_inicio) {
       Window.alert('Faltan campos Completa todos los campos obligatorios.');
      return false;
    }
    if (isNaN(Number(form.monto))) {
       Window.alert('Monto inválido Escribe un número válido en monto.');
      return false;
    }
    if (!FRECUENCIAS.includes(form.frecuencia)) {
       Window.alert('Frecuencia inválida Usa: Diario, Semanal, Mensual o Anual.');
      return false;
    }
    if (!ESTADOS.includes(form.estado)) {
       Window.alert('Estado inválido Usa: Pendiente o Completado.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log('Form data:', form);
    if (!validate()) return;
    const payload = {
      nombre: form.nombre.trim(),
      monto: Number(parseFloat(form.monto).toFixed(2)),
      categoria: form.categoria.trim(),
      frecuencia: form.frecuencia,
      fecha_inicio: form.fecha_inicio,
      estado: form.estado,
      activo: Boolean(form.activo)
    };

    try {
      if (isEdit) {
        await actualizarPagoFijo(id, payload);
         Window.alert('Éxito Pago fijo actualizado.');
      } else {
        await crearPagoFijo(payload);
         Window.alert('Éxito Pago fijo creado.');
      }
      navigation.goBack();
    } catch (e) {
       Window.alert('Error e?.response?.data?.detail || No se pudo guardar.');
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
        <Text style={styles.title}>{isEdit ? 'Editar' : 'Nuevo'} Pago Fijo</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Renta del departamento"
          value={form.nombre}
          onChangeText={(t) => onChange('nombre', t)}
        />

        <Text style={styles.label}>Monto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 4500.00"
          keyboardType="decimal-pad"
          value={form.monto}
          onChangeText={(t) => onChange('monto', t)}
        />

        <Text style={styles.label}>Categoría</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Vivienda"
          value={form.categoria}
          onChangeText={(t) => onChange('categoria', t)}
        />

        <Text style={styles.label}>Frecuencia (Diario/Semanal/Mensual/Anual)</Text>
        <TextInput
          style={styles.input}
          placeholder="Mensual"
          value={form.frecuencia}
          onChangeText={(t) => onChange('frecuencia', t)}
        />

        <Text style={styles.label}>Fecha inicio (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2025-08-01"
          value={form.fecha_inicio}
          onChangeText={(t) => onChange('fecha_inicio', t)}
        />

        <Text style={styles.label}>Estado (Pendiente/Completado)</Text>
        <TextInput
          style={styles.input}
          placeholder="Pendiente"
          value={form.estado}
          onChangeText={(t) => onChange('estado', t)}
        />

        <Text style={styles.label}>Activo (true/false)</Text>
        <TextInput
          style={styles.input}
          placeholder="true"
          value={String(form.activo)}
          onChangeText={(t) => onChange('activo', t.toLowerCase() === 'true')}
        />

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>{isEdit ? 'Guardar cambios' : 'Crear pago fijo'}</Text>
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
