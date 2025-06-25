import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';

export default function SupportScreen({ navigation }) {
  const faqs = [
    {
      question: "¿Cómo puedo restablecer mi contraseña?",
      answer: "Ve a la pantalla de login y haz clic en 'Recuperar Contraseña'.",
    },
    {
      question: "¿Cómo agrego una nueva transacción?",
      answer: "Desde el Panel Principal, selecciona 'Nueva Transacción' e ingresa los datos.",
    },
    {
      question: "¿Puedo exportar mis transacciones?",
      answer: "Sí, desde la pantalla de Historial puedes exportar tus datos en formato CSV.",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ayuda y Soporte</Text>

      {faqs.map((item, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.question}>{item.question}</Text>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      ))}

      <Button title="Contactar Soporte" onPress={() => alert('Formulario de contacto')} />
      <Button title="Volver" onPress={() => navigation.goBack()} color="#999" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  answer: {
    fontSize: 15,
    marginTop: 5,
    color: '#444',
  },
});