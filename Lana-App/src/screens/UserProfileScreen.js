import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/authService';
import { getUserProfile, updateUserProfile } from '../services/userService';

export default function UserProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { clearAuthState, isAuthenticated, user, updateUserInfo } = useAuth();

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const result = await getUserProfile();
      
      if (result.success) {
        setName(result.data.nombre || '');
        setEmail(result.data.correo || '');
        console.log('📝 Perfil cargado:', result.data);
      } else {
        console.error('❌ Error cargando perfil:', result.message);
        Alert.alert('Error', 'No se pudo cargar el perfil del usuario');
      }
    } catch (error) {
      console.error('❌ Error cargando perfil:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validar campos
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'El correo electrónico es obligatorio');
      return;
    }
    
    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Formato de correo electrónico inválido');
      return;
    }

    try {
      setIsSaving(true);
      
      const profileData = {
        nombre: name.trim(),
        correo: email.trim()
      };
      
      console.log('📝 Enviando datos de perfil:', profileData);
      
      const result = await updateUserProfile(profileData);
      
      if (result.success) {
        // Actualizar el estado global del usuario
        const updatedUserInfo = {
          ...user,
          nombre: name.trim(),
          correo: email.trim()
        };
        await updateUserInfo(updatedUserInfo);
        
        Alert.alert(
          'Éxito', 
          'Perfil actualizado correctamente',
          [{ 
            text: 'OK',
            onPress: () => {
              // Recargar el perfil para asegurar sincronización
              loadUserProfile();
            }
          }]
        );
        console.log('✅ Perfil actualizado exitosamente');
      } else {
        Alert.alert('Error', result.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 Iniciando proceso de logout...');
              
              // Llamar al servicio de logout
              const result = await logout();
              console.log('📡 Resultado del servicio logout:', result);
              
              if (result.success) {
                // Limpiar el estado de autenticación
                await clearAuthState();
                console.log('🧹 Estado de autenticación limpiado');
                
                // Verificar que el estado se limpió correctamente
                console.log('🔍 Estado actual de autenticación:', isAuthenticated);
                
                // Mostrar mensaje de éxito y forzar navegación
                Alert.alert(
                  'Sesión Cerrada', 
                  'Has cerrado sesión correctamente',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        console.log('✅ Logout completado exitosamente');
                        // Forzar navegación a la pantalla de autenticación
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Auth' }],
                        });
                      }
                    }
                  ]
                );
              } else {
                console.error('❌ Error en logout:', result.message);
                Alert.alert('Error', result.message || 'Error al cerrar sesión');
              }
            } catch (error) {
              console.error('❌ Error en logout:', error);
              Alert.alert('Error', 'Ocurrió un error al cerrar sesión');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil de Usuario</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Cargando perfil...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ingresa tu nombre"
              editable={!isSaving}
            />

            <Text style={styles.label}>Correo electrónico:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="ejemplo@correo.com"
              editable={!isSaving}
            />

            <View style={styles.buttonContainer}>
              <Button 
                title="Cambiar Contraseña" 
                onPress={() => navigation.navigate('RecuperarContraseña')}
                disabled={isSaving}
              />
              
              <Button 
                title={isSaving ? "Guardando..." : "Guardar Cambios"} 
                onPress={handleSave}
                disabled={isSaving}
              />
              
              <Button 
                title="Cerrar Sesión" 
                onPress={handleLogout} 
                color="#ff4444"
                disabled={isSaving}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
});