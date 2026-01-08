# React Native Responsive UI Guide

## Overview
This guide shows you how to use `react-native-responsive-screen` to create responsive UI components that adapt to different screen sizes.

## Installation
```bash
npm install react-native-responsive-screen
```

## Key Functions

### 1. Width and Height Utilities
- `wp('10%')` - Converts width percentage to device pixels
- `hp('20%')` - Converts height percentage to device pixels

### 2. Responsive Utility Object
We've created a comprehensive utility object with pre-defined responsive values:

```typescript
import responsive from './utils/responsive';

// Usage examples:
const styles = StyleSheet.create({
  container: {
    padding: responsive.padding.lg,        // 6% of screen width
    margin: responsive.margin.md,          // 4% of screen width
    borderRadius: responsive.borderRadius.lg, // 4% of screen width
  },
  title: {
    fontSize: responsive.fontSize.xl,      // 6% of screen width
  },
  button: {
    height: responsive.button.medium.height, // 6% of screen height
    paddingHorizontal: responsive.button.medium.paddingHorizontal, // 4% of screen width
  }
});
```

## Responsive Values Available

### Padding & Margin
```typescript
responsive.padding.xs  // 1% of screen width
responsive.padding.sm  // 2% of screen width
responsive.padding.md  // 4% of screen width
responsive.padding.lg  // 6% of screen width
responsive.padding.xl  // 8% of screen width

responsive.margin.xs   // 1% of screen width
responsive.margin.sm   // 2% of screen width
responsive.margin.md   // 4% of screen width
responsive.margin.lg   // 6% of screen width
responsive.margin.xl   // 8% of screen width
```

### Font Sizes
```typescript
responsive.fontSize.xs   // 3% of screen width
responsive.fontSize.sm   // 3.5% of screen width
responsive.fontSize.md   // 4% of screen width
responsive.fontSize.lg   // 5% of screen width
responsive.fontSize.xl   // 6% of screen width
responsive.fontSize.xxl  // 7% of screen width
```

### Border Radius
```typescript
responsive.borderRadius.xs  // 1% of screen width
responsive.borderRadius.sm  // 2% of screen width
responsive.borderRadius.md  // 3% of screen width
responsive.borderRadius.lg  // 4% of screen width
responsive.borderRadius.xl  // 6% of screen width
```

### Shadows
```typescript
responsive.shadow.xs  // 0.25% of screen width
responsive.shadow.sm  // 0.5% of screen width
responsive.shadow.md  // 1% of screen width
responsive.shadow.lg  // 2% of screen width
responsive.shadow.xl  // 3% of screen width
```

### Button Sizes
```typescript
responsive.button.small.height              // 5% of screen height
responsive.button.small.paddingHorizontal  // 3% of screen width
responsive.button.small.paddingVertical    // 1% of screen height
responsive.button.small.borderRadius       // 2% of screen width

responsive.button.medium.height            // 6% of screen height
responsive.button.medium.paddingHorizontal // 4% of screen width
responsive.button.medium.paddingVertical   // 1.5% of screen height
responsive.button.medium.borderRadius      // 3% of screen width

responsive.button.large.height             // 7% of screen height
responsive.button.large.paddingHorizontal  // 6% of screen width
responsive.button.large.paddingVertical    // 2% of screen height
responsive.button.large.borderRadius       // 4% of screen width
```

### Input & Card Sizes
```typescript
responsive.input.height           // 6% of screen height
responsive.input.paddingHorizontal // 4% of screen width
responsive.input.borderRadius     // 2.5% of screen width

responsive.card.padding           // 6% of screen width
responsive.card.borderRadius      // 4% of screen width
responsive.card.marginHorizontal  // 2% of screen width
```

## Best Practices

### 1. Use Percentage-Based Values
- **Good**: `wp('10%')` - Scales with screen width
- **Avoid**: Fixed values like `100` - Doesn't scale

### 2. Use Predefined Responsive Values
- **Good**: `responsive.padding.md` - Consistent across components
- **Avoid**: `wp('4%')` - Hard to maintain consistency

### 3. Combine with Flexbox
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsive.padding.lg,
  },
  card: {
    flex: 1,
    margin: responsive.margin.md,
    borderRadius: responsive.borderRadius.lg,
  }
});
```

### 4. Test on Different Screen Sizes
- Small phones (320px width)
- Medium phones (375px width)
- Large phones (414px width)
- Tablets (768px+ width)

## Example Component

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import responsive from './utils/responsive';

const ResponsiveCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Responsive Card</Text>
      <Text style={styles.description}>
        This card automatically adapts to different screen sizes
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: responsive.padding.lg,
    margin: responsive.margin.md,
    borderRadius: responsive.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsive.shadow.sm },
    shadowOpacity: 0.1,
    shadowRadius: responsive.shadow.md,
    elevation: 3,
  },
  title: {
    fontSize: responsive.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: responsive.margin.sm,
  },
  description: {
    fontSize: responsive.fontSize.md,
    color: '#666',
  },
});

export default ResponsiveCard;
```

## Benefits

1. **Consistent Scaling**: All UI elements scale proportionally
2. **Maintainable**: Centralized responsive values
3. **Cross-Platform**: Works on both iOS and Android
4. **Performance**: No runtime calculations
5. **Flexible**: Easy to adjust for different screen sizes

## Migration Tips

### Before (Fixed Values)
```typescript
const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 16,
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
  }
});
```

### After (Responsive Values)
```typescript
const styles = StyleSheet.create({
  container: {
    padding: responsive.padding.lg,      // 20 → responsive
    margin: responsive.margin.md,        // 16 → responsive
    borderRadius: responsive.borderRadius.md, // 8 → responsive
  },
  text: {
    fontSize: responsive.fontSize.lg,    // 18 → responsive
  }
});
```

## Troubleshooting

### Common Issues
1. **Text too small on large screens**: Use larger responsive font sizes
2. **Padding too large on small screens**: Use smaller responsive padding values
3. **Buttons too big on tablets**: Use responsive button sizes

### Debugging
```typescript
console.log('Screen width:', responsive.screen.width);
console.log('Screen height:', responsive.screen.height);
console.log('Medium padding:', responsive.padding.md);
```

This responsive system will make your UI look great on all device sizes!







