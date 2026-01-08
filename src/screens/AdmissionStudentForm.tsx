import React, { useState, useEffect } from 'react'
import StepperCustomDot from './StepperCustomDot'
import StudentDetailsForm from './StudentDetailsForm'
import StudentCollegeDetailsForm from './StudentCollegeDetailsForm'
import CourseAndBatchDetails from './CourseAndBatchDetails'
import PaymentDetails from './PaymentDetails'
import StudentFormReview from 'src/views/apps/review/StudentReview/StudentFormReview'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import { styled } from '@mui/material/styles'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Step from '@mui/material/Step'
import debounce from 'lodash.debounce'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import { useDispatch } from 'react-redux'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import Button from '@mui/material/Button'
import { getAllListReferralAgent, getCountAllStudentsApi, getCouponList, listOrganizationCourse, getAllBatchList } from 'src/store/APIs/Api'
import { Helmet } from 'react-helmet'

const steps = [
  {
    icon: 'mdi:account-student-outline',
    title: 'Student Details',
    subtitle: 'Enter Student Information'
  },
  {
    icon: 'maki:college',
    title: 'College Details',
    subtitle: 'Enter College Information'
  },
  {
    icon: 'mdi:college',
    title: 'Course & Batch',
    subtitle: 'Enter Course & Batch Information'
  },
  {
    icon: 'mdi:account-payment',
    title: 'Payment Details',
    subtitle: 'Enter Payment Information'
  },
  {
    icon: 'material-symbols:rate-review-outline-rounded',
    title: 'Review ',
    subtitle: 'Check Your Filled Details'
  }
]

const AdmissionStudentForm = () => {

  const dispatch = useDispatch()
  const router = useRouter()

  const [user, setUser] = useState<any>()
  const [snackbarColor, setSnackbarColor] = useState(true)
  const [open, setOpen] = useState<any>({ open: false, mssg: '' })
  const [activeStep, setActiveStep] = useState<number>(0)
  const [listAgent, setListAgent] = useState<any>()
  const [agentPopup, setAgentPopup] = useState<any>(false)
  const [agentData, setAgentData] = useState<any>({
    agentId: "",
    agentName: "",
    agentPayment: "",
    paymentStatus: "",
    paymentMode: "",
  })
  const [rollNumberFirstPart, setRollNumberFirstPart] = useState<any>()
  const [enrollNumberFirstPart, setEnrollNumberFirstPart] = useState<any>()
  const [courseListData, setCourseListData] = useState<any>([])
  const [listBatch, setListBatch] = useState<any>([])
  const [permission, setPermission] = useState<any>()
  const [newBatch, setNewBatch] = useState<boolean>(false)
  const [newCoupon, setNewCoupon] = useState<boolean>(false)
  const [newCourse, setNewCourse] = useState<boolean>(false)
  const [openBackPopup, setOpenBackPopup] = useState<boolean>(false)
  const [openImageBackPopup, setOpenImageBackPopup] = useState<boolean>(false)
  const [couponListData, setCouponListData] = useState<any>()
  const [isNavigating, setIsNavigating] = useState(false)
  const [isFormComplete, setIsFormComplete] = useState(true)
  const [updationData, setUpdationData] = useState<any>({})
  const [updationDataForm, setUpdationDataForm] = useState<any>({})
  const [course, setCourse] = useState<any>(null)
  const [goBack, setGoBack] = useState<boolean>(false)

  const getAllStudentApi = debounce(() => {
    if (user) {
      getCountAllStudentsApi(user.customerId, user.organizationId)
        .then(res => {
          const data = res?.data
          if (data) {
            const organizationId = user ? user.organizationId : ''
            let studentAdorment = organizationId.split('-')
            setRollNumberFirstPart(studentAdorment[0] + '-')
            if (data?.totalStudents?.studentDataCount) {
              setEnrollNumberFirstPart(`${studentAdorment[0]}-${data?.totalStudents?.studentDataCount + 1}`)
            } else {
              setEnrollNumberFirstPart(`${studentAdorment[0]}-${1}`)
            }
          }
        })
        .catch((err: any) => {
          console.log(err)
        })
    }
  }, 1000)

  const listAgentApiCall = debounce(() => {
    if (user) {
      const customerId = user?.customerId
      const organizationId = user?.organizationId
      getAllListReferralAgent(customerId, organizationId).then((res: any) => {
        setListAgent(res?.data?.data?.sort((a: any, b: any) => b.dateCreated - a.dateCreated));
      })
    }
  }, 1000)

  const listCourse = debounce(() => {
    if (user) {
      let customerId = user.customerId
      let organizationId = user.organizationId
      if (customerId && organizationId) {
        dispatch(listOrganizationCourse({ organizationId, customerId })).then((res: any) => {
          if (res?.payload?.data?.data.length > 0) {
            setCourseListData(res?.payload?.data?.data?.sort((a: any, b: any) => b.dateCreated - a.dateCreated).filter((obj: any) => obj?.mode != "online"))
          }
        })
      }
    }
  }, 1000)



  const listBatchApiCall = debounce(() => {
    if (user) {
      const customerId = user.customerId
      const organizationId = user.organizationId

      getAllBatchList(customerId, organizationId)
        .then((res: any) => {
          setListBatch(res?.data?.sort((a: any, b: any) => b.dateCreated - a.dateCreated))
        })
        .catch((err: any) => {
          console.log(err)
        })
    }
  }, 1000)



  const listCouponApiCall = debounce(() => {
    if (user) {
      const customerId = user.customerId
      const organizationId = user.organizationId
      getCouponList(customerId, organizationId)
        .then((res: any) => {
          const filteredSorted = res?.data
            ?.filter((coupon: any) => coupon.couponStatus !== "inActive") // ✅ filter first
            .sort((a: any, b: any) => b.dateCreated - a.dateCreated);     // ✅ then sort

          setCouponListData(filteredSorted);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, 1000)

  useEffect(() => {
    if (newBatch) {
      listBatchApiCall()
      setNewBatch(false)
      setNewCourse(true)
    }
  }, [newBatch])

  useEffect(() => {
    if (newCoupon) {
      listCouponApiCall()
      setNewCoupon(false)
    }
  }, [newCoupon])

  useEffect(() => {
    if (newCourse) {
      listCourse()
      setNewCourse(false)
    }
  }, [newCourse])

  useEffect(() => {
    getAllStudentApi()
    listAgentApiCall();
    listCourse()
    listBatchApiCall()
    listCouponApiCall()
    if (user) {
      setPermission(user?.role?.permissions)
    }
  }, [user])

  useEffect(() => {
    const userDetails = localStorage.getItem('organization')
    if (userDetails) {
      setUser(JSON.parse(userDetails))
    }
  }, [])


  const handleClose = () => {
    if (open.open == true) {
      setOpen({ open: false, mssg: '' })
    }
  }

  const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
    borderRight: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('md')]: {
      borderRight: 0,
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  }))

  const removeStorageItems = (url: any) => {
    sessionStorage.removeItem('studentPersonalDetails')
    sessionStorage.removeItem('studentCourseAndBatch')
    sessionStorage.removeItem('studentPaymentDetails')
    sessionStorage.removeItem('StudentCollegeDetailsForm')
    localStorage.removeItem('enquiryStudent')
    localStorage.removeItem('enquiryStudentForm')
    setIsNavigating(true)
    router.push(url)
  }

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (!isFormComplete && !isNavigating) {
        if (!isFormComplete) {
          if (confirm('You have an incomplete form. Are you sure you want to leave?')) {
            removeStorageItems(url)
          } else {
            // Prevent navigation
            router.events.emit('routeChangeError')
            throw 'routeChange aborted'
          }
        } else {
          removeStorageItems(url)
        }
      }
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [isFormComplete, isNavigating, router])

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <StudentDetailsForm
              setActiveStep={setActiveStep}
              activeStep={activeStep}
              listAgent={listAgent}
              setListAgent={setListAgent}
              setAgentPopup={setAgentPopup}
              agentData={agentData}
              user={user}
              enrollNumberFirstPart={enrollNumberFirstPart}
              setAgentData={setAgentData}
              agentPopup={agentPopup}
              setIsFormComplete={setIsFormComplete}
              setUpdationDataForm={setUpdationDataForm}
              setUpdationData={setUpdationData}
              updationDataForm={updationDataForm}
              updationData={updationData}
              setSnackbarColor={setSnackbarColor}
              setOpen={setOpen}
              getAllStudentApi={getAllStudentApi}
            /></>
        )
      case 1:
        return (
          <><StudentCollegeDetailsForm
            setActiveStep={setActiveStep}
            activeStep={activeStep}
            setOpenImageBackPopup={setOpenImageBackPopup}
          /></>
        )
      case 2:
        return (
          <>
            <CourseAndBatchDetails
              setActiveStep={setActiveStep}
              activeStep={activeStep}
              courseListData={courseListData}
              listBatch={listBatch}
              permission={permission}
              setSnackbarColor={setSnackbarColor}
              setOpen={setOpen}
              user={user}
              setNewCourse={setNewCourse}
              setNewBatch={setNewBatch}
              setCourse={setCourse}
              course={course}
              setGoBack={setGoBack}

            /></>
        )
      case 3:
        return (
          <>
            <PaymentDetails
              setActiveStep={setActiveStep}
              activeStep={activeStep}
              couponListData={couponListData}
              permission={permission}
              setSnackbarColor={setSnackbarColor}
              setOpen={setOpen}
              user={user}
              setNewCoupon={setNewCoupon}
              setOpenBackPopup={setOpenBackPopup}
            />
          </>
        )
      case 4:
        return (
          <>
            <StudentFormReview
              setOpenBackPopup={setOpenBackPopup}
              setActiveStep={setActiveStep}
              activeStep={activeStep}
              agentData={agentData}
              updationDataForm={updationDataForm}
              updationData={updationData}
              setIsFormComplete={setIsFormComplete}
              rollNumberFirstPart={rollNumberFirstPart}
              user={user}
              setSnackbarColor={setSnackbarColor}
              setOpen={setOpen}
            />
          </>
        )

      default:
        return null
    }
  }
  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <>
          <Typography>All steps are completed!</Typography>
        </>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <>

      <Helmet>
        {/* Google Tag Manager (head section) */}
        <script>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PBWMC2G8');`}
        </script>
      </Helmet>

      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <StepperHeaderContainer>
          <StepperWrapper sx={{ height: '100%' }}>
            <Stepper
              activeStep={activeStep}
              orientation='vertical'
              connector={<></>}
              sx={{ height: '100%', minWidth: '15rem' }}
            >
              {steps.map((step, index) => {
                return (
                  <Step key={index}>
                    <StepLabel StepIconComponent={StepperCustomDot}>
                      <div className='step-label'>
                        <CustomAvatar
                          variant='rounded'
                          skin={activeStep === index ? 'filled' : 'light'}
                          color={activeStep >= index ? 'primary' : 'secondary'}
                          sx={{
                            mr: 2.5,
                            borderRadius: 1,
                            ...(activeStep === index && {
                              boxShadow: theme =>
                                `0 0.1875rem 0.375rem 0 ${hexToRGBA(theme.palette.primary.main, 0.4)}`
                            })
                          }}
                        >
                          <Icon icon={step.icon} />
                        </CustomAvatar>
                        <div>
                          <Typography className='step-title'>{step.title}</Typography>
                          <Typography className='step-subtitle'>{step.subtitle}</Typography>
                        </div>
                      </div>
                    </StepLabel>
                  </Step>
                )
              })}
            </Stepper>
          </StepperWrapper>
        </StepperHeaderContainer>

        <Divider sx={{ m: '0 !important' }} />

        <CardContent sx={{ width: { xs: '100%', md: '100%' } }}>
          {renderContent()}
        </CardContent>
      </Card>


      <Dialog
        fullWidth
        open={openBackPopup}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <Grid container justifyContent='flex-end'>
          <Icon
            className='iconContainer'
            onClick={() => setOpenBackPopup(false)}
            style={{
              cursor: 'pointer',
              fontSize: '30px',
              margin: '8px',
              transition: 'background-color 0.3s'
            }}
            icon='bx:x'
          />
        </Grid>
        <DialogContent sx={{ pb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Box sx={{ mb: 7, maxWidth: '85%', textAlign: 'center', '& svg': { color: 'warning.main' } }}>
              <Icon icon='bx:error-circle' fontSize='5.5rem' style={{ marginTop: '-30px' }} />
              <Typography variant='h5' sx={{ color: 'text.secondary' }}>
                Are you sure?
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '1.125rem' }}>You need to refill the payment details</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'right', mt: 5 }}>
          <Button variant='outlined' color='secondary' onClick={() => setOpenBackPopup(false)}>
            Cancel
          </Button>
          <Button variant='contained' sx={{ mr: 1.5 }} onClick={() => {
            setOpenBackPopup(false)
            if (activeStep == 3 || activeStep == 4) {
              setActiveStep(prevActiveStep => prevActiveStep - 1)
            }
            if (sessionStorage.getItem('studentPaymentDetails') !== null) {
              sessionStorage.removeItem('studentPaymentDetails');
            }
          }}>
            Sure!
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        open={openImageBackPopup}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <Grid container justifyContent='flex-end'>
          <Icon
            className='iconContainer'
            onClick={() => setOpenImageBackPopup(false)}
            style={{
              cursor: 'pointer',
              fontSize: '30px',
              margin: '8px',
              transition: 'background-color 0.3s'
            }}
            icon='bx:x'
          />
        </Grid>
        <DialogContent sx={{ pb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Box sx={{ mb: 7, maxWidth: '85%', textAlign: 'center', '& svg': { color: 'warning.main' } }}>
              <Icon icon='bx:error-circle' fontSize='5.5rem' style={{ marginTop: '-30px' }} />
              <Typography variant='h5' sx={{ color: 'text.secondary' }}>
                Are you sure?
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '1.125rem' }}>You need to set the image again.</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'right', mt: 5 }}>
          <Button variant='outlined' color='secondary' onClick={() => setOpenImageBackPopup(false)}>
            Cancel
          </Button>
          <Button variant='contained' sx={{ mr: 1.5 }} onClick={() => {
            setOpenImageBackPopup(false)
            if (activeStep == 1) {
              setActiveStep(prevActiveStep => prevActiveStep - 1)
            }

          }}>
            Sure!
          </Button>
        </DialogActions>
      </Dialog>


      {/* Snackbar */}
      {open.open && (
        <Snackbar
          open={open.open} onClose={handleClose} autoHideDuration={5000}>
          <Alert
            variant='filled'
            elevation={3}
            onClose={handleClose}
            severity={snackbarColor === true ? 'success' : 'error'} // Change the severity based on message type
          >
            {open.mssg}
          </Alert>
        </Snackbar>
      )}

      {/* Google Tag Manager (body section) */}
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PBWMC2G8"
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
      </noscript>
    </>
  )
}

export default AdmissionStudentForm
