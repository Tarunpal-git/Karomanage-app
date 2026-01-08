import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../colors';

// Test component to demonstrate GST calculations
const GSTTestComponent = () => {
  // Mock organization data for testing different GST scenarios
  const testScenarios = [
    {
      name: 'NOGST',
      gstRuleData: {
        cgstPercentage: 0,
        sgstPercentage: 0,
        cgstEnabled: false,
        sgstEnabled: false,
        inclusionType: 'noGST' as const,
        gstinNumber: 'HG67698686JH'
      }
    },
    {
      name: 'INCLUDED',
      gstRuleData: {
        cgstPercentage: 9,
        sgstPercentage: 9,
        cgstEnabled: true,
        sgstEnabled: true,
        inclusionType: 'included' as const,
        gstinNumber: 'HG67698686JH'
      }
    },
    {
      name: 'EXCLUDED',
      gstRuleData: {
        cgstPercentage: 9,
        sgstPercentage: 9,
        cgstEnabled: true,
        sgstEnabled: true,
        inclusionType: 'excluded' as const,
        gstinNumber: 'HG67698686JH'
      }
    }
  ];

  const calculateGSTAmounts = (baseAmount: number, gstRuleData: any) => {
    if (!gstRuleData || gstRuleData.inclusionType === 'noGST') {
      return {
        cgstAmount: 0,
        sgstAmount: 0,
        totalGSTAmount: 0,
        amountAfterGST: baseAmount
      };
    }
    
    const cgstAmount = gstRuleData.cgstEnabled ? (baseAmount * gstRuleData.cgstPercentage) / 100 : 0;
    const sgstAmount = gstRuleData.sgstEnabled ? (baseAmount * gstRuleData.sgstPercentage) / 100 : 0;
    const totalGSTAmount = cgstAmount + sgstAmount;
    
    let amountAfterGST = baseAmount;
    if (gstRuleData.inclusionType === 'excluded') {
      // GST is added on top of base amount
      amountAfterGST = baseAmount + totalGSTAmount;
    } else if (gstRuleData.inclusionType === 'included') {
      // GST is already included in base amount
      amountAfterGST = baseAmount;
    }
    
    return {
      cgstAmount: Math.round(cgstAmount),
      sgstAmount: Math.round(sgstAmount),
      totalGSTAmount: Math.round(totalGSTAmount),
      amountAfterGST: Math.round(amountAfterGST)
    };
  };

  const testAmount = 5000; // Test with ₹5000

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GST Calculation Test</Text>
      <Text style={styles.subtitle}>Base Amount: ₹{testAmount}</Text>
      
      {testScenarios.map((scenario, index) => {
        const gstAmounts = calculateGSTAmounts(testAmount, scenario.gstRuleData);
        
        return (
          <View key={index} style={styles.scenarioContainer}>
            <Text style={styles.scenarioTitle}>{scenario.name}</Text>
            <Text style={styles.scenarioSubtitle}>
              Inclusion Type: {scenario.gstRuleData.inclusionType}
            </Text>
            
            <View style={styles.calculationContainer}>
              <Text style={styles.calculationText}>
                Base Amount: ₹{testAmount}
              </Text>
              
              {scenario.gstRuleData.cgstEnabled && (
                <Text style={styles.calculationText}>
                  CGST ({scenario.gstRuleData.cgstPercentage}%): ₹{gstAmounts.cgstAmount}
                </Text>
              )}
              
              {scenario.gstRuleData.sgstEnabled && (
                <Text style={styles.calculationText}>
                  SGST ({scenario.gstRuleData.sgstPercentage}%): ₹{gstAmounts.sgstAmount}
                </Text>
              )}
              
              {gstAmounts.totalGSTAmount > 0 && (
                <Text style={styles.calculationText}>
                  Total GST: ₹{gstAmounts.totalGSTAmount}
                </Text>
              )}
              
              <Text style={styles.finalAmount}>
                Final Amount: ₹{gstAmounts.amountAfterGST}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 20,
  },
  scenarioContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scenarioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  scenarioSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  calculationContainer: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
  },
  calculationText: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 5,
  },
  finalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 5,
  },
});

export default GSTTestComponent; 