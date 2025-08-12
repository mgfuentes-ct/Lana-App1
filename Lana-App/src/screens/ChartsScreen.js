import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { 
  getChartData, 
  getIncomeExpenses, 
  getCategoryDistribution,
  getMonthlyComparison,
  getChartMetrics
} from '../services/chartService';

export default function ChartsScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartData, setChartData] = useState({
    incomeExpenses: {},
    categoryDistribution: {},
    monthlyComparison: {},
    metrics: {}
  });

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar todos los datos de gráficas en paralelo
      const [incomeExpensesResult, categoryResult, monthlyResult, metricsResult] = await Promise.all([
        getIncomeExpenses('mes'),
        getCategoryDistribution('mes', 'gastos'),
        getMonthlyComparison(6),
        getChartMetrics('mes')
      ]);

      if (incomeExpensesResult.success) {
        setChartData(prev => ({ ...prev, incomeExpenses: incomeExpensesResult.data }));
      }

      if (categoryResult.success) {
        setChartData(prev => ({ ...prev, categoryDistribution: categoryResult.data }));
      }

      if (monthlyResult.success) {
        setChartData(prev => ({ ...prev, monthlyComparison: monthlyResult.data }));
      }

      if (metricsResult.success) {
        setChartData(prev => ({ ...prev, metrics: metricsResult.data }));
      }

    } catch (error) {
      console.error('Error loading chart data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de las gráficas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadChartData();
    setIsRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const renderCategoryChart = () => {
    const { datos = [] } = chartData.categoryDistribution;
    
    if (datos.length === 0) {
      return <Text style={styles.noDataText}>No hay datos de categorías disponibles</Text>;
    }

    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Gastos por Categoría</Text>
        {datos.map((item, index) => (
          <View key={index} style={styles.categoryRow}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{item.categoria}</Text>
              <Text style={styles.categoryAmount}>{formatCurrency(item.monto)}</Text>
            </View>
            <View style={styles.percentageBar}>
              <View 
                style={[
                  styles.percentageFill, 
                  { width: `${Math.min(item.porcentaje, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.percentageText}>{item.porcentaje.toFixed(1)}%</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderIncomeExpensesChart = () => {
    const { ingresos = [], egresos = [] } = chartData.incomeExpenses;
    
    if (ingresos.length === 0 && egresos.length === 0) {
      return <Text style={styles.noDataText}>No hay datos de ingresos y gastos disponibles</Text>;
    }

    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Ingresos vs Gastos (Mes Actual)</Text>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Ingresos</Text>
            <Text style={styles.summaryAmountIncome}>
              {formatCurrency(ingresos.reduce((sum, item) => sum + item.total, 0))}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Gastos</Text>
            <Text style={styles.summaryAmountExpense}>
              {formatCurrency(egresos.reduce((sum, item) => sum + item.total, 0))}
            </Text>
          </View>
        </View>

        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#27ae60' }]} />
            <Text style={styles.legendText}>Ingresos</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#e74c3c' }]} />
            <Text style={styles.legendText}>Gastos</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderMonthlyComparisonChart = () => {
    const { datos = [] } = chartData.monthlyComparison;
    
    if (datos.length === 0) {
      return <Text style={styles.noDataText}>No hay datos de comparación mensual disponibles</Text>;
    }

    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Comparación Mensual (Últimos 6 meses)</Text>
        {datos.slice(-6).map((item, index) => (
          <View key={index} style={styles.monthlyRow}>
            <Text style={styles.monthLabel}>{item.mes}</Text>
            <View style={styles.monthlyData}>
              <Text style={styles.monthlyIncome}>+{formatCurrency(item.ingresos)}</Text>
              <Text style={styles.monthlyExpense}>-{formatCurrency(item.egresos)}</Text>
              <Text style={[
                styles.monthlyBalance,
                item.balance >= 0 ? styles.positiveBalance : styles.negativeBalance
              ]}>
                {item.balance >= 0 ? '+' : ''}{formatCurrency(item.balance)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderMetricsCard = () => {
    const { ingresos = 0, egresos = 0, ahorros = 0, total_transacciones = 0 } = chartData.metrics;
    
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Métricas del Mes</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{formatCurrency(ingresos)}</Text>
            <Text style={styles.metricLabel}>Ingresos</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{formatCurrency(egresos)}</Text>
            <Text style={styles.metricLabel}>Gastos</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[
              styles.metricValue,
              ahorros >= 0 ? styles.positiveBalance : styles.negativeBalance
            ]}>
              {ahorros >= 0 ? '+' : ''}{formatCurrency(ahorros)}
            </Text>
            <Text style={styles.metricLabel}>Ahorros</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{total_transacciones}</Text>
            <Text style={styles.metricLabel}>Transacciones</Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Cargando gráficas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#3498db']}
          />
        }
      >
        <Text style={styles.title}>Gráficas Financieras</Text>
        
        {renderMetricsCard()}
        {renderIncomeExpensesChart()}
        {renderCategoryChart()}
        {renderMonthlyComparisonChart()}
      </ScrollView>
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
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2c3e50',
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#34495e',
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  categoryAmount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  percentageBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginHorizontal: 15,
  },
  percentageFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495e',
    minWidth: 40,
    textAlign: 'right',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  summaryAmountIncome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  summaryAmountExpense: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  monthlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    minWidth: 80,
  },
  monthlyData: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  monthlyIncome: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '500',
  },
  monthlyExpense: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
  monthlyBalance: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color: '#27ae60',
  },
  negativeBalance: {
    color: '#e74c3c',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
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
});