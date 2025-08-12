import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { 
  getSupportFAQ, 
  getSupportCategories, 
  getSupportPriorities,
  createSupportTicket
} from '../services/supportService';

export default function SupportScreen({ navigation }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  
  // Estados para el modal de ticket
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketData, setTicketData] = useState({
    asunto: '',
    mensaje: '',
    categoria: '',
    prioridad: ''
  });

  useEffect(() => {
    loadSupportData();
  }, []);

  const loadSupportData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar FAQ, categorías y prioridades en paralelo
      const [faqResult, categoriesResult, prioritiesResult] = await Promise.all([
        getSupportFAQ(),
        getSupportCategories(),
        getSupportPriorities()
      ]);

      if (faqResult.success) {
        setFaqs(faqResult.data);
      }

      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
        if (categoriesResult.data.length > 0) {
          setTicketData(prev => ({ ...prev, categoria: categoriesResult.data[0].id }));
        }
      }

      if (prioritiesResult.success) {
        setPriorities(prioritiesResult.data);
        if (prioritiesResult.data.length > 0) {
          setTicketData(prev => ({ ...prev, prioridad: prioritiesResult.data[0].id }));
        }
      }

    } catch (error) {
      console.error('Error loading support data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de soporte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketData.asunto.trim() || !ticketData.mensaje.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const result = await createSupportTicket(ticketData);
      
      if (result.success) {
        Alert.alert(
          '¡Éxito!',
          'Ticket de soporte creado correctamente. Nos pondremos en contacto contigo pronto.',
          [
            {
              text: 'Continuar',
              onPress: () => {
                setShowTicketModal(false);
                setTicketData({ asunto: '', mensaje: '', categoria: '', prioridad: '' });
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      Alert.alert('Error', 'No se pudo crear el ticket de soporte');
    }
  };

  const renderFAQItem = (item, index) => (
    <View key={index} style={styles.faqItem}>
      <Text style={styles.question}>{item.pregunta}</Text>
      <Text style={styles.answer}>{item.respuesta}</Text>
    </View>
  );

  const renderTicketModal = () => (
    <Modal
      visible={showTicketModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowTicketModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear Ticket de Soporte</Text>
          
          <Text style={styles.inputLabel}>Asunto:</Text>
          <TextInput
            style={styles.textInput}
            value={ticketData.asunto}
            onChangeText={(text) => setTicketData(prev => ({ ...prev, asunto: text }))}
            placeholder="Describe brevemente tu problema"
            multiline
          />

          <Text style={styles.inputLabel}>Mensaje:</Text>
          <TextInput
            style={[styles.textInput, styles.messageInput]}
            value={ticketData.mensaje}
            onChangeText={(text) => setTicketData(prev => ({ ...prev, mensaje: text }))}
            placeholder="Describe tu problema en detalle"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.inputLabel}>Categoría:</Text>
          <View style={styles.pickerContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.pickerOption,
                  ticketData.categoria === cat.id && styles.pickerOptionSelected
                ]}
                onPress={() => setTicketData(prev => ({ ...prev, categoria: cat.id }))}
              >
                <Text style={[
                  styles.pickerOptionText,
                  ticketData.categoria === cat.id && styles.pickerOptionTextSelected
                ]}>
                  {cat.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Prioridad:</Text>
          <View style={styles.pickerContainer}>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.id}
                style={[
                  styles.pickerOption,
                  ticketData.prioridad === priority.id && styles.pickerOptionSelected
                ]}
                onPress={() => setTicketData(prev => ({ ...prev, prioridad: priority.id }))}
              >
                <Text style={[
                  styles.pickerOptionText,
                  ticketData.prioridad === priority.id && styles.pickerOptionTextSelected
                ]}>
                  {priority.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowTicketModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton]}
              onPress={handleCreateTicket}
            >
              <Text style={styles.modalButtonText}>Enviar Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Cargando soporte...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Ayuda y Soporte</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
          {faqs.map((item, index) => renderFAQItem(item, index))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Necesitas ayuda?</Text>
          <Text style={styles.sectionDescription}>
            Si no encuentras la respuesta a tu pregunta en las FAQ, 
            puedes crear un ticket de soporte y nuestro equipo te ayudará.
          </Text>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => setShowTicketModal(true)}
          >
            <Text style={styles.contactButtonText}>Crear Ticket de Soporte</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          <Text style={styles.contactInfo}>
            Email: soporte@lanaapp.com{'\n'}
            Horario: Lunes a Viernes 9:00 AM - 6:00 PM{'\n'}
            Tiempo de respuesta: 24-48 horas
          </Text>
        </View>
      </ScrollView>

      {renderTicketModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2c3e50',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#34495e',
  },
  sectionDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 15,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  answer: {
    fontSize: 15,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  contactButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactInfo: {
    fontSize: 15,
    color: '#7f8c8d',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#7f8c8d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#2c3e50',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#34495e',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  pickerOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    backgroundColor: '#f8f9fa',
  },
  pickerOptionSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  pickerOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  submitButton: {
    backgroundColor: '#3498db',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});