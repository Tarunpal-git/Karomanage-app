import React, { useEffect, useState } from 'react'
import {
  MenuItem,
  Typography,
  FormControl,
  Grid,
  Tooltip,
  CardContent,
  Card,
  CardHeader,
  Button,
  InputLabel,
  Avatar,
  Select,
  IconButton,
  Skeleton,
  Radio
} from '@mui/material'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import { useDispatch } from 'react-redux'
import {
  organizationDetails,
  customerRegistration,
  listEmailNotification,
  getCustomerDetails,
  getSingleOrganization,
  getAllModuleVisitStatus
} from 'src/store/APIs/Api'
import { useMsal, useAccount } from '@azure/msal-react'
import { loginRequest } from '../../../config/authConfig'
import { ThemeColor } from 'src/@core/layouts/types'
import { useRouter } from 'next/router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Image from 'next/image'
import SyncIcon from '@mui/icons-material/Sync'
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Icon from 'src/@core/components/icon'
import OrgCreationStepper from './OrgCreationStepper'
import JoinUsingLink from './OrganizationLink'
import ErrorBoundary from 'src/errorBoundary'
import debounce from 'lodash.debounce'
import Loader from 'src/@core/components/loader'
import { setOrgLogo } from 'src/store/APIs/paginationReducer/actions'
import { stringReduce } from 'src/@core/hooks/stringReducer'

const CardStyled = styled(MuiCard)<CardProps>(() => ({
  border: 0,
  boxShadow: 'none',
  backgroundSize: 'cover',
  backgroundColor: 'transparent',
  backgroundImage: 'url(/images/pages/header.png)'
}))

const Img = styled('img')(({ theme }) => ({
  right: 60,
  bottom: -1,
  height: 170,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    position: 'static'
  }
}))

function BootstrapDialogTitle(props: any) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        ></IconButton>
      ) : null}
    </DialogTitle>
  )
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
}

const renderClient = (value: any) => {
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  return (
    <CustomAvatar
      skin='light'
      color={color as ThemeColor}
      sx={{ fontSize: '1rem', width: '2.875rem', height: '2.875rem' }}
    >
      {value ? value[0]?.toUpperCase() : 'J'}
    </CustomAvatar>
  )
}

const SelectionBox = ({ setSelectedOrganization }: any) => {
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(true)
  const [orgId, setOrgId] = useState('')
  const [loading, setLoading] = useState(true)
  const [showHeading, setShowHeading] = useState(false)
  const [newOrg, setNewOrg] = useState<boolean>(false)
  const [recall, setRecall] = useState<any>(true)
  const [customerId, setCustomerId] = useState('')
  const [userDetails, setUserDetails] = useState<any>({})
  const [visibleOrganizations, setVisibleOrganizations] = useState(3)
  const [currentSelectedOrganization, setCurrentSelectedOrganization] = useState<any>(false)
  const [allOrganizationsList, setAllOrganizationsList] = useState([])
  const [organizationCategoryList, setOrganizationCategoryList] = useState()
  const [show, setShow] = useState(true)

  const loadMoreOrganizations = () => {
    // Increase the number of visible organizations
    setVisibleOrganizations(allOrganizationsList.length)
  }
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose: any = () => {
    setOpen(false)
  }

  const handleLogout = () => {
    router.push('/')
    instance.logoutRedirect()
    localStorage.clear()
  }

  // const orgSelected = debounce((organization: any) => {

  //   getSingleOrganization(customerId, organization?.organizationId).then((res: any) => {

  //     localStorage.setItem('organizationLogo', JSON.stringify({ logo: res.data.data.organizationLogo }))
  //     if (res?.data?.data?.organizationLogo) {
  //       localStorage.setItem('organization', JSON.stringify(res?.data?.data))
  //       dispatch(setOrgLogo(res.data.data.organizationLogo))
  //     }
  //   })
  //   listEmailNotification(organization?.customerId, organization?.organizationId).then((res: any) => {
  //     if (res?.statusCode !== 404) {
  //       localStorage.setItem('messageRestriction', JSON.stringify(res?.data?.notificationPermissions))
  //     } else {
  //       localStorage.setItem('messageRestriction', JSON.stringify({}))
  //     }
  //   })


  //   setOrgId(organization.organizationId)
  //   setSelectedOrganization(organization)
  //   // getAllModuleVisitStatus(customerId, organization.organizationId).then((res: any) => {
  //   //   if (res.data) {
  //   //     const dataString = JSON.stringify(res.data);
  //   //     localStorage.setItem('moduleVisitStatus', dataString);
  //   //   }
  //   // })
  //   handleClose()
  // }, 300)

  const orgSelected = debounce(async (organization: any) => {
    await getSingleOrganization(customerId, organization?.organizationId).then((res: any) => {
      if (res?.data?.data) {
        const apiData = res.data.data;

        // organization object ki missing keys ko merge karna
        const updatedOrganization = { ...organization, ...apiData };

        // LocalStorage me updated data save karna
        localStorage.setItem("organization", JSON.stringify(updatedOrganization));

        // Logo ko bhi separately store karna
        if (updatedOrganization.organizationLogo) {
          localStorage.setItem("organizationLogo", JSON.stringify({ logo: updatedOrganization.organizationLogo }));
          dispatch(setOrgLogo(updatedOrganization.organizationLogo));
        }
      }
    });

    listEmailNotification(organization?.customerId, organization?.organizationId).then((res: any) => {
      if (res?.statusCode !== 404) {
        localStorage.setItem("messageRestriction", JSON.stringify(res?.data?.notificationPermissions));
      } else {
        localStorage.setItem("messageRestriction", JSON.stringify({}));
      }
    });

    setOrgId(organization.organizationId);
    setSelectedOrganization(organization);
    handleClose();
  }, 300);


  const { instance, accounts, inProgress } = useMsal()
  const account = useAccount(accounts[0] || {})

  const request: any = {
    ...loginRequest,
    account
  }

  const bringOrganizationsDetails = debounce(async (userid: any) => {
    setNewOrg(false)
    await dispatch(organizationDetails(userid)).then(async (response: any) => {
      if (response.payload.data) {
        await setAllOrganizationsList(response?.payload?.data?.organizations?.organizationNames.reverse())
        setShowHeading(true)
        setLoading(false)
      }
    })
  }, 300)

  const [handleSubmitStatus, setHandleSubmitStatus] = useState<any>(false)
  // useEffect(() => {
  //   if (handleSubmitStatus == true) {
  //     registrationApi()
  //   }
  // }, [handleSubmitStatus])
  const registrationApi = () => {
    instance?.acquireTokenSilent(request)?.then(response => {
      dispatch(customerRegistration(response.idToken)).then((res: any) => {
        localStorage.setItem('userDetails', JSON.stringify(res))
        setCustomerId(res.payload.customerId)
        localStorage.setItem('customer', JSON.stringify(res.payload))
        setUserDetails(res.payload)
        bringOrganizationsDetails(res.payload.customerId)
        getCustomerDetailsFunction(res.payload.customerId)
      })
    })
  }


  useEffect(() => {
    registrationApi()
  }, [])
  const getCustomerDetailsFunction = debounce(customerId => {
    getCustomerDetails({ customerId: customerId })
  }, 300)

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 350
      }
    }
  }

  const reload = () => {
    bringOrganizationsDetails(customerId)
  }

  useEffect(() => {
    const data = localStorage.getItem('userDetails')
    if (data) {
      bringOrganizationsDetails(JSON.parse(data).payload.customerId)
      getCustomerDetailsFunction(JSON.parse(data).payload.customerId)

      setLoading(false)
    }
  }, [recall])
  // useEffect(() => {

  // }, [currentSelectedOrganization])

  const renderedOrganizations = allOrganizationsList
    ?.slice(0, visibleOrganizations)
    ?.map((organization: any, index: number) => {
      return (
        <Card
          onClick={() => setCurrentSelectedOrganization(organization)}
          key={index}
          sx={{ mb: 2, boxShadow: 4 }}
          style={{ cursor: 'pointer' }}
        >
          <CardContent>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <div
                style={{
                  display: 'flex'
                  //  justifyContent: 'space-between'
                }}
              >
                <div>{renderClient(organization.organizationName[0])}</div>
                <div style={{ marginLeft: 9, textAlign: 'left' }}>
                  <Tooltip
                    title={
                      organization.organizationName.charAt(0).toUpperCase() + organization.organizationName.slice(1)
                    }
                  >
                    <Typography className='text'>
                      {' '}
                      {stringReduce(
                        organization.organizationName.charAt(0).toUpperCase() + organization.organizationName.slice(1),
                        30
                      )}
                    </Typography>
                  </Tooltip>
                  <Tooltip
                    title={
                      organization.organizationDetails.charAt(0).toUpperCase() +
                      organization.organizationDetails.slice(1)
                    }
                  >
                    <Typography className='sub-text' variant='caption'>
                      {' '}
                      {stringReduce(
                        organization.organizationDetails.charAt(0).toUpperCase() +
                        organization.organizationDetails.slice(1),
                        30
                      )}
                    </Typography>
                  </Tooltip>
                </div>
              </div>
              <div>
                <Radio
                  checked={currentSelectedOrganization?.organizationId == organization.organizationId ? true : false}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )
    })

  const reloadDetails = debounce(() => {
    const data = localStorage.getItem('userDetails')
    if (data) {
      bringOrganizationsDetails(JSON.parse(data).payload.customerId)
      getCustomerDetailsFunction(JSON.parse(data).payload.customerId)
      setLoading(false)
    }
  }, 1000)
  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'right',
          position: 'fixed',
          top: 5,
          right: 20,
          height: '7vh',
          zIndex: 999
        }}
      >
        <Grid sx={{ width: '3%' }}>
          <Box sx={{ display: 'flex', height: '7vh', alignItems: 'center', justifyContent: 'flex-end' }}>
            {/* <div className='refresh'>
              <SyncIcon className='refresh' onClick={() => { reloadDetails(); setLoading(true) }} />
            </div> */}
            <Button variant='outlined' className='signOut'>
              <Icon className='signOut' icon='bx:power-off' onClick={() => handleLogout()} />
            </Button>
          </Box>
        </Grid>
      </div>
      {currentSelectedOrganization && !newOrg && (
        <div className='continue-div'>
          <Button className='button-text' variant='contained' onClick={() => orgSelected(currentSelectedOrganization)}>
            Continue
          </Button>
        </div>
      )}
      {!newOrg && (
        <Grid container sx={{ width: '100%' }}>
          <Grid item xs={1} sm={6} className='list-container'>
            <div className='orgListing-Image'>
              <Image alt='image' src={'/images/pages/girl-with-laptop-analytics.png'} height={350} width={350} />
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className='list-display' style={{ height: renderedOrganizations?.length < 2 ? '100vh' : '100%' }}>
              <Card sx={{ width: '90%', boxShadow: 'none', display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "10%" }}>
                <CardContent
                  sx={{
                    pt: 15,
                    width: "85%",
                    textAlign: 'left',
                    pb: theme => `${theme.spacing(17.5)} !important`,
                    display: 'flax',
                    flexDirection: 'column',
                    justifyContent: 'left'
                  }}
                >
                  {allOrganizationsList && showHeading && (
                    <div>
                      <Typography sx={{ mb: 2, mt: 10, fontSize: 20 }}>
                        {(
                          (userDetails?.userType == 'admin' && allOrganizationsList?.length <= 0 &&
                            (typeof userDetails?.organizations == 'object' || userDetails?.organizations == 0)) ||
                          (userDetails?.userType == 'subUser' &&
                            (typeof userDetails?.organizations == 'object' || userDetails?.organizations >= 0))) ? 'Join Organization!' : ''}
                      </Typography>
                      <div style={{ width: "100%", display: 'flax', justifyContent: 'left' }}>
                        {(
                          (userDetails?.userType == 'admin' && allOrganizationsList?.length <= 0 &&
                            (typeof userDetails?.organizations == 'object' || userDetails?.organizations == 0)) ||
                          (userDetails?.userType == 'subUser' &&
                            (typeof userDetails?.organizations == 'object' || userDetails?.organizations >= 0))) && (
                            <Grid xs={12} sm={9} style={{ paddingTop: '10px' }}>
                              <JoinUsingLink recall={recall} setRecall={setRecall} setShow={setShow} />
                            </Grid>
                          )}
                      </div>

                      <Typography sx={{ mb: 2, mt: 5, color: "#AFAFAF", width: "70%", textAlign: "center", fontSize: "20px" }}>
                        {(
                          (userDetails?.userType == 'admin' && allOrganizationsList?.length <= 0 &&
                            (typeof userDetails?.organizations == 'object' || userDetails?.organizations == 0)))
                          ? 'OR' : ''}
                      </Typography>


                      <Typography sx={{ mb: 2, mt: 5, fontSize: 20 }}>
                        {(
                          (userDetails?.userType == 'admin' && allOrganizationsList?.length <= 0 &&
                            (typeof userDetails?.organizations == 'object' || userDetails?.organizations == 0)))
                          ? 'Create Organization!' : ''}
                      </Typography>
                    </div>
                  )}

                  <div>
                    {loading ? (
                      <div
                        style={{
                          height: '40vh',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: '5%'
                        }}
                      >
                        <Loader />
                      </div>
                    ) : (
                      <div style={{ width: '100%' }}>


                        {renderedOrganizations.length !== 0 ? (
                          <Grid xs={12} md={8} style={{ width: '100vw', paddingTop: '10px' }}>
                            {renderedOrganizations}
                            {allOrganizationsList.length > visibleOrganizations && (
                              <Button
                                className='button-text'
                                onClick={loadMoreOrganizations}
                                variant='contained'
                                sx={{ mt: 2, mb: 2 }}
                              >
                                Load All
                              </Button>
                            )}

                            {userDetails?.userType == 'admin' && show && (
                              <Card
                                onClick={() => setNewOrg(true)}
                                style={{ cursor: 'pointer', border: '1px solid #696CFF' }}
                              >
                                <CardContent>
                                  <Typography
                                    color='primary'
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <AddCircleIcon />
                                    </div>

                                    <div>
                                      <Typography className='text'>Create Organization</Typography>
                                    </div>
                                  </Typography>
                                </CardContent>
                              </Card>
                            )}
                          </Grid>
                        ) : (
                          <Grid xs={12} sm={6} style={{ width: '100vw', paddingTop: '10px' }}>
                            {userDetails?.userType == 'admin' && show && (
                              <Card
                                onClick={() => setNewOrg(true)}
                                style={{ cursor: 'pointer', border: '1px solid #696CFF' }}
                              >
                                <CardContent>
                                  <Typography
                                    color='primary'
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                      <AddCircleIcon />
                                    </div>
                                    <div>
                                      <Typography className='text'>Create Organization</Typography>
                                    </div>
                                  </Typography>
                                </CardContent>
                              </Card>
                            )}
                          </Grid>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Grid>
        </Grid>
      )}
      {newOrg && (
        <Grid xs={12} sm={6} sx={{ margin: '0 auto', marginTop: 20 }}>
          <ErrorBoundary>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 5 }}>
              <Button
                onClick={() => {
                  setNewOrg(false)
                }}
                variant='contained'
                sx={{ m: 3, cursor: 'pointer' }}
              >
                <ArrowBackIcon />
                Back
              </Button>
            </div>
            <Card sx={{ overflow: 'hiddden', width: '100%' }}>
              <OrgCreationStepper
                categoryList={organizationCategoryList}
                customerDetails={userDetails}
                refreshCall={bringOrganizationsDetails}
                setHandleSubmitStatus={setHandleSubmitStatus}
              />
            </Card>
          </ErrorBoundary>
        </Grid>
      )}
    </>
  )
}
export default SelectionBox
