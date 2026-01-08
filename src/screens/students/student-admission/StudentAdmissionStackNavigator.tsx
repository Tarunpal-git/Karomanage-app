import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentDetailsScreen from './StudentDetailsScreen';
import CollegeDetailsScreen from './CollegeDetailsScreen';
import CourseBatchScreen from './CourseBatchScreen';
import PaymentDetailsScreen from './PaymentDetailsScreen';
import ReviewScreen from './ReviewScreen';
import AddCouponScreen from './AddCouponScreen';
import { StudentAdmissionProvider } from './StudentAdmissionContext';
import { StudentAdmissionWrapper } from './components/StudentAdmissionWrapper';
// import other screens as you build them

const Stack = createNativeStackNavigator();

const StudentAdmissionStackNavigator = () => (
  <StudentAdmissionProvider>
    <StudentAdmissionWrapper>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} />
        <Stack.Screen name="CollegeDetails" component={CollegeDetailsScreen} />
        <Stack.Screen name="CourseBatch" component={CourseBatchScreen} />
        <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
        <Stack.Screen name="AddCoupon" component={AddCouponScreen} />
      </Stack.Navigator>
    </StudentAdmissionWrapper>
  </StudentAdmissionProvider>
);

export default StudentAdmissionStackNavigator; 