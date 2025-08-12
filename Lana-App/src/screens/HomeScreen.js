import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { getDashboardSummary, getCurrentBalance, getRecentTransactions } from '../services/dashboardService';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    recentTransactions: [],
    summary: {}
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar datos en paralelo
      const [balanceResult, transactionsResult, summaryResult] = await Promise.all([
        getCurrentBalance(),
        getRecentTransactions(5),
        getDashboardSummary()
      ]);

      if (balanceResult.success) {
        setDashboardData(prev => ({
          ...prev,
          balance: balanceResult.data.balance || 0
        }));
      }

      if (transactionsResult.success) {
        setDashboardData(prev => ({
          ...prev,
          recentTransactions: transactionsResult.data || []
        }));
      }

      if (summaryResult.success) {
        setDashboardData(prev => ({
          ...prev,
          summary: summaryResult.data || {}
        }));
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Cargando dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#3498db']}
          />
        }
      >
        <Text style={styles.title}>¡Hola, {user?.nombre || 'Usuario'}!</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saldo Actual</Text>
          <Text style={styles.balance}>
            {formatCurrency(dashboardData.balance)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Últimas Transacciones</Text>
          {dashboardData.recentTransactions.length > 0 ? (
            dashboardData.recentTransactions.map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <Text style={styles.transactionText}>
                  {transaction.descripcion || 'Sin descripción'}
                </Text>
                <Text style={[
                  styles.transactionAmount,
                  transaction.tipo === 'ingreso' ? styles.income : styles.expense
                ]}>
                  {transaction.tipo === 'ingreso' ? '+' : '-'} {formatCurrency(transaction.monto)}
                </Text>
                <Text style={styles.transactionDate}>
                  {formatDate(transaction.fecha)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noTransactionsText}>No hay transacciones recientes</Text>
          )}
        </View>

        {dashboardData.summary && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resumen del Mes</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ingresos:</Text>
              <Text style={styles.income}>
                {formatCurrency(dashboardData.summary.ingresos || 0)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Gastos:</Text>
              <Text style={styles.expense}>
                {formatCurrency(dashboardData.summary.gastos || 0)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ahorros:</Text>
              <Text style={styles.savings}>
                {formatCurrency(dashboardData.summary.ahorros || 0)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.quickAccess}
            onPress={() => navigation.navigate('NuevaTransacción')}
          >
            <Text style={styles.quickAccessText}>Nueva Transacción</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAccess}
            onPress={() => navigation.navigate('Charts')}
          >
            <Text style={styles.quickAccessText}>Ver Gráficas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAccess}
            onPress={() => navigation.navigate('UpcomingPayments')}
          >
            <Text style={styles.quickAccessText}>Próximos Pagos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fafafa',
    top: 3,
    paddingBottom: 10,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  balance: {
    fontSize: 20,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  income: {
    color: '#2e7d32',
  },
  expense: {
    color: '#d32f2f',
  },
  savings: {
    color: '#1976d2',
  },
  noTransactionsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickAccess: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});