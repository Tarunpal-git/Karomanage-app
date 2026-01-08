import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import SafeView from '../../../@ui/safe-view/SafeView';
import AppHeader from '../../../@ui/app-header/AppHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TScreenNavigator } from '../../../types/navigator/screen-navigator';
import { COLORS } from '../../../colors';
import ScalableText from '../../../@ui/scalable-text/ScalableText';
import Button from '../../../@ui/button/Button';
import ThemeScrollView from '../../../@ui/theme-scroll-view/ThemeScrollView';

// Import step components
import CourseBatchStep from './steps/CourseBatchStep';
import PaymentDetailsStep from './steps/PaymentDetailsStep';
import ReviewStep from './steps/ReviewStep';

// Import context
import { AddCourseToStudentProvider, useAddCourseToStudent } from './AddCourseToStudentContext';

const AddCourseToStudentScreen = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const route = useRoute<any>();
  const { studentRollNo, studentDetails } = route.params || {};
  const [currentStep, setCurrentStep] = useState(1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CourseBatchStep onNext={() => setCurrentStep(2)} />;
      case 2:
        return <PaymentDetailsStep onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3:
        return <ReviewStep onBack={() => setCurrentStep(2)} />;
      default:
        return <CourseBatchStep onNext={() => setCurrentStep(2)} />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Course & Batch';
      case 2:
        return 'Payment Details';
      case 3:
        return 'Review';
      default:
        return 'Add Course';
    }
  };

  return (
    <SafeView>
      <AppHeader
        title={getStepTitle()}
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />
      <View style={styles.screenRoot}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressStep, currentStep >= 1 && styles.activeStep]}>
              <ScalableText style={styles.stepNumber} fontFamily="Medium">
                1
              </ScalableText>
            </View>
            <View style={[styles.progressLine, currentStep >= 2 && styles.activeLine]} />
            <View style={[styles.progressStep, currentStep >= 2 && styles.activeStep]}>
              <ScalableText style={styles.stepNumber} fontFamily="Medium">
                2
              </ScalableText>
            </View>
            <View style={[styles.progressLine, currentStep >= 3 && styles.activeLine]} />
            <View style={[styles.progressStep, currentStep >= 3 && styles.activeStep]}>
              <ScalableText style={styles.stepNumber} fontFamily="Medium">
                3
              </ScalableText>
            </View>
          </View>
          <View style={styles.stepLabels}>
            <ScalableText style={styles.stepLabel} fontFamily="Medium">
              Course & Batch
            </ScalableText>
            <ScalableText style={styles.stepLabel} fontFamily="Medium">
              Payment Details
            </ScalableText>
            <ScalableText style={styles.stepLabel} fontFamily="Medium">
              Review
            </ScalableText>
          </View>
        </View>

        {/* Step Content */}
        <View style={styles.contentContainer}>
          {renderStep()}
        </View>
      </View>
    </SafeView>
  );
};

// Wrap with context provider
const AddCourseToStudentScreenWithProvider = () => {
  const route = useRoute<any>();
  const { studentRollNo, studentDetails } = route.params || {};

  return (
    <AddCourseToStudentProvider studentRollNo={studentRollNo} studentDetails={studentDetails}>
      <AddCourseToStudentScreen />
    </AddCourseToStudentProvider>
  );
};

export default AddCourseToStudentScreenWithProvider;

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: COLORS.whiteSmoke,
  },
  progressContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: COLORS.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  activeStepText: {
    color: COLORS.white,
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  activeLine: {
    backgroundColor: COLORS.primary,
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    flex: 1,
  },
  activeStepLabel: {
    color: COLORS.primary,
    fontFamily: 'Poppins-Medium',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
}); 