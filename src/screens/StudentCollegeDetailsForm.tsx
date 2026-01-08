import React, { useState, forwardRef, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Autocomplete from '@mui/material/Autocomplete'
import { useForm, Controller } from 'react-hook-form'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { collegeList } from 'src/store/APIs/Api'
import { IconButton } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';



const StudentCollegeDetailsForm = (props: any) => {

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 370
      }
    }
  }

  const { setActiveStep, activeStep, setOpenImageBackPopup } = props
  const [allCollegeList, setAllCollegeList] = useState<any>()
  const [selctedCollege, setSelectedCollege] = useState<any>(null)
  const [selctedDepartment, setSelectedDepartment] = useState<any>(null)
  const [selctedCourse, setSelectedCourse] = useState<any>(null)
  const [allCitiesOfSelectedState, setAllCitiesOfSelectedState] = useState<any>()
  const [allStates, setAllStates] = useState<any>()

  const defaultCollegeValues = {
    collegeName: '',
    departmentName: '',
    collegeCourse: '',
    collegeSemester: '',
    selectedState: '',
    selectedCity: ''
  }

  const collegeSchema = yup.object().shape({
    collegeName: yup.string().trim().max(250, 'Your input is too long. Max(250 characters)').required("This field is required"),
    departmentName: yup.string().trim().max(100, 'Your input is too long. Max(100 characters)').required("This field is required"),
    collegeCourse: yup.string().trim().max(250, 'Your input is too long. Max(250 characters)').required("This field is required"),
    collegeSemester: yup.string().trim().max(50, 'Your input is too long. Max(50 characters)').required("This field is required").test(
      'min-value',
      'Value should be greater than 0',
      value => value !== undefined && value !== "" && parseInt(value, 10) > 0 // Returns true or false
    ),
    selectedState: yup.string().trim().required("This field is required"),
    selectedCity: yup.string().trim().max(100, 'Your input is too long. Max(100 characters)').required("This field is required")
  })

  const {
    reset: collegeReset,
    control: collegeControl,
    getValues: collegeValues,
    watch,
    setValue,
    handleSubmit: handlePersonalSubmit,
    formState: { errors: collegeErrors },
    clearErrors,
  } = useForm({
    defaultValues: defaultCollegeValues,
    resolver: yupResolver(collegeSchema)
  })

  const watchValues = watch()

  let Country = require('country-state-city').Country
  let State = require('country-state-city').State
  let City = require('country-state-city').City
  const countries = Country.getAllCountries()
  const india: any = countries.find((country: any) => country.name === 'India')
  useEffect(() => {
    if (india) {
      const indianStates = State.getStatesOfCountry(india.isoCode)
      setAllStates(indianStates)
    }
  }, [india])

  const onSubmit = () => {
    sessionStorage.setItem('StudentCollegeDetailsForm', JSON.stringify({
      ...collegeValues(),
      college: selctedCollege,
      department: selctedDepartment,
      course: selctedCourse,
      city: allCitiesOfSelectedState,
      states: allStates,
      collegeList: allCollegeList
    }))
    setActiveStep(activeStep + 1)

  }
  useEffect(() => {
    const fetchData = async () => {
      if (watchValues?.selectedState) {
        setAllCollegeList([])
        const selectedStateObject = allStates.find((state: any) => state.name === watchValues?.selectedState)
        if (selectedStateObject) {
          try {
            const citiesInSelectedState = await City.getCitiesOfState('IN', selectedStateObject.isoCode)
            setAllCitiesOfSelectedState(citiesInSelectedState)
          } catch (error) {
            console.error('Error fetching cities:', error)
          }
        }
      }
    }

    fetchData()
  }, [watchValues?.selectedState, allStates])


  useEffect(() => {
    if (sessionStorage.getItem('StudentCollegeDetailsForm') !== null) {
      const StudentCollegeDetailsForm: any = sessionStorage.getItem('StudentCollegeDetailsForm')
      const studentValuesSession: any = JSON.parse(StudentCollegeDetailsForm)
      setValue('selectedState', studentValuesSession.selectedState)
      setValue('selectedCity', studentValuesSession.selectedCity)
      setValue('collegeName', studentValuesSession.collegeName)
      setValue('departmentName', studentValuesSession.departmentName)
      setValue('collegeCourse', studentValuesSession.collegeCourse)
      setValue('collegeSemester', studentValuesSession.collegeSemester)
      setAllStates(studentValuesSession.states)
      setAllCitiesOfSelectedState(studentValuesSession.city)
      setAllCollegeList(studentValuesSession.collegeList)
      setSelectedCourse(studentValuesSession.course)
      setSelectedDepartment(studentValuesSession.department)
      setSelectedCollege(studentValuesSession.college)
    }
  }, [])

  useEffect(() => {

    if (watchValues?.selectedState && watchValues?.selectedCity) {
      collegeList(watchValues?.selectedState, watchValues?.selectedCity).then((res: any) => {
        if (res) {
          setAllCollegeList(res?.data?.data?.filter((e: any) => e.collegeName && e.collegeName.trim() !== '') || [])
        }
      })
    } else {
      setAllCollegeList([])
    }

  }, [watchValues?.selectedCity])

  useEffect(() => {

    if (watchValues?.collegeName) {
      setSelectedDepartment(null)
    }

  }, [watchValues?.collegeName])

  useEffect(() => {

    if (watchValues?.departmentName) {
      setSelectedCourse(null)
    }
  }, [watchValues?.departmentName])

  return (
    <>
      <form key={1} onSubmit={handlePersonalSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
              College Details
            </Typography>
            <Typography variant='caption' component='p'>
              Enter College Information
            </Typography>
          </Grid>
          <Grid xs={12} item sx={{ display: 'flex', gap: '20px', flexDirection: { xs: 'column', sm: 'row' } }}>

            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel
                  id='validation-basic-select'
                  error={Boolean(collegeErrors.selectedState)}
                  htmlFor='validation-basic-select'
                >
                  State *
                </InputLabel>
                <Controller
                  name='selectedState'
                  control={collegeControl}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label='State *'
                      MenuProps={MenuProps}
                      onChange={onChange}
                      error={Boolean(collegeErrors.selectedState)}
                      labelId='validation-basic-select'
                      aria-describedby='validation-basic-select'
                    >
                      {allStates && allStates.length > 0 ? (
                        allStates.map((name: any) => (
                          <MenuItem key={name.name} value={name.name} onClick={() => {
                            setValue('selectedCity', '')
                            setValue('collegeName', '')
                            setValue('collegeCourse', '')
                            setValue('departmentName', '')
                          }}>
                            {name.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          No data found
                        </MenuItem>
                      )}

                    </Select>
                  )}
                />
                {collegeErrors.selectedState && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-selectedState'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name="selectedState"
                  control={collegeControl}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={value}
                      onChange={(event, newValue) => {
                        onChange(newValue); // Update the field value
                        setValue("selectedCity", "");
                        setValue("collegeName", "");
                        setValue("collegeCourse", "");
                        setValue("departmentName", "");
                      }}
                      options={allStates ? allStates.map((state: any) => state.name) : []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="State *"
                          error={Boolean(collegeErrors.selectedState)}
                          helperText={
                            collegeErrors.selectedState
                              ? "This field is required"
                              : ""
                          }
                        />
                      )}
                      // clearOnEscape
                      disableClearable
                    />
                  )}
                />
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='selectedCity'
                  control={collegeControl}
                  render={({ field: { value, onChange } }) => {
                    const [open, setOpen] = useState(false);

                    return (
                      <Autocomplete
                        value={value || ''}
                        onChange={(event, newValue) => {
                          onChange(newValue || '');
                          setValue('collegeName', '');
                          setValue('collegeCourse', '');
                          setValue('departmentName', '');
                        }} // Handle null value
                        options={allCitiesOfSelectedState ? allCitiesOfSelectedState.map((city: any) => city.name) : []}
                        freeSolo
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='City *'
                            error={Boolean(collegeErrors.selectedCity)}
                            aria-describedby='validation-basic-select'
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {params.InputProps.endAdornment}
                                  <IconButton
                                    onClick={() => setOpen(!open)}
                                    edge="end"
                                  >
                                    {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                  </IconButton>
                                </>
                              ),
                            }}
                          />
                        )}
                        inputValue={value}
                        onInputChange={(event, newInputValue) => {
                          setValue('collegeName', '');
                          setValue('collegeCourse', '');
                          setValue('departmentName', '');
                          onChange(newInputValue || '');
                        }} // Handle null value

                        disableClearable
                      />
                    );
                  }}
                />
                {collegeErrors.selectedCity && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-collegeSemester'>
                    {collegeErrors.selectedCity.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

          </Grid>

          <Grid xs={12} item sx={{ display: 'flex', gap: '20px', flexDirection: { xs: 'column', sm: 'row' } }}>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='collegeName'
                  control={collegeControl}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={value || ''}
                      onChange={(event, newValue) => {
                        const selected = allCollegeList.find((college: any) => college.collegeName === newValue) || null;
                        setSelectedCollege(selected);
                        onChange(newValue || '')
                        setValue('collegeCourse', '')
                        setValue('departmentName', '')
                        clearErrors(["departmentName", "collegeCourse"]);
                      }} // Handle null value
                      options={allCollegeList ? allCollegeList.map((e: any) => e.collegeName) : []}
                      freeSolo
                      disabled={!watchValues.selectedCity}
                      clearOnEscape
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='College name *'
                          error={Boolean(collegeErrors.collegeName)}
                          aria-describedby='validation-basic-select'
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {value ? params.InputProps.endAdornment : null}
                              </>
                            ),
                          }}
                        />
                      )}
                      inputValue={value}
                      onInputChange={(event, newInputValue) => {
                        const selected = allCollegeList.find((college: any) => college.collegeName === newInputValue) || null;
                        setSelectedCollege(selected);
                        onChange(newInputValue || '')
                        setValue('collegeCourse', '')
                        setValue('departmentName', '')
                        clearErrors(["departmentName", "collegeCourse"]);
                      }} // Handle null value

                    />
                  )}
                />
                {collegeErrors.collegeName && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-collegeSemester'>
                    {collegeErrors.collegeName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='departmentName'
                  control={collegeControl}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={value || ''}
                      onChange={(event, newValue) => {
                        const selected = selctedCollege?.departments.find((college: any) => college.departmentName === newValue) || null;
                        setSelectedDepartment(selected);
                        onChange(newValue || '')
                        setValue('collegeCourse', '')
                        clearErrors("collegeCourse");

                      }} // Handle null value
                      options={selctedCollege?.departments ? selctedCollege?.departments.map((e: any) => e.departmentName) : []}
                      freeSolo
                      clearOnEscape
                      disabled={!watchValues.collegeName}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label=' College department *'
                          error={Boolean(collegeErrors.departmentName)}
                          aria-describedby='validation-basic-select'
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {value ? params.InputProps.endAdornment : null}
                              </>
                            ),
                          }}
                        />
                      )}
                      inputValue={value}
                      onInputChange={(event, newInputValue) => {
                        const selected = selctedCollege?.departments.find((college: any) => college.departmentName === newInputValue) || null;
                        setSelectedDepartment(selected);
                        onChange(newInputValue || '')
                        setValue('collegeCourse', '')
                        clearErrors("collegeCourse");

                      }} // Handle null value
                    />
                  )}
                />
                {collegeErrors.departmentName && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-collegeSemester'>
                    {collegeErrors.departmentName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

          </Grid>

          <Grid xs={12} item sx={{ display: 'flex', gap: '20px', flexDirection: { xs: 'column', sm: 'row' } }}>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='collegeCourse'
                  control={collegeControl}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={value || ''}
                      onChange={(event, newValue) => {
                        const selected = selctedDepartment?.courses.find((college: any) => college.coursesName === newValue) || null;
                        setSelectedCourse(selected);
                        onChange(newValue || '')
                      }} // Handle null value
                      options={selctedDepartment?.courses ? selctedDepartment?.courses.map((e: any) => e.coursesName) : []}
                      freeSolo
                      clearOnEscape
                      disabled={!watchValues.departmentName}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='College course *'
                          error={Boolean(collegeErrors.collegeCourse)}
                          aria-describedby='validation-basic-select'
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {value ? params.InputProps.endAdornment : null}
                              </>
                            ),
                          }}
                        />
                      )}
                      inputValue={value}
                      onInputChange={(event, newInputValue) => {
                        const selected = selctedDepartment?.courses.find((college: any) => college.coursesName === newInputValue) || null;
                        setSelectedCourse(selected);
                        onChange(newInputValue || '')
                      }} // Handle null value
                    />
                  )}
                />
                {collegeErrors.collegeCourse && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-collegeSemester'>
                    {collegeErrors.collegeCourse.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='collegeSemester'
                  control={collegeControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      sx={{
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          display: 'none'
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield'
                        }
                      }}
                      type='string'
                      value={value}
                      label='College semester/year * '
                      onChange={onChange}
                      placeholder='College semester/year* '
                      error={Boolean(collegeErrors.collegeSemester)}
                      autoComplete='OFF'
                      aria-describedby='stepper-linear-personal-collegeSemester'
                    />
                  )}
                />
                {collegeErrors.collegeSemester && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-collegeSemester'>
                    {collegeErrors.collegeSemester.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>


          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              size='large'
              variant='outlined'
              color='secondary'
              onClick={() => {
                const studentPersonalDetailsString = sessionStorage.getItem('studentPersonalDetails');
                if (studentPersonalDetailsString) {
                  const studentPersonalDetails = JSON.parse(studentPersonalDetailsString);
                  if (studentPersonalDetails?.studentImage) {
                    setOpenImageBackPopup(true);
                  } else {
                    setOpenImageBackPopup(false);
                    setActiveStep((prevActiveStep: any) => prevActiveStep - 1)

                  }
                } else { setActiveStep((prevActiveStep: any) => prevActiveStep - 1) }
              }}
            >
              Back
            </Button>


            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                style={{ marginLeft: '5px', marginRight: '5px' }}
                size='large'
                type='submit'
                variant='contained'
                onClick={() => {
                  setActiveStep(activeStep + 1);
                  collegeReset({
                    collegeName: '',
                    departmentName: '',
                    collegeCourse: '',
                    collegeSemester: '',
                    selectedState: '',
                    selectedCity: ''
                  })
                  sessionStorage.removeItem('StudentCollegeDetailsForm')
                }}
              >
                skip
              </Button>
              <Button size='large' type='submit' variant='contained'>
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form >
    </>
  )
}

export default StudentCollegeDetailsForm
