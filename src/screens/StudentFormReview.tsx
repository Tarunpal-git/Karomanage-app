/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import { customDateFormat, customDateFormatDash } from 'src/@core/utils/format'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TableContainer from '@mui/material/TableContainer'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Loader from 'src/@core/components/loader';
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import debounce from 'lodash.debounce'
import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'
import { stringReduce } from 'src/@core/hooks/stringReducer'
import {
  createStudentAdmission,
  commonEmailService,
  updateEnquiry,
  createCollege,
  deleteSingleFormData,
  couponCountCheck,
  enquiryBulkDataUpdate,
  createExtraField,
  checkStudentEnrollmentNumber
} from 'src/store/APIs/Api'
import { v4 as uuidv4 } from 'uuid'
import { commonWhatspSmsMessage } from 'src/@core/utils/commonWhtspSmsMessage'
import { handleCapitalizeFirstLetter } from 'src/@core/utils/handleCapitalizeFirstLetter'
import Icon from 'src/@core/components/icon'
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton'
import { NumbersRounded } from '@mui/icons-material'

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}))


const StudentFormReview = (props: any) => {
  // ** Props
  const [studentValues, setStudentValues] = useState<any>({})
  const [dynamicFields, setDynamicFields] = useState<any>();
  const [oldDynamicFields, setOldDynamicFields] = useState<any>();
  const { setActiveStep, setOpenBackPopup, activeStep, user,
    agentData, updationData, updationDataForm, rollNumberFirstPart, setIsFormComplete,
    setSnackbarColor, setOpen } = props


  const removeStorageItems = () => {
    sessionStorage.removeItem('studentPersonalDetails')
    sessionStorage.removeItem('studentDynamicFields')
    sessionStorage.removeItem('studentCourseAndBatch')
    sessionStorage.removeItem('studentPaymentDetails')
    sessionStorage.removeItem('StudentCollegeDetailsForm')
    localStorage.removeItem('enquiryStudent')
    localStorage.removeItem('enquiryStudentForm')
  }

  const randomID = uuidv4().slice(0, 8)
  const router = useRouter()
  const studentCollegeDetails = debounce(() => {

    try {
      // if (studentValues?.StudentCollegeDetailsForm) {
      //   createCollege({
      //     state: studentValues?.StudentCollegeDetailsForm?.selectedState,
      //     city: studentValues?.StudentCollegeDetailsForm?.selectedCity,
      //     collegeId: studentValues?.StudentCollegeDetailsForm?.college?.collegeId,
      //     collegeName: studentValues?.StudentCollegeDetailsForm?.college?.collegeName,
      //     departments: [
      //       {
      //         departmentName: studentValues?.StudentCollegeDetailsForm?.departmentName,
      //         departmentId: studentValues?.StudentCollegeDetailsForm?.department?.departmentId,
      //         courses: [
      //           {
      //             coursesName: studentValues?.StudentCollegeDetailsForm?.collegeCourse,
      //             coursesId: studentValues?.StudentCollegeDetailsForm?.course?.coursesId
      //           }
      //         ]
      //       }
      //     ]
      //   })
      // }
      if (studentValues?.StudentCollegeDetailsForm) {
        createCollege({
          state: studentValues?.StudentCollegeDetailsForm?.selectedState,
          city: studentValues?.StudentCollegeDetailsForm?.selectedCity,
          collegeId: studentValues?.StudentCollegeDetailsForm?.collegeId,
          collegeName: studentValues?.StudentCollegeDetailsForm?.collegeName,
          departments: [
            {
              departmentName: studentValues?.StudentCollegeDetailsForm?.departmentName,
              departmentId: studentValues?.StudentCollegeDetailsForm?.department?.departmentId,
              courses: [
                {
                  coursesName: studentValues?.StudentCollegeDetailsForm?.collegeCourse,
                  coursesId: studentValues?.StudentCollegeDetailsForm?.course?.coursesId
                }
              ]
            }
          ]
        })
      }
    } catch (err) {
      console.log(err)
    }
  }, 1000)

  const handleSubmit = debounce(() => {
    let count = 0;
    const installmentDetailsArray = []

    const batchIdArray = [{
      batchId: studentValues?.studentCourseAndBatch?.batch?.batchId,
      batchStatus: studentValues?.studentCourseAndBatch?.batch?.batchStatus
    }]
    const courseIdArray = [{
      courseId: studentValues?.studentCourseAndBatch?.course?.courseId,
      courseStatus: studentValues?.studentCourseAndBatch?.course?.courseStatus
    }]
    const couponIdArray = [{
      couponId: studentValues?.studentPaymentDetails?.coupon?.couponId,
      couponStatus: studentValues?.studentPaymentDetails?.coupon?.couponStatus
    }
    ]


    for (const singleObj of studentValues?.studentPaymentDetails?.installments) {
      const obj: any = {}
      if (count == 0 && studentValues?.studentPaymentDetails?.firstPaymentInstallment == 'pay') {
        count++
        obj.installmentNumber = count
        obj.paymentStatus = 'paid'
        obj.paymentReceiveDate = customDateFormatDash(singleObj.date)
        obj.receivedPayment = singleObj.amount
        obj.paymentNotes = singleObj.description
        installmentDetailsArray.push(obj)
      } else {
        count++
        obj.installmentNumber = count
        obj.paymentStatus = 'due'
        obj.nextpaymentDate = customDateFormatDash(singleObj.date)
        obj.duePayment = singleObj.amount
        obj.paymentNotes = singleObj.description
        installmentDetailsArray.push(obj)
      }
    }

    const userCustomerData: any = localStorage.getItem('userDetails')
    const userCustomerObj: any = JSON.parse(userCustomerData)
    const organizationData: any = localStorage.getItem('organization')
    const organizationObj: any = JSON.parse(organizationData)
    const organizationLogoData: any = localStorage.getItem('organizationLogo')
    const organizationLogoObj: any = JSON.parse(organizationLogoData)

    const basicOrgAndCourseDetail = {
      courseName: studentValues?.studentCourseAndBatch?.courseName,
      organizationName: organizationObj.organizationName,
      organizationLogo: organizationLogoObj?.logo ? organizationLogoObj.logo : "",
      organizationEmail: organizationObj.organizationEmail,
      organizationAddress: organizationObj.organizationAddress,
      organizationPhoneNumber: organizationObj.organizationPhoneNumber,
    }

    let dateOfAdmission: any = studentValues?.studentPersonalDetails?.dateOfAdmission
    let dateOfBirth: any = studentValues?.studentPersonalDetails?.dob
    dateOfBirth = customDateFormatDash(dateOfBirth)
    dateOfAdmission = customDateFormatDash(dateOfAdmission)
    let studentData = {}
    if (studentValues?.studentPaymentDetails?.partPayment == 'true') {
      const studentDynamicFields = [
        ...(studentValues?.extraFields || []),
        ...(studentValues?.extraOldFields || [])
      ];

      studentData = {
        user: {
          userCustomerId: userCustomerObj.payload.customerId,
          userCustomerName: userCustomerObj.payload.customerName + ' ' + userCustomerObj.payload?.lastName,
          userCustomerEmail: userCustomerObj.payload.customerEmail,
          roleName: user.role.roleName,
          roleId: user.role?.roleId ? user.role.roleId : '',
          userEmployeeId: user?.employeeId ? user.employeeId : ''
        },
        customerId: user.customerId,
        rollNo: rollNumberFirstPart + randomID,
        organizationId: user.organizationId,
        studentFirstName: studentValues?.studentPersonalDetails?.firstName,
        studentLastName: studentValues?.studentPersonalDetails?.lastName,
        studentEmail: studentValues?.studentPersonalDetails?.email,
        studentDateOfBirth: dateOfBirth,
        dateOfAdmission: dateOfAdmission,
        studentImage: studentValues?.studentPersonalDetails?.studentImage ? studentValues?.studentPersonalDetails?.studentImage : "",
        referralpaymentStatus: studentValues?.agentData.paymentStatus ? studentValues?.agentData.paymentStatus : "",
        referralAmount: studentValues?.agentData.agentPayment ? parseInt(studentValues?.agentData.agentPayment) : 0,
        referedBy: studentValues?.agentData.agentId ? studentValues?.agentData?.agentId : "",
        studentCollage: studentValues?.StudentCollegeDetailsForm?.collegeName,
        studentDepartmentName: studentValues?.StudentCollegeDetailsForm?.departmentName,
        studentCourse: studentValues?.StudentCollegeDetailsForm?.collegeCourse,
        studentSemester: studentValues?.StudentCollegeDetailsForm?.collegeSemester,
        state: studentValues?.StudentCollegeDetailsForm?.selectedState,
        city: studentValues?.StudentCollegeDetailsForm?.selectedCity,
        studentContact: studentValues?.studentPersonalDetails?.phoneNumber,
        studentFatherName: studentValues?.studentPersonalDetails?.fathersName,
        studentFatherContact: studentValues?.studentPersonalDetails?.fathersPhoneNumber,
        studentEnrollmentNumber: studentValues?.studentPersonalDetails?.enrollmentNumber,
        studentAddress: studentValues?.studentPersonalDetails?.address,
        studentGender: studentValues?.studentPersonalDetails?.gender,
        studentDynamicFields: studentDynamicFields,
        basicOrgAndCourseDetail: basicOrgAndCourseDetail,
        courses: courseIdArray,
        batch: batchIdArray,
        coupon: studentValues?.studentPaymentDetails?.coupon ? couponIdArray : [],
        paymentDetails: {
          isPartPayment: true,
          totalPayment: studentValues?.studentPaymentDetails?.totalPaymentAmount,
          discountedPaymentAmount: studentValues?.studentPaymentDetails?.discountedPayment || studentValues?.studentPaymentDetails?.totalPaymentAmount,
          installmentDetails: installmentDetailsArray
        }
      }
    } else {

      const studentDynamicFields = [
        ...(studentValues?.extraFields || []),
        ...(studentValues?.extraOldFields || [])
      ];
      studentData = {
        user: {
          userCustomerId: userCustomerObj?.payload?.customerId,
          userCustomerName: userCustomerObj?.payload?.customerName + ' ' + userCustomerObj?.payload?.lastName,
          userCustomerEmail: userCustomerObj?.payload?.customerEmail,
          roleName: user.role.roleName,
          roleId: user.role?.roleId ? user?.role.roleId : '',
          userEmployeeId: user?.employeeId ? user.employeeId : ''
        },
        customerId: user.customerId,
        rollNo: rollNumberFirstPart + randomID,
        organizationId: user.organizationId,
        studentFirstName: studentValues?.studentPersonalDetails?.firstName,
        studentLastName: studentValues?.studentPersonalDetails?.lastName,
        studentEmail: studentValues?.studentPersonalDetails?.email,
        studentDateOfBirth: dateOfBirth,
        dateOfAdmission: dateOfAdmission,
        studentImage: studentValues?.studentPersonalDetails?.studentImage ? studentValues?.studentPersonalDetails?.studentImage : "",
        referralpaymentStatus: studentValues?.agentData.paymentStatus ? studentValues?.agentData.paymentStatus : "",
        referralAmount: studentValues?.agentData.agentPayment ? parseInt(studentValues?.agentData.agentPayment) : 0,
        referedBy: studentValues?.agentData.agentId ? studentValues?.agentData?.agentId : "",
        studentCollage: studentValues?.StudentCollegeDetailsForm?.collegeName,
        studentDepartmentName: studentValues?.StudentCollegeDetailsForm?.departmentName,
        studentCourse: studentValues?.StudentCollegeDetailsForm?.collegeCourse,
        studentSemester: studentValues?.StudentCollegeDetailsForm?.collegeSemester,
        state: studentValues?.StudentCollegeDetailsForm?.selectedState,
        city: studentValues?.StudentCollegeDetailsForm?.selectedCity,
        studentContact: studentValues?.studentPersonalDetails?.phoneNumber,
        studentFatherName: studentValues?.studentPersonalDetails?.fathersName,
        studentFatherContact: studentValues?.studentPersonalDetails?.fathersPhoneNumber,
        studentEnrollmentNumber: studentValues?.studentPersonalDetails?.enrollmentNumber,
        studentAddress: studentValues?.studentPersonalDetails?.address,
        studentGender: studentValues?.studentPersonalDetails?.gender,
        studentDynamicFields: studentDynamicFields,
        basicOrgAndCourseDetail: basicOrgAndCourseDetail,
        courses: courseIdArray,
        batch: batchIdArray,
        coupon: studentValues?.studentPaymentDetails?.coupon ? couponIdArray : [],
        paymentDetails: {
          isPartPayment: false,
          totalPayment: (studentValues?.studentPaymentDetails?.totalPaymentAmount),
          discountedPaymentAmount: (studentValues?.studentPaymentDetails?.discountedPayment || (studentValues?.studentPaymentDetails?.totalPaymentAmount)),
          totalReceivedPayment: (studentValues?.studentPaymentDetails?.installments[0].amount),
          paymentReceiveDate: customDateFormatDash(studentValues?.studentPaymentDetails?.installments[0].date),
          paymentNotes: studentValues?.studentPaymentDetails?.installments[0].description,
          allPaymentStatus: studentValues?.studentPaymentDetails?.firstPaymentInstallment == 'pay' ? "paid" : "due"
        }
      }
    }


    try {
      checkStudentEnrollmentNumber({
        customerId: user.customerId,
        studentEnrollmentNumber: studentValues.studentPersonalDetails.enrollmentNumber,
        organizationId: user.organizationId,
      })
        .then((res: any): any => {
          const statusCode = res?.data?.statuscode;
          const isUnique = res?.data?.isUnique;
          const existingOrgId = res?.data?.organizationId;

          const isSameOrg = existingOrgId === user.organizationId;

          if (statusCode === 200 && (isUnique || !isSameOrg)) {
            // Allow if unique, or it's from another organization
            // if (!isUnique && !isSameOrg) {
            //   setSnackbarColor(true);
            //   setOpen({
            //     open: true,
            //     mssg: "Enrollment number available (used in another organization)",
            //   });
            // }
            createStudentAdmission(studentData)
              .then(async (res: any) => {
                if (res?.data?.statusCode == 200) {
                  const fieldData: any = {
                    "customerId": user.customerId,
                    "organizationId": user.organizationId,
                    "flag": "form",
                    "extraFields": dynamicFields ? dynamicFields : []
                  }
                  createExtraField(fieldData).then((res: any) => {
                  })
                  try {
                    if (Object.keys(updationDataForm).length !== 0 && updationDataForm.hasOwnProperty('origin')) {

                      const data = {
                        user: {
                          userCustomerId: userCustomerObj.payload.customerId,
                          userCustomerName: userCustomerObj.payload.customerName + ' ' + userCustomerObj.payload?.lastName,
                          userCustomerEmail: userCustomerObj.payload.customerEmail,
                          roleName: user.role.roleName,
                          roleId: user.role?.roleId ? user.role.roleId : '',
                          userEmployeeId: user?.employeeId ? user.employeeId : ''
                        },
                        customerId: updationDataForm.customerId,
                        organizationId: updationDataForm.organizationId,
                        formTemplateId: updationDataForm.formTemplateId,
                        formId: updationDataForm.formId,
                        formStatus: 'student'
                      }
                      deleteSingleFormData(data)
                    }
                    else if (Object.keys(updationDataForm).length !== 0 && !updationDataForm.hasOwnProperty('origin')) {

                      const data = {
                        ...updationDataForm,
                        user: {
                          userCustomerId: userCustomerObj.payload.customerId,
                          userCustomerName: userCustomerObj.payload.customerName + ' ' + userCustomerObj.payload?.lastName,
                          userCustomerEmail: userCustomerObj.payload.customerEmail,
                          roleName: user.role.roleName,
                          roleId: user.role?.roleId ? user.role.roleId : '',
                          userEmployeeId: user?.employeeId ? user.employeeId : ''
                        },
                        formStatus: 'student'
                      }
                      enquiryBulkDataUpdate(data)
                    }
                    // return;
                    if (Object.keys(updationData).length !== 0) {
                      const newData = {
                        ...updationData,
                        "customerID": user?.customerId,
                        "organizationId": user?.organizationId,
                        status: 'student',
                      }
                      updateEnquiry({
                        user: {
                          userCustomerId: userCustomerObj.payload.customerId,
                          userCustomerName: userCustomerObj.payload.customerName + ' ' + userCustomerObj.payload?.lastName,
                          userCustomerEmail: userCustomerObj.payload.customerEmail,
                          roleName: user.role.roleName,
                          roleId: user.role?.roleId ? user.role.roleId : '',
                          userEmployeeId: user?.employeeId ? user.employeeId : ''
                        },
                        ...newData
                      })
                    }
                    await studentCollegeDetails()
                    if (
                      studentValues?.studentPaymentDetails?.coupon &&
                      (studentValues?.studentPaymentDetails?.coupon?.couponLimit == 'Both'
                        || studentValues?.studentPaymentDetails?.coupon?.couponLimit == 'couponCount')
                    ) {
                      const userCustomerData: any = localStorage.getItem('userDetails')
                      const userCustomerObj: any = JSON.parse(userCustomerData)
                      const userInfo = {
                        userCustomerId: userCustomerObj.payload.customerId,
                        userCustomerName: userCustomerObj.payload.customerName + ' ' + userCustomerObj.payload?.lastName,
                        userCustomerEmail: userCustomerObj.payload.customerEmail,
                        roleName: user.role.roleName,
                        roleId: user.role?.roleId ? user.role.roleId : '',
                        userEmployeeId: user?.employeeId ? user.employeeId : ''
                      }
                      couponCountCheck(user.customerId, user.organizationId, studentValues?.studentPaymentDetails?.coupon?.couponId, userInfo)
                    }

                    setSnackbarColor(true)
                    setOpen({ open: true, mssg: "Student created successfully" })
                    const orgData: any = localStorage.getItem('organization')
                    const parsedOrgData = JSON.parse(orgData)
                    if (studentValues?.studentPersonalDetails?.email && commonMessageRestriction?.student[0].mail == true) {
                      commonEmailService({
                        "action": "studentWelcome",
                        "studentWelcome": {
                          "studentWelcomeOrganizationName": handleCapitalizeFirstLetter(user?.organizationName) || "",
                          "studentWelcomeStudentEmail": studentValues?.studentPersonalDetails?.email,

                          "studentWelcomeStudentName": studentValues?.studentPersonalDetails?.lastName
                            ? `${handleCapitalizeFirstLetter(studentValues?.studentPersonalDetails?.firstName)} ${handleCapitalizeFirstLetter(studentValues?.studentPersonalDetails?.lastName)}`
                            : handleCapitalizeFirstLetter(studentValues?.studentPersonalDetails?.firstName),

                          "studentWelcomeOrganizationLogo": organizationLogoObj?.logo ? organizationLogoObj.logo : "",
                          "studentWelcomeEnvironment": `${process.env.NEXT_PUBLIC_ENVIRONMENT}`
                        }
                      })
                    }
                    if (Object.keys(commonMessageRestriction).length > 0) {
                      if (studentValues?.studentPersonalDetails?.phoneNumber || studentValues?.studentPersonalDetails?.fathersPhoneNumber) {

                        if ((commonMessageRestriction?.student[0]?.whatsapp == true || commonMessageRestriction?.student[0]?.sms == true) && studentValues?.studentPersonalDetails?.phoneNumber) {

                          const obj: any = {
                            "customerId": user?.customerId,
                            "organizationId": user?.organizationId,

                            "user": {
                              userCustomerId: userCustomerObj.payload.customerId,
                              userCustomerName: userCustomerObj.payload.customerName + ' ' + userCustomerObj.payload?.lastName,
                              userCustomerEmail: userCustomerObj.payload.customerEmail,
                              roleName: user.role.roleName,
                              roleId: user.role?.roleId ? user.role.roleId : '',
                              userEmployeeId: user?.employeeId ? user.employeeId : ''
                            },

                            "action": {
                              "actionOn": [
                                (commonMessageRestriction?.student[0].whatsapp ? "whatsapp" : ""),
                                (commonMessageRestriction?.student[0].sms ? "sms" : ""),
                              ],
                              "singleNumber": studentValues?.studentPersonalDetails?.phoneNumber,
                              "templateName": commonMessageRestriction?.student[0].whatsappName,
                              "templateId": commonMessageRestriction?.student[0].whatsappTemplateId,
                              "bodyParams": [
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentPersonalDetails?.firstName
                                    ? studentValues.studentPersonalDetails.firstName.charAt(0).toUpperCase() +
                                    studentValues.studentPersonalDetails.firstName.slice(1)
                                    : ""}${studentValues?.studentPersonalDetails?.lastName
                                      ? " " +
                                      studentValues.studentPersonalDetails.lastName.charAt(0).toUpperCase() +
                                      studentValues.studentPersonalDetails.lastName.slice(1)
                                      : ""}`
                                },
                                {
                                  "type": "text",
                                  "text": `${parsedOrgData?.organizationName?.charAt(0).toUpperCase() + parsedOrgData?.organizationName?.slice(1)}`
                                },
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentCourseAndBatch?.course?.courseName?.charAt(0).toUpperCase() + studentValues?.studentCourseAndBatch?.course?.courseName?.slice(1)}`
                                },
                              ],
                              "textBodyParams": [
                                {
                                  "value": `${studentValues?.studentPersonalDetails?.firstName
                                    ? studentValues.studentPersonalDetails.firstName.charAt(0).toUpperCase() +
                                    studentValues.studentPersonalDetails.firstName.slice(1)
                                    : ""}${studentValues?.studentPersonalDetails?.lastName
                                      ? " " +
                                      studentValues.studentPersonalDetails.lastName.charAt(0).toUpperCase() +
                                      studentValues.studentPersonalDetails.lastName.slice(1)
                                      : ""}`
                                },
                                {
                                  "value": `${studentValues?.studentCourseAndBatch?.course?.courseName?.charAt(0).toUpperCase() + studentValues?.studentCourseAndBatch?.course?.courseName?.slice(1)}`
                                }
                              ],
                              "smsTemplateId": commonMessageRestriction?.student[0].smsTemplateId,
                              "smsNumber": studentValues?.studentPersonalDetails?.phoneNumber
                            }
                          }
                          commonWhatspSmsMessage(obj, "noRecharge", router)
                        }
                        if ((commonMessageRestriction?.parents[0]?.whatsapp == true || commonMessageRestriction?.parents[0]?.sms == true) && studentValues?.studentPersonalDetails?.fathersPhoneNumber) {
                          const obj: any = {
                            "customerId": user?.customerId,
                            "organizationId": user?.organizationId,

                            "user": {
                              userCustomerId: userCustomerObj.payload.customerId,
                              userCustomerName: userCustomerObj.payload.customerName + ' ' + userCustomerObj.payload?.lastName,
                              userCustomerEmail: userCustomerObj.payload.customerEmail,
                              roleName: user.role.roleName,
                              roleId: user.role?.roleId ? user.role.roleId : '',
                              userEmployeeId: user?.employeeId ? user.employeeId : ''
                            },

                            "action": {
                              "actionOn": [
                                (commonMessageRestriction?.parents[0].whatsapp ? "whatsapp" : ""),
                                (commonMessageRestriction?.parents[0].sms ? "sms" : ""),
                              ],
                              "singleNumber": studentValues?.studentPersonalDetails?.fathersPhoneNumber,
                              "templateName": commonMessageRestriction?.parents[0].whatsappName,
                              "templateId": commonMessageRestriction?.parents[0].whatsappTemplateId,
                              "bodyParams": [
                                {
                                  "value": `${studentValues?.studentPersonalDetails?.studentFatherName
                                    ? studentValues.studentPersonalDetails.studentFatherName.charAt(0).toUpperCase() +
                                    studentValues.studentPersonalDetails.studentFatherName.slice(1)
                                    : "Sir"}`
                                },
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentPersonalDetails?.firstName
                                    ? studentValues.studentPersonalDetails.firstName.charAt(0).toUpperCase() +
                                    studentValues.studentPersonalDetails.firstName.slice(1)
                                    : ""}${studentValues?.studentPersonalDetails?.lastName
                                      ? " " +
                                      studentValues.studentPersonalDetails.lastName.charAt(0).toUpperCase() +
                                      studentValues.studentPersonalDetails.lastName.slice(1)
                                      : ""}`
                                },
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentCourseAndBatch?.course?.courseName?.charAt(0).toUpperCase() + studentValues?.studentCourseAndBatch?.course?.courseName?.slice(1)}`
                                },
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentCourseAndBatch?.courseFee}`
                                }

                              ],
                              "textBodyParams": [
                                {
                                  "value": `${studentValues?.studentPersonalDetails?.firstName
                                    ? studentValues.studentPersonalDetails.firstName.charAt(0).toUpperCase() +
                                    studentValues.studentPersonalDetails.firstName.slice(1)
                                    : ""}${studentValues?.studentPersonalDetails?.lastName
                                      ? " " +
                                      studentValues.studentPersonalDetails.lastName.charAt(0).toUpperCase() +
                                      studentValues.studentPersonalDetails.lastName.slice(1)
                                      : ""}`
                                },
                                {
                                  "value": `${studentValues?.studentCourseAndBatch?.course?.courseName?.charAt(0).toUpperCase() + studentValues?.studentCourseAndBatch?.course?.courseName?.slice(1)}`
                                }
                              ],
                              "smsTemplateId": commonMessageRestriction?.parents[0].smsTemplateId,
                              "smsNumber": studentValues?.studentPersonalDetails?.fathersPhoneNumber
                            }
                          }
                          commonWhatspSmsMessage(obj, "noRecharge", router)
                        }
                        if ((commonMessageRestriction?.student[2].whatsapp == true || commonMessageRestriction?.student[2].sms == true) && studentValues?.studentPersonalDetails?.phoneNumber && studentValues?.studentPaymentDetails?.firstPaymentInstallment == 'pay') {
                          const obj: any = {
                            "customerId": user?.customerId,
                            "organizationId": user?.organizationId,

                            "user": {
                              userCustomerId: userCustomerObj.payload.customerId,
                              userCustomerName: userCustomerObj.payload.customerName + ' ' + userCustomerObj.payload?.lastName,
                              userCustomerEmail: userCustomerObj.payload.customerEmail,
                              roleName: user.role.roleName,
                              roleId: user.role?.roleId ? user.role.roleId : '',
                              userEmployeeId: user?.employeeId ? user.employeeId : ''
                            },

                            "action": {
                              "actionOn": [
                                (commonMessageRestriction?.student[2].whatsapp ? "whatsapp" : ""),
                                (commonMessageRestriction?.student[2].sms ? "sms" : ""),
                              ],
                              "singleNumber": studentValues?.studentPersonalDetails?.phoneNumber,
                              "templateName": commonMessageRestriction?.student[2].whatsappName,
                              "templateId": commonMessageRestriction?.student[2].whatsappTemplateId,
                              "bodyParams": [
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentPersonalDetails?.firstName
                                    ? studentValues.studentPersonalDetails.firstName.charAt(0).toUpperCase() +
                                    studentValues.studentPersonalDetails.firstName.slice(1)
                                    : ""}${studentValues?.studentPersonalDetails?.lastName
                                      ? " " +
                                      studentValues.studentPersonalDetails.lastName.charAt(0).toUpperCase() +
                                      studentValues.studentPersonalDetails.lastName.slice(1)
                                      : ""}`
                                },
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentCourseAndBatch?.courseFee}`
                                },
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentCourseAndBatch?.course?.courseName?.charAt(0).toUpperCase() + studentValues?.studentCourseAndBatch?.course?.courseName?.slice(1)}`
                                }

                              ],
                              "textBodyParams": [
                                {
                                  "value": `${studentValues?.studentPersonalDetails?.firstName
                                    ? studentValues.studentPersonalDetails.firstName.charAt(0).toUpperCase() +
                                    studentValues.studentPersonalDetails.firstName.slice(1)
                                    : ""}${studentValues?.studentPersonalDetails?.lastName
                                      ? " " +
                                      studentValues.studentPersonalDetails.lastName.charAt(0).toUpperCase() +
                                      studentValues.studentPersonalDetails.lastName.slice(1)
                                      : ""}`
                                },
                                {
                                  "value": `${studentValues?.studentCourseAndBatch?.course?.courseName?.charAt(0).toUpperCase() + studentValues?.studentCourseAndBatch?.course?.courseName?.slice(1)}`
                                }
                              ],
                              "smsTemplateId": commonMessageRestriction?.student[2].smsTemplateId,
                              "smsNumber": studentValues?.studentPersonalDetails?.phoneNumber
                            }
                          }
                          commonWhatspSmsMessage(obj, "noRecharge", router)
                        }
                        if ((commonMessageRestriction?.parents[1].whatsapp == true || commonMessageRestriction?.parents[1].sms == true) && studentValues?.studentPersonalDetails?.fathersPhoneNumber && studentValues?.studentPaymentDetails?.firstPaymentInstallment == 'pay') {
                          const obj: any = {
                            "customerId": user?.customerId,
                            "organizationId": user?.organizationId,

                            "user": {
                              userCustomerId: userCustomerObj.payload.customerId,
                              userCustomerName: userCustomerObj.payload.customerName + ' ' + userCustomerObj.payload?.lastName,
                              userCustomerEmail: userCustomerObj.payload.customerEmail,
                              roleName: user.role.roleName,
                              roleId: user.role?.roleId ? user.role.roleId : '',
                              userEmployeeId: user?.employeeId ? user.employeeId : ''
                            },

                            "action": {
                              "actionOn": [
                                (commonMessageRestriction?.parents[1].whatsapp ? "whatsapp" : ""),
                                (commonMessageRestriction?.parents[1].sms ? "sms" : ""),
                              ],
                              "singleNumber": studentValues?.studentPersonalDetails?.fathersPhoneNumber,
                              "templateName": commonMessageRestriction?.parents[1].whatsappName,
                              "templateId": commonMessageRestriction?.parents[1].whatsappTemplateId,
                              "bodyParams": [
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentPersonalDetails?.studentFatherName
                                    ? studentValues.studentPersonalDetails.studentFatherName.charAt(0).toUpperCase() +
                                    studentValues.studentPersonalDetails.studentFatherName.slice(1)
                                    : "Sir"}`
                                },
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentCourseAndBatch?.courseFee}`
                                },
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentCourseAndBatch?.course?.courseName?.charAt(0).toUpperCase() + studentValues?.studentCourseAndBatch?.course?.courseName?.slice(1)}`
                                },
                                {
                                  "type": "text",
                                  "text": `${studentValues?.studentPersonalDetails?.firstName
                                    ? studentValues.studentPersonalDetails.firstName.charAt(0).toUpperCase() +
                                    studentValues.studentPersonalDetails.firstName.slice(1)
                                    : ""}${studentValues?.studentPersonalDetails?.lastName
                                      ? " " +
                                      studentValues.studentPersonalDetails.lastName.charAt(0).toUpperCase() +
                                      studentValues.studentPersonalDetails.lastName.slice(1)
                                      : ""}`
                                },

                              ],
                              "textBodyParams": [
                                {
                                  "value": `${studentValues?.studentPersonalDetails?.fathersName ? studentValues?.studentPersonalDetails?.fathersName : "Sir"}`
                                },
                                {
                                  "value": `${studentValues?.studentPersonalDetails?.firstName
                                    ? studentValues.studentPersonalDetails.firstName.charAt(0).toUpperCase() +
                                    studentValues.studentPersonalDetails.firstName.slice(1)
                                    : ""}${studentValues?.studentPersonalDetails?.lastName
                                      ? " " +
                                      studentValues.studentPersonalDetails.lastName.charAt(0).toUpperCase() +
                                      studentValues.studentPersonalDetails.lastName.slice(1)
                                      : ""}`
                                }
                              ],
                              "smsTemplateId": commonMessageRestriction?.parents[1].smsTemplateId,
                              "smsNumber": studentValues?.studentPersonalDetails?.fathersPhoneNumber
                            }
                          }
                          commonWhatspSmsMessage(obj, "noRecharge", router)
                        }
                      }
                    }
                  } catch (err) {
                    console.log(err)
                  }

                  setLoading(true)
                  removeStorageItems()
                  router.push('/student/studentList/')
                } else {
                  setLoading(true)
                  setSnackbarColor(false)
                  setOpen({ open: true, mssg: "Something went wrong" })
                }

              })
              .catch((err: any) => {
                setLoading(true)
                setSnackbarColor(false)
                setOpen({ open: true, mssg: "Try again later" })
                setLoading(false)
              })

            // if (fields.length > 0) {
            //   handleFieldSubmit();
            // }

            // const studentDetails = {
            //   ...studentValues(),
            //   studentImage: base64String,
            // };

            // sessionStorage.setItem(
            //   "studentPersonalDetails",
            //   JSON.stringify({ ...studentDetails, imageObj: imageObject })
            // );

          } else {
            // If it's a duplicate in the same organization
            setSnackbarColor(false);
            setOpen({
              open: true,
              mssg: res?.data?.message || "Enrollment number already exists in this organization",
            });
            setActiveStep(0);

          }
        })
        .catch((err: any) => {
          setSnackbarColor(false);
          setOpen({ open: true, mssg: "Error checking enrollment number" });
        })
        .finally(() => {
          // setIsSubmitting(false);
        });


    } catch (err) {
      setLoading(true)
      setSnackbarColor(false)
      setOpen({ open: true, mssg: "Try again later" })
      setLoading(false)
    }

  }, 1000)
  const [commonMessageRestriction, setCommonMessageRestriction] = useState<any>({})
  useEffect(() => {
    let studentDataObj: any = {}
    if (sessionStorage.getItem('studentPersonalDetails') !== null) {
      const studentPersonalDetails: any = sessionStorage.getItem('studentPersonalDetails')
      const studentValuesSession: any = JSON.parse(studentPersonalDetails)
      studentDataObj = {
        ...studentDataObj,
        studentPersonalDetails: studentValuesSession
      }
    }

    if (sessionStorage.getItem('studentDynamicFields') !== null) {
      const studentDynamicFields: any = sessionStorage.getItem('studentDynamicFields')
      const studentExtraFields: any = JSON.parse(studentDynamicFields)
      setDynamicFields(studentExtraFields)
      studentDataObj = {
        ...studentDataObj,
        extraFields: studentExtraFields
      }
    }

    if (sessionStorage.getItem('studentOldDynamicFields') !== null) {
      const studentOldDynamicFields: any = sessionStorage.getItem('studentOldDynamicFields')
      const studentExtraOldFields: any = JSON.parse(studentOldDynamicFields)
      setOldDynamicFields(studentExtraOldFields)
      studentDataObj = {
        ...studentDataObj,
        extraOldFields: studentExtraOldFields
      }
    }

    if (sessionStorage.getItem('studentCourseAndBatch') !== null) {
      const studentCourseAndBatch: any = sessionStorage.getItem('studentCourseAndBatch')
      const studentValuesSession: any = JSON.parse(studentCourseAndBatch)
      studentDataObj = {
        ...studentDataObj,
        studentCourseAndBatch: studentValuesSession
      }
    }

    if (sessionStorage.getItem('studentPaymentDetails') !== null) {
      const studentPaymentDetails: any = sessionStorage.getItem('studentPaymentDetails')
      const studentValuesSession: any = JSON.parse(studentPaymentDetails)
      studentDataObj = {
        ...studentDataObj,
        studentPaymentDetails: studentValuesSession
      }
    }

    if (sessionStorage.getItem('StudentCollegeDetailsForm') !== null) {
      const StudentCollegeDetailsForm: any = sessionStorage.getItem('StudentCollegeDetailsForm')
      const studentValuesSession: any = JSON.parse(StudentCollegeDetailsForm)
      studentDataObj = {
        ...studentDataObj,
        StudentCollegeDetailsForm: studentValuesSession
      }
    }

    if (agentData) {
      studentDataObj = {
        ...studentDataObj,
        agentData
      }
    }
    setStudentValues({ ...studentDataObj })
    const messageRestrictionData: any = localStorage.getItem('messageRestriction')
    if (messageRestrictionData !== 'undefined') {
      const parsedData: any = JSON.parse(messageRestrictionData)
      setCommonMessageRestriction(parsedData)
    }
  }, [])
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const handlePrint = () => {
    window.print();
  };

  function commonAddCommaInNumbers(num: any) {
    num = Number(num);
    num = num.toFixed(2);
    const decimalPart = num.substring(num.length - 3, num.length);
    num = num.substring(0, num.length - 3);

    let response = "";
    if (num.length > 3) {
      const lastSubString = num.substring(num.length - 3, num.length);
      if (parseFloat(num.length) % 2 == 0) {

        for (let c: any = 0; c < num.length - 3; c++) {
          if (parseFloat(c) % 2 == 0) {
            response += num[c];
            response += ","
          } else {
            response += num[c];
          }
        }

        response = response + lastSubString + decimalPart;
      } else {
        for (let c: any = 0; c < num.length - 3; c++) {
          if (parseFloat(c) % 2 != 0) {
            response += num[c];
            response += ","
          } else {
            response += num[c];
          }
        }

        response = response + lastSubString + decimalPart;
      }


    } else {
      return num + decimalPart;
    }

    return response;
  }
  if (loading) {
    return (
      <Box sx={{
        height: 'calc(100% - 8.4375rem)',
        display: 'flex', justifyContent: 'center', alignItems: 'center'
      }} mt={15}>
        <Loader />
      </Box>
    )
  } else {
    const fullName: any = studentValues?.studentPersonalDetails?.firstName + " " + studentValues?.studentPersonalDetails?.lastName
    return (
      <>
        <Card className="student-review print-area">
          <Box sx={{ mb: -5, display: 'flex', justifyContent: "start", flexDirection: "row", alignItems: "center" }}>
            <Typography
              className='capitalize'
              sx={{
                width: 1000,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: '-0.45px',
                fontSize: '2rem !important',
                padding: '2rem'
              }}
            >
              Student review page
            </Typography>

            <div style={{
              width: 850,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: '-0.45px',
              fontSize: '2rem !important',
              padding: '2rem'
            }}>
              {studentValues?.studentPersonalDetails?.studentImage ? (
                <img
                  src={studentValues?.studentPersonalDetails.studentImage}
                  style={{
                    width: 90,
                    height: 90,
                    fontWeight: 600,
                    marginLeft: "45px",
                    fontSize: '3rem',
                    borderRadius: "50%"
                  }}
                  alt="StudentImage"
                />
              ) : null}
            </div>
          </Box>


          {studentValues?.studentPersonalDetails && <>
            <Box sx={{ height: "100%", width: "100%", display: 'flex', flexDirection: "row" }}>
              <CardContent style={{ paddingTop: 0, }}>

                <Grid container sx={{ pb: '0 !important', pl: '10px' }}>
                  <Grid item xl={6} xs={6} sx={{ mb: { xl: 0, xs: 6 } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '400px', lg: '500px', xl: '600px' } }}>
                      <Typography sx={{ mb: 2, fontWeight: 500 }} className='capitalize'>Student personal details :</Typography>
                      <TableContainer sx={{ width: '1100px' }} >
                        <Table>
                          <TableBody sx={{ width: '100%' }}>
                            <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                              <Grid >
                                <MUITableCell sx={{ pb: '0 !important' }}>Full name</MUITableCell></Grid>

                              <Grid sx={{ width: '76%' }}>
                                <Tooltip placement="bottom-start" title={`${studentValues?.studentPersonalDetails?.firstName + studentValues?.studentPersonalDetails?.lastName}`}>

                                  <MUITableCell sx={{ pb: '0 !important', width: '200px' }} className='capitalize'>:  {stringReduce(fullName, 30)}</MUITableCell>
                                </Tooltip>
                              </Grid>
                            </TableRow>
                            <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                              <Grid sx={{ maxWidth: '60%' }}>
                                <MUITableCell sx={{ pb: '0 !important' }}>Enrollment number</MUITableCell></Grid>

                              <Grid sx={{ width: '76%' }}>
                                <MUITableCell sx={{ pb: '0 !important', }}>:  {studentValues?.studentPersonalDetails?.enrollmentNumber}</MUITableCell></Grid>
                            </TableRow>
                            <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                              <Grid sx={{ maxWidth: '60% !important' }}>

                                <MUITableCell sx={{ pb: '0 !important' }}>Email</MUITableCell></Grid>
                              <Grid sx={{ width: '76%' }}>
                                <Tooltip placement="bottom-start" title={`${studentValues?.studentPersonalDetails?.email}`}>
                                  <MUITableCell sx={{ pb: '0 !important' }}>:  {studentValues?.studentPersonalDetails?.email ? stringReduce(studentValues?.studentPersonalDetails?.email, 30) : "-"} </MUITableCell></Tooltip></Grid>
                            </TableRow>
                            <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                              <Grid sx={{ maxWidth: '60% !important' }}>
                                <MUITableCell sx={{ pb: '0 !important' }}>Mobile number</MUITableCell></Grid>

                              <Grid sx={{ width: '76%' }}>
                                <MUITableCell sx={{ pb: '0 !important' }}>:  {studentValues?.studentPersonalDetails?.phoneNumber}</MUITableCell></Grid>
                            </TableRow>
                            <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                              <Grid sx={{ maxWidth: '60% !important' }}>
                                <MUITableCell sx={{ pb: '0 !important' }}>Date of birth</MUITableCell></Grid>
                              <Grid sx={{ width: '76%' }}>
                                <MUITableCell sx={{ pb: '0 !important' }}>:  {studentValues?.studentPersonalDetails?.dob ? customDateFormat(studentValues?.studentPersonalDetails?.dob) : "-"}</MUITableCell>
                              </Grid>
                            </TableRow>
                            <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                              <Grid sx={{ maxWidth: '60% !important' }}>
                                <MUITableCell sx={{ pb: '0 !important' }}>Date of admission </MUITableCell></Grid>
                              <Grid sx={{ width: '76%' }}>
                                <MUITableCell sx={{ pb: '0 !important' }}>:  {studentValues?.studentPersonalDetails?.dateOfAdmission ? customDateFormat(studentValues?.studentPersonalDetails?.dateOfAdmission) : "-"}</MUITableCell>
                              </Grid>
                            </TableRow>
                            <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                              <Grid sx={{ maxWidth: '60% !important' }}>

                                <MUITableCell sx={{ pb: '0 !important' }}>Father's name </MUITableCell></Grid>
                              <Grid sx={{ width: '76%' }}>
                                <Tooltip placement="bottom-start" title={`${studentValues?.studentPersonalDetails?.fathersName ? studentValues?.studentPersonalDetails?.fathersName : "-"}`}>
                                  <MUITableCell sx={{ pb: '0 !important' }} className='capitalize'>:  {stringReduce(studentValues?.studentPersonalDetails?.fathersName ? studentValues?.studentPersonalDetails?.fathersName : "-", 30)}</MUITableCell></Tooltip></Grid>
                            </TableRow>
                            <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                              <Grid sx={{ maxWidth: '60% !important' }}>
                                <MUITableCell sx={{ pb: '0 !important' }}>Father's number </MUITableCell></Grid>
                              <Grid sx={{ width: '76%' }}>
                                <MUITableCell sx={{ pb: '0 !important' }}>:  {studentValues?.studentPersonalDetails?.fathersPhoneNumber ? studentValues?.studentPersonalDetails?.fathersPhoneNumber : "-"}</MUITableCell>
                              </Grid>
                            </TableRow>

                            <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                              <Grid sx={{ maxWidth: '60% !important' }}>
                                <MUITableCell sx={{ pb: '0 !important' }}>Address</MUITableCell></Grid>
                              <Grid sx={{ width: '76%' }}>
                                <Tooltip title={`${studentValues?.studentPersonalDetails?.address}`}>
                                  <MUITableCell sx={{ pb: '0 !important' }} className='capitalize'>:  {studentValues?.studentPersonalDetails?.address ? stringReduce(studentValues?.studentPersonalDetails?.address, 30) : "-"}</MUITableCell>
                                </Tooltip>
                              </Grid>
                            </TableRow>

                            <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                              <Grid sx={{ maxWidth: '60% !important' }}>
                                <MUITableCell sx={{ pb: '0 !important' }}>Gender </MUITableCell></Grid>
                              <Grid sx={{ width: '76%' }}>
                                <MUITableCell sx={{ pb: '0 !important' }} className='capitalize'>:  {studentValues?.studentPersonalDetails?.gender ? studentValues?.studentPersonalDetails?.gender : "-"}</MUITableCell>
                              </Grid>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>

                  </Grid>
                </Grid>
              </CardContent>

            </Box>
          </>
          }

          {studentValues?.StudentCollegeDetailsForm &&
            <>
              <CardContent sx={{ marginLeft: '10px' }}>
                <Typography sx={{ mb: 2, fontWeight: 500, mt: 2 }} className="capitalize">College details :</Typography>
                <TableContainer sx={{ width: '1100px' }}>
                  <Table>
                    <TableBody sx={{ width: '1100px' }}>
                      <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                        <Grid sx={{ maxWidth: '60% !important' }}>
                          <MUITableCell sx={{ pb: '0 !important' }}>State</MUITableCell></Grid>
                        <Grid sx={{ width: '76%' }}>
                          <MUITableCell sx={{ pb: '0 !important' }} className='capitalize'>:  {studentValues?.StudentCollegeDetailsForm?.selectedState}</MUITableCell></Grid>
                      </TableRow>
                      <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                        <Grid sx={{ maxWidth: '60% !important' }}>
                          <MUITableCell sx={{ pb: '0 !important' }}>City</MUITableCell></Grid>
                        <Grid sx={{ width: '76%' }}>
                          <MUITableCell sx={{ pb: '0 !important' }} className='capitalize'>:  {studentValues?.StudentCollegeDetailsForm?.selectedCity}</MUITableCell></Grid>
                      </TableRow>
                      <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                        <Grid sx={{ maxWidth: '60% !important' }}>
                          <MUITableCell sx={{ pb: '0 !important' }}>College  name</MUITableCell></Grid>
                        <Grid sx={{ width: '76%' }}>
                          <MUITableCell sx={{ pb: '0 !important' }} className='capitalize'>:  {studentValues?.StudentCollegeDetailsForm?.collegeName}</MUITableCell></Grid>
                      </TableRow>
                      <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                        <Grid sx={{ maxWidth: '60% !important' }}>
                          <MUITableCell sx={{ pb: '0 !important' }}>College  course</MUITableCell></Grid>
                        <Grid sx={{ width: '76%' }}>
                          <MUITableCell sx={{ pb: '0 !important' }} className='capitalize'>:  {studentValues?.StudentCollegeDetailsForm?.collegeCourse}</MUITableCell>
                        </Grid>
                      </TableRow>
                      <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                        <Grid sx={{ maxWidth: '60% !important' }}>
                          <MUITableCell sx={{ pb: '0 !important' }}>College  semester</MUITableCell></Grid>
                        <Grid sx={{ width: '76%' }}>
                          <MUITableCell sx={{ pb: '0 !important' }} >:  {studentValues?.StudentCollegeDetailsForm?.collegeSemester}</MUITableCell>
                        </Grid>
                      </TableRow>
                      <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                        <Grid sx={{ maxWidth: '60% !important' }}>
                          <MUITableCell sx={{ pb: '0 !important' }}>Department name</MUITableCell></Grid>
                        <Grid sx={{ width: '76%' }}>
                          <MUITableCell sx={{ pb: '0 !important' }} className='capitalize'>:  {studentValues?.StudentCollegeDetailsForm?.departmentName}</MUITableCell></Grid>
                      </TableRow>

                    </TableBody>
                  </Table>
                </TableContainer>

              </CardContent>
              <Divider
                sx={{ mt: theme => `${theme.spacing(1.25)} !important`, mb: theme => `${theme.spacing(4)} !important` }}
              />
            </>}


          {studentValues?.studentCourseAndBatch && <>
            <CardContent style={{ paddingTop: 2 }} sx={{ marginLeft: '10px' }}>
              <Typography sx={{ mb: 2, fontWeight: 500, mt: 2 }} className='capitalize'>Course & Batch details :</Typography>
              <TableContainer sx={{ width: '1100px' }}>
                <Table>
                  <TableBody sx={{ width: '1100px' }}>
                    <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                      <Grid sx={{ maxWidth: '60% !important' }}>
                        <MUITableCell sx={{ pb: '0 !important' }}>Course name</MUITableCell></Grid>
                      <Grid sx={{ width: '76%' }}>
                        <Tooltip title={`${studentValues?.studentCourseAndBatch?.course?.courseName?.toUpperCase()}`}>

                          <MUITableCell sx={{ cursor: 'pointer', pb: '0 !important', }} className='capitalize'>{stringReduce(`:  ${studentValues?.studentCourseAndBatch?.course?.courseName}`, 30)}</MUITableCell>
                        </Tooltip>
                      </Grid>
                    </TableRow>
                    <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                      <Grid sx={{ maxWidth: '60% !important' }}>
                        <MUITableCell sx={{ pb: '0 !important' }}>Course fee</MUITableCell></Grid>
                      <Grid sx={{ width: '76%' }}>
                        <MUITableCell sx={{ pb: '0 !important' }}>:  ₹ {commonAddCommaInNumbers(studentValues?.studentCourseAndBatch?.course?.courseFee)}</MUITableCell></Grid>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer >

              <TableContainer sx={{ width: '1100px' }}>
                <Table>
                  <TableBody sx={{ width: '1100px' }}>
                    <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                      <Grid sx={{ maxWidth: '60% !important' }}>
                        <MUITableCell sx={{ cursor: 'pointer', pb: '0 !important' }}>Batch name</MUITableCell></Grid>
                      <Grid sx={{ width: '76%' }}>
                        <Tooltip title={`${studentValues?.studentCourseAndBatch?.batch?.batchName?.toUpperCase()}`}>
                          <MUITableCell sx={{ pb: '0 !important' }} className='capitalize'>{stringReduce(`:  ${studentValues?.studentCourseAndBatch?.batch?.batchName}`, 30)}</MUITableCell>
                        </Tooltip>
                      </Grid>
                    </TableRow>

                  </TableBody>
                </Table>

              </TableContainer>

            </CardContent>


            <Divider
              sx={{ mt: theme => `${theme.spacing(1.25)} !important`, mb: theme => `${theme.spacing(4)} !important` }}
            />
          </>}

          {studentValues?.studentPaymentDetails && <>

            <CardContent style={{ paddingTop: 2, paddingBottom: 0 }}>
              <Grid container sx={{ p: { sm: 4, xs: 0 }, pb: '0 !important' }}>
                <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 6 } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ mb: 2, fontWeight: 500 }} className="capitalize">Payment details :</Typography>
                    <TableContainer sx={{ width: '1100px' }}>
                      <Table>
                        <TableBody sx={{ width: '1100px' }}>
                          <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                            <Grid sx={{ maxWidth: '60% !important' }}>
                              <MUITableCell sx={{ pb: '0 !important' }}>Part payment</MUITableCell></Grid>
                            <Grid sx={{ width: '76%' }}>
                              <MUITableCell sx={{ pb: '0 !important' }} className='capitalize'>:  {studentValues?.studentPaymentDetails?.partPayment == "false" ? "No" : "Yes"}</MUITableCell></Grid>
                          </TableRow>
                          {studentValues?.studentPaymentDetails?.coupon &&
                            <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                              <Grid sx={{ maxWidth: '60% !important' }}>

                                <MUITableCell sx={{ pb: '0 !important' }}>Coupon Name</MUITableCell>

                              </Grid>
                              <Grid sx={{ width: '76%' }}>
                                <Tooltip title={`${studentValues?.studentPaymentDetails?.coupon?.couponName?.toUpperCase()}`}>

                                  <MUITableCell sx={{ cursor: 'pointer', pb: '0 !important' }} className='capitalize'>:  {studentValues?.studentPaymentDetails?.coupon?.couponName}</MUITableCell>
                                </Tooltip>
                              </Grid>
                            </TableRow>}

                          <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                            <Grid sx={{ maxWidth: '60% !important' }}>
                              <MUITableCell sx={{ pb: '0 !important' }}>Course fee</MUITableCell></Grid>
                            <Grid sx={{ width: '76%' }}>
                              <MUITableCell sx={{ pb: '0 !important' }}>:  ₹ {commonAddCommaInNumbers(studentValues?.studentPaymentDetails?.totalPaymentAmount)}</MUITableCell></Grid>
                          </TableRow>
                          {studentValues?.studentPaymentDetails?.coupon &&
                            <>
                              <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                                <Grid sx={{ maxWidth: '60% !important' }}>
                                  <MUITableCell sx={{ pb: '0 !important' }}>Discount offered</MUITableCell></Grid>
                                <Grid sx={{ width: '76%' }}>
                                  <MUITableCell sx={{ pb: '0 !important' }}>:  ₹ {commonAddCommaInNumbers(studentValues?.studentPaymentDetails?.discountedPayment != null ?
                                    studentValues?.studentPaymentDetails?.totalPaymentAmount - studentValues?.studentPaymentDetails?.discountedPayment : 0)}</MUITableCell></Grid>
                              </TableRow>

                            </>
                          }


                          <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                            <Grid sx={{ maxWidth: '60% !important' }}>
                              <MUITableCell sx={{ pb: '0 !important' }}><b>Total</b></MUITableCell></Grid>
                            <Grid sx={{ width: '76%' }}>
                              <MUITableCell sx={{ pb: '0 !important' }}><b>:  ₹ {commonAddCommaInNumbers(studentValues?.studentPaymentDetails?.discountedPayment == null ?
                                studentValues?.studentPaymentDetails?.totalPaymentAmount : studentValues?.studentPaymentDetails?.discountedPayment)}</b></MUITableCell></Grid>
                          </TableRow>


                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                </Grid>
              </Grid>
            </CardContent>

            <CardContent style={{ paddingTop: 0 }}>
              <Grid container sx={{ pb: '0 !important', pl: 5 }}>
                <Grid item xl={6} xs={12} >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {studentValues?.studentPaymentDetails?.installments?.map((obj: any, index: any) => {
                      return (
                        <>
                          <Typography sx={{ mb: 1, mt: 5, fontWeight: 500 }}>Installment {index + 1} :</Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TableContainer key={index} sx={{ width: '1100px' }}>
                              <Table>
                                <TableBody sx={{ width: '1100px' }}>
                                  <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                                    <Grid sx={{ maxWidth: '60% !important' }}>
                                      <MUITableCell sx={{ pb: '0 !important' }}>Date</MUITableCell></Grid>
                                    <Grid sx={{ width: '76%' }}>
                                      <MUITableCell sx={{ pb: '0 !important' }}>:  {customDateFormat(obj?.date)}</MUITableCell></Grid>
                                  </TableRow>

                                  <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                                    <Grid sx={{ maxWidth: '60% !important' }}>
                                      <MUITableCell sx={{ pb: '0 !important' }}>Amount </MUITableCell></Grid>
                                    <Grid sx={{ width: '76%' }}>
                                      <MUITableCell sx={{ pb: '0 !important' }}>:  ₹ {commonAddCommaInNumbers(obj?.amount)}</MUITableCell></Grid>
                                  </TableRow>

                                  <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                                    <Grid sx={{ maxWidth: '60% !important' }}>
                                      <MUITableCell sx={{ pb: '0 !important' }}>Payment status </MUITableCell></Grid>
                                    <Grid sx={{ width: '76%' }}>
                                      <MUITableCell sx={{ pb: '0 !important' }} className='capitalize'>:  {obj?.status}</MUITableCell></Grid>
                                  </TableRow>

                                  <TableRow sx={{ display: 'flex !important', columnGap: { sm: '0px', xs: '20px' }, justifyContent: { sm: 'space-between', xs: 'normal' } }}>
                                    <Grid sx={{ maxWidth: '60% !important' }}>
                                      <MUITableCell sx={{ pb: '0 !important' }}>Description </MUITableCell></Grid>
                                    <Grid sx={{ width: '76%' }}>
                                      <MUITableCell sx={{ pb: '0 !important' }}>:  {obj?.description ? obj?.description : "   - "}</MUITableCell></Grid>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box >
                        </>

                      )
                    })}

                  </Box>

                </Grid>
              </Grid>
            </CardContent>

          </>}

        </Card >

        <Grid
          item
          sx={{ display: 'flex', justifyContent: 'space-between', pt: 5, width: { xs: '100%', md: '67%' } }}
        >
          <Button size='large' variant='outlined' color='secondary'
            onClick={() => setOpenBackPopup(true)}
            sx={{ ml: 8 }}>
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: '5px' }}>
            <Button
              size='large'
              variant='outlined'
              onClick={handlePrint}
            >
              {'Print'}
            </Button>
            <Button
              size='large'
              variant='contained'
              onClick={() => {
                if (!loading) {
                  setLoading(true)
                  handleSubmit()
                }
                setIsFormComplete(true)
              }}
            >
              {loading ? 'Loading...' : 'Submit'}
            </Button>

          </Box>
        </Grid>
      </>

    )
  }
}

export default StudentFormReview