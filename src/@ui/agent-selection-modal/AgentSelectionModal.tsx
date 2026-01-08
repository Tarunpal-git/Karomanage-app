import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import ScalableText from '../scalable-text/ScalableText';
import { COLORS } from '../../colors';
import { useCreateReferralAgentMutation } from '../../apis/hooks/agent-management/mutation/useCreateReferralAgent.mutation';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useStudentsListQuery } from '../../apis/hooks/students/query/useStudentsList.query';
import { useTeachersListQuery } from '../../apis/hooks/teachers/query/useTeachersList.query';
import { useEmployeesListQuery } from '../../apis/hooks/employee/query/useEmployeesList.query';
import SelectDropdown from '../select-dropdown/SelectDropdown';

interface AgentSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onAgentSelected: (agentId: string, agentName: string) => void;
  agents: Array<{
    agentId: string;
    agentName: string;
    agentLastName: string;
    agentContact: string;
    agentEmail: string;
    agentType: string;
  }>;
}

const AGENT_TYPES = [
  { id: 'student', label: 'Student', icon: '🎓' },
  { id: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
  { id: 'employee', label: 'Employee', icon: '👔' },
  { id: 'other', label: 'Other', icon: '👤' },
];

const AgentSelectionModal: React.FC<AgentSelectionModalProps> = ({
  visible,
  onClose,
  onAgentSelected,
  agents,
}) => {
  const [selectedAgentType, setSelectedAgentType] = useState<string>('');
  const [showAgentList, setShowAgentList] = useState(false);
  const [showAddAgentForm, setShowAddAgentForm] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [selectedAgentFromDropdown, setSelectedAgentFromDropdown] = useState<any>(null);
  const [agentFormData, setAgentFormData] = useState({
    agentName: '',
    agentLastName: '',
    agentEmail: '',
    agentContact: '',
  });

  const { mutateAsync: createReferralAgent, isPending: isCreating } = useCreateReferralAgentMutation();
  const { selectedOrganization, authUser } = useSelector((state: RootState) => state.auth);

  // Fetch dynamic lists from APIs
  const { data: studentsData, isLoading: studentsLoading, refetch: refetchStudents } = useStudentsListQuery();
  const { data: teachersData, isLoading: teachersLoading, refetch: refetchTeachers } = useTeachersListQuery();
  const { data: employeesData, isLoading: employeesLoading, refetch: refetchEmployees } = useEmployeesListQuery();

  // Get the appropriate list based on selected type
  const getDynamicList = () => {
    switch (selectedAgentType) {
      case 'student':
        // Debug: Log student data structure
        console.log('🔍 Student data in AgentSelectionModal:', {
          studentsData,
          hasData: !!studentsData?.data,
          dataLength: studentsData?.data?.length || 0,
          firstStudent: studentsData?.data?.[0],
          dataKeys: studentsData?.data?.[0] ? Object.keys(studentsData.data[0]) : []
        });
        return studentsData?.data || [];
      case 'teacher':
        return teachersData?.data || [];
      case 'employee':
        // Debug: Log employee data structure
        console.log('🔍 Employee data in AgentSelectionModal:', {
          employeesData,
          hasData: !!employeesData?.data,
          dataLength: employeesData?.data?.length || 0,
          firstEmployee: employeesData?.data?.[0],
          dataKeys: employeesData?.data?.[0] ? Object.keys(employeesData.data[0]) : []
        });
        return employeesData?.data || [];
      case 'other':
        return agents; // Use existing agents for 'other' type
      default:
        return [];
    }
  };

  const dynamicList = getDynamicList();
  const isLoading = studentsLoading || teachersLoading || employeesLoading;

  // Format dropdown options
  const getDropdownOptions = () => {
    // Debug: Log dropdown options creation for all types
    console.log('🔍 Creating dropdown options:', {
      selectedAgentType,
      dynamicListLength: dynamicList.length,
      dynamicList: dynamicList,
      options: dynamicList.map((item: any) => ({
        label: getDisplayName(item),
        value: getItemId(item),
        data: item,
      }))
    });
    
    return dynamicList.map((item: any) => ({
      label: getDisplayName(item),
      value: getItemId(item),
      data: item,
    }));
  };

  // Helper function to get the correct ID for each agent type
  const getItemId = (item: any) => {
    let id = '';
    
    if (selectedAgentType === 'student') {
      id = item.studentEnrollmentNumber || item.id || item.studentId || item.student_id || item.studentID;
      console.log('🔍 getItemId - Student:', {
        studentEnrollmentNumber: item.studentEnrollmentNumber,
        id: item.id,
        studentId: item.studentId,
        student_id: item.student_id,
        studentID: item.studentID,
        finalId: id
      });
    } else if (selectedAgentType === 'teacher') {
      id = item.teacherId || item.id;
      console.log('🔍 getItemId - Teacher:', { teacherId: item.teacherId, id: item.id, finalId: id });
    } else if (selectedAgentType === 'employee') {
      id = item.employeeId || item.id;
      console.log('🔍 getItemId - Employee:', { employeeId: item.employeeId, id: item.id, finalId: id });
    } else {
      id = item.agentId || item.id;
      console.log('🔍 getItemId - Agent:', { agentId: item.agentId, id: item.id, finalId: id });
    }
    
    return id;
  };

  // Helper functions to get display information from different data types
  const getDisplayName = (item: any) => {
    if (selectedAgentType === 'student') {
      // Check all possible student name fields
      const firstName = item.studentFirstName || item.studentFirstname || item.firstName || item.first_name || '';
      const lastName = item.studentLastName || item.studentLastname || item.lastName || item.last_name || '';
      const displayName = `${firstName} ${lastName}`.trim();
      
      console.log('🔍 Student Display Name:', {
        studentFirstName: item.studentFirstName,
        studentFirstname: item.studentFirstname,
        firstName: item.firstName,
        first_name: item.first_name,
        studentLastName: item.studentLastName,
        studentLastname: item.studentLastname,
        lastName: item.lastName,
        last_name: item.last_name,
        finalFirstName: firstName,
        finalLastName: lastName,
        displayName
      });
      return displayName;
    } else if (selectedAgentType === 'teacher') {
      return `${item.teacherFirstName || ''} ${item.teacherLastName || ''}`.trim();
    } else if (selectedAgentType === 'employee') {
      // Employee data structure: employeePersonalDetails.employeeFirstname
      const firstName = item?.employeePersonalDetails?.employeeFirstname || item.employeeFirstName || '';
      const lastName = item?.employeePersonalDetails?.employeeLastname || item.employeeLastName || '';
      return `${firstName} ${lastName}`.trim();
    } else {
      return `${item.agentName || ''} ${item.agentLastName || ''}`.trim();
    }
  };

  const getDisplayContact = (item: any) => {
    if (selectedAgentType === 'student') {
      return item.studentContact || item.phoneNumber;
    } else if (selectedAgentType === 'teacher') {
      return item.teacherPhoneNumber || item.teacherContact || item.phoneNumber;
    } else if (selectedAgentType === 'employee') {
      // Employee data structure: employeePersonalDetails.employeePhoneNumber
      const contact = item?.employeePersonalDetails?.employeePhoneNumber || item?.employeePersonalDetails?.employeeContact || item.employeeContact || item.phoneNumber;
      console.log('🔍 getDisplayContact - Employee:', {
        employeePersonalDetails: item?.employeePersonalDetails,
        employeePhoneNumber: item?.employeePersonalDetails?.employeePhoneNumber,
        nestedEmployeeContact: item?.employeePersonalDetails?.employeeContact,
        directEmployeeContact: item?.employeeContact,
        phoneNumber: item?.phoneNumber,
        finalContact: contact,
        fullItem: item
      });
      return contact;
    } else {
      return item.agentContact;
    }
  };

  const getDisplayEmail = (item: any) => {
    if (selectedAgentType === 'student') {
      return item.studentEmail || item.email;
    } else if (selectedAgentType === 'teacher') {
      return item.teacherEmail || item.email;
    } else if (selectedAgentType === 'employee') {
      // Employee data structure: employeePersonalDetails.employeeEmail
      return item?.employeePersonalDetails?.employeeEmail || item.employeeEmail || item.email;
    } else {
      return item.agentEmail;
    }
  };

  const handleAgentTypeSelect = (agentType: string) => {
    setSelectedAgentType(agentType);
    
    if (agentType === 'other') {
      // For "Other" agent type, directly show the create agent form
      setShowAddAgentForm(true);
      setShowAgentList(false);
      // Reset form data for new agent and clear any selected agent
      setAgentFormData({
        agentName: '',
        agentLastName: '',
        agentEmail: '',
        agentContact: '',
      });
      setSelectedAgent(null);
      setSelectedAgentFromDropdown(null);
    } else {
      // For other agent types, show the agent list first
      setShowAddAgentForm(false);
      setShowAgentList(true);
    }
  };

  const handleAddAgent = async () => {
    if (!agentFormData.agentName.trim() || !agentFormData.agentContact.trim()) {
      Alert.alert('Error', 'Agent name and contact are required');
      return;
    }

    if (!selectedAgentType) {
      Alert.alert('Error', 'Please select an agent type');
      return;
    }

    // For "Other" agent type, validate email format if provided
    if (selectedAgentType === 'other' && agentFormData.agentEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(agentFormData.agentEmail.trim())) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
    }

    try {
      const payload = {
        customerId: selectedOrganization?.customerId || '',
        organizationId: selectedOrganization?.organizationId || '',
        agentName: agentFormData.agentName.trim(),
        agentLastName: agentFormData.agentLastName.trim(),
        agentEmail: agentFormData.agentEmail.trim(),
        agentContact: agentFormData.agentContact.trim(),
        agentType: selectedAgentType as 'student' | 'teacher' | 'employee' | 'other',
        user: {
          userCustomerId: authUser?.customerId || '',
          userCustomerName: authUser?.customerName || '',
          userCustomerEmail: authUser?.customerEmail || '',
          roleName: 'admin',
          roleId: 'J9xAF',
          userEmployeeId: 'TOP-9d8a8',
        },
      };

      const response = await createReferralAgent(payload);
      
      if (response.statusCode === 200) {
        Alert.alert('Success', 'Agent added successfully');
        
        // If we had a selected agent, use it to populate the referred by field
        if (selectedAgent || selectedAgentFromDropdown) {
          const agentToUse = selectedAgent || selectedAgentFromDropdown;
          let agentId = '';
          let agentName = '';
          
          if (selectedAgentType === 'student') {
            agentId = getItemId(agentToUse);
            agentName = `${agentToUse.studentFirstName || ''} ${agentToUse.studentLastName || ''}`.trim();
          } else if (selectedAgentType === 'teacher') {
            agentId = getItemId(agentToUse);
            agentName = `${agentToUse.teacherFirstName || ''} ${agentToUse.teacherLastName || ''}`.trim();
          } else if (selectedAgentType === 'employee') {
            agentId = getItemId(agentToUse);
            agentName = `${agentToUse?.employeePersonalDetails?.employeeFirstname || agentToUse.employeeFirstName || ''} ${agentToUse?.employeePersonalDetails?.employeeLastname || agentToUse.employeeLastName || ''}`.trim();
          } else {
            agentId = getItemId(agentToUse);
            agentName = `${agentToUse.agentName || ''} ${agentToUse.agentLastName || ''}`.trim();
          }
          
          onAgentSelected(agentId, agentName);
        }
        
        onClose();
      } else {
        // Check for specific error cases in the response
        let errorMessage = 'Failed to add agent';
        
        if (response.message && typeof response.message === 'string') {
          const message = response.message.toLowerCase();
          if (message.includes('duplicate') || 
              message.includes('already exists') ||
              message.includes('already in use') ||
              message.includes('already present')) {
            errorMessage = 'An agent with this information already exists. Please check the details or use a different agent.';
          } else {
            errorMessage = response.message;
          }
        }
        
        Alert.alert('Error', errorMessage);
        return;
      }
    } catch (error: any) {
      console.error('Error creating agent:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to add agent. Please try again.';
      
      if (error?.response?.data?.message) {
        // Handle axios error response
        const apiError = error.response.data.message;
        if (apiError.toLowerCase().includes('duplicate') || 
            apiError.toLowerCase().includes('already exists') ||
            apiError.toLowerCase().includes('already in use') ||
            apiError.toLowerCase().includes('already present')) {
          errorMessage = 'An agent with this information already exists. Please check the details or use a different agent.';
        } else {
          errorMessage = apiError;
        }
      } else if (error?.message) {
        const message = error.message.toLowerCase();
        if (message.includes('duplicate') || 
            message.includes('already exists') ||
            message.includes('already in use') ||
            message.includes('already present')) {
          errorMessage = 'An agent with this information already exists. Please check the details or use a different agent.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  const handleAgentSelect = (item: any) => {
    setSelectedAgent(item);
    
    // Pre-fill form data based on selected agent
    if (selectedAgentType === 'student') {
      const firstName = item.studentFirstName || item.studentFirstname || item.firstName || item.first_name || '';
      const lastName = item.studentLastName || item.studentLastname || item.lastName || item.last_name || '';
      
      setAgentFormData({
        agentName: firstName,
        agentLastName: lastName,
        agentEmail: item.studentEmail || item.email || '',
        agentContact: item.studentContact || item.phoneNumber || '',
      });
      
      console.log('🔍 handleAgentSelect - Student Form Data:', {
        firstName,
        lastName,
        agentName: firstName,
        agentLastName: lastName,
        item
      });
         } else if (selectedAgentType === 'teacher') {
           console.log('🔍 handleAgentSelect - Teacher Data:', {
             teacherFirstName: item.teacherFirstName,
             teacherLastName: item.teacherLastName,
             teacherEmail: item.teacherEmail,
             teacherPhoneNumber: item.teacherPhoneNumber,
             teacherContact: item.teacherContact,
             phoneNumber: item.phoneNumber
           });
           
           setAgentFormData({
             agentName: item.teacherFirstName || '',
             agentLastName: item.teacherLastName || '',
             agentEmail: item.teacherEmail || item.email || '',
             agentContact: item.teacherPhoneNumber || item.teacherContact || item.phoneNumber || '',
           });
           
           console.log('🔍 handleAgentSelect - Form Data Set for Teacher:', {
             agentName: item.teacherFirstName || '',
             agentLastName: item.teacherLastName || '',
             agentEmail: item.teacherEmail || item.email || '',
             agentContact: item.teacherPhoneNumber || item.teacherContact || item.phoneNumber || '',
             finalAgentContact: item.teacherPhoneNumber || item.teacherContact || item.phoneNumber || ''
           });
         } else if (selectedAgentType === 'employee') {
      console.log('🔍 handleAgentSelect - Employee Data:', {
        employeePersonalDetails: item?.employeePersonalDetails,
        employeeFirstname: item?.employeePersonalDetails?.employeeFirstname,
        employeeLastname: item?.employeePersonalDetails?.employeeLastname,
        employeePhoneNumber: item?.employeePersonalDetails?.employeePhoneNumber,
        employeeContact: item?.employeePersonalDetails?.employeeContact,
        employeeEmail: item?.employeePersonalDetails?.employeeEmail,
        fullItem: item
      });
      
      setAgentFormData({
        agentName: item?.employeePersonalDetails?.employeeFirstname || item.employeeFirstName || '',
        agentLastName: item?.employeePersonalDetails?.employeeLastname || item.employeeLastName || '',
        agentEmail: item?.employeePersonalDetails?.employeeEmail || item.employeeEmail || item.email || '',
        agentContact: item?.employeePersonalDetails?.employeePhoneNumber || item?.employeePersonalDetails?.employeeContact || item.employeeContact || item.phoneNumber || '',
      });
      
      console.log('🔍 Form Data Set for Employee:', {
        agentName: item?.employeePersonalDetails?.employeeFirstname || item.employeeFirstName || '',
        agentLastName: item?.employeePersonalDetails?.employeeLastname || item.employeeLastName || '',
        agentEmail: item?.employeePersonalDetails?.employeeEmail || item.employeeEmail || item.email || '',
        agentContact: item?.employeePersonalDetails?.employeePhoneNumber || item?.employeePersonalDetails?.employeeContact || item.employeeContact || item.phoneNumber || '',
        finalAgentContact: item?.employeePersonalDetails?.employeePhoneNumber || item?.employeePersonalDetails?.employeeContact || item.employeeContact || item.phoneNumber || ''
      });
    } else {
      setAgentFormData({
        agentName: item.agentName || '',
        agentLastName: item.agentLastName || '',
        agentEmail: item.agentEmail || '',
        agentContact: item.agentContact || '',
      });
    }
    
    setShowAddAgentForm(true);
  };

  const handleDropdownSelection = (value: string) => {
    console.log('🔍 Dropdown Selection:', {
      selectedValue: value,
      dynamicListLength: dynamicList.length,
      selectedAgentType
    });
    
    const selectedItem = dynamicList.find((item: any) => 
      getItemId(item) === value
    );
    
    console.log('🔍 Selected Item:', {
      selectedItem,
      hasStudentId: !!selectedItem?.studentId,
      hasId: !!selectedItem?.id,
      studentFirstName: selectedItem?.studentFirstName,
      studentLastName: selectedItem?.studentLastName,
      // Check all possible student ID fields
      possibleIds: {
        id: selectedItem?.id,
        studentId: selectedItem?.studentId,
        student_id: selectedItem?.student_id,
        studentID: selectedItem?.studentID
      },
      // Check all possible name fields
      possibleNames: {
        studentFirstName: selectedItem?.studentFirstName,
        studentFirstname: selectedItem?.studentFirstname,
        firstName: selectedItem?.firstName,
        first_name: selectedItem?.first_name,
        studentLastName: selectedItem?.studentLastName,
        studentLastname: selectedItem?.studentLastname,
        lastName: selectedItem?.lastName,
        last_name: selectedItem?.last_name
      }
    });
    
    if (selectedItem) {
      setSelectedAgentFromDropdown(selectedItem);
      setSelectedAgent(selectedItem); // Set the selected agent immediately
      
      // Pre-fill form data based on selected agent
      if (selectedAgentType === 'student') {
        const firstName = selectedItem.studentFirstName || selectedItem.studentFirstname || selectedItem.firstName || selectedItem.first_name || '';
        const lastName = selectedItem.studentLastName || selectedItem.studentLastname || selectedItem.lastName || selectedItem.last_name || '';
        
        setAgentFormData({
          agentName: firstName,
          agentLastName: lastName,
          agentEmail: selectedItem.studentEmail || selectedItem.email || '',
          agentContact: selectedItem.studentContact || selectedItem.phoneNumber || '',
        });
        
        console.log('🔍 Form Data Pre-filled for Student:', {
          firstName,
          lastName,
          agentName: firstName,
          agentLastName: lastName,
          selectedItem
        });
              } else if (selectedAgentType === 'teacher') {
          console.log('🔍 Teacher Data for Form:', {
            teacherFirstName: selectedItem.teacherFirstName,
            teacherLastName: selectedItem.teacherLastName,
            teacherEmail: selectedItem.teacherEmail,
            teacherPhoneNumber: selectedItem.teacherPhoneNumber,
            teacherContact: selectedItem.teacherContact,
            phoneNumber: selectedItem.phoneNumber
          });
          
          setAgentFormData({
            agentName: selectedItem.teacherFirstName || '',
            agentLastName: selectedItem.teacherLastName || '',
            agentEmail: selectedItem.teacherEmail || selectedItem.email || '',
            agentContact: selectedItem.teacherPhoneNumber || selectedItem.teacherContact || selectedItem.phoneNumber || '',
          });
          
          console.log('🔍 Form Data Set for Teacher:', {
            agentName: selectedItem.teacherFirstName || '',
            agentLastName: selectedItem.teacherLastName || '',
            agentEmail: selectedItem.teacherEmail || selectedItem.email || '',
            agentContact: selectedItem.teacherPhoneNumber || selectedItem.teacherContact || selectedItem.phoneNumber || '',
            finalAgentContact: selectedItem.teacherPhoneNumber || selectedItem.teacherContact || selectedItem.phoneNumber || ''
          });
        } else if (selectedAgentType === 'employee') {
          console.log('🔍 Employee Data for Form:', {
            employeePersonalDetails: selectedItem?.employeePersonalDetails,
            nestedFirstname: selectedItem?.employeePersonalDetails?.employeeFirstname,
            nestedLastname: selectedItem?.employeePersonalDetails?.employeeLastname,
            nestedContact: selectedItem?.employeePersonalDetails?.employeeContact,
            nestedEmail: selectedItem?.employeePersonalDetails?.employeeEmail,
            directFirstName: selectedItem?.employeeFirstName,
            directLastName: selectedItem?.employeeLastName,
            directEmail: selectedItem?.employeeEmail,
            directContact: selectedItem?.employeeContact,
            phoneNumber: selectedItem?.phoneNumber,
            fullItem: selectedItem
          });
          
          setAgentFormData({
            agentName: selectedItem?.employeePersonalDetails?.employeeFirstname || selectedItem.employeeFirstName || '',
            agentLastName: selectedItem?.employeePersonalDetails?.employeeLastname || selectedItem.employeeLastName || '',
            agentEmail: selectedItem?.employeePersonalDetails?.employeeEmail || selectedItem.employeeEmail || selectedItem.email || '',
            agentContact: selectedItem?.employeePersonalDetails?.employeePhoneNumber || selectedItem?.employeePersonalDetails?.employeeContact || selectedItem.employeeContact || selectedItem.phoneNumber || '',
          });
          
          console.log('🔍 Form Data Set for Employee:', {
            agentName: selectedItem?.employeePersonalDetails?.employeeFirstname || selectedItem.employeeFirstName || '',
            agentLastName: selectedItem?.employeePersonalDetails?.employeeLastname || selectedItem.employeeLastName || '',
            agentEmail: selectedItem?.employeePersonalDetails?.employeeEmail || selectedItem.employeeEmail || selectedItem.email || '',
            agentContact: selectedItem?.employeePersonalDetails?.employeePhoneNumber || selectedItem?.employeePersonalDetails?.employeeContact || selectedItem.employeeContact || selectedItem.phoneNumber || '',
            finalAgentContact: selectedItem?.employeePersonalDetails?.employeePhoneNumber || selectedItem?.employeePersonalDetails?.employeeContact || selectedItem.employeeContact || selectedItem.phoneNumber || ''
          });
        } else {
        setAgentFormData({
          agentName: selectedItem.agentName || '',
          agentLastName: selectedItem.agentLastName || '',
          agentEmail: selectedItem.agentEmail || '',
          agentContact: selectedItem.agentContact || '',
        });
      }
      
      // Auto-proceed to form after a short delay
      setTimeout(() => {
        setShowAddAgentForm(true);
      }, 500);
    }
  };

  const resetForm = () => {
    setSelectedAgentType('');
    setShowAgentList(false);
    setShowAddAgentForm(false);
    setSelectedAgent(null);
    setSelectedAgentFromDropdown(null);
    setAgentFormData({
      agentName: '',
      agentLastName: '',
      agentEmail: '',
      agentContact: '',
    });
  };

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  // Debug: Monitor agentFormData changes
  useEffect(() => {
    console.log('🔍 agentFormData changed:', agentFormData);
  }, [agentFormData]);

  // Debug: Log form display data
  useEffect(() => {
    if (showAddAgentForm) {
      console.log('🔍 Form Display - Current Form Data:', {
        selectedAgentType,
        selectedAgent,
        agentFormData,
        showAddAgentForm
      });
    }
  }, [showAddAgentForm, selectedAgentType, selectedAgent, agentFormData]);

  // Remove the problematic formKey logic that causes re-renders
  // const [formKey, setFormKey] = useState(0);
  
  // useEffect(() => {
  //   if (agentFormData.agentContact) {
  //     setFormKey(prev => prev + 1);
  //   }
  // }, [agentFormData.agentContact]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              {showAgentList && !showAddAgentForm && selectedAgentType !== 'other' ? (
                <>
                  <TouchableOpacity
                    style={styles.headerBackButton}
                    onPress={() => setShowAgentList(false)}
                  >
                    <Text style={styles.backButtonText}>←</Text>
                  </TouchableOpacity>
                  <ScalableText style={styles.modalTitle} fontFamily="Medium">
                    Select your agent
                  </ScalableText>
                </>
              ) : (
                <ScalableText style={styles.modalTitle} fontFamily="Medium">
                  {showAddAgentForm ? (selectedAgentType === 'other' ? 'Create your agent' : 'Add New Agent') : 'Choose your agent type'}
                </ScalableText>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {!showAddAgentForm && !showAgentList ? (
              <>
                {/* Step 1: Agent Type Selection */}
                <View style={styles.agentTypesContainer}>
                  {AGENT_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={styles.agentTypeButton}
                      onPress={() => handleAgentTypeSelect(type.id)}
                    >
                      <Text style={styles.agentTypeIcon}>{type.icon}</Text>
                      <ScalableText style={styles.agentTypeLabel} fontFamily="Medium">
                        {type.label}
                      </ScalableText>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Data Source Info */}
                {/* <View style={styles.dataSourceInfo}>
                  <ScalableText style={styles.dataSourceText} fontFamily="Regular">
                    📊 Data fetched dynamically from APIs
                  </ScalableText>
                </View> */}
              </>
            ) : showAgentList && !showAddAgentForm && selectedAgentType !== 'other' ? (
              <>
                {/* Step 2: Agent List for Selected Type */}
                <View style={styles.agentListHeader}>
                  <ScalableText style={styles.agentTypeTitle} fontFamily="Medium">
                    {AGENT_TYPES.find(t => t.id === selectedAgentType)?.label}s
                  </ScalableText>
                </View>

                <View style={styles.agentsListContainer}>
                  <View style={styles.sectionHeader}>
                    {/* <ScalableText style={styles.sectionTitle} fontFamily="Medium">
                      Select {AGENT_TYPES.find(t => t.id === selectedAgentType)?.label}
                    </ScalableText> */}
                    <View style={styles.headerButtons}>
                      {/* <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={() => {
                          if (selectedAgentType === 'student') {
                            refetchStudents();
                          } else if (selectedAgentType === 'teacher') {
                            refetchTeachers();
                          } else if (selectedAgentType === 'employee') {
                            refetchEmployees();
                          }
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                          <Text style={styles.refreshButtonText}>🔄</Text>
                        )}
                      </TouchableOpacity> */}
                      {/* Only show Add New button for "Other" agent type */}
                      {selectedAgentType === 'other' ? (
                        <TouchableOpacity
                          style={styles.addNewButton}
                          onPress={() => {
                            setSelectedAgent(null);
                            setSelectedAgentFromDropdown(null);
                            setAgentFormData({
                              agentName: '',
                              agentLastName: '',
                              agentEmail: '',
                              agentContact: '',
                            });
                            setShowAddAgentForm(true);
                          }}
                        >
                          <Text style={styles.addNewButtonText}>+ Add New</Text>
                        </TouchableOpacity>
                      ) : (
                        <View>
                          {/* <ScalableText style={styles.infoText} fontFamily="Regular">
                            💡 {AGENT_TYPES.find(t => t.id === selectedAgentType)?.label}s are managed separately
                          </ScalableText> */}
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={COLORS.primary} />
                      <ScalableText style={styles.loadingText} fontFamily="Regular">
                        Loading {AGENT_TYPES.find(t => t.id === selectedAgentType)?.label}s...
                      </ScalableText>
                    </View>
                  ) : dynamicList.length > 0 ? (
                    <>
                      {/* Dropdown for selecting agent */}
                      <View style={styles.dropdownContainer}>
                        <SelectDropdown
                          label={`Select ${AGENT_TYPES.find(t => t.id === selectedAgentType)?.label}`}
                          options={getDropdownOptions()}
                          onChange={handleDropdownSelection}
                                                                        value={selectedAgentFromDropdown ? {
                                label: getDisplayName(selectedAgentFromDropdown),
                                value: getItemId(selectedAgentFromDropdown)
                              } : { label: '', value: '' }}
                        />
                      </View>
                      

                    </>
                  ) : (
                    <View style={styles.noAgentsContainer}>
                      <ScalableText style={styles.noAgentsText} fontFamily="Regular">
                        {selectedAgentType === 'other' 
                          ? `No ${AGENT_TYPES.find(t => t.id === selectedAgentType)?.label}s found`
                          : `No ${AGENT_TYPES.find(t => t.id === selectedAgentType)?.label}s available in the system`
                        }
                      </ScalableText>
                      {/* Only show Add First button for "Other" agent type */}
                      {selectedAgentType === 'other' && (
                        <TouchableOpacity
                          style={styles.addFirstAgentButton}
                          onPress={() => {
                            setSelectedAgent(null);
                            setSelectedAgentFromDropdown(null);
                            setAgentFormData({
                              agentName: '',
                              agentLastName: '',
                              agentEmail: '',
                              agentContact: '',
                            });
                            setShowAddAgentForm(true);
                          }}
                        >
                          <Text style={styles.addFirstAgentButtonText}>Add First {AGENT_TYPES.find(t => t.id === selectedAgentType)?.label}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </>
            ) : (
            /* Add Agent Form */
            <View key={`form-${selectedAgentType}-${selectedAgent?.teacherId || selectedAgent?.agentId || 'new'}`} style={styles.addAgentForm}>
              <View style={styles.formHeader}>
                <ScalableText style={styles.formTitle} fontFamily="Medium">
                  {selectedAgentType === 'other' ? 'Create New Agent' : (selectedAgent ? 'Confirm Agent Details' : 'Add New Agent')}
                </ScalableText>
              </View>


              
              {selectedAgent && selectedAgentType !== 'other' ? (
                // Confirm Agent Details UI - Read-only display
                <View style={styles.confirmAgentDetails}>
                  <View style={styles.confirmField}>
                    <ScalableText style={styles.confirmLabel} fontFamily="Medium">
                      Name
                    </ScalableText>
                    <View style={styles.confirmValueContainer}>
                      <ScalableText style={styles.confirmValue} fontFamily="Regular">
                        {agentFormData.agentName} {agentFormData.agentLastName}
                      </ScalableText>
                    </View>
                  </View>

                  <View style={styles.confirmField}>
                    <ScalableText style={styles.confirmLabel} fontFamily="Medium">
                      Phone Number
                    </ScalableText>
                    <View style={styles.confirmValueContainer}>
                      <ScalableText style={styles.confirmValue} fontFamily="Regular">
                        {agentFormData.agentContact}
                      </ScalableText>
                    </View>
                  </View>

                  <View style={styles.confirmField}>
                    <ScalableText style={styles.confirmLabel} fontFamily="Medium">
                      Email
                    </ScalableText>
                    <View style={styles.confirmValueContainer}>
                      <ScalableText style={styles.confirmValue} fontFamily="Regular">
                        {agentFormData.agentEmail || 'Not provided'}
                      </ScalableText>
                    </View>
                  </View>

                  <View style={styles.confirmField}>
                    <ScalableText style={styles.confirmLabel} fontFamily="Medium">
                      Agent Type
                    </ScalableText>
                    <View style={styles.confirmValueContainer}>
                      <ScalableText style={styles.confirmValue} fontFamily="Regular">
                        {AGENT_TYPES.find(t => t.id === selectedAgentType)?.label}
                      </ScalableText>
                    </View>
                  </View>
                </View>
              ) : (
                // Regular form fields for "Other" agent type or new agent
                <>
                  <View style={styles.formField}>
                    <ScalableText style={styles.formLabel} fontFamily="Medium">
                      Name *
                    </ScalableText>
                    <TextInput
                      style={styles.formInput}
                      value={agentFormData.agentName}
                      onChangeText={(text) => setAgentFormData(prev => ({ ...prev, agentName: text }))}
                      placeholder="Enter agent name"
                    />
                  </View>

                  <View style={styles.formField}>
                    <ScalableText style={styles.formLabel} fontFamily="Medium">
                      Last Name
                    </ScalableText>
                    <TextInput
                      style={styles.formInput}
                      value={agentFormData.agentLastName}
                      onChangeText={(text) => setAgentFormData(prev => ({ ...prev, agentLastName: text }))}
                      placeholder="Enter last name"
                    />
                  </View>

                  <View style={styles.formField}>
                    <ScalableText style={styles.formLabel} fontFamily="Medium">
                      Phone Number *
                    </ScalableText>
                    <TextInput
                      style={styles.formInput}
                      value={agentFormData.agentContact}
                      onChangeText={(text) => setAgentFormData(prev => ({ ...prev, agentContact: text }))}
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>

                  <View style={styles.formField}>
                    <ScalableText style={styles.formLabel} fontFamily="Medium">
                      Email
                    </ScalableText>
                    <TextInput
                      style={styles.formInput}
                      value={agentFormData.agentEmail}
                      onChangeText={(text) => setAgentFormData(prev => ({ ...prev, agentEmail: text }))}
                      placeholder="Enter email address"
                      keyboardType="email-address"
                    />
                  </View>
                </>
              )}

              <View style={styles.formButtons}>
                {selectedAgentType === 'other' ? (
                  // For "Other" agent type: Back and Create Agent buttons
                  <>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => {
                        setShowAddAgentForm(false);
                        setSelectedAgentType('');
                      }}
                    >
                      <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addAgentButton}
                      onPress={handleAddAgent}
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                      ) : (
                        <Text style={styles.addAgentButtonText}>Create Agent</Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  // For other agent types: Back and Add Agent buttons
                  <>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => setShowAddAgentForm(false)}
                    >
                      <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addAgentButton}
                      onPress={handleAddAgent}
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                      ) : (
                        <Text style={styles.addAgentButtonText}>Add Agent</Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    color: COLORS.black,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  agentTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  agentTypeButton: {
    width: (Dimensions.get('window').width * 0.9 - 48 - 36) / 2,
    aspectRatio: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  selectedAgentType: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F8FF',
  },
  agentTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  agentTypeLabel: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: 'center',
  },
  agentsListContainer: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.black,
  },
  addNewButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addNewButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  agentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 4,
  },
  agentContact: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  agentEmail: {
    fontSize: 12,
    color: '#666',
  },
  selectArrow: {
    fontSize: 18,
    color: COLORS.primary,
  },
  noAgentsContainer: {
    alignItems: 'center',
    padding: 24,
  },
  noAgentsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  addFirstAgentButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstAgentButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  addAgentForm: {
    marginTop: 16,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 8,
  },
  formInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
  },
  readOnlyInput: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E0E0E0',
    color: '#666',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  backButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  addAgentButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAgentButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 16,
  },
  dataSourceInfo: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  dataSourceText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  agentListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  agentTypeTitle: {
    fontSize: 18,
    color: COLORS.black,
    flex: 1,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  formTitle: {
    fontSize: 18,
    color: COLORS.black,
    flex: 1,
  },
  selectedAgentInfo: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  selectedAgentLabel: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 4,
  },
  selectedAgentTypeText: {
    fontSize: 12,
    color: '#666',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  selectedAgentPreview: {
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  selectedAgentPreviewTitle: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 12,
  },
  selectedAgentPreviewInfo: {
    marginBottom: 16,
  },
  selectedAgentPreviewName: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 8,
  },
  selectedAgentPreviewContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  selectedAgentPreviewEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  proceedButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  infoContainer: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    padding: 8,
    borderRadius: 6,
  },
  infoText: {
    fontSize: 11,
    color: '#856404',
    fontStyle: 'italic',
  },
  autoProceedInfo: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  autoProceedText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
  confirmAgentDetails: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  confirmField: {
    marginBottom: 12,
  },
  confirmLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  confirmValueContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
  },
  confirmValue: {
    fontSize: 16,
    color: COLORS.black,
  },
});

export default AgentSelectionModal;
