import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, Alert, ActivityIndicator, TextInput, Text, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { studentDetailsValidation } from './validation/studentDetails.validation';
import { useSelector } from 'react-redux';
import { RootState, store } from '../../../app/store';
import Input from '../../../@ui/input/Input';
import Button from '../../../@ui/button/Button';
import ScalableText from '../../../@ui/scalable-text/ScalableText';
import { useStudentAdmission } from './StudentAdmissionContext';
import { useNavigationConfirmation } from './hooks/useNavigationConfirmation';
import { useNavigation } from '@react-navigation/native';
import ControlledSelect from '../../../@ui/controlled-select/ControlledSelect';
import DateInput from '../../../@ui/date-input/DateInput';
import { launchImageLibrary } from 'react-native-image-picker';
import { useStudentsListQuery } from '../../../apis/hooks/students/query/useStudentsList.query';
import { useCheckEnrollmentMutation } from '../../../apis/hooks/students/mutation/useCheckEnrollment.mutation';
import { useGetExtraFieldsQuery } from '../../../apis/hooks/students/query/useGetExtraFields.query';
import { useCreateExtraFieldsMutation } from '../../../apis/hooks/students/mutation/useCreateExtraFields.mutation';
import { useDeleteExtraFieldMutation } from '../../../apis/hooks/students/mutation/useDeleteExtraField.mutation';
import RNPickerSelect from 'react-native-picker-select';
import SafeView from '../../../@ui/safe-view/SafeView';
import AppHeader from '../../../@ui/app-header/AppHeader';
import ThemeScrollView from '../../../@ui/theme-scroll-view/ThemeScrollView';
import { COLORS } from '../../../colors';
import AgentSelectionModal from '../../../@ui/agent-selection-modal/AgentSelectionModal';
import { useGetReferralAgentsQuery } from '../../../apis/hooks/agent-management/query/useGetReferralAgents.query';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const PAYMENT_MODE_OPTIONS = [
  { label: 'Online', value: 'Online' },
  { label: 'Cash', value: 'Cash' },
  { label: 'Other', value: 'Other' },
];

const FIELD_TYPE_OPTIONS = [
  { label: 'Text', value: 'Text' },
  { label: 'Number', value: 'Number' },
  { label: 'Email', value: 'Email' },
  { label: 'Media', value: 'Media' },
];

const StudentDetailsScreen = () => {
  const { data, updateStepData } = useStudentAdmission();
  const navigation = useNavigation<any>();
  const { goBackWithConfirmation } = useNavigationConfirmation();
  const [imageUri, setImageUri] = useState(data.studentImage || '');

  // Restore student image from context when data changes
  useEffect(() => {
    if (data.studentImage) {
      setImageUri(data.studentImage);
    }
  }, [data.studentImage]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState('');
  const [dynamicFields, setDynamicFields] = useState<{ fieldName: string; type: string; value: string; mediaUri?: string }[]>(data.dynamicFields || []);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('Text');
  const [customFieldError, setCustomFieldError] = useState('');
  const [agentModalVisible, setAgentModalVisible] = useState(false);
  const [showCustomFieldErrors, setShowCustomFieldErrors] = useState(false);
  const [referralModalVisible, setReferralModalVisible] = useState(false);
  const [selectedAgentForReferral, setSelectedAgentForReferral] = useState<{
    agentId: string;
    agentName: string;
  } | null>(null);
  const [referralAmount, setReferralAmount] = useState('');
  const [referralPaymentStatus, setReferralPaymentStatus] = useState('');
  const [referralPaymentMode, setReferralPaymentMode] = useState('');
  const [referralAmountError, setReferralAmountError] = useState('');
  const [dropdownValue, setDropdownValue] = useState({ label: '', value: '' });



  // Fetch student list for auto-enrollment number
  const { data: studentsData, isLoading: studentsLoading } = useStudentsListQuery();
  
  // Fetch existing custom fields
  const { data: extraFieldsData, isLoading: extraFieldsLoading, refetch: refetchExtraFields } = useGetExtraFieldsQuery();
  
  // Enrollment validation mutation
  const { mutateAsync: checkEnrollment, isPending: isCheckingEnrollment } = useCheckEnrollmentMutation();
  
  // Create custom fields mutation
  const { mutateAsync: createExtraFields, isPending: isCreatingExtraFields } = useCreateExtraFieldsMutation();
  
  // Delete custom field mutation
  const { mutateAsync: deleteExtraField, isPending: isDeletingExtraField } = useDeleteExtraFieldMutation();

  // Fetch referral agents
  const { data: agentsData, isLoading: agentsLoading } = useGetReferralAgentsQuery();

  // Debug: Log agents data structure
  useEffect(() => {
    if (agentsData) {
      console.log('🎯 Agents data in StudentDetailsScreen:', agentsData);
      console.log('🎯 Agents data structure:', {
        hasData: !!agentsData?.data,
        dataKeys: agentsData?.data ? Object.keys(agentsData.data) : [],
        dataType: typeof agentsData?.data,
        isArray: Array.isArray(agentsData?.data),
        dataLength: Array.isArray(agentsData?.data) ? agentsData.data.length : 'Not an array'
      });
    }
  }, [agentsData]);

  const handler = useForm({
    defaultValues: {
      studentFirstName: data.studentFirstName || '',
      studentLastName: data.studentLastName || '',
      studentEmail: data.studentEmail || '',
      studentEnrollmentNumber: data.studentEnrollmentNumber || '',
      studentContact: data.studentContact || '',
      studentFatherName: data.studentFatherName || '',
      studentFatherContact: data.studentFatherContact || '',
      studentAddress: data.studentAddress || '',
      studentGender: data.studentGender || '',
      referedBy: data.referedBy || '',
      dateOfAdmission: data.dateOfAdmission || '',
      studentDateOfBirth: data.studentDateOfBirth || '',
    },
    resolver: yupResolver(studentDetailsValidation),
  });

  // Restore form values from context when data changes
  useEffect(() => {
    if (data.studentFirstName) handler.setValue('studentFirstName', data.studentFirstName);
    if (data.studentLastName) handler.setValue('studentLastName', data.studentLastName);
    if (data.studentEmail) handler.setValue('studentEmail', data.studentEmail);
    if (data.studentEnrollmentNumber) handler.setValue('studentEnrollmentNumber', data.studentEnrollmentNumber);
    if (data.studentContact) handler.setValue('studentContact', data.studentContact);
    if (data.studentFatherName) handler.setValue('studentFatherName', data.studentFatherName);
    if (data.studentFatherContact) handler.setValue('studentFatherContact', data.studentFatherContact);
    if (data.studentAddress) handler.setValue('studentAddress', data.studentAddress);
    if (data.studentGender) handler.setValue('studentGender', data.studentGender);
    if (data.referedBy) handler.setValue('referedBy', data.referedBy);
    if (data.dateOfAdmission) handler.setValue('dateOfAdmission', data.dateOfAdmission);
    if (data.studentDateOfBirth) handler.setValue('studentDateOfBirth', data.studentDateOfBirth);
    
    // Debug: Log context data for custom fields
    if (data.dynamicFields && data.dynamicFields.length > 0) {
      console.log('🎯 Context has dynamic fields:', data.dynamicFields.length);
      data.dynamicFields.forEach((field, index) => {
        console.log(`🎯 Context field ${index}:`, {
          name: field.fieldName,
          type: field.type,
          value: field.value
        });
      });
    }
  }, [data]);

  // Auto-generate enrollment number from last student
  useEffect(() => {
    if (
      studentsData &&
      studentsData.data &&
      studentsData.data.length > 0 &&
      !handler.getValues('studentEnrollmentNumber')
    ) {
      // Sort by dateCreated descending (latest first)
      const sorted = [...studentsData.data].sort((a, b) => b.dateCreated - a.dateCreated);
      const lastStudent = sorted[0];
      const lastEnrollment = lastStudent.studentEnrollmentNumber; // e.g., "LO-27"
      if (lastEnrollment) {
        // Extract prefix and number
        const match = lastEnrollment.match(/^(.*?)-(\d+)$/);
        if (match) {
          const prefix = match[1] + '-';
          const number = parseInt(match[2], 10) + 1;
          const nextEnrollment = `${prefix}${number}`;
          handler.setValue('studentEnrollmentNumber', nextEnrollment);
        }
      }
    }
  }, [studentsData, handler]);

  // Load existing custom fields from API and restore context data
  useEffect(() => {
    console.log('🎯 Context data check:', {
      hasDynamicFields: !!data.dynamicFields,
      dynamicFieldsLength: data.dynamicFields?.length || 0,
      hasExtraFieldsData: !!extraFieldsData?.data?.form,
      currentDynamicFieldsLength: dynamicFields.length
    });

    // First, try to restore fields from context data (for media persistence)
    if (data.dynamicFields && data.dynamicFields.length > 0) {
      console.log('🎯 Restoring dynamic fields from context:', data.dynamicFields);
      
      // Check for media fields and log their state
      data.dynamicFields.forEach((field, index) => {
        if (field.type === 'Media') {
          console.log(`🎯 Media field ${index}:`, {
            fieldName: field.fieldName,
            value: field.value,
            mediaUri: field.mediaUri,
            mediaType: (field as any).mediaType,
            mediaSize: (field as any).mediaSize
          });
        }
      });
      
      setDynamicFields(data.dynamicFields);
      return;
    }
    
    // If no context data, load from API
    if (extraFieldsData?.data?.form && Object.keys(extraFieldsData.data.form).length > 0) {
      const formFields = extraFieldsData.data.form;
      console.log('🎯 Form fields structure:', JSON.stringify(formFields, null, 2));
      const existingFields = Object.keys(formFields).map(fieldName => {
        // Get the field type from the API response
        const fieldData = formFields[fieldName];
        let fieldType = 'Text'; // Default type
        
        // Check if the API response has type information
        if (fieldData && typeof fieldData === 'object') {
          // First, check if the field data has a direct type property
          if (fieldData.type) {
            // Convert API type to our format
            switch (fieldData.type.toLowerCase()) {
              case 'text':
                fieldType = 'Text';
                break;
              case 'number':
                fieldType = 'Number';
                break;
              case 'email':
                fieldType = 'Email';
                break;
              case 'media':
                fieldType = 'Media';
                break;
              default:
                fieldType = 'Text';
            }
          } else {
            // Check if the field data has nested type information
            // Sometimes the API might store type info in a different structure
            const nestedType = fieldData.fieldType || fieldData.inputType || fieldData.field_type;
            if (nestedType) {
              switch (nestedType.toLowerCase()) {
                case 'text':
                  fieldType = 'Text';
                  break;
                case 'number':
                  fieldType = 'Number';
                  break;
                case 'email':
                  fieldType = 'Email';
                  break;
                case 'media':
                  fieldType = 'Media';
                  break;
                default:
                  fieldType = 'Text';
              }
            } else {
              // Fallback to field name detection
              fieldType = getFieldTypeFromValue(fieldData, fieldName);
            }
          }
        } else {
          // Fallback to field name detection
          fieldType = getFieldTypeFromValue(fieldData, fieldName);
        }
        
        // Enhanced field name detection for common field types
        const fieldNameLower = fieldName.toLowerCase();
        if (fieldNameLower.includes('email') || fieldNameLower.includes('mail')) {
          fieldType = 'Email';
        } else if (fieldNameLower.includes('phone') || fieldNameLower.includes('mobile') || fieldNameLower.includes('contact')) {
          fieldType = 'Number';
        } else if (fieldNameLower.includes('age') || fieldNameLower.includes('number') || fieldNameLower.includes('count')) {
          fieldType = 'Number';
        } else if (fieldNameLower.includes('voter') || 
                   fieldNameLower.includes('pancard') || 
                   fieldNameLower.includes('aadhar') ||
                   fieldNameLower.includes('license') ||
                   fieldNameLower.includes('passport') ||
                   fieldNameLower.includes('document') ||
                   fieldNameLower.includes('image') ||
                   fieldNameLower.includes('photo') ||
                   fieldNameLower.includes('file')) {
          fieldType = 'Media';
        }
        
        console.log(`🎯 Field "${fieldName}" type detection:`, {
          originalType: fieldType,
          fieldData: fieldData,
          finalType: fieldType
        });
        
        return {
          fieldName,
          type: fieldType,
          value: '',
          mediaUri: undefined,
          mediaType: undefined,
          mediaSize: undefined
        };
      });
      
      console.log('🎯 Loading existing fields from API:', existingFields);
      console.log('🎯 API form data:', formFields);
      console.log('🎯 Raw API response:', extraFieldsData);
      
      // Debug: Check each field's type detection
      existingFields.forEach((field, index) => {
        console.log(`🎯 Field ${index}: ${field.fieldName} -> Type: ${field.type}`);
        console.log(`🎯 Field ${index} raw data:`, formFields[field.fieldName]);
      });
      
      // Only set if we don't already have dynamic fields
      if (dynamicFields.length === 0) {
        setDynamicFields(existingFields);
      }
      
      // If we have both context data and API data, merge them to preserve field types
      if (data.dynamicFields && data.dynamicFields.length > 0 && existingFields.length > 0) {
        console.log('🎯 Merging context and API data to preserve field types');
        const mergedFields = existingFields.map(apiField => {
          // Find matching field in context data
          const contextField = data.dynamicFields.find(cf => 
            cf.fieldName.toLowerCase() === apiField.fieldName.toLowerCase()
          );
          
          if (contextField) {
            console.log(`🎯 Merging field "${apiField.fieldName}": API type "${apiField.type}" + Context type "${contextField.type}"`);
            // Prefer context type if it's more specific than the detected type
            let finalType = apiField.type;
            if (contextField.type === 'Email' && apiField.type === 'Text') {
              finalType = 'Email';
            } else if (contextField.type === 'Number' && apiField.type === 'Text') {
              finalType = 'Number';
            } else if (contextField.type === 'Media' && apiField.type !== 'Media') {
              finalType = 'Media';
            }
            
            return {
              ...apiField,
              type: finalType,
              value: contextField.value || '',
              mediaUri: contextField.mediaUri,
              mediaType: (contextField as any).mediaType,
              mediaSize: (contextField as any).mediaSize
            };
          }
          
          return apiField;
        });
        
        console.log('🎯 Final merged fields:', mergedFields);
        setDynamicFields(mergedFields);
      }
    }
  }, [extraFieldsData, data.dynamicFields]);

  // Helper function to determine field type from value
  const getFieldTypeFromValue = (value: any, fieldName?: string): string => {
    // Enhanced field name detection for common field types
    if (fieldName) {
      const fieldNameLower = fieldName.toLowerCase();
      
      // Media fields
      if (['document', 'image', 'photo', 'file', 'media', 'pancard', 'voter', 'voterid', 'aadhar', 'pan', 'driving', 'license', 'passport', 'certificate', 'id'].includes(fieldNameLower)) {
        return 'Media';
      }
      
      // Email fields
      if (['email', 'mail', 'e-mail'].includes(fieldNameLower)) {
        return 'Email';
      }
      
      // Number fields
      if (['phone', 'mobile', 'contact', 'age', 'number', 'count', 'quantity', 'amount', 'price', 'salary', 'marks', 'score'].includes(fieldNameLower)) {
        return 'Number';
      }
    }
    
    // Value-based type detection
    if (typeof value === 'number') return 'Number';
    if (typeof value === 'string') {
      if (value.includes('@') && value.includes('.')) return 'Email';
      if (/^\d+$/.test(value)) return 'Number';
      return 'Text';
    }
    return 'Text';
  };

  const validateEnrollmentNumber = async (enrollmentNumber: string) => {
    if (!enrollmentNumber) {
      setEnrollmentError('Enrollment number is required');
      return false;
    }
    
    if (enrollmentNumber.trim().length === 0) {
      setEnrollmentError('Enrollment number is required');
      return false;
    }

    try {
      const response = await checkEnrollment({ studentEnrollmentNumber: enrollmentNumber });
      
      if (response.statuscode === 200 && response.message === "Enrollment number available") {
        setEnrollmentError('');
        return true;
      } else {
        setEnrollmentError('Enrollment number is already taken');
        return false;
      }
    } catch (error: any) {
      console.error('Enrollment validation error:', error);
      
      // Handle different error scenarios
      if (error?.data?.message) {
        setEnrollmentError(error.data.message);
      } else if (error?.message) {
        setEnrollmentError(error.message);
      } else {
        setEnrollmentError('Failed to validate enrollment number. Please try again.');
      }
      return false;
    }
  };

  // Helper function to trim only leading and trailing spaces, preserve spaces between words
  const trimLeadingTrailing = (text: string) => {
    return text.replace(/^\s+|\s+$/g, '');
  };

  const handleDynamicFieldValueChange = (idx: number, value: string) => {
    // Allow spaces between words
    setDynamicFields(fields => fields.map((f, i) => i === idx ? { ...f, value: value } : f));
  };

  // Add validation for custom fields based on type
  const validateCustomField = (fieldType: string, value: string): string => {
    if (!value.trim()) return ''; // Empty values are allowed
    
    switch (fieldType) {
      case 'Email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return 'Please enter a valid email address';
        }
        break;
      case 'Number':
        const numberRegex = /^\d+$/;
        if (!numberRegex.test(value.trim())) {
          return 'Please enter only numbers';
        }
        break;
      case 'Text':
        // Text fields should only contain letters, spaces, and common punctuation
        const textRegex = /^[a-zA-Z\s.,!?;:'"()-]+$/;
        if (!textRegex.test(value.trim())) {
          return 'Please enter only text (letters, spaces, and punctuation)';
        }
        break;
    }
    return '';
  };

  const handleCustomFieldValueChange = (idx: number, value: string) => {
    const field = dynamicFields[idx];
    
    // Hide validation errors when user starts typing
    if (showCustomFieldErrors) {
      setShowCustomFieldErrors(false);
    }
    
    // Apply type-specific validation and formatting
    let processedValue = value;
    
    switch (field.type) {
      case 'Number':
        // Remove any non-digit characters
        processedValue = value.replace(/\D/g, '');
        break;
      case 'Email':
        // Allow email input but validate format
        processedValue = value;
        break;
      case 'Text':
        // Remove numbers and special characters, keep only letters, spaces, and common punctuation
        processedValue = value.replace(/[0-9]/g, '').replace(/[^a-zA-Z\s.,!?'"()-]/g, '');
        break;
    }
    
    // Update the field value
    setDynamicFields(fields => fields.map((f, i) => i === idx ? { ...f, value: processedValue } : f));
  };

  const handleCustomFieldMediaSelect = (fieldIndex: number) => {
    launchImageLibrary(
      { 
        mediaType: 'mixed', 
        quality: 0.7,
        maxWidth: 1024,
        maxHeight: 1024,
        selectionLimit: 1,
      }, 
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
            Alert.alert('Error', 'File size exceeds 10MB limit');
            return;
          }
          setDynamicFields(fields => fields.map((f, i) => 
            i === fieldIndex ? { 
              ...f, 
              value: asset.fileName || 'Selected file', 
              mediaUri: asset.uri,
              mediaType: asset.type || 'image',
              mediaSize: asset.fileSize || 0
            } : f
          ));
        }
      }
    );
  };

  const handleCustomFieldMediaRemove = (fieldIndex: number) => {
    setDynamicFields(fields => fields.map((f, i) => 
      i === fieldIndex ? { 
        ...f, 
        value: '', 
        mediaUri: undefined,
        mediaType: undefined,
        mediaSize: undefined
      } : f
    ));
  };

  const saveCustomFieldsToAPI = async (newFields: any[]) => {
    try {
      // Get organization from store directly
      const state = store.getState();
      const selectedOrganization = state.auth.selectedOrganization;
      
      if (!selectedOrganization) {
        Alert.alert('Error', 'No organization selected');
        return false;
      }

      // Convert dynamic fields to API format
      const extraFields = newFields.map(field => {
        const fieldObj: any = {};
        
        // Handle different field types
        if (field.type === 'Media') {
          fieldObj[field.fieldName.toLowerCase()] = ''; // Empty string for media
          fieldObj.type = 'media'; // Save as 'media' type
        } else {
          fieldObj[field.fieldName.toLowerCase()] = '';
          fieldObj.type = field.type.toLowerCase();
        }
        
        return fieldObj;
      });

      const payload = {
        customerId: selectedOrganization.customerId,
        organizationId: selectedOrganization.organizationId,
        flag: 'form',
        extraFields,
      };

      console.log('🎯 Saving custom fields to API:', payload);
      console.log('🎯 Field types being saved:', newFields.map(f => ({ name: f.fieldName, type: f.type })));
      console.log('🎯 Extra fields structure:', JSON.stringify(extraFields, null, 2));
      
      const response = await createExtraFields(payload);
      
      console.log('🎯 Create API response:', response);
      console.log('🎯 Response type:', typeof response);
      console.log('🎯 Response keys:', Object.keys(response || {}));
      console.log('🎯 Response has statusCode:', response?.statusCode);
      console.log('🎯 Response has data:', response?.data);
      console.log('🎯 Full response structure:', JSON.stringify(response, null, 2));
      
      // Check if response has data (indicates success)
      if (response && (response.statusCode === 200 || Object.keys(response).length > 0)) {
        console.log('🎯 Custom fields saved successfully');
        
        // Force refresh of extra fields data to get updated field types
        setTimeout(() => {
          console.log('🎯 Refreshing extra fields data...');
          // This will trigger the useEffect that loads fields from API
        }, 1000);
        
        return true;
      } else {
        console.log('🎯 Failed to save custom fields:', response);
        return false;
      }
    } catch (error) {
      console.error('🎯 Error saving custom fields:', error);
      return false;
    }
  };

  const deleteCustomFieldFromAPI = async (fieldName: string) => {
    try {
      // Get organization from store directly
      const state = store.getState();
      const selectedOrganization = state.auth.selectedOrganization;
      
      if (!selectedOrganization) {
        Alert.alert('Error', 'No organization selected');
        return false;
      }

      const payload = {
        customerId: selectedOrganization.customerId,
        organizationId: selectedOrganization.organizationId,
        flag: 'form',
        keyToRemove: fieldName.toLowerCase(),
      };

      console.log('🎯 Deleting custom field from API:', payload);
      
      const response = await deleteExtraField(payload);
      
      // Check if field was deleted (404 means field not found, which is success for deletion)
      if (response.statusCode === 200 || response.statusCode === 404) {
        console.log('🎯 Custom field deleted successfully');
        return true;
      } else {
        console.log('🎯 Failed to delete custom field:', response);
        return false;
      }
    } catch (error) {
      console.error('🎯 Error deleting custom field:', error);
      return false;
    }
  };



  const onNext = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      // Validate enrollment number
      const isEnrollmentValid = await validateEnrollmentNumber(values.studentEnrollmentNumber);
      
      if (!isEnrollmentValid) {
        setIsSubmitting(false);
        return;
      }

      // Validate custom fields
      let hasCustomFieldErrors = false;
      const customFieldErrors: string[] = [];
      
      dynamicFields.forEach((field, index) => {
        if (field.value.trim()) { // Only validate non-empty fields
          const error = validateCustomField(field.type, field.value);
          if (error) {
            hasCustomFieldErrors = true;
            customFieldErrors.push(`${field.fieldName}: ${error}`);
          }
        }
      });
      
      if (hasCustomFieldErrors) {
        setShowCustomFieldErrors(true);

        setIsSubmitting(false);
        return;
      }

      // Update context with form data and dynamic fields (with values)
      updateStepData({
        ...values,
        studentImage: imageUri,
        dynamicFields: dynamicFields.map(field => ({
          fieldName: field.fieldName,
          type: field.type,
          value: field.value,
          mediaUri: field.mediaUri,
          mediaType: (field as any).mediaType,
          mediaSize: (field as any).mediaSize
        })),
      });

      // Clear form changes flag since we're proceeding to next step
      updateStepData({});
      
      navigation.navigate('CollegeDetails');
    } catch (error) {
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectImage = () => {
    launchImageLibrary(
      { 
        mediaType: 'photo', 
        quality: 0.7,
        maxWidth: 1024,
        maxHeight: 1024,
      }, 
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
            Alert.alert('Error', 'File size exceeds 5MB limit');
            return;
          }
          setImageUri(asset.uri || '');
        }
      }
    );
  };

  const handleClearImage = () => {
    setImageUri('');
  };

  const handleAgentSelected = (agentId: string, agentName: string) => {
    handler.setValue('referedBy', agentName);
    // You can also store the agentId if needed for future reference
    console.log('Selected agent:', { agentId, agentName });
  };

  const handleReferralAmountChange = (text: string) => {
    // Clear error when user starts typing
    if (referralAmountError) {
      setReferralAmountError('');
    }
    
    // Only allow numbers and decimal point
    const cleanText = text.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      return; // Don't update if multiple decimal points
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return; // Don't update if more than 2 decimal places
    }
    
    setReferralAmount(cleanText);
  };

  const handleReferralSubmit = () => {
    // Clear previous errors
    setReferralAmountError('');
    
    // Validate referral amount
    if (!referralAmount.trim()) {
      setReferralAmountError('Referral amount is required');
      return;
    }
    
    // Check if amount is a valid number
    const amount = parseFloat(referralAmount);
    if (isNaN(amount) || amount <= 0) {
      setReferralAmountError('Please enter a valid amount (numbers only)');
      return;
    }
    
    if (!referralPaymentStatus.trim()) {
      Alert.alert('Error', 'Please select payment status');
      return;
    }

    // If payment status is "Paid", payment mode is required
    if (referralPaymentStatus === 'paid' && !referralPaymentMode.trim()) {
      Alert.alert('Error', 'Please select payment mode');
      return;
    }

    // Set the referred by value and close modal
    handler.setValue('referedBy', selectedAgentForReferral?.agentName || '');
    
    // Store referral details in local state for future use
    console.log('Referral details saved:', {
      agentId: selectedAgentForReferral?.agentId || '',
      agentName: selectedAgentForReferral?.agentName || '',
      referredAmount: amount,
      paymentStatus: referralPaymentStatus,
      paymentMode: referralPaymentMode,
    });
    
    // Clear the dropdown selection by resetting the ControlledSelect value
    // This ensures the dropdown shows the placeholder again
    setDropdownValue({ label: '', value: '' });

    // Reset form and close modal
    setReferralAmount('');
    setReferralPaymentStatus('');
    setReferralPaymentMode('');
    setReferralAmountError('');
    setSelectedAgentForReferral(null);
    setReferralModalVisible(false);
  };

  // Reset referral amount error when modal opens
  useEffect(() => {
    if (referralModalVisible) {
      setReferralAmountError('');
      setReferralPaymentStatus('');
      setReferralPaymentMode('');
      // Also reset dropdown value to ensure clean state
      setDropdownValue({ label: '', value: '' });
    }
  }, [referralModalVisible]);

  // Debug: Log dropdown value changes
  useEffect(() => {
    console.log('🎯 Dropdown value changed:', dropdownValue);
  }, [dropdownValue]);

  // Reset dropdown value when referred by field is empty
  useEffect(() => {
    if (!handler.watch('referedBy')) {
      setDropdownValue({ label: '', value: '' });
    }
  }, [handler.watch('referedBy')]);

  // Initialize dropdown value on component mount
  useEffect(() => {
    // Ensure dropdown shows placeholder on initial load
    if (!data.referedBy) {
      setDropdownValue({ label: '', value: '' });
    }
  }, []);

  // Handle form data restoration from context
  useEffect(() => {
    // If we have referred by data from context, update the dropdown accordingly
    if (data.referedBy) {
      // Find the agent in the agents data to get the proper label/value
      const agent = (agentsData?.data || agentsData?.agents || agentsData?.referralAgents || []).find((agent: any) => {
        const agentName = `${agent.agentName || agent.name || ''} ${agent.agentLastName || agent.lastName || ''}`.trim();
        return agentName === data.referedBy;
      });
      
      if (agent) {
        const agentName = `${agent.agentName || agent.name || ''} ${agent.agentLastName || agent.lastName || ''}`.trim();
        setDropdownValue({ label: agentName, value: agentName });
        setSelectedAgentForReferral({
          agentId: agent.id || agent.agentId || agentName,
          agentName: agentName,
        });
      }
    }
  }, [data.referedBy, agentsData]);



  return (
    <SafeView>
      <AppHeader
        title="Student Details"
        showDrawer={false}
        handleBackClick={goBackWithConfirmation}
      />
      <View style={styles.screenRoot}>
        <View style={styles.formCard}>
          <ThemeScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 20 }}>
            <ScalableText style={styles.sectionTitle} fontFamily="Medium">
              Student Details
            </ScalableText>
            <ScalableText style={styles.stepIndicator} fontFamily="Regular">
              Step 1 of 5 - Enter Student Information
            </ScalableText>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                First Name*
              </ScalableText>
              <Input
                handler={handler}
                name="studentFirstName"
                label="Enter first name"
                containerStyles={styles.inputContainer}
                placeholder="Enter first name"
                onChangeText={(text) => {
                  // Allow spaces between words (e.g., "Surya Dev")
                  handler.setValue('studentFirstName', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('studentFirstName');
                  if (currentValue) {
                    handler.setValue('studentFirstName', trimLeadingTrailing(currentValue));
                  }
                }}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Last Name
              </ScalableText>
              <Input
                handler={handler}
                name="studentLastName"
                label="Enter last name"
                containerStyles={styles.inputContainer}
                placeholder="Enter last name"
                onChangeText={(text) => {
                  // Allow spaces between words (e.g., "Kumar Singh")
                  handler.setValue('studentLastName', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('studentLastName');
                  if (currentValue) {
                    handler.setValue('studentLastName', trimLeadingTrailing(currentValue));
                  }
                }}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Email
              </ScalableText>
              <Input
                handler={handler}
                name="studentEmail"
                label="Enter email address"
                containerStyles={styles.inputContainer}
                placeholder="Enter email address"
                keyboardType="email-address"
                onChangeText={(text) => {
                  // Allow spaces but email validation will handle format
                  handler.setValue('studentEmail', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('studentEmail');
                  if (currentValue) {
                    handler.setValue('studentEmail', trimLeadingTrailing(currentValue));
                  }
                }}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Enrollment Number*
              </ScalableText>
              <Input
                handler={handler}
                name="studentEnrollmentNumber"
                label="Enter enrollment number"
                containerStyles={styles.inputContainer}
                placeholder="Enter enrollment number"
                onChangeText={(text) => {
                  // Allow spaces but enrollment validation will handle format
                  handler.setValue('studentEnrollmentNumber', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('studentEnrollmentNumber');
                  if (currentValue) {
                    handler.setValue('studentEnrollmentNumber', trimLeadingTrailing(currentValue));
                  }
                  
                  // Validate enrollment number
                  const enrollmentNumber = handler.getValues('studentEnrollmentNumber');
                  if (enrollmentNumber) {
                    validateEnrollmentNumber(enrollmentNumber);
                  }
                }}
              />
              {enrollmentError ? (
                <ScalableText style={styles.errorText} fontFamily="Regular">{enrollmentError}</ScalableText>
              ) : null}
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Phone Number*
              </ScalableText>
              <Input
                handler={handler}
                name="studentContact"
                label="Enter phone number"
                keyboardType="phone-pad"
                containerStyles={styles.inputContainer}
                placeholder="Enter phone number"
                maxLength={10}
                onChangeText={(text) => {
                  // Remove any non-digit characters
                  const cleanText = text.replace(/\D/g, '');
                  // Limit to 10 digits
                  const limitedText = cleanText.slice(0, 10);
                  handler.setValue('studentContact', limitedText);
                }}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Father's Name
              </ScalableText>
              <Input
                handler={handler}
                name="studentFatherName"
                label="Enter father's name"
                containerStyles={styles.inputContainer}
                placeholder="Enter father's name"
                onChangeText={(text) => {
                  // Allow spaces between words (e.g., "Raj Kumar")
                  handler.setValue('studentFatherName', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('studentFatherName');
                  if (currentValue) {
                    handler.setValue('studentFatherName', trimLeadingTrailing(currentValue));
                  }
                }}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Father's Phone Number
              </ScalableText>
              <Input
                handler={handler}
                name="studentFatherContact"
                label="Enter father's phone number"
                keyboardType="phone-pad"
                containerStyles={styles.inputContainer}
                placeholder="Enter Phone number"
                maxLength={10}
                onChangeText={(text) => {
                  // Remove any non-digit characters
                  const cleanText = text.replace(/\D/g, '');
                  // Limit to 10 digits
                  const limitedText = cleanText.slice(0, 10);
                  handler.setValue('studentFatherContact', limitedText);
                }}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Address
              </ScalableText>
              <Input
                handler={handler}
                name="studentAddress"
                label="Enter address"
                containerStyles={styles.inputContainer}
                placeholder="Enter address"
                multiline={false}
                onChangeText={(text) => {
                  // Allow spaces between words (e.g., "Surya Dev Nagar, Street 123")
                  handler.setValue('studentAddress', text);
                }}
                onBlur={() => {
                  // Trim leading/trailing spaces when field loses focus
                  const currentValue = handler.getValues('studentAddress');
                  if (currentValue) {
                    handler.setValue('studentAddress', trimLeadingTrailing(currentValue));
                  }
                }}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Gender
              </ScalableText>
              <ControlledSelect
                handler={handler}
                name="studentGender"
                label="Select gender"
                options={GENDER_OPTIONS}
                value={GENDER_OPTIONS.find(opt => opt.value === handler.watch('studentGender')) || { label: '', value: '' }}
                dropdownButtonStyle={styles.inputContainer}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Date of Birth
              </ScalableText>
              <View style={styles.inputContainer}>
                <DateInput
                  handler={handler}
                  name="studentDateOfBirth"
                  label="Enter date of birth"
                  inputRoot={styles.dateInputStyle}
                  maximumDate={new Date(new Date().getFullYear() - 5, 11, 31)} // Allow up to 5 years back (e.g., 2020)
                  minimumDate={new Date(1950, 0, 1)} // Start from 1950 so year list starts from bottom
                />
              </View>
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Referred By
              </ScalableText>
              <View style={styles.referredByContainer}>
                <View style={styles.referredByInputContainer}>
                  {handler.watch('referedBy') ? (
                    // Show selected agent with remove button
                    <View style={styles.selectedAgentContainer}>
                      <View style={styles.selectedAgentInfo}>
                        <ScalableText style={styles.selectedAgentName} fontFamily="Medium">
                          {handler.watch('referedBy')}
                        </ScalableText>
                      </View>
                      <TouchableOpacity 
                        style={styles.removeAgentButton}
                        onPress={() => {
                          handler.setValue('referedBy', '');
                          setSelectedAgentForReferral(null);
                          // Also reset dropdown value to show placeholder
                          setDropdownValue({ label: '', value: '' });
                        }}
                      >
                        <ScalableText style={styles.removeAgentText} fontFamily="Bold">×</ScalableText>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // Show dropdown when no agent is selected
                    <ControlledSelect
                      handler={handler}
                      name="referedBy"
                      label="Select referral agent"
                      options={(agentsData?.data || agentsData?.agents || agentsData?.referralAgents || []).map((agent: any) => {
                        const agentName = `${agent.agentName || agent.name || ''} ${agent.agentLastName || agent.lastName || ''}`.trim();
                        return {
                          label: agentName || 'Unknown Agent',
                          value: agentName || 'Unknown Agent',
                        };
                      })}
                      value={dropdownValue}
                      dropdownButtonStyle={styles.referredByInput}
                      onChangeValue={(selectedValue: string) => {
                        if (selectedValue) {
                          // Find the selected agent from the agents data
                          const selectedAgent = (agentsData?.data || agentsData?.agents || agentsData?.referralAgents || []).find((agent: any) => {
                            const agentName = `${agent.agentName || agent.name || ''} ${agent.agentLastName || agent.lastName || ''}`.trim();
                            return agentName === selectedValue;
                          });
                          
                          if (selectedAgent) {
                            // Show referral payment popup when agent is selected
                            setSelectedAgentForReferral({
                              agentId: selectedAgent.id || selectedAgent.agentId || selectedValue,
                              agentName: selectedValue,
                            });
                            setReferralModalVisible(true);
                          }
                        }
                      }}
                    />
                  )}
                </View>
                <TouchableOpacity
                  style={styles.addAgentButton}
                  onPress={() => setAgentModalVisible(true)}
                >
                  <Text style={styles.addAgentButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Date of Admission
              </ScalableText>
              <View style={styles.inputContainer}>
                <DateInput
                  handler={handler}
                  name="dateOfAdmission"
                  label="Enter date of admission"
                  inputRoot={styles.dateInputStyle}
                />
              </View>
            </View>
            {/* Student Image picker */}
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Student Image
              </ScalableText>
              <View style={styles.imageButtons}>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handleSelectImage}
                >
                  <Text style={styles.imageButtonText}>{imageUri ? 'Change Image' : 'Select Image'}</Text>
                </TouchableOpacity>
                {imageUri && (
                  <TouchableOpacity
                    style={[styles.imageButton, { backgroundColor: '#FF3B30' }]}
                    onPress={handleClearImage}
                  >
                    <Text style={styles.imageButtonText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : null}
            </View>

            {/* Add Custom Field Section */}
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                Add Custom Fields
              </ScalableText>
              <View style={styles.customFieldContainer}>
                <View style={styles.customFieldRow}>
                  <View style={styles.fieldNameContainer}>
                    <TextInput
                      value={newFieldName}
                      onChangeText={(text) => setNewFieldName(text)}
                      placeholder="Field name"
                      style={styles.fieldNameInput}
                      onBlur={() => {
                        // Trim leading/trailing spaces when field loses focus
                        if (newFieldName) {
                          setNewFieldName(trimLeadingTrailing(newFieldName));
                        }
                      }}
                    />
                  </View>
                  <View style={styles.typeDropdownContainer}>
                    <ControlledSelect
                      handler={handler}
                      name="newFieldType"
                      label="Select type"
                      options={FIELD_TYPE_OPTIONS}
                      value={FIELD_TYPE_OPTIONS.find(opt => opt.value === newFieldType) || { label: '', value: '' }}
                      dropdownButtonStyle={styles.typeDropdown}
                      onChangeValue={(selectedValue: string) => {
                        if (selectedValue) {
                          setNewFieldType(selectedValue);
                        }
                      }}
                    />
                  </View>
                 
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={async () => {
                      if (!newFieldName.trim()) {
                        setCustomFieldError('Field name is required');
                        return;
                      }
                      if (dynamicFields.some(f => f.fieldName === newFieldName.trim())) {
                        setCustomFieldError('Field name must be unique');
                        return;
                      }
                      
                      const newField = { fieldName: newFieldName.trim(), type: newFieldType, value: '' };
                      const updatedFields = [...dynamicFields, newField];
                      
                      console.log('🎯 Adding new field:', newField);
                      console.log('🎯 Updated fields list:', updatedFields);
                      
                      // Save to API
                      const saved = await saveCustomFieldsToAPI(updatedFields);
                      
                      if (saved) {
                        setDynamicFields(updatedFields);
                        
                        setNewFieldName('');
                        setNewFieldType('Text');
                        setCustomFieldError('');
                        
                        // Refresh extra fields data to ensure we have the latest field types
                        setTimeout(() => {
                          refetchExtraFields();
                        }, 500);
                      } else {
                        Alert.alert('Error', 'Failed to save custom field. Please try again.');
                      }
                    }}
                  >
                    <ScalableText style={styles.addButtonText} fontFamily="Medium">Add</ScalableText>
                  </TouchableOpacity>
                {customFieldError ? (
                  <ScalableText fontFamily="Regular" style={styles.errorText}>{customFieldError}</ScalableText>
                ) : null}
              </View>
            </View>

            {/* Dynamic Fields Input Section */}
            {dynamicFields.length > 0 && (
              <View style={styles.inputSpacing}>
                <ScalableText style={styles.inputLabel} fontFamily="Medium">
                  Custom Fields
                </ScalableText>
                <View style={styles.dynamicFieldsContainer}>
                  {dynamicFields.map((field, idx) => (
                  <View key={idx} style={styles.dynamicFieldRow}>
                    <ScalableText style={styles.dynamicFieldLabel} fontFamily="Medium">
                      {field.fieldName}
                    </ScalableText>
                    {/* Render different input types based on field type */}
                    {field.type === 'Text' && (
                      <View>
                        <View style={styles.inputWithRemoveContainer}>
                          <TextInput
                            value={field.value}
                            onChangeText={(value) => handleCustomFieldValueChange(idx, value)}
                            placeholder={`Enter ${field.fieldName.toLowerCase()}`}
                            style={styles.dynamicInputWithRemove}
                            onBlur={() => {
                              // Trim leading/trailing spaces when field loses focus
                              if (field.value) {
                                const trimmedValue = trimLeadingTrailing(field.value);
                                setDynamicFields(fields => fields.map((f, i) => i === idx ? { ...f, value: trimmedValue } : f));
                              }
                            }}
                          />
                          <TouchableOpacity 
                            style={styles.removeButtonInline}
                            onPress={async () => {
                              const fieldToDelete = dynamicFields[idx];
                              const deleted = await deleteCustomFieldFromAPI(fieldToDelete.fieldName);
                              
                              if (deleted) {
                                setDynamicFields(dynamicFields.filter((_, i) => i !== idx));
                              } else {
                                Alert.alert('Error', 'Failed to remove custom field. Please try again.');
                              }
                            }}
                          >
                            <ScalableText style={styles.removeIconInline} fontFamily="Bold">×</ScalableText>
                          </TouchableOpacity>
                        </View>
                                                {showCustomFieldErrors && validateCustomField(field.type, field.value) ? (
                          <ScalableText style={styles.errorText} fontFamily="Regular">
                            {validateCustomField(field.type, field.value)}
                          </ScalableText>
                        ) : null}
                      </View>
                    )}
                    
                    {field.type === 'Number' && (
                      <View>
                        <View style={styles.inputWithRemoveContainer}>
                          <TextInput
                            value={field.value}
                            onChangeText={(value) => handleCustomFieldValueChange(idx, value)}
                            placeholder={`Enter ${field.fieldName.toLowerCase()}`}
                            keyboardType="numeric"
                            style={styles.dynamicInputWithRemove}
                          />
                          <TouchableOpacity 
                            style={styles.removeButtonInline}
                            onPress={async () => {
                              const fieldToDelete = dynamicFields[idx];
                              const deleted = await deleteCustomFieldFromAPI(fieldToDelete.fieldName);
                              
                              if (deleted) {
                                setDynamicFields(dynamicFields.filter((_, i) => i !== idx));
                              } else {
                                Alert.alert('Error', 'Failed to remove custom field. Please try again.');
                              }
                            }}
                          >
                            <ScalableText style={styles.removeIconInline} fontFamily="Bold">×</ScalableText>
                          </TouchableOpacity>
                        </View>
                        {showCustomFieldErrors && validateCustomField(field.type, field.value) ? (
                          <ScalableText style={styles.errorText} fontFamily="Regular">
                            {validateCustomField(field.type, field.value)}
                          </ScalableText>
                        ) : null}
                      </View>
                    )}
                    
                    {field.type === 'Email' && (
                      <View>
                        <View style={styles.inputWithRemoveContainer}>
                          <TextInput
                            value={field.value}
                            onChangeText={(value) => handleCustomFieldValueChange(idx, value)}
                            placeholder={`Enter ${field.fieldName.toLowerCase()}`}
                            keyboardType="email-address"
                            style={styles.dynamicInputWithRemove}
                            onBlur={() => {
                              // Trim leading/trailing spaces when field loses focus
                              if (field.value) {
                                const trimmedValue = trimLeadingTrailing(field.value);
                                setDynamicFields(fields => fields.map((f, i) => i === idx ? { ...f, value: trimmedValue } : f));
                              }
                            }}
                          />
                          <TouchableOpacity 
                            style={styles.removeButtonInline}
                            onPress={async () => {
                              const fieldToDelete = dynamicFields[idx];
                              const deleted = await deleteCustomFieldFromAPI(fieldToDelete.fieldName);
                              
                              if (deleted) {
                                setDynamicFields(dynamicFields.filter((_, i) => i !== idx));
                              } else {
                                Alert.alert('Error', 'Failed to remove custom field. Please try again.');
                            }
                          }}
                        >
                          <ScalableText style={styles.removeIconInline} fontFamily="Bold">×</ScalableText>
                        </TouchableOpacity>
                      </View>
                      {showCustomFieldErrors && validateCustomField(field.type, field.value) ? (
                        <ScalableText style={styles.errorText} fontFamily="Regular">
                          {validateCustomField(field.type, field.value)}
                        </ScalableText>
                      ) : null}
                    </View>
                  )}
                    
                    {field.type === 'Media' && (
                      <View style={styles.mediaFieldContainer}>
                        <View style={styles.inputWithRemoveContainer}>
                          <TouchableOpacity
                            style={styles.mediaSelectButtonInline}
                            onPress={() => handleCustomFieldMediaSelect(idx)}
                          >
                            <ScalableText style={styles.mediaSelectButtonText} fontFamily="Medium">
                              {field.value ? field.value : `Select ${field.fieldName.toLowerCase()}`}
                            </ScalableText>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.removeButtonInline}
                            onPress={async () => {
                              const fieldToDelete = dynamicFields[idx];
                              const deleted = await deleteCustomFieldFromAPI(fieldToDelete.fieldName);
                              
                              if (deleted) {
                                setDynamicFields(dynamicFields.filter((_, i) => i !== idx));
                              } else {
                                Alert.alert('Error', 'Failed to remove custom field. Please try again.');
                              }
                            }}
                          >
                            <ScalableText style={styles.removeIconInline} fontFamily="Bold">×</ScalableText>
                          </TouchableOpacity>
                        </View>
                        
                        {/* Media Preview and Remove Media Button */}
                        {field.mediaUri && (
                          <View style={styles.mediaPreviewContainer}>
                            <Image source={{ uri: field.mediaUri }} style={styles.mediaPreview}/>
                            <TouchableOpacity 
                              style={styles.removeMediaButton}
                              onPress={() => handleCustomFieldMediaRemove(idx)}
                            >
                              <ScalableText style={styles.removeMediaIcon} fontFamily="Bold">✕</ScalableText>
                            </TouchableOpacity>
                            <View style={styles.mediaInfo}>
                              <ScalableText style={styles.mediaFileName} fontFamily="Medium">
                                {field.value}
                              </ScalableText>
                              {(field as any).mediaSize && (
                                <ScalableText style={styles.mediaFileSize} fontFamily="Regular">
                                  {((field as any).mediaSize / 1024 / 1024).toFixed(2)} MB
                                </ScalableText>
                              )}
                            </View>
                          </View>
                        )}
                      </View>
                    )}
              </View>
                ))}
                </View>
            </View>
            )}
          </ThemeScrollView>
        </View>
        <View style={styles.buttonBelowCardWrapper}>
          <Button
            title={isSubmitting || isCheckingEnrollment ? "Validating..." : "Next"}
            onPress={handler.handleSubmit(onNext)}
            btnStyles={styles.submitBtn}
            btnTxtStyles={styles.submitBtnText}
            disabled={isSubmitting || isCheckingEnrollment}
          />
        </View>
      </View>
      
      {(isSubmitting || isCheckingEnrollment) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ScalableText style={styles.loadingText} fontFamily="Medium">
            {isCheckingEnrollment ? 'Validating enrollment number...' : 'Processing...'}
          </ScalableText>
        </View>
      )}

      {/* Agent Selection Modal */}
      <AgentSelectionModal
        visible={agentModalVisible}
        onClose={() => setAgentModalVisible(false)}
        onAgentSelected={handleAgentSelected}
        agents={agentsData?.data || agentsData?.agents || agentsData?.referralAgents || []}
      />

      {/* Referral Payment Modal */}
      <Modal
        visible={referralModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setReferralModalVisible(false);
          // Reset form when modal is closed via back button
          setReferralAmount('');
          setReferralPaymentStatus('');
          setReferralPaymentMode('');
          setReferralAmountError('');
          setDropdownValue({ label: '', value: '' });
          // Also reset the selected agent to clear the referred by field
          setSelectedAgentForReferral(null);
          handler.setValue('referedBy', '');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ScalableText style={styles.modalTitle} fontFamily="Medium">
                Please Select The Payment For The Agents
              </ScalableText>
              <TouchableOpacity onPress={() => {
                setReferralModalVisible(false);
                // Reset form when modal is closed
                setReferralAmount('');
                setReferralPaymentStatus('');
                setReferralPaymentMode('');
                setReferralAmountError('');
                setDropdownValue({ label: '', value: '' });
                // Also reset the selected agent to clear the referred by field
                setSelectedAgentForReferral(null);
                handler.setValue('referedBy', '');
              }} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                <View style={styles.modalField}>
                  <ScalableText style={styles.modalLabel} fontFamily="Medium">
                    Agent name
                  </ScalableText>
                  <TextInput
                    style={styles.modalInput}
                    value={selectedAgentForReferral?.agentName || ''}
                    editable={false}
                    placeholder="Agent name"
                  />
                </View>

                <View style={styles.modalField}>
                  <ScalableText style={styles.modalLabel} fontFamily="Medium">
                    Referred amount *
                  </ScalableText>
                  <TextInput
                    style={[
                      styles.modalInput,
                      referralAmountError ? styles.modalInputError : null
                    ]}
                    placeholder="Enter referred amount"
                    keyboardType="numeric"
                    value={referralAmount}
                    onChangeText={handleReferralAmountChange}
                  />
                  {referralAmountError ? (
                    <ScalableText style={styles.modalErrorText} fontFamily="Regular">
                      {referralAmountError}
                    </ScalableText>
                  ) : null}
                </View>

                <View style={styles.modalField}>
                  <ScalableText style={styles.modalLabel} fontFamily="Medium">
                    Payment status *
                  </ScalableText>
                  <ControlledSelect
                    handler={handler}
                    name="referralPaymentStatus"
                    label="Select payment status"
                    options={[
                      { label: 'Paid', value: 'paid' },
                      { label: 'Due', value: 'due' }
                    ]}
                    value={referralPaymentStatus ? 
                      { label: referralPaymentStatus === 'paid' ? 'Paid' : 'Due', value: referralPaymentStatus } : 
                      { label: 'Select payment status', value: '' }
                    }
                    dropdownButtonStyle={styles.modalDropdown}
                    onChangeValue={(value) => {
                      console.log('Payment status changed to:', value);
                      setReferralPaymentStatus(value);
                    }}
                  />
                </View>

                {/* Payment Mode Field - Only show when status is "Paid" */}
                {referralPaymentStatus === 'paid' && (
                  <View style={styles.modalField}>
                    <ScalableText style={styles.modalLabel} fontFamily="Medium">
                      Please select the payment mode *
                    </ScalableText>
                    <ControlledSelect
                      handler={handler}
                      name="referralPaymentMode"
                      label="Select payment mode"
                      options={PAYMENT_MODE_OPTIONS}
                      value={PAYMENT_MODE_OPTIONS.find(opt => opt.value === referralPaymentMode) || { label: '', value: '' }}
                      dropdownButtonStyle={styles.modalDropdown}
                      onChangeValue={(value) => {
                        console.log('Payment mode changed to:', value);
                        setReferralPaymentMode(value);
                      }}
                    />
                  </View>
                )}
                
            
         
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setReferralModalVisible(false);
                  // Reset form when modal is cancelled
                  setReferralAmount('');
                  setReferralPaymentStatus('');
                  setReferralPaymentMode('');
                  setReferralAmountError('');
                  setDropdownValue({ label: '', value: '' });
                  // Also reset the selected agent to clear the referred by field
                  setSelectedAgentForReferral(null);
                  handler.setValue('referedBy', '');
                }}
              >
                <Text style={styles.modalCancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleReferralSubmit}
              >
                <Text style={styles.modalSubmitButtonText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1, 
    backgroundColor: COLORS.whiteSmoke,
    paddingHorizontal: 10,
    paddingTop: 0,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 24,
    marginHorizontal: 8,
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.black,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  inputSpacing: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 8,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  inputContainer: {
    marginTop: 8,
  },
  dateInputStyle: {
    marginTop: 0,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  imageButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtonText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 8,
  },
  buttonBelowCardWrapper: {
    marginTop: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitBtn: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
  },
  submitBtnText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: COLORS.white,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  customFieldContainer: {
    marginTop: 8,
  },
  customFieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  fieldNameContainer: {
    flex: 2,
  },
  fieldNameInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
  },
  typeDropdownContainer: {
    flex: 1.5,
  },
  typeDropdown: {
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 0,
    paddingHorizontal: 20,
    minWidth: 80,
    marginTop: 10,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: "Poppins-Medium",
  },
  fieldList: {
    marginTop: 12,
  },
  fieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  fieldPillText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeIcon: {
    fontSize: 18,
    color: '#FF3B30',
  },
  dynamicFieldContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dynamicFieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  dynamicInputContainer: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
  },
  mediaFieldContainer: {
    marginTop: 8,
  },
  mediaSelectButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mediaSelectButtonText: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  mediaPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dynamicFieldRow: {
    marginBottom: 16,
  },
  dynamicFieldLabel: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  inputWithRemoveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dynamicInputWithRemove: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
  },
  removeButtonInline: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIconInline: {
    fontSize: 16,
    color: COLORS.white,
  },
  mediaSelectButtonInline: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dynamicFieldsContainer: {
    marginBottom: 12,
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginTop: 8,
    alignItems: 'center',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeMediaIcon: {
    fontSize: 14,
    color: COLORS.white,
  },
  mediaInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  mediaFileName: {
    fontSize: 12,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 2,
  },
  mediaFileSize: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  referredByContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  referredByInputContainer: {
    flex: 1,
  },
  referredByInput: {
    marginTop: 8,
  },
  addAgentButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  addAgentButtonText: {
    fontSize: 24,
    color: COLORS.white,
    fontFamily: 'Poppins-Bold',
  },
  selectedAgentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedAgentInfo: {
    flex: 1,
  },
  selectedAgentName: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Poppins-Medium",
  },
  removeAgentButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeAgentText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "Poppins-Bold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 0,
    width: Dimensions.get('window').width * 0.9,
    minHeight: 520,
    maxHeight: Dimensions.get('window').height * 0.9,
    flexDirection: 'column',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    color: COLORS.black,
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  modalBody: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
    justifyContent: 'flex-start',
    minHeight: 300,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalField: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  modalInput: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 18,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
  },
  modalDropdown: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 18,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    padding: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  modalCancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalCancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  modalSubmitButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalSubmitButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  modalInputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
  },
  modalErrorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 6,
    fontFamily: 'Poppins-Regular',
    marginLeft: 4,
  },
  debugInfo: {
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#B0D4F1',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  debugText: {
    color: '#0066CC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});

export default StudentDetailsScreen; 