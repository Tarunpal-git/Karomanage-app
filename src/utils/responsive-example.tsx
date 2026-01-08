import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import responsive from './responsive';

// Example component showing how to use responsive utilities
const ResponsiveExample = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Responsive Design Example</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>This card uses responsive dimensions</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Small Button</Text>
        </View>
        <View style={[styles.button, styles.mediumButton]}>
          <Text style={styles.buttonText}>Medium Button</Text>
        </View>
        <View style={[styles.button, styles.largeButton]}>
          <Text style={styles.buttonText}>Large Button</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsive.padding.lg,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: responsive.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: responsive.margin.lg,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: responsive.card.padding,
    borderRadius: responsive.card.borderRadius,
    marginBottom: responsive.margin.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsive.shadow.sm },
    shadowOpacity: 0.1,
    shadowRadius: responsive.shadow.md,
    elevation: 3,
  },
  cardText: {
    fontSize: responsive.fontSize.md,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: responsive.spacing.md,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: responsive.button.small.paddingVertical || responsive.padding.sm,
    paddingHorizontal: responsive.button.small.paddingHorizontal || responsive.padding.md,
    borderRadius: responsive.button.small.borderRadius || responsive.borderRadius.sm,
    alignItems: 'center',
  },
  mediumButton: {
    paddingVertical: responsive.button.medium.paddingVertical || responsive.padding.md,
    paddingHorizontal: responsive.button.medium.paddingHorizontal || responsive.padding.lg,
    borderRadius: responsive.button.medium.borderRadius || responsive.borderRadius.md,
  },
  largeButton: {
    paddingVertical: responsive.button.large.paddingVertical || responsive.padding.lg,
    paddingHorizontal: responsive.button.large.paddingHorizontal || responsive.padding.xl,
    borderRadius: responsive.button.large.borderRadius || responsive.borderRadius.lg,
  },
  buttonText: {
    color: 'white',
    fontSize: responsive.fontSize.md,
    fontWeight: '600',
  },
});

export default ResponsiveExample;







