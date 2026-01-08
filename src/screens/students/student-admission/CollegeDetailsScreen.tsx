import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, Dimensions, ScrollView, Alert, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useForm } from 'react-hook-form';
import Input from '../../../@ui/input/Input';
import Button from '../../../@ui/button/Button';
import ScalableText from '../../../@ui/scalable-text/ScalableText';
import { useNavigation } from '@react-navigation/native';
import { useStudentAdmission } from './StudentAdmissionContext';
import { useNavigationConfirmation } from './hooks/useNavigationConfirmation';
import ControlledSelect from '../../../@ui/controlled-select/ControlledSelect';
import HybridInput from '../../../@ui/hybrid-input/HybridInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { collegeDetailsValidation } from './validation/collegeDetails.validation';
import { useGetStatesCitiesQuery } from '../../../apis/hooks/college/useGetStatesCities.query';
import { useCollegeListQuery } from '../../../apis/hooks/college/useCollegeList.query';
import { useCreateCollegeMutation } from '../../../apis/hooks/college/mutation/useCreateCollege.mutation';
import { STATES_CITIES } from '../../../data/indiaStatesCities';
import SafeView from '../../../@ui/safe-view/SafeView';
import AppHeader from '../../../@ui/app-header/AppHeader';
import ThemeScrollView from '../../../@ui/theme-scroll-view/ThemeScrollView';
import { COLORS } from '../../../colors';
import AutoHeightImage from '../../../@ui/auto-height-image/AutoHeightImage';
import { IMAGES } from '../../../images';

const CollegeDetailsScreen = () => {
  const { data, updateStepData } = useStudentAdmission();
  const { goBackWithConfirmation } = useNavigationConfirmation();
  const handler = useForm({ 
    defaultValues: {
      state: data.state || '',
      city: data.city || '',
      collegeName: data.collegeName || '',
      departmentName: data.departmentName || '',
      collegeCourse: data.collegeCourse || '',
      collegeSemester: data.collegeSemester || '',
    }, 
    resolver: yupResolver(collegeDetailsValidation) 
  });
  const navigation = useNavigation<any>();
  const [selectedState, setSelectedState] = React.useState(data.state || '');
  const [selectedCity, setSelectedCity] = React.useState(data.city || '');
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  // Reset form when data is empty (after skip)
  React.useEffect(() => {
    if (!data.state && !data.city && !data.collegeName && !data.departmentName && !data.collegeCourse && !data.collegeSemester) {
      handler.reset({
        state: '',
        city: '',
        collegeName: '',
        departmentName: '',
        collegeCourse: '',
        collegeSemester: '',
      });
      setSelectedState('');
      setSelectedCity('');
    }
  }, [data, handler]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);



  // API hooks - Sequential data loading
  const { data: statesCitiesData, isLoading: statesCitiesLoading, refetch: refetchStatesCities } = useGetStatesCitiesQuery();
  const { data: collegeListData, isLoading: collegeListLoading, refetch: refetchColleges } = useCollegeListQuery(
    selectedState && selectedCity ? { state: selectedState, city: selectedCity } : undefined
  );
  const { mutateAsync: createCollege, isPending: isCreating } = useCreateCollegeMutation();

  // Extract unique suggestions from API
  const collegeNames = React.useMemo(() => {
    if (!collegeListData?.data || !Array.isArray(collegeListData.data)) {
      return [];
    }
    
    return [...new Set(collegeListData.data.map((c: any) => c.collegeName).filter(Boolean))] as string[];
  }, [collegeListData]);
  
  // Get departments for selected college only
  const collegeDepartments = React.useMemo(() => {
    if (!collegeListData?.data || !Array.isArray(collegeListData.data) || !handler.watch('collegeName')) {
      return [];
    }
    
    // Find the selected college
    const selectedCollege = collegeListData.data.find((college: any) => college.collegeName === handler.watch('collegeName'));
    
    if (!selectedCollege || !selectedCollege.departments) {
      return [];
    }
    
    // Extract departments from selected college only
    const departments: string[] = [];
    selectedCollege.departments.forEach((dept: any) => {
      if (dept.departmentName && !departments.includes(dept.departmentName)) {
        departments.push(dept.departmentName);
      }
    });
    
    return departments;
  }, [collegeListData, handler.watch('collegeName')]);
  
  // Get courses for selected department only
  const collegeCourses = React.useMemo(() => {
    if (!collegeListData?.data || !Array.isArray(collegeListData.data) || !handler.watch('collegeName') || !handler.watch('departmentName')) {
      return [];
    }
    
    // Find the selected college
    const selectedCollege = collegeListData.data.find((college: any) => college.collegeName === handler.watch('collegeName'));
    
    if (!selectedCollege || !selectedCollege.departments) {
      return [];
    }
    
    // Find the selected department
    const selectedDepartment = selectedCollege.departments.find((dept: any) => dept.departmentName === handler.watch('departmentName'));
    
    if (!selectedDepartment || !selectedDepartment.courses) {
      return [];
    }
    
    // Extract courses from selected department only
    const courses: string[] = [];
    selectedDepartment.courses.forEach((course: any) => {
      if (course.coursesName && !courses.includes(course.coursesName)) {
        courses.push(course.coursesName);
      }
    });
    
    return courses;
  }, [collegeListData, handler.watch('collegeName'), handler.watch('departmentName')]);

  // Filter suggestions based on current input values
  const filteredCollegeNames = collegeNames.filter((name: string) =>
    name.toLowerCase().includes(handler.watch('collegeName')?.toLowerCase() || '')
  );
  const filteredDepartments = collegeDepartments.filter((dep: string) =>
    dep.toLowerCase().includes(handler.watch('departmentName')?.toLowerCase() || '')
  );
  const filteredCourses = collegeCourses.filter((course: string) =>
    course.toLowerCase().includes(handler.watch('collegeCourse')?.toLowerCase() || '')
  );

  // Debug: Log college list API response and extracted data
  React.useEffect(() => {
    if (collegeListData) {
      console.log('College List API Response:', collegeListData);
      console.log('College List Data Structure:', {
        hasData: !!collegeListData.data,
        isArray: Array.isArray(collegeListData.data),
        length: Array.isArray(collegeListData.data) ? collegeListData.data.length : 'Not array',
        statusCode: collegeListData.statuscode,
        message: collegeListData.message
      });
      
      // Debug extracted data
      console.log('Extracted College Names:', collegeNames);
      console.log('Extracted Departments (for selected college):', collegeDepartments);
      console.log('Extracted Courses (for selected department):', collegeCourses);
      console.log('Filtered College Names:', filteredCollegeNames);
      console.log('Filtered Departments:', filteredDepartments);
      console.log('Filtered Courses:', filteredCourses);
      
      // Debug dropdown visibility
      console.log('Dropdown Debug:', {
        collegeNamesLength: collegeNames.length,
        collegeDepartmentsLength: collegeDepartments.length,
        collegeCoursesLength: collegeCourses.length,
        selectedCollege: handler.watch('collegeName'),
        selectedDepartment: handler.watch('departmentName'),
        shouldShowDropdown: collegeNames.length > 0
      });
    }
  }, [collegeListData, collegeNames, collegeDepartments, collegeCourses, filteredCollegeNames, filteredDepartments, filteredCourses]);

  // Additional debug logs for dropdown states
  React.useEffect(() => {
    console.log('Dropdown States Debug:', {
      collegeNamesLength: collegeNames.length,
      collegeDepartmentsLength: collegeDepartments.length,
      collegeCoursesLength: collegeCourses.length,
      selectedCollege: handler.watch('collegeName'),
      selectedDepartment: handler.watch('departmentName'),
      selectedCourse: handler.watch('collegeCourse')
    });
  }, [collegeNames, collegeDepartments, collegeCourses, handler.watch('collegeName'), handler.watch('departmentName'), handler.watch('collegeCourse')]);

  // Generate state and city options from static data with API fallback
  const stateOptions = React.useMemo(() => {
    console.log('Generating state options...');
    
    // Always use static data first for complete list
    const staticStateOptions = STATES_CITIES.map((state: any) => ({ 
      label: state.state, 
      value: state.state 
    }));
    
    console.log('Static state options:', staticStateOptions.length);
    
    // If API data is available, merge with static data (avoid duplicates)
    if (statesCitiesData?.data && Array.isArray(statesCitiesData.data)) {
      const apiStates = new Set<string>();
      statesCitiesData.data.forEach((college: any) => {
        if (college.state) {
          apiStates.add(college.state);
        }
      });
      
      // Add any API states that are not in static data
      apiStates.forEach((apiState: string) => {
        const exists = staticStateOptions.some((option: any) => option.value === apiState);
        if (!exists) {
          staticStateOptions.push({ label: apiState, value: apiState });
        }
      });
      
      console.log('Merged with API states, total:', staticStateOptions.length);
    }
    
    return staticStateOptions;
  }, [statesCitiesData]);
  
  const cityOptions = React.useMemo(() => {
    console.log('Generating city options for state:', selectedState);
    
    if (!selectedState) {
      return [];
    }
    
    // Always use static data first for complete list
    const staticStateData = STATES_CITIES.find((state: any) => state.state === selectedState);
    let cityOptions: Array<{label: string, value: string}> = [];
    
    if (staticStateData && staticStateData.cities) {
      cityOptions = staticStateData.cities.map((city: string) => ({ 
        label: city, 
        value: city 
      }));
      console.log('Static city options for', selectedState, ':', cityOptions.length);
    }
    
    // If API data is available, merge with static data (avoid duplicates)
    if (statesCitiesData?.data && Array.isArray(statesCitiesData.data)) {
      const apiCities = new Set<string>();
      statesCitiesData.data.forEach((college: any) => {
        if (college.state === selectedState && college.city) {
          apiCities.add(college.city);
        }
      });
      
      // Add any API cities that are not in static data
      apiCities.forEach((apiCity: string) => {
        const exists = cityOptions.some((option: any) => option.value === apiCity);
        if (!exists) {
          cityOptions.push({ label: apiCity, value: apiCity });
        }
      });
      
      console.log('Merged with API cities for', selectedState, ', total:', cityOptions.length);
    }
    
    return cityOptions;
  }, [statesCitiesData, selectedState]);

  // Debug useEffect for statesCitiesData
  React.useEffect(() => {
    console.log('=== STATES CITIES API DEBUG ===');
    console.log('statesCitiesData:', statesCitiesData);
    console.log('statesCitiesLoading:', statesCitiesLoading);
    console.log('stateOptions length:', stateOptions.length);
    console.log('cityOptions length:', cityOptions.length);
    console.log('selectedState:', selectedState);
    console.log('selectedCity:', selectedCity);
    
    // Test static data
    console.log('Static STATES_CITIES length:', STATES_CITIES.length);
    console.log('First static state:', STATES_CITIES[0]);
    
    // Test API response structure
    if (statesCitiesData) {
      console.log('API Response Structure:', {
        hasData: !!statesCitiesData.data,
        isArray: Array.isArray(statesCitiesData.data),
        hasDataData: !!statesCitiesData.data?.data,
        isDataDataArray: Array.isArray(statesCitiesData.data?.data),
        statusCode: statesCitiesData.statuscode,
        message: statesCitiesData.message
      });
    }
    
    console.log('=== END DEBUG ===');
  }, [statesCitiesData, statesCitiesLoading, stateOptions, cityOptions, selectedState, selectedCity]);

  // Trigger college list API call when state or city changes
  React.useEffect(() => {
    if (selectedState && selectedCity) {
      console.log('State or city changed, triggering college list API call for:', selectedState, selectedCity);
      // The useCollegeListQuery will automatically refetch when the parameters change
    }
  }, [selectedState, selectedCity]);

  const onNext = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      // Check if we need to create college first
      const needsCollegeCreation = selectedState && selectedCity && 
                                 values.collegeName && values.departmentName && values.collegeCourse;
      
      if (needsCollegeCreation) {
        // Try to create college first
        try {
          const payload = {
            state: selectedState,
            city: selectedCity,
            collegeName: values.collegeName,
            departments: [
              {
                departmentName: values.departmentName,
                courses: [
                  {
                    coursesName: values.collegeCourse
                  }
                ]
              }
            ]
          };

          const response = await createCollege(payload);
          
          if (response.data && response.data.collegeId) {
            console.log('College created successfully before proceeding');
            // Refresh college list
            refetchColleges();
          } else {
            console.log('College creation failed, but proceeding anyway:', response.message);
          }
        } catch (error) {
          console.log('Error creating college, but proceeding anyway:', error);
          // Continue with form submission even if college creation fails
        }
      }
      
      // Update context with form data
      updateStepData(values);
      
      // Clear form changes flag since we're proceeding to next step
      updateStepData({});
      
      navigation.navigate('CourseBatch');
    } catch (error) {
      console.error('Error proceeding to next step:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSkip = () => {
    // Reset selected state first
    setSelectedState('');
    setSelectedCity('');
    
    // Clear all form data when skipping
    handler.reset({
      state: '',
      city: '',
      collegeName: '',
      departmentName: '',
      collegeCourse: '',
      collegeSemester: '',
    });
    
    // Clear context data for this step
    updateStepData({
      state: '',
      city: '',
      collegeName: '',
      departmentName: '',
      collegeCourse: '',
      collegeSemester: '',
    });
    
    // Clear form changes flag since we're proceeding to next step
    updateStepData({});
    
    // Navigate to next step
    navigation.navigate('CourseBatch');
  };

  const onBack = () => {
    goBackWithConfirmation();
  };

  const closeAllDropdowns = () => {
    setOpenDropdown(null);
    Keyboard.dismiss();
  };





  return (
    <SafeView>
      <AppHeader
        title="College Details"
        showDrawer={false}
        handleBackClick={goBackWithConfirmation}
      />
      {/* <TouchableWithoutFeedback onPress={closeAllDropdowns}> */}
        <View style={styles.screenRoot}>
          <View style={styles.formCard}>
            <ThemeScrollView  contentContainerStyle={{ paddingBottom: 20 }}>
              <ScalableText style={styles.sectionTitle} fontFamily="Medium">
                College Details
              </ScalableText>
              <ScalableText style={styles.stepIndicator} fontFamily="Regular">
                Step 2 of 5 - Enter College Information
              </ScalableText>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                State*
              </ScalableText>
              <HybridInput
                handler={handler}
                name="state"
                label="Enter or select state"
                placeholder="Enter or select state"
                options={stateOptions}
                value={stateOptions.find((opt: any) => opt.value === handler.watch('state')) ? { label: handler.watch('state'), value: handler.watch('state') } : { label: '', value: '' }}
                dropdownButtonStyle={styles.inputContainer}
                onDropdownOpen={() => setOpenDropdown('state')}
                onDropdownClose={() => setOpenDropdown(null)}
                onChangeValue={val => {
                  console.log('State selected:', val);
                  setSelectedState(val);
                  handler.setValue('state', val);
                  setOpenDropdown(null);
                  
                  // Reset all dependent fields when state changes
                  handler.setValue('city', '');
                  setSelectedCity('');
                  handler.setValue('collegeName', '');
                  handler.setValue('departmentName', '');
                  handler.setValue('collegeCourse', '');
                  
                  console.log('State changed to:', val, '- All dependent fields reset');
                }}
              />

            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                City*
              </ScalableText>
              <HybridInput
                handler={handler}
                name="city"
                label="Enter or select city"
                placeholder="Enter or select city"
                options={selectedState ? cityOptions : []}
                value={cityOptions.find((opt: any) => opt.value === handler.watch('city')) ? { label: handler.watch('city'), value: handler.watch('city') } : { label: '', value: '' }}
                dropdownButtonStyle={styles.inputContainer}
                onDropdownOpen={() => setOpenDropdown('city')}
                onDropdownClose={() => setOpenDropdown(null)}
                onChangeValue={val => {
                  console.log('City selected:', val);
                  setSelectedCity(val);
                  handler.setValue('city', val);
                  setOpenDropdown(null);
                  
                  // Reset college-dependent fields when city changes
                  handler.setValue('collegeName', '');
                  handler.setValue('departmentName', '');
                  handler.setValue('collegeCourse', '');
                  
                  console.log('City changed to:', val, '- College fields reset');
                }}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                College Name*
              </ScalableText>
              <HybridInput
                handler={handler}
                name="collegeName"
                label="Enter or select college name"
                placeholder="Enter or select college name"
                options={selectedCity ? collegeNames.map(name => ({ label: name, value: name })) : []}
                value={collegeNames.find(name => name === handler.watch('collegeName')) ? { label: handler.watch('collegeName'), value: handler.watch('city') } : { label: '', value: '' }}
                dropdownButtonStyle={styles.inputContainer}
                onDropdownOpen={() => setOpenDropdown('collegeName')}
                onDropdownClose={() => setOpenDropdown(null)}
                onChangeValue={val => {
                  console.log('College selected:', val);
                  handler.setValue('collegeName', val);
                  setOpenDropdown(null);
                  
                  // Reset department and course when college changes
                  handler.setValue('departmentName', '');
                  handler.setValue('collegeCourse', '');
                  
                  console.log('College changed to:', val, '- Department and Course reset');
                }}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
               College Department*
              </ScalableText>
              <HybridInput
                handler={handler}
                name="departmentName"
                label="Enter or select department name"
                placeholder="Enter or select department name"
                options={handler.watch('collegeName') ? collegeDepartments.map(dept => ({ label: dept, value: dept })) : []}
                value={collegeDepartments.find(dept => dept === handler.watch('departmentName')) ? { label: handler.watch('departmentName'), value: handler.watch('departmentName') } : { label: '', value: '' }}
                dropdownButtonStyle={styles.inputContainer}
                onDropdownOpen={() => setOpenDropdown('departmentName')}
                onDropdownClose={() => setOpenDropdown(null)}
                onChangeValue={val => {
                  console.log('Department selected:', val);
                  handler.setValue('departmentName', val);
                  setOpenDropdown(null);
                  
                  // Reset course when department changes
                  handler.setValue('collegeCourse', '');
                  
                  console.log('Department changed to:', val, '- Course reset');
                  }}
                />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                College Course*
              </ScalableText>
              <HybridInput
                handler={handler}
                name="collegeCourse"
                label="Enter or select course name"
                placeholder="Enter or select course name"
                options={handler.watch('departmentName') ? collegeCourses.map(course => ({ label: course, value: course })) : []}
                value={collegeCourses.find(course => course === handler.watch('collegeCourse')) ? { label: handler.watch('collegeCourse'), value: handler.watch('collegeCourse') } : { label: '', value: '' }}
                dropdownButtonStyle={styles.inputContainer}
                onDropdownOpen={() => setOpenDropdown('collegeCourse')}
                onDropdownClose={() => setOpenDropdown(null)}
                onChangeValue={val => {
                  console.log('Course selected:', val);
                  handler.setValue('collegeCourse', val);
                  setOpenDropdown(null);
                }}
              />
            </View>
            
            <View style={styles.inputSpacing}>
              <ScalableText style={styles.inputLabel} fontFamily="Medium">
                College Semester/Year*
              </ScalableText>
              <Input 
                handler={handler} 
                name="collegeSemester" 
                label="Enter semester/year"
                containerStyles={styles.inputContainer}
                placeholder="Enter semester/year"
              />
            </View>


          </ThemeScrollView>
        </View>
        <View style={styles.buttonBelowCardWrapper}>
          <View style={styles.buttonRow}>
            <Button 
              title="Back" 
              onPress={onBack} 
              btnStyles={styles.backBtn}
              btnTxtStyles={styles.backBtnText}
            />
            <Button 
              title="Skip" 
              onPress={onSkip} 
              btnStyles={styles.skipBtn}
              btnTxtStyles={styles.skipBtnText}
            />
            <Button 
              title={isSubmitting ? "Processing..." : "Next"} 
              onPress={handler.handleSubmit(onNext)} 
              btnStyles={styles.nextBtn}
              btnTxtStyles={styles.nextBtnText}
              disabled={isSubmitting}
            />
          </View>
        </View>
        </View>
      {/* </TouchableWithoutFeedback> */}
      
      {(isSubmitting || collegeListLoading || statesCitiesLoading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ScalableText style={styles.loadingText} fontFamily="Medium">
            {isSubmitting ? "Processing..." : 
             statesCitiesLoading ? "Loading States & Cities..." : 
             collegeListLoading ? "Loading Colleges..." : 
             "Processing..."}
          </ScalableText>
          {collegeListLoading && selectedState && selectedCity && (
            <ScalableText style={{ fontSize: 12, marginTop: 8, color: '#666' }} fontFamily="Regular">
              Loading colleges for {selectedState}, {selectedCity}...
            </ScalableText>
          )}
        </View>
      )}
    </SafeView>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: COLORS.whiteSmoke,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 24,
    marginHorizontal: 8,
    marginTop: 15,
    marginBottom: 0,
    paddingBottom: 0,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    maxHeight: Dimensions.get('window').height * 0.55,
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
    position: 'relative',
  },


  buttonBelowCardWrapper: {
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    gap: 8,
  },
  backBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    minWidth: 0,
  },
  backBtnText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: COLORS.black,
  },
  skipBtn: {
    flex: 1,
    borderRadius: 12,
    minWidth: 0,
  },
  skipBtnText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: COLORS.white,
  },
  nextBtn: {
    flex: 1,
    borderRadius: 12,
    minWidth: 0,
  },
  nextBtnText: {
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
});

export default CollegeDetailsScreen; 