# GST Implementation Summary for PaymentDetailsScreen

## Overview
This implementation adds GST (Goods and Services Tax) functionality to the PaymentDetailsScreen based on the organization's `gstRuleData` configuration. The system supports three different GST scenarios as defined in the organization API response.

## GST Scenarios

### 1. NOGST Scenario
- **inclusionType**: `"noGST"`
- **CGST/SGST**: Disabled (0%)
- **Behavior**: No GST fields are shown, calculations proceed without GST
- **Example**: ₹5000 → ₹5000 (no GST applied)

### 2. INCLUDED Scenario
- **inclusionType**: `"included"`
- **CGST/SGST**: Enabled (e.g., 9% each)
- **Behavior**: GST is already included in the base amount
- **Fields Shown**: CGST, SGST, Total GST, Payment After GST, GSTIN
- **Example**: ₹5000 (includes GST) → CGST: ₹450, SGST: ₹450, Total: ₹5000

### 3. EXCLUDED Scenario
- **inclusionType**: `"excluded"`
- **CGST/SGST**: Enabled (e.g., 9% each)
- **Behavior**: GST is added on top of the base amount
- **Fields Shown**: CGST, SGST, Total GST, Payment After GST, GSTIN
- **Example**: ₹5000 + GST → CGST: ₹450, SGST: ₹450, Total: ₹5900

## Implementation Details

### 1. Type Definitions
- Added `GstRuleData` type in `src/types/data/organization.d.ts`
- Updated `TOrganizationName` to include optional `gstRuleData`
- Added GST fields to `StudentAdmissionData` in `StudentAdmissionContext.tsx`

### 2. GST Calculation Function
```typescript
const calculateGSTAmounts = (baseAmount: number) => {
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
    amountAfterGST = baseAmount + totalGSTAmount;
  } else if (gstRuleData.inclusionType === 'included') {
    amountAfterGST = baseAmount;
  }
  
  return {
    cgstAmount: Math.round(cgstAmount),
    sgstAmount: Math.round(sgstAmount),
    totalGSTAmount: Math.round(totalGSTAmount),
    amountAfterGST: Math.round(amountAfterGST)
  };
};
```

### 3. Organization Data Access
```typescript
const organizationData = store.getState().organization.organization;
const gstRuleData = organizationData?.gstRuleData;
```

### 4. Conditional UI Rendering
GST fields are only shown when GST is enabled:
```typescript
{gstRuleData && gstRuleData.inclusionType !== 'noGST' && (
  <>
    {/* CGST Field */}
    {gstRuleData.cgstEnabled && (
      <View style={styles.inputSpacing}>
        <ScalableText style={styles.inputLabel} fontFamily="Medium">
          CGST ({gstRuleData.cgstPercentage}%)
        </ScalableText>
        <Input
          handler={handler} 
          name="cgstAmount"
          label="CGST amount"
          keyboardType="numeric"
          containerStyles={styles.inputContainer}
          placeholder="0"
          editable={false}
        />
      </View>
    )}
    
    {/* SGST Field */}
    {gstRuleData.sgstEnabled && (
      <View style={styles.inputSpacing}>
        <ScalableText style={styles.inputLabel} fontFamily="Medium">
          SGST ({gstRuleData.sgstPercentage}%)
        </ScalableText>
        <Input
          handler={handler} 
          name="sgstAmount"
          label="SGST amount"
          keyboardType="numeric"
          containerStyles={styles.inputContainer}
          placeholder="0"
          editable={false}
        />
      </View>
    )}
    
    {/* Total GST Amount */}
    <View style={styles.inputSpacing}>
      <ScalableText style={styles.inputLabel} fontFamily="Medium">
        Total GST Amount
      </ScalableText>
      <Input
        handler={handler} 
        name="totalGSTAmount"
        label="Total GST amount"
        keyboardType="numeric"
        containerStyles={styles.inputContainer}
        placeholder="0"
        editable={false}
      />
    </View>
    
    {/* Payment After GST */}
    <View style={styles.inputSpacing}>
      <ScalableText style={styles.inputLabel} fontFamily="Medium">
        Payment After GST
      </ScalableText>
      <Input
        handler={handler} 
        name="paymentAfterGST"
        label="Payment after GST"
        keyboardType="numeric"
        containerStyles={styles.inputContainer}
        placeholder="0"
        editable={false}
      />
    </View>
    
    {/* GSTIN Number */}
    <View style={styles.inputSpacing}>
      <ScalableText style={styles.inputLabel} fontFamily="Medium">
        GSTIN Number
      </ScalableText>
      <Input
        handler={handler} 
        name="gstinNumber"
        label="GSTIN number"
        containerStyles={styles.inputContainer}
        placeholder="Enter GSTIN number"
        editable={false}
        value={gstRuleData.gstinNumber}
      />
    </View>
  </>
)}
```

### 5. Updated Payment Calculations
- All payment calculations now use `paymentAfterGST` instead of `paymentAfterDiscount`
- Installment calculations are based on the GST-adjusted amount
- Form submission includes all GST-related fields

### 6. Form Fields Added
- `cgstAmount`: CGST amount
- `sgstAmount`: SGST amount  
- `totalGSTAmount`: Total GST amount
- `paymentAfterGST`: Final amount after GST
- `gstinNumber`: GSTIN number from organization

## API Response Structure
The organization API response includes `gstRuleData`:
```json
{
  "gstRuleData": {
    "cgstPercentage": 9,
    "sgstPercentage": 9,
    "cgstEnabled": true,
    "sgstEnabled": true,
    "inclusionType": "excluded",
    "gstinNumber": "HG67698686JH"
  }
}
```

## Testing
A test component `GSTTestComponent.tsx` has been created to demonstrate the three GST scenarios with sample calculations.

## Key Features
1. **Dynamic Field Display**: GST fields only appear when GST is enabled
2. **Automatic Calculations**: GST amounts are calculated automatically based on organization settings
3. **Installment Support**: GST calculations work with both full payment and installment payments
4. **Coupon Integration**: GST is calculated after discount application
5. **Form Validation**: All GST fields are included in form submission
6. **Debug Logging**: Comprehensive logging for troubleshooting

## Usage
The implementation automatically adapts to the organization's GST configuration. No additional setup is required - the system reads the `gstRuleData` from the organization API response and adjusts the UI and calculations accordingly. 