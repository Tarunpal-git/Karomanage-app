import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import * as Yup from 'yup'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Button, TextField, Tooltip } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Batch from 'src/pages/batch/batchPopup'
import Course from 'src/pages/courses/coursePopup'
import { stringReduce } from 'src/@core/hooks/stringReducer';
import { Toolbar } from 'material-ui';
interface CourseAndBatchInputs {
  courseName: string;
  batchName: string;
}

const CourseAndBatchDetails = ({
  setActiveStep, setNewBatch, setNewCourse,
  activeStep, courseListData, listBatch, permission,
  user, setOpen, setSnackbarColor, onState, course, setCourse, setGoBack }: any) => {


  const [defaultValues, setDefaultValues] = useState<any>({
    courseName: '',
    batchName: '',
  })

  const [batch, setBatch] = useState<any>(null)
  const [filteredNewBatchForStudent, setFilteredNewBatchForStudent] = useState<any>([])
  const [openBatchDialog, setOpenBatchDialog] = useState<boolean>(false)
  const [openCourseDialog, setOpenCourseDialog] = useState<boolean>(false)
  const [courseValue, setCourseValue] = useState<any>()

  const courseAndBatchSchema: any = yup.object().shape({
    courseName: Yup.string().required('This field is required'),
    batchName: Yup.string().required('This field is required'),
  })


  const {
    reset,
    control,
    getValues: courseAndBatchValues,
    handleSubmit: handCourseAndBatchSubmit,
    setValue,
    watch,
    formState: { errors: courseAndBatchErrors }
  } = useForm<CourseAndBatchInputs>({
    defaultValues: defaultValues,
    resolver: yupResolver(courseAndBatchSchema)
  })

  const courseNameValue = watch('courseName');

  useEffect(() => {
    if (courseNameValue) {
      // Logic to execute whenever courseName changes
      setCourseValue(courseNameValue)
    }
  }, [courseNameValue]);

  useEffect(() => {
    if (listBatch.length > 0 && course != null) {
      let arr: any = []
      for (let singleBatch of course?.batch) {
        let batchSingle = listBatch.find((obj: any) => obj.batchId == singleBatch.batchId)
        if (batchSingle) {
          arr.push(batchSingle)
        }
      }
      // let newArr = listBatch.filter((obj: any) => obj.courses.length == 0)
      arr = [...arr]

      setFilteredNewBatchForStudent(arr)
    }
  }, [listBatch, course])

  useEffect(() => {
    if (courseListData.length > 0) {
      const tempCourse = { ...course }
      const updatedCourse = courseListData.find((obj: any) => obj.courseName == tempCourse?.courseName)
      if (updatedCourse && Object.keys(updatedCourse).length != 0) {
        setCourse({ ...updatedCourse })
      }
    }

  }, [courseListData])


  const onSubmit = () => {
    sessionStorage.setItem('studentCourseAndBatch', JSON.stringify({
      ...courseAndBatchValues(),
      batch: batch,
      course: course,
      installments: course?.maxPaymentInstallment,
      courseFee: course?.courseFee
    }))
    setActiveStep(activeStep + 1)
  }

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 450
      }
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem('studentCourseAndBatch') !== null) {
      const studentCourseAndBatch: any = sessionStorage.getItem('studentCourseAndBatch')
      const studentValuesSession: any = JSON.parse(studentCourseAndBatch)
      setValue('courseName', studentValuesSession.courseName)
      setValue('batchName', studentValuesSession.batchName)
      setCourse(courseListData.find((obj: any) => obj.courseName == studentValuesSession.courseName))
      setBatch(listBatch.find((obj: any) => obj.batchName == studentValuesSession.batchName))
    }
  }, [])

  return (
    <>
      <form onSubmit={handCourseAndBatchSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }} className='capitalize'>
              Select batch & course
            </Typography>
          </Grid>
          {/* <Grid item xs={6} sm={6}>
            <FormControl fullWidth>
              <InputLabel
                id='validation-basic-select'
                error={Boolean(courseAndBatchErrors.courseName)}
                htmlFor='validation-basic-select'
              >
                Course *
              </InputLabel>
              <Controller
                name='courseName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value}
                    label='Course *'
                    onChange={onChange}
                    MenuProps={MenuProps}
                    error={Boolean(courseAndBatchErrors.courseName)}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                  >

                    {courseListData && courseListData?.length > 0 ? (
                      courseListData?.map((name: any) => (
                        <MenuItem key={name?.courseId} value={name?.courseName} onClick={() => {
                          setCourse(name)
                          setValue("courseName", '')
                        }}>
                          <Tooltip
                            title={`${name?.courseName?.charAt(0)?.toUpperCase() + name?.courseName?.slice(1)} `}
                            placement={"top"}>
                            <span>
                              {stringReduce(`${name?.courseName?.charAt(0)?.toUpperCase() + name?.courseName?.slice(1)}`, 30)}
                            </span>
                          </Tooltip>
                        </MenuItem>

                      ))
                    ) : (
                      <MenuItem disabled>
                        <ListItemText primary='No data found' />
                      </MenuItem>
                    )}
                  </Select>
                )}
              />
              {courseAndBatchErrors.courseName && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-courseName'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
          </Grid> */}


          <Grid item xs={6} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="courseName"
                control={control}
                rules={{ required: true }} // Validation rule
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    value={courseListData?.find((course: any) => course?.courseName === value) || null} // Sync value with the selected course object
                    onChange={(event, newValue) => {
                      onChange(newValue?.courseName || ''); // Update the form field with course name
                      setCourse(newValue); // Pass the entire course object to setCourse
                      setValue("batchName", '');
                      setGoBack(true)
                      // setGoBack(true);

                      // Close the dropdown after selection
                      const autocompleteElement = document.activeElement as HTMLElement;
                      autocompleteElement?.blur(); // Remove focus from the autocomplete input
                    }}
                    options={courseListData ? courseListData : []}
                    getOptionLabel={(option) => { return (stringReduce(`${option?.courseName}`, 35)) || '' }}
                    renderOption={(props, option) => (
                      <>
                        {option?.courseName.length > 35 ?
                          <Tooltip title={option?.courseName}>
                            <li {...props}>
                              {stringReduce(`${option?.courseName}`, 35)}
                            </li>
                          </Tooltip> :
                          <li {...props}>
                            {option?.courseName}
                          </li>
                        }
                      </>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Course *"
                        error={Boolean(courseAndBatchErrors.courseName)}
                        helperText={
                          courseAndBatchErrors.courseName ? "This field is required" : ""
                        }
                      />
                    )}
                    disableClearable
                  />
                )}
              />
            </FormControl>
          </Grid>


          <Grid item xs={1} sm={0} mt={0.6}>
            {permission?.some((obj: any) => obj?.title === 'Courses' && obj?.action?.includes('create')) && (
              <AddCircleIcon
                style={{ marginTop: '12px', cursor: 'pointer' }}
                onClick={() => {
                  setGoBack(true)
                  setOpenCourseDialog(true)
                }}
                color='primary'
              />
            )}
          </Grid>



          {/* <Grid item xs={6} sm={6}>
            <FormControl fullWidth>
              <InputLabel
                id='validation-basic-select'
                error={Boolean(courseAndBatchErrors.batchName)}
                htmlFor='validation-basic-select'
              >
                Batch *
              </InputLabel>
              <Controller
                name='batchName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value}
                    label='Batch *'
                    onChange={onChange}
                    MenuProps={MenuProps}
                    error={Boolean(courseAndBatchErrors.batchName)}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                  >
                    {filteredNewBatchForStudent && filteredNewBatchForStudent?.length > 0 ? (
                      filteredNewBatchForStudent?.map((name: any) => (
                        <MenuItem key={name?.batchId} value={name?.batchName} onClick={() => {
                          setBatch(name)
                        }}>
                          <Tooltip
                            title={`${name?.batchName?.charAt(0)?.toUpperCase() + name?.batchName?.slice(1)} `}
                            placement={"top"}>
                            <span>{stringReduce(`${name?.batchName?.charAt(0)?.toUpperCase() + name?.batchName?.slice(1)}`, 20)}</span>
                          </Tooltip>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        {courseValue ?
                          <ListItemText primary='No batch is created for this course' /> : <ListItemText primary='No data found' />}
                      </MenuItem>
                    )}

                  </Select>
                )}
              />
              {courseAndBatchErrors.batchName && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-batchName'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
          </Grid> */}



          <Grid item xs={6} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="batchName"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <Autocomplete
                    value={
                      filteredNewBatchForStudent
                        ? filteredNewBatchForStudent.find((batch: any) => batch.batchName === value) || null
                        : null
                    }
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.batchName : '');
                      setBatch(newValue);
                      setGoBack(true)
                    }}
                    options={filteredNewBatchForStudent || []}
                    getOptionLabel={(option) => option.batchName || ''}
                    noOptionsText={
                      filteredNewBatchForStudent && filteredNewBatchForStudent.length === 0
                        ? courseValue
                          ? 'No batch is created for this course'
                          : 'No data found'
                        : 'No options'
                    } // Dynamically change the message
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Batch *"
                        error={Boolean(error)} // Display validation error
                        helperText={error ? 'This field is required' : ''}
                      />
                    )}
                    disableClearable
                  />
                )}
              />
            </FormControl>
          </Grid>


          <Grid item xs={1} sm={0} mt={0.6}>
            {permission?.some((obj: any) => obj?.title === 'Batch' && obj?.action?.includes('create')) && (
              <AddCircleIcon
                style={{ marginTop: '12px', cursor: 'pointer' }}
                onClick={() => {
                  setGoBack(true)
                  setOpenBatchDialog(true)
                }}
                color='primary'
              />
            )}
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: onState != "update" ? 'space-between' : 'right' }}>
            {onState != "update" && <Button size='large' variant='outlined' color='secondary' onClick={() => { setActiveStep((prevActiveStep: any) => prevActiveStep - 1) }}>
              Back
            </Button>}
            <Button size='large' type='submit' variant='contained'>
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
      <Batch
        openBatchDialog={openBatchDialog}
        setOpenBatchDialog={setOpenBatchDialog}
        user={user}
        setSnackbarColor={setSnackbarColor}
        setOpen={setOpen}
        setNewBatch={setNewBatch}
        courseListData={courseListData}

      />

      <Course
        openCourseDialog={openCourseDialog}
        setOpenCourseDialog={setOpenCourseDialog}
        user={user}
        setSnackbarColor={setSnackbarColor}
        setOpen={setOpen}
        setNewCourse={setNewCourse}
      />
    </>

  )
}

export default CourseAndBatchDetails
