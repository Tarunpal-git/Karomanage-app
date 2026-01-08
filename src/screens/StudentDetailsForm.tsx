import React, { useState, forwardRef, useEffect, useRef } from 'react'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import InputAdornment from '@mui/material/InputAdornment'
import EventNoteIcon from '@mui/icons-material/EventNote'
import Icon from 'src/@core/components/icon'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { customDateFormatDash } from 'src/@core/utils/format'
import { AllExtraFieldList, checkStudentEnrollmentNumber, createExtraField, deleteExtraField, getAllListReferralAgent } from 'src/store/APIs/Api'
import ClearIcon from '@mui/icons-material/Clear';
import { Close as CloseIcon } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import { json } from 'stream/consumers'
import { Autocomplete, Box } from '@mui/material'
import YourComponent from 'src/components/customFields/Dropdown'
import DynamicDropdown from 'src/components/customFields/Dropdown'
import CreateAgentPopUp from 'src/components/customFields/createAgentPopup'
import { Label } from 'recharts'
import { useRouter } from "next/router";
import { Snackbar, Alert } from "@mui/material";


interface StudentInputs {
  dob: DateType
  email: string
  radio: string
  select: string
  lastName: string
  password: string
  textarea: string
  checkbox: boolean
  firstName: string
  fathersName: string
  enrollmentNumber: string
  phoneNumber: string
  fathersPhoneNumber: string
  address: string
  gender: string
  referedBy: string
  dateOfAdmission: DateType
  studentImage: string
  imageObj: any

}

const StudentDetailsForm = (props: any) => {

  const { listAgent, setListAgent, agentData, setAgentPopup,
    setActiveStep, activeStep, user,
    setSnackbarColor, setOpen, enrollNumberFirstPart,
    setAgentData, agentPopup, setIsFormComplete, setUpdationData,
    setUpdationDataForm, updationDataForm, updationData, getAllStudentApi
  } = props

  const router = useRouter();
  const [image, setImage] = useState<any>()
  const [base64String, setBase64String] = useState<any>("");
  const [key, setKey] = useState(0);
  const [error, setError] = useState<any>(null)
  const [goBack, setGoBack] = useState<any>(false);
  const [inputValue, setInputValue] = React.useState('');
  const [dynamicFields, setDynamicFields] = React.useState<any>();
  const [newField, setNewField] = React.useState<any>(false);
  const [reCall, setReCall] = useState(false);
  const [isFieldDeleted, setIsFieldDeleted] = useState<any>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const [defaultStudentValues, setDefaultStudentValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dob: null,
    fathersName: '',
    fathersPhoneNumber: '',
    address: '',
    gender: '',
    enrollmentNumber: '',
    referedBy: '',
    dateOfAdmission: null,
    studentImage: '',
    imageObj: {}
  })

  const setAgentListApiCall = (newAgentData: any) => {
    setListAgent([...listAgent, newAgentData]); // Updating state
    setReCall(true)
  };


  useEffect(() => {
    const customerId = user?.customerId
    const organizationId = user?.organizationId
    getAllListReferralAgent(customerId, organizationId).then((res: any) => {
      setListAgent(res?.data?.data?.sort((a: any, b: any) => b.dateCreated - a.dateCreated));
    })
  }, [reCall])
  const [imageObject, setImageObject] = useState({})

  const handleImageChange = (e: any) => {
    setError(null);
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }
    const imageType = ["png", "jpeg", "jpg"];
    const splitedSelectedFile = selectedFile?.name?.split(".");
    const selectedFileExtension = splitedSelectedFile[splitedSelectedFile.length - 1];

    if (imageType.includes(selectedFileExtension) && selectedFile.size < 5 * 1024 * 1024) {
      setImage(selectedFile);


      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBase64String(base64String);
        let jsonImage = {
          lastModified: selectedFile.lastModified,
          lastModifiedDate: selectedFile.lastModifiedDate,
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          // webkitRelativePath: selectedFile.webkitRelativePath,
        }
        const updatedStudentValues = { ...defaultStudentValues, studentImage: base64String, imageObj: jsonImage };
        setDefaultStudentValues(updatedStudentValues);
        setImageObject(jsonImage)
      };
    }
    else if (selectedFile.size > 5 * 1024 * 1024) {
      setKey((prevState) => prevState + 1);
      setError('File size exceeds 5MB limit');
    }
    else if (!imageType.includes(selectedFileExtension)) {
      setKey((prevState) => prevState + 1);
      setError('File type not supported. Use PNG, JPEG, JPG.');
    }
  };


  const handleClear = () => {
    setImage(null);
    setKey((prevKey) => prevKey + 1);

    setDefaultStudentValues({ ...defaultStudentValues, studentImage: "" });

    const studentPersonalDetails = sessionStorage.getItem('studentPersonalDetails');

    if (studentPersonalDetails) {
      const parsedDetails = JSON.parse(studentPersonalDetails);
      parsedDetails.studentImage = "";
      sessionStorage.setItem('studentPersonalDetails', JSON.stringify(parsedDetails));
    }
  };
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [activeAgents, setActiveAgents] = useState<any[]>([]);
  const [isError, setIsError] = useState(false);
  const filterActiveAgent = async () => {
    const agents = await listAgent?.filter((agent: any) => agent.agentStatus === "active");
    if (agents) {
      await setActiveAgents(agents)
    }
  }
  useEffect(() => {
    filterActiveAgent()
  }, [listAgent]);
  const handleAgentChange = (event: any) => {
    const selectedAgentName = event;
    const agent = listAgent.find((agent: any) => agent.agentName === selectedAgentName);
    setAgentData({
      ...agentData, agentId: selectedAgentName?.agentId, agentName: selectedAgentName?.agentName, agentLastName: selectedAgentName?.agentLastName
    })
  };

  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const handleAgentSelect = (agent: any | null) => {
    setSelectedAgent(agent);

    setAgentData({
      ...agentData, agentId: agent?.agentId, agentName: agent?.agentName, agentLastName: agent?.agentLastName
    })
  };
  const handleValidation = () => {
    if (!agentData.paymentMode) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };
  const handleAgentSubmit = () => {
    handleValidation();
    if (agentData?.agentPayment && agentData?.paymentStatus == 'paid') {

      if (agentData.paymentMode) {
        setSubmitted(false)
        setAgentPopup(false)
      }
    }
    else {
      setSubmitted(false)
      setAgentPopup(false)
    }

    setAgentData({
      agentName: '',
      agentLastName: '',
      agentPayment: '',
      paymentStatus: '',
      paymentMode: '',
    });
  }

  useEffect(() => {
    if (enrollNumberFirstPart !== '') {
      setDefaultStudentValues(prevValues => ({
        ...prevValues,
        enrollmentNumber: enrollNumberFirstPart
      }))
    }
  }, [enrollNumberFirstPart])


  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const studentSchema = yup.object().shape({
    firstName: yup
      .string()

      .max(100, 'Your input is too long. Max(100 characters)')
      .matches(/^[a-zA-Z][a-zA-Z\s]*$/, 'Insert only normal characters')
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .required('This field is required'),

    email: Yup.string()

      .nullable()
      .email('Enter a valid email address')
      .test('isValidEmail', 'Enter a valid email address', function (value) {
        if (value && typeof value === 'string') {
          const trimmedValue = value.trim()
          const lowercasedValue = trimmedValue.toLowerCase()
          return lowercasedValue === trimmedValue
        }
        return true
      }),
    // .required('This field is required'),


    lastName: Yup.string()
      .max(100, 'Your input is too long. Max(100 characters)')
      .matches(/^[a-zA-Z][a-zA-Z\s]*$/, 'Insert only normal characters')
      .transform((value, originalValue) => (originalValue === '' ? undefined : value)),

    enrollmentNumber: Yup.string()
      .max(10, 'Your input is too long. Max(10 digits)')
      .nullable()
      .matches(/^[a-zA-Z0-9\s-]+$/, 'Insert only digits and hyphens')
      .test('isValidCode', 'Enter a valid enrollment number', function (value) {
        if (value && typeof value === 'string') {
          const trimmedValue = value.trim()
          return trimmedValue === value
        }
        return true
      })
      .required(' '),

    phoneNumber: Yup.string()
      .nullable()
      .trim()
      .required('This field is required') // Sabse pehle required error trigger karega
      .matches(phoneRegExp, 'Enter a valid phone number') // Pattern mismatch error
      .min(10, 'Enter a valid phone number') // Minimum length error
      .max(10, 'Enter a valid phone number'), // Maximum length error

    dob: Yup.string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .nullable(),
    dateOfAdmission: Yup.string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .nullable(),
    fathersName: Yup.string()
      .max(100, 'Your input is too long. Max(100 characters)')
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .matches(/^[a-zA-Z][a-zA-Z\s]*$/, 'Insert only normal characters'),

    fathersPhoneNumber: Yup.string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .matches(phoneRegExp, 'Enter a valid phone number') // Pattern mismatch error
      .nullable()
      .trim()
      .min(10, 'Enter a valid phone number') // Minimum length error
      .max(10, 'Enter a valid phone number'), // Maximum length error

    address: Yup.string()
      .max(100, 'Your input is too long. Max(100 characters)')
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .matches(/^(?!\s).+/, 'Enter a valid address'),

    gender: yup
      .string()
      // .oneOf(['Male', 'Female', 'Other'], 'Invalid gender selected') // Allowed values
      .notRequired(),
    // .required('Gender is required'),

    referedBy: Yup.string()
      .max(25, 'Your input is too long. Max(25 characters)')
      .matches(/^[a-zA-Z][a-zA-Z\s]*$/, 'Insert only normal characters')
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
  })

  const AgentSchema = yup.object().shape({
    agentPayment: yup
      .string() // Pehle string le rahe hain taaki empty string handle ho sake
      .test("is-required", "This field is required", (value: any) => value !== "")
      .test("is-number", "Referred amount must be a positive number", (value: any) => /^\d+$/.test(value)) // Ensure only numbers
      .test("is-positive", "Amount must be greater than 0", (value: any) => parseInt(value, 10) > 0),


    paymentStatus: yup.string().required("This field is required"),

    paymentMode: yup
      .string()
      .when("paymentStatus", {
        is: "paid",
        then: yup.string().required("This field is required"),
      }),
  });

  const {
    control: agentControl,
    handleSubmit: handleAgentDataSubmit,
    setValue: agentValue,
    watch: watchAgent,
    reset: agentReset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AgentSchema),
    defaultValues: {
      agentPayment: "",
      paymentStatus: "",
      paymentMode: "",
    },
  });

  const paymentStatus = watchAgent("paymentStatus");

  const onAgentSubmit = (data: any) => {
    setSubmitted(true);
    // setAgentData(data); // Set agent data after validation
    agentReset()
    setAgentPopup(false);
  };



  const CustomInput = forwardRef(({ ...props }: any, ref) => {
    return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
  })

  const {
    reset: studentReset,
    control,
    getValues: studentValues,
    handleSubmit: handleStudentSubmit,
    setValue,
    watch,
    formState: { errors: studentErrors }
  } = useForm<StudentInputs>({
    defaultValues: defaultStudentValues,
    resolver: yupResolver(studentSchema)
  })
  const watchValues = watch()

  useEffect(() => {
    if (enrollNumberFirstPart !== undefined && enrollNumberFirstPart !== studentValues().enrollmentNumber) {
      setValue('enrollmentNumber', enrollNumberFirstPart)
    }
  }, [enrollNumberFirstPart, setValue, studentValues])

  const convertDateStringToDate = (dateString: string): Date => {
    if (!dateString) {
      throw new Error("Invalid date string");
    }

    const [day, month, year]: any = dateString.split('-').map(Number);

    if ([day, month, year].some(isNaN)) {
      throw new Error("Invalid date format");
    }

    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    if (sessionStorage.getItem('studentPersonalDetails') !== null && activeStep == 0) {
      const studentPersonalDetails: any = sessionStorage.getItem('studentPersonalDetails')
      const studentValuesSession: any = JSON.parse(studentPersonalDetails)
      setValue('firstName', studentValuesSession.firstName)
      setValue('lastName', studentValuesSession.lastName)
      setValue('email', studentValuesSession.email)
      setValue('phoneNumber', studentValuesSession.phoneNumber)
      setValue('fathersName', studentValuesSession.fathersName)
      setValue('fathersPhoneNumber', studentValuesSession.fathersPhoneNumber)
      setValue('address', studentValuesSession.address)
      setValue('gender', studentValuesSession.gender)
      setValue('enrollmentNumber', studentValuesSession.enrollmentNumber)
      setValue('referedBy', studentValuesSession.referedBy)
      setValue('studentImage', studentValuesSession.studentImage)
      setValue('imageObj', studentValuesSession.imageObj)
      setImageObject(studentValuesSession.imageObj)


      if (studentValuesSession.dob != null) {
        const dob: any = convertDateStringToDate(customDateFormatDash(studentValuesSession.dob))
        setValue('dob', dob)
      }

      if (studentValuesSession.dateOfAdmission != null) {
        const dateOfAdmission: any = convertDateStringToDate(customDateFormatDash(studentValuesSession.dateOfAdmission))
        setValue('dateOfAdmission', dateOfAdmission)
      }

    }
  }, [activeStep])

  const [formValues, setFormValues] = useState({
    agentPayment: agentData?.agentPayment || '',
    paymentStatus: agentData?.paymentStatus || '',
    paymentMode: agentData?.paymentMode || '',
  });
  useEffect(() => {
    if (
      watchValues.firstName ||
      watchValues.lastName ||
      watchValues.email ||
      watchValues.phoneNumber ||
      watchValues.fathersName ||
      watchValues.address ||
      watchValues.gender ||
      watchValues.fathersPhoneNumber ||
      watchValues.referedBy ||
      watchValues.studentImage
    ) {
      setIsFormComplete(false)
    }
  }, [watchValues])

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
      },
    },
  };

  const currentDate = new Date()
  currentDate.setFullYear(currentDate.getFullYear() - 5)
  const minDate = new Date(currentDate)
  minDate.setFullYear(minDate.getFullYear() - 100)
  const maxDate = new Date(currentDate)
  maxDate.setMonth(11, 31)

  // const onSubmit = () => {
  //   let customerId = user.customerId
  //   let organizationId = user.organizationId
  //   if (activeStep == 0) {

  //     checkStudentEnrollmentNumber({
  //       customerId: customerId,
  //       studentEnrollmentNumber: studentValues().enrollmentNumber,
  //       organizationId: organizationId
  //     })
  //       .then((res: any): any => {
  //         if (res?.data?.statuscode == 200) {
  //           if (fields.length > 0) {
  //             handleFieldSubmit()
  //           }

  //           const studentDetails = {
  //             ...studentValues(),
  //             studentImage: base64String
  //           }
  //           sessionStorage.setItem('studentPersonalDetails', JSON.stringify({ ...studentDetails, imageObj: imageObject }))
  //           setActiveStep(activeStep + 1)
  //         } else {
  //           setSnackbarColor(false)
  //           setOpen({ open: true, mssg: res.data.message })
  //         }
  //       })
  //       .catch((err: any) => console.log(err))


  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = () => {
    const customerId = user.customerId;
    const organizationId = user.organizationId;

    if (activeStep === 0) {
      setIsSubmitting(true);

      checkStudentEnrollmentNumber({
        customerId,
        studentEnrollmentNumber: studentValues().enrollmentNumber,
        organizationId,
      })
        .then((res: any): any => {
          const statusCode = res?.data?.statuscode;
          const isUnique = res?.data?.isUnique;
          const existingOrgId = res?.data?.organizationId;

          const isSameOrg = existingOrgId === organizationId;

          if (statusCode === 200 && (isUnique || !isSameOrg)) {
            // Allow if unique, or it's from another organization
            if (!isUnique && !isSameOrg) {
              setSnackbarColor(true);
              setOpen({
                open: true,
                mssg: "Enrollment number available",
              });
            }

            if (fields.length > 0) {
              handleFieldSubmit();
            }

            const studentDetails = {
              ...studentValues(),
              studentImage: base64String,
            };

            sessionStorage.setItem(
              "studentPersonalDetails",
              JSON.stringify({ ...studentDetails, imageObj: imageObject })
            );

            setActiveStep(activeStep + 1);
          } else {
            // If it's a duplicate in the same organization
            setSnackbarColor(false);
            setOpen({
              open: true,
              mssg: res?.data?.message || "Enrollment number already exists in this organization",
            });
          }
        })
        .catch((err: any) => {
          console.error("❌ API Error:", err);
          setSnackbarColor(false);
          setOpen({ open: true, mssg: "Error checking enrollment number" });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };





  useEffect(() => {
    if (updationData.email) {
      const agent = listAgent.find((agent: any) => agent.agentEmail === updationData?.leadManager?.managerEmail);
      if (agent?.agentId) {
        setAgentData({
          ...agentData, agentId: agent.agentId, agentName: agent.agentName, agentLastName: agent?.agentLastName
        })
      }
    } else if (updationDataForm.customerId) {

      const agent = listAgent.find((agent: any) => agent.agentEmail === updationDataForm?.formData?.leadManager?.managerEmail);
      if (agent?.agentId) {
        setAgentData({
          ...agentData, agentId: agent.agentId, agentName: agent.agentName, agentLastName: agent?.agentLastName
        })
      }
    }
  }, [listAgent?.length])


  useEffect(() => {
    const localStorageDataString = localStorage.getItem('enquiryStudent')
    const localStorageDataStringFrom = localStorage.getItem('enquiryStudentForm')
    if (localStorageDataString) {
      const localStorageData = JSON.parse(localStorageDataString)
      setUpdationData({ ...localStorageData, status: 'inActive' })
      Object.keys(localStorageData).forEach(key => {
        switch (key) {
          case 'studentName':
            setValue('firstName', localStorageData[key].split(' ')[0])
            setValue('lastName', localStorageData[key].split(' ')[localStorageData[key].split(' ').length - 1])
            break
          case 'parentName':
            setValue('fathersName', localStorageData[key])
            break
          case 'parentContact':
            setValue('fathersPhoneNumber', localStorageData[key])
            break
          case 'email':
            setValue('email', localStorageData[key])
            break
          case 'mobileNumber':
            setValue('phoneNumber', localStorageData[key])
            break

          default:
            // setValue(key, localStorageData[key]);
            break
        }
      })
    } else if (localStorageDataStringFrom) {
      const localStorageData = JSON.parse(localStorageDataStringFrom)
      setUpdationDataForm({ ...localStorageData, formStatus: 'student' })
      Object.keys(localStorageData).forEach(key => {
        switch (key) {
          case 'studentName':
            setValue('firstName', localStorageData[key].split(' ')[0])
            if (localStorageData[key].split(' ').length > 1) {
              setValue('lastName', localStorageData[key].split(' ')[localStorageData[key].split(' ').length - 1])
            }
            break
          case 'parentContact':
            setValue('fathersPhoneNumber', localStorageData[key])
            break
          case 'email':
            setValue('email', localStorageData[key])
            break
          case 'mobileNumber':
            setValue('phoneNumber', localStorageData[key])
            break

          default:
            // setValue(key, localStorageData[key]);
            break
        }
      })
    }
  }, [])
  const getAcceptedMediaTypes = (mediaType: string) => {
    switch (mediaType) {
      case "image":
        return "image/png, image/jpeg, image/jpg";
      default:
        return "*/*";
    }
  };

  // Add dynamic field code

  // const getAllExtraFieldList = function () {
  //   const customerId = user?.customerId
  //   const organizationId = user?.organizationId
  //   const flag = "form"

  //   if (customerId && organizationId) {
  //     AllExtraFieldList(customerId, organizationId, flag).then((res: any) => {
  //       setIsFieldDeleted(false)
  //       // setDynamicFields(res?.data?.data)


  //       if (res?.data?.data) {
  //         const keyName = Object?.keys(res?.data?.data)[0];

  //         const fieldsArray = Object?.entries(res?.data?.data[keyName])?.map(([key, value]) => {
  //           return {
  //             [key]: value,
  //             type: typeof value === "number" ? "number" : "text"
  //           };
  //         });
  //         setDynamicFields(fieldsArray)

  //       }

  //     })
  //   }
  // }

  useEffect(() => {
    if (activeStep === 0) {
      const storedFields = sessionStorage.getItem("studentDynamicFields");

      if (storedFields) {
        const parsedFields = JSON.parse(storedFields); // Parse the stored array

        // Convert to desired format: [{ fieldName, value, type }]
        const formattedFields = parsedFields.map((item: any) => {
          const fieldKey = Object.keys(item).find((key) => key !== "type") || "field";
          return {
            fieldName: fieldKey,
            value: item[fieldKey],
            type: item.type || "text"
          };
        });

        setFields(formattedFields); // Set in state
      }
    }
  }, [activeStep]);


  const getAllExtraFieldList = function () {
    const customerId = user?.customerId;
    const organizationId = user?.organizationId;
    const flag = "form";

    if (customerId && organizationId) {
      AllExtraFieldList(customerId, organizationId, flag).then((res: any) => {
        setIsFieldDeleted(false);

        if (res?.data?.data) {

          if (Object.keys(res.data.data).length !== 0) {
            const keyName = Object?.keys(res?.data?.data)[0];

            // const fieldsArray = Object?.entries(res?.data?.data[keyName]).map(([key, value]) => {
            //   let fieldType = "text"; // Default type

            //   if (typeof value === "number") {
            //     fieldType = "number";
            //   } else if (typeof value === "string" && (emailRegex.test(value) || key.toLowerCase().includes("email"))) {
            //     fieldType = "email";
            //   }

            //   return {
            //     [key]: value,
            //     type: fieldType
            //   };
            // });

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            const fieldsArray = Object.entries(res?.data?.data[keyName]).map(([key, value]) => {
              let fieldType = "text"; // Default type

              if (typeof value === "number") {
                fieldType = "number";
              } else if (typeof value === "string") {
                // Check if 'email' is anywhere in the key (case-insensitive)
                if (key.toLowerCase().includes("email") || emailRegex.test(value)) {
                  fieldType = "email";
                } else {
                  fieldType = "text"; // explicitly set to text
                }
              }

              return {
                [key]: value,
                type: fieldType
              };
            });

            setDynamicFields(fieldsArray);
          }
        }
      });

    }
  };

  useEffect(() => {

    getAllExtraFieldList()
  }, [user])


  const [fields, setFields] = useState<{ fieldName: string; value: string; type: string }[]>([]);
  const [oldFields, setOldFields] = useState<{ fieldName: string; value: string; type: string }[]>([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  const [showFieldInput, setShowFieldInput] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Function to convert string to camelCase
  const toCamelCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");
  };

  // Add new field
  // const handleAddField = () => {
  //   if (newFieldName.trim() === "") return;

  //   const formattedFieldName = toCamelCase(newFieldName); // Convert to camelCase
  //   const newField = { fieldName: formattedFieldName, value: "", type: newFieldType };

  //   setFields([...fields, newField]);
  //   setNewFieldName("");
  //   setNewFieldType("text");
  //   setShowFieldInput(false);
  // };

  const handleAddField = () => {
    if (newFieldName.trim() === "") return;

    const formattedFieldName = toCamelCase(newFieldName);

    // Check in dynamicField
    const isDuplicate = dynamicFields?.some((fieldObj: any) => {
      const firstKey = Object.keys(fieldObj)[0]; // get first key
      return firstKey === formattedFieldName;
    });

    if (isDuplicate) {
      setSnackbarOpen(true); // Show error Snackbar
      return;
    }

    const newField = {
      fieldName: formattedFieldName,
      value: "",
      type: newFieldType,
    };

    setFields([...fields, newField]);
    setNewFieldName("");
    setNewFieldType("text");
    setShowFieldInput(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  // Show field input
  const handleShowFieldInput = () => {
    setShowFieldInput(true);
  };

  // Update field value
  const emailRegex = /^[a-z0-9.+-@]*$/;

  const handleDynamicFieldChange = (index: number, value: string) => {
    if (dynamicFields[index].type === "email" && !emailRegex.test(value)) {
      return;
    }

    const updatedFields = [...dynamicFields];
    const fieldKey = Object.keys(updatedFields[index])[0];
    updatedFields[index][fieldKey] = value;
    setDynamicFields(updatedFields);
  };

  const handleChange = (index: number, value: string) => {
    if (fields[index].type === "email" && !emailRegex.test(value)) {
      return;
    }

    const updatedFields = [...fields];
    updatedFields[index].value = value;
    setFields(updatedFields);
  };



  // Remove a field
  // const handleRemoveField = (index: number) => {
  //   const updatedFields = fields.filter((_, i) => i !== index);
  //   setFields(updatedFields);

  //   if (updatedFields.length === 0) setShowFieldInput(false);
  // };

  const handleRemoveField = (index: number) => {
    // Remove from fields state
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);

    // Remove from sessionStorage
    const storedFields = sessionStorage.getItem("studentDynamicFields");

    if (storedFields) {
      const parsedFields = JSON.parse(storedFields);

      // Remove from the same index
      const updatedStoredFields = parsedFields.filter((_: any, i: number) => i !== index);

      sessionStorage.setItem("studentDynamicFields", JSON.stringify(updatedStoredFields));
    }

    if (updatedFields.length === 0) setShowFieldInput(false);
  };


  const handleRemoveDynamicField = (field: any, index: number) => {
    const fieldKey = Object.keys(field)[0];
    // const updatedFields = fields.filter((_, i) => i !== index);
    // setFields(updatedFields);
    // if (updatedFields.length === 0) setShowFieldInput(false);

    const customerId = user?.customerId
    const organizationId = user?.organizationId
    const flag = "form"

    const data = {

      "customerId": customerId,
      "organizationId": organizationId,
      "flag": flag,
      "keyToRemove": fieldKey
    }

    deleteExtraField(data).then((res: any) => {
      // setIsFieldDeleted(true)
      getAllExtraFieldList()
    })
  };


  const handleFieldSubmit = () => {
    try {

      // Formatted Data
      const formattedData = fields.map((field) => ({
        [field.fieldName]: field.value,
        type: field.type,
      }));


      const fieldData: any = {
        customerId: user.customerId,
        organizationId: user.organizationId,
        flag: "form",
        extraFields: formattedData,
      };

      // Store in sessionStorage if data exists
      if (formattedData.length > 0) {
        sessionStorage.setItem("studentDynamicFields", JSON.stringify(formattedData));
      } else {
        console.warn("⚠️ Formatted data is empty, skipping sessionStorage update.");
      }

      if (dynamicFields.length > 0) {
        sessionStorage.setItem("studentOldDynamicFields", JSON.stringify(dynamicFields));
      } else {
        console.warn("⚠️ dynamicFields is empty, skipping sessionStorage update.");
      }

    } catch (error) {
      console.error("❌ Error in handleFieldSubmit:", error);
    }
  };

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      sessionStorage.removeItem("studentDynamicFields");
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  function camelCaseToWords(str: any) {
    return str.replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .toLowerCase() // Convert the whole string to lowercase
      .replace(/^./, (char: any) => char.toUpperCase()); // Capitalize only the first letter
  }
  useEffect(() => {
    if (activeStep == 0) {
      getAllStudentApi()
    }
  }, [user, activeStep])
  return (
    <>
      <form onSubmit={handleStudentSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Student Details
            </Typography>
            <Typography variant='caption' component='p'>
              Enter Student Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='firstName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='First name *'
                    onChange={onChange}
                    placeholder='First name *'
                    error={Boolean(studentErrors.firstName)}
                    aria-describedby='stepper-linear-account-firstName'
                    autoComplete='new-firstName'
                    inputProps={{
                      maxLength: 100
                    }}
                  />
                )}
              />
              {studentErrors.firstName && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-firstName'>
                  {studentErrors.firstName?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='lastName'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Last name '
                    onChange={onChange}
                    placeholder='Last name '
                    error={Boolean(studentErrors.lastName)}
                    aria-describedby='stepper-linear-account-lastName'
                    autoComplete='new-lastname'

                  />
                )}
              />
              {studentErrors.lastName && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-lastName'>
                  {studentErrors.lastName?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type='email'
                    value={value}
                    label='Email'
                    onChange={onChange}
                    error={Boolean(studentErrors.email)}
                    placeholder='email@gmail.com'
                    aria-describedby='stepper-linear-account-email'
                    autoComplete=' new-email'

                  />
                )}
              />
              {studentErrors.email && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-email'>
                  {studentErrors.email?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePickerWrapper>
              <Controller
                name='dob'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={value}
                    showYearDropdown
                    showMonthDropdown
                    yearDropdownItemNumber={50}
                    onChange={e => onChange(e)}
                    autoComplete='new-dob'
                    placeholderText='DD/MM/YYYY'
                    minDate={minDate}
                    maxDate={maxDate}
                    customInput={
                      <CustomInput
                        value={value}
                        onChange={(e: any) => onChange(e)}
                        label='Date of birth '
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <EventNoteIcon />
                            </InputAdornment>
                          ),
                          readOnly: true,
                        }}
                        error={Boolean(studentErrors.dob)}
                        aria-describedby='validation-basic-dob'
                      />
                    }
                  />
                )}
              />
            </DatePickerWrapper>
            {studentErrors.dob && (
              <FormHelperText sx={{ mx: 3.5, color: 'error.main' }} id='validation-basic-dob'>
                {studentErrors.dob?.message}
              </FormHelperText>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='enrollmentNumber'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Enrollment number *'
                    onChange={onChange}
                    placeholder='Enrollment number '
                    error={Boolean(studentErrors.enrollmentNumber)}
                    aria-describedby='stepper-linear-account-enrollmentNumber'
                    autoComplete='new-enrollmentNumber'
                    inputProps={{
                      maxLength: 50
                    }}
                    InputLabelProps={{
                      shrink: true // This makes the label shrink when there is a value
                    }}
                  />
                )}
              />
              {studentErrors.enrollmentNumber && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-enrollmentNumber'>
                  {studentErrors.enrollmentNumber?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='phoneNumber'
                control={control}
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
                    inputProps={{
                      inputMode: 'numeric',
                      onKeyDown: (e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }

                      },
                      onWheel: (e: any) => e.target.blur(), // Blurs the input field to prevent value change
                    }}
                    fullWidth
                    type='number'
                    label='Phone number *'
                    onChange={onChange}
                    value={value}
                    placeholder='123-456-8790'
                    error={Boolean(studentErrors.phoneNumber)}
                    autoComplete='new-phonenumber'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Icon icon='bx:phone' />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              {studentErrors.phoneNumber && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-phoneNumber'>
                  {studentErrors.phoneNumber?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='fathersName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label="Father's name "
                    onChange={onChange}
                    placeholder="Father's name "
                    error={Boolean(studentErrors.fathersName)}
                    aria-describedby='stepper-linear-account-fathersName'
                    autoComplete='new-fathername'

                  />
                )}
              />
              {studentErrors.fathersName && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-fathersName'>
                  {studentErrors.fathersName?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='fathersPhoneNumber'
                control={control}
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
                    inputProps={{

                      inputMode: 'numeric',
                      onKeyDown: (e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }

                      },
                      onWheel: (e: any) => e.target.blur(), // Blurs the input field to prevent value change
                    }}
                    fullWidth
                    type='number'
                    label="Father's phone number "
                    value={value}
                    onChange={onChange}
                    placeholder='123-456-8790'
                    error={Boolean(studentErrors.fathersPhoneNumber)}
                    autoComplete='new-fathersPhoneNumber'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Icon icon='bx:phone' />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              {studentErrors.fathersPhoneNumber && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-fathersPhoneNumber'>
                  {studentErrors.fathersPhoneNumber?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type='string'
                    value={value}
                    label='Address '
                    onChange={onChange}
                    placeholder='Address '
                    error={Boolean(studentErrors.address)}
                    aria-describedby='stepper-linear-account-address'
                    autoComplete='OFF'
                  />
                )}
              />
              {studentErrors.address && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-address'>
                  {studentErrors.address?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel
              >
                Gender
              </InputLabel>
              <Controller
                name='gender'
                control={control}
                // rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value}
                    label='Gender'
                    onChange={onChange}
                  >

                    <MenuItem value='Male'>Male</MenuItem>
                    <MenuItem value='Female'>Female</MenuItem>
                    <MenuItem value='Other'>Other</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* <Grid item xs={12} sm={6}>

            <FormControl fullWidth >
              <InputLabel id="employeereference-type-label">Referred by</InputLabel>
              <Select
                value={agentData?.agentName}
                id="Referred-type-label"
                placeholder='Referred by'
                label='Referred by'
                MenuProps={MenuProps}
                onChange={(event) => {
                  setAgentPopup(true)
                  handleAgentChange(event)
                }}
                style={{ maxHeight: '100px', overflowY: 'auto' }}
              >
                {activeAgents?.length > 0 ? (
                  activeAgents?.map((agent: any) => (
                    <MenuItem key={agent?.value} value={agent?.agentName} >
                      {agent?.agentLastName
                        ? agent?.agentName?.charAt(0)?.toUpperCase() +
                        agent?.agentName?.slice(1) +
                        '  ' +
                        agent?.agentLastName?.charAt(0)?.toUpperCase() +
                        agent?.agentLastName?.slice(1)
                        : agent?.agentName?.charAt(0)?.toUpperCase() + agent?.agentName?.slice(1)}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    No options
                  </MenuItem>
                )}
              </Select>
            </FormControl>

          </Grid> */}

          {/* <Grid item xs={12} sm={6}>
            <Autocomplete
              id="referred-by-autocomplete"
              options={activeAgents}
              getOptionLabel={(option) =>
                option.agentLastName
                  ? `${option?.agentName?.charAt(0)?.toUpperCase()}${option?.agentName?.slice(1)} ${option.agentLastName.charAt(0).toUpperCase()}${option.agentLastName.slice(1)} `
                  : `${option?.agentName?.charAt(0)?.toUpperCase()}${option?.agentName?.slice(1)}`
              }
              value={agentData || null} // Pass the full object, not just a property
              onChange={(event, newValue) => {
                setAgentData(newValue); // Update the full object in state
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              isOptionEqualToValue={(option, value) => option.value === value?.value} // Match full objects
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Referred by"
                  placeholder="Search agents"
                  fullWidth
                />
              )}
              renderOption={(props, option) => {
                const isSelected = agentData?.value === option.value; // Check if the option is selected
                return (
                  <MenuItem
                    {...props}
                    key={option.value}
                    value={option.value}
                    sx={{
                      backgroundColor: isSelected ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
                      color: isSelected ? 'blue' : 'grey',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                      },
                    }}
                  >
                    {option.agentLastName
                      ? `${option.agentName.charAt(0).toUpperCase()}${option.agentName.slice(1)} ${option.agentLastName.charAt(0).toUpperCase()}${option.agentLastName.slice(1)}`
                      : `${option.agentName.charAt(0).toUpperCase()}${option.agentName.slice(1)}`}
                  </MenuItem>
                );
              }}
              noOptionsText="No options"
            />
          </Grid> */}


          <Grid item xs={6} sm={6} sx={{ display: "flex", gap: "2%" }}>
            <Grid item xs={16} sm={16}>
              <FormControl fullWidth>
                <Controller
                  name="referedBy"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={activeAgents?.find((agent: any) => agent?.agentName === value) || null} // Sync value with the selected agent object
                      onChange={(event, newValue) => {
                        onChange(newValue?.agentName || ''); // Update the form field with agent name
                        if (newValue) {

                          setAgentPopup(true);
                        }
                        handleAgentChange(newValue);

                        // Close the dropdown after selection
                        const autocompleteElement = document.activeElement as HTMLElement;
                        autocompleteElement?.blur(); // Remove focus from the autocomplete input
                      }}
                      options={activeAgents ? activeAgents : []}
                      getOptionLabel={(option) =>
                        `${option?.agentName} ${option?.agentLastName ? option?.agentLastName : ''}` // Combine agentName and agentLastName
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Referred by"
                        />
                      )}
                    // disableClearable
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2} sm={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CreateAgentPopUp setAgentListApiCall={setAgentListApiCall} />
            </Grid>
          </Grid>


          <Grid item xs={12} sm={6}>
            <DatePickerWrapper>
              <Controller
                name='dateOfAdmission'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={value}
                    showYearDropdown
                    showMonthDropdown
                    yearDropdownItemNumber={50}
                    onChange={e => onChange(e)}
                    autoComplete='new-dob'
                    placeholderText='DD/MM/YYYY'

                    customInput={
                      <CustomInput
                        value={value}
                        onChange={(e: any) => onChange(e)}
                        label='Date of admission '
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <EventNoteIcon />
                            </InputAdornment>
                          ),
                          readOnly: true,
                        }}
                        error={Boolean(studentErrors.dateOfAdmission)}
                        aria-describedby='validation-basic-dob'
                      />
                    }
                  />
                )}
              />
            </DatePickerWrapper>
            {studentErrors.dateOfAdmission && (
              <FormHelperText sx={{ mx: 3.5, color: 'error.main' }} id='validation-basic-dob'>
                {studentErrors.dateOfAdmission?.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                type='file'
                key={key}
                ref={fileInputRef}
                name='studentImage'
                label='Student Image'
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  accept: getAcceptedMediaTypes("image"),
                }}
                InputProps={{
                  style: { borderColor: 'your-border-color', borderWidth: 'your-border-width' },
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      {image && (
                        <IconButton edge="end" onClick={(e) => { handleClear(); }}>
                          <ClearIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }} onChange={handleImageChange} />
              {error && <div style={{ color: 'red' }}>{error}</div>}

            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            {/* dynamic field code start */}
            <Box>
              {/* "Add Field" button */}
              {!showFieldInput && (
                <Button variant="contained" color="primary" onClick={handleShowFieldInput} sx={{ mb: 2 }}>
                  Add Field
                </Button>
              )}

              {/* Show field name input only after clicking "Add Field" */}
              {showFieldInput && (
                <Grid container spacing={2} alignItems="center" >
                  <Grid item xs={6}>
                    <TextField
                      label="Field name"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      variant="outlined"
                      fullWidth
                      error={Boolean(newField && newFieldName == "")}
                    />

                    {newField && newFieldName == "" && (
                      <FormHelperText sx={{ mx: 3.5, color: 'error.main' }} id='validation-basic-dob'>
                        This field is required
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={5}>
                    <TextField
                      select
                      label="Field type"
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value)}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                      {/* <MenuItem value="password">Password</MenuItem> */}
                    </TextField>
                    {newField && newFieldType == "" && (
                      <FormHelperText sx={{ mx: 3.5, color: 'error.main' }} id='validation-basic-dob'>
                        This field is required
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={1}>
                    <Button variant="contained" color="primary" onClick={(e) => { handleAddField(), setNewField(true) }} fullWidth>
                      Add
                    </Button>
                  </Grid>
                </Grid>
              )}

              {/* Dynamically Added Fields */}


              {/* Dynamic Fields */}
              {/* {dynamicFields ? dynamicFields.map((field: any, index: any) => {
                const fieldKey = Object.keys(field)[0]; // First key of object (field label)
                return (
                  <Grid spacing={2} alignItems="center" key={index} sx={{ mt: 1, display: "flex" }}>
                    <Grid item xs={5}>
                      <TextField
                        type={field.type}
                        label={fieldKey} // Label = First key of object
                        value={field[fieldKey]} // Value = Entered data
                        onChange={(e) => handleDynamicFieldChange(index, e.target.value)}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton onClick={() => handleRemoveField(index)} color="error">
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                );
              }) : ''} */}

              <Grid container spacing={2} sx={{ mt: 1, maxHeight: "135px", overflowY: "auto" }}>
                {dynamicFields &&
                  dynamicFields.map((field: any, index: any) => {
                    const fieldKey = Object.keys(field)[0]; // First key of object (field label)
                    return (
                      <Grid item xs={12} sm={6} md={6} key={index}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={10}>
                            <TextField
                              type={field.type}
                              label={camelCaseToWords(fieldKey)} // Label = First key of object
                              value={field[fieldKey]} // Value = Entered data
                              onChange={(e) => handleDynamicFieldChange(index, e.target.value)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={2} sx={{ display: "flex", justifyContent: 'center' }}>
                            <IconButton onClick={() => handleRemoveDynamicField(field, index)} >
                              <CloseIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
              </Grid>

              {fields.map((field, index) => (
                <Grid container spacing={2} alignItems="center" key={index} sx={{ mt: 1 }}>
                  <Grid item xs={10}>
                    <TextField
                      type={field.type}
                      // label={field.fieldName.charAt(0).toUpperCase() + field.fieldName.slice(1)}
                      label={camelCaseToWords(field.fieldName)}
                      value={field.value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => handleRemoveField(index)} color="error">
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              {/* Submit Button */}
              {/* {fields.length > 0 && (
                <Button variant="contained" color="success" onClick={handleSubmit} sx={{ mt: 2 }}>
                  Submit
                </Button>
              )} */}
            </Box>

            {/* dynamic field code End */}

          </Grid>



          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button size='large' variant='outlined' color='secondary' disabled>
              Back
            </Button>
            <Button size='large' type='submit' variant='contained'
              disabled={isSubmitting} // Disable during submission
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </form>




      {agentPopup &&
        // <Dialog open={agentPopup} aria-labelledby='form-dialog-title'>
        //   <Grid container justifyContent="flex-end" alignItems="center" sx={{ mt: '-15px' }}>

        //     <DialogTitle className='capitalize' id='form-dialog-title' style={{ textAlign: 'center', fontSize: '1.5rem !important' }}>Please select the payment for the agents</DialogTitle>

        //   <Icon
        //     className="iconContainer"
        //     onClick={() => {
        //       if (goBack) {
        //         const isConfirmed = window.confirm("You have an incomplete form. Are you sure you want to leave?");
        //         if (isConfirmed) {
        //           setAgentPopup(false);
        //           setAgentData("");
        //           setGoBack(false)
        //           setIsError(false);
        //           setSubmitted(false);
        //           setValue('referedBy', '')
        //         }
        //       }
        //       else {
        //         setAgentPopup(false);
        //         setAgentData("");
        //         setIsError(false);
        //         setSubmitted(false)
        //         setValue('referedBy', '')
        //       }
        //     }}
        //     style={{
        //       cursor: "pointer",
        //       fontSize: "35px",
        //       margin: "8px",
        //       marginTop: "5%",
        //       transition: "background-color 0.3s",
        //       position: 'relative',
        //       top: '3px',
        //       right: '5px'
        //     }}
        //     icon='bx:x'
        //   />
        // </Grid >

        //   <DialogContent>
        //     <Grid item xs={12} sm={6}>
        //       <FormControl fullWidth>

        //         <TextField
        //           // required
        //           type='text'
        //           value={`${agentData?.agentName} ${agentData?.agentLastName ?? " "}`}
        //           label='Agent name'
        //           disabled
        //           autoComplete='OFF'
        //           aria-describedby='stepper-linear-account-email'
        //           inputProps={{
        //             maxLength: 50,
        //           }}

        //         />
        //       </FormControl>
        //     </Grid>
        //     <Grid item xs={12} sm={6} sx={{ mt: '15px' }}>
        //       <FormControl fullWidth>
        //         <TextField
        //           type="number"
        //           value={agentData?.agentPayment}
        //           label="Referred amount *"
        //           onChange={(e: any) => {
        //             const value = e.target.value;

        //             // Allow only integer values greater than 0 or an empty value (for delete)
        //             if (/^\d*$/.test(value)) {
        //               // If the value is empty or greater than 0, update state
        //               if (value === '' || parseInt(value) > 0) {
        //                 setAgentData({
        //                   ...agentData,
        //                   agentPayment: value,
        //                 });
        //               }
        //             }
        //           }}

        //           autoComplete="OFF"
        //           aria-describedby="stepper-linear-account-email"
        //           inputProps={{
        //             maxLength: 50,
        //             min: 1, // Ensures the minimum value entered is 1
        //           }}
        //           sx={{
        //             '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        //               display: 'none',
        //             },
        //             '& input[type=number]': {
        //               MozAppearance: 'textfield',
        //             },
        //           }}
        //           onKeyDown={(e) => {
        //             if (e.key === '.' || e.key === ',' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        //               e.preventDefault(); // Prevent decimal points and arrows
        //             }
        //           }}
        //           error={submitted ? (agentData?.agentPayment ? false : true) : false}
        //           helperText={
        //             submitted && !agentData?.agentPayment ? 'This field is required' : ''
        //           }
        //         />
        //       </FormControl>
        //     </Grid>


        //     <Grid item xs={12} sm={6} sx={{ mt: '15px' }}>
        //       <FormControl fullWidth>
        //         <InputLabel id='stepper-custom-vertical-personal-select-label'>Payment status *  </InputLabel>
        //         <Select
        //           label='Payment status *'
        //           required
        //           name='paymentStatus'
        //           id='stepper-custom-vertical-personal-select'
        //           value={agentData?.paymentStatus}
        //           onChange={(e: any) => {
        //             setGoBack(true),
        //               setAgentData({
        //                 ...agentData,
        //                 paymentStatus: e.target.value,
        //               });
        //           }}
        //           labelId='stepper-custom-vertical-personal-select-label'
        //           error={submitted ? agentData?.paymentStatus ? false : true : false}

        //         >
        //           <MenuItem value={'paid'}>Paid</MenuItem>
        //           <MenuItem value={'due'}>Due</MenuItem>
        //         </Select>
        //         {submitted && !agentData?.paymentStatus && (
        //           <FormHelperText sx={{ color: 'error.main' }} id='batchName-error'>
        //             {"This field is required"}
        //           </FormHelperText>
        //         )}
        //       </FormControl>
        //     </Grid>
        //     {agentData?.paymentStatus == 'paid' ?
        //       <Grid item xs={12} sx={{ mt: '15px' }} container>
        //         <FormControl fullWidth>
        //           <InputLabel
        //             style={{ width: '100%' }}
        //             error={submitted ? agentData?.paymentMode ? false : true : false}
        //           >
        //             Please select the payment mode *
        //           </InputLabel>

        //           <Select
        //             name="paymentMode"
        //             value={agentData?.paymentMode}
        //             label='Please select the payment mode *'
        //             onChange={(e: any) => {
        //               setAgentData({
        //                 ...agentData,
        //                 paymentMode: e.target.value,
        //               });
        //               setIsError(false);
        //             }}
        //             required
        //             labelId='validation-basic-select'
        //             aria-describedby='validation-basic-select'
        //             error={submitted ? agentData?.paymentMode ? false : true : false}
        //           >
        //             <MenuItem value='online'>Online</MenuItem>
        //             <MenuItem value="cash">Cash</MenuItem>
        //             <MenuItem value="other">Other</MenuItem>
        //           </Select>
        //           {isError && (
        //             <FormHelperText id="validation-basic-select-helper" sx={{ color: "red" }}>
        //               This field is required.
        //             </FormHelperText>
        //           )}
        //         </FormControl>
        //       </Grid>
        //       : ""}
        //   </DialogContent>
        //   <DialogActions style={{ display: 'flex', justifyContent: 'right', width: '100%' }}>
        //     {/* <Button variant='outlined' color='secondary' onClick={() => { setAgentPopup(false); setAgentData("") }}>
        //       Cancel
        //     </Button> */}
        //     <Button
        //       variant="outlined"
        //       color="secondary"
        //       onClick={() => {
        //         if (goBack) {
        //           const isConfirmed = window.confirm("You have an incomplete form. Are you sure you want to leave?");
        //           if (isConfirmed) {
        //             setAgentPopup(false);
        //             setAgentData("");
        //             setGoBack(false)
        //             setIsError(false);
        //             setSubmitted(false);
        //             setValue('referedBy', '')
        //           }
        //         }
        //         else {
        //           setAgentPopup(false);
        //           setAgentData("");
        //           setIsError(false);
        //           setSubmitted(false);
        //           setValue('referedBy', '')
        //         }
        //       }}
        //     >
        //       Cancel
        //     </Button>
        //     <Button variant='contained' onClick={() => {
        //       setSubmitted(true)

        //       handleAgentSubmit()

        //     }} >
        //       Submit
        //     </Button>
        //   </DialogActions>
        // </Dialog>

        <Dialog open={agentPopup} aria-labelledby="form-dialog-title">
          <Grid container justifyContent="flex-end" alignItems="center" sx={{ mt: '-15px' }}>
            <DialogTitle style={{ textAlign: "center", fontSize: "1.5rem" }} className='capitalize'>
              Please select the payment for the agents
            </DialogTitle>
            <Icon
              className="iconContainer"
              onClick={() => {
                if (goBack) {
                  const isConfirmed = window.confirm("You have an incomplete form. Are you sure you want to leave?");
                  if (isConfirmed) {
                    setAgentPopup(false);
                    setAgentData("");
                    setGoBack(false)
                    setIsError(false);
                    setSubmitted(false);
                    setValue('referedBy', '')
                    agentReset()
                  }
                }
                else {
                  setAgentPopup(false);
                  setAgentData("");
                  setIsError(false);
                  setSubmitted(false)
                  setValue('referedBy', '')
                  agentReset()
                }
              }}
              style={{
                cursor: "pointer",
                fontSize: "35px",
                margin: "8px",
                marginTop: "5%",
                transition: "background-color 0.3s",
                position: 'relative',
                top: '3px',
                right: '5px'
              }}
              icon='bx:x'
            />

          </Grid>
          <DialogContent>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  type="text"
                  value={`${agentData?.agentName} ${agentData?.agentLastName ?? " "}`}
                  label="Agent name"
                  disabled
                />
              </FormControl>
            </Grid>

            {/* Referred Amount */}
            <Grid item xs={12} sm={6} sx={{ mt: "15px" }}>
              <FormControl fullWidth>
                <Controller
                  name="agentPayment"
                  control={agentControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Referred amount *"
                      autoComplete="OFF"
                      error={!!errors.agentPayment}
                      helperText={errors.agentPayment?.message}
                      sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                          display: "none",
                        },
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                      }}
                      onKeyDown={(e) => {
                        if ([".", ",", "ArrowUp", "ArrowDown"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        field.onChange(e);
                        setGoBack(true);
                        setAgentData({
                          ...agentData,
                          agentPayment: e.target.value,
                        });
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Payment Status */}
            <Grid item xs={12} sm={6} sx={{ mt: "15px" }}>
              <FormControl fullWidth error={!!errors.paymentStatus}>
                <InputLabel>Payment status *</InputLabel>
                <Controller
                  name="paymentStatus"
                  control={agentControl}
                  render={({ field }) => (
                    <Select {...field} label="Payment status *" onChange={(e: any) => {
                      field.onChange(e);
                      setGoBack(true);
                      setAgentData({
                        ...agentData,
                        paymentStatus: e.target.value,
                      });
                    }}>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="due">Due</MenuItem>
                    </Select>
                  )}
                />
                {errors.paymentStatus && <FormHelperText>{errors.paymentStatus.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Payment Mode (Only if Paid) */}
            {paymentStatus === "paid" && (
              <Grid item xs={12} sx={{ mt: "15px" }} container>
                <FormControl fullWidth error={!!errors.paymentMode}>
                  <InputLabel>Please select the payment mode *</InputLabel>
                  <Controller
                    name="paymentMode"
                    control={agentControl}
                    render={({ field }) => (
                      <Select {...field} label='Please select the payment mode *' onChange={(e: any) => {
                        field.onChange(e);
                        setGoBack(true);
                        setAgentData({
                          ...agentData,
                          paymentMode: e.target.value,
                        });
                      }}>
                        <MenuItem value="online">Online</MenuItem>
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.paymentMode && <FormHelperText>{errors.paymentMode.message}</FormHelperText>}
                </FormControl>
              </Grid>
            )}
          </DialogContent>

          <DialogActions style={{ display: "flex", justifyContent: "right", width: "100%" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                if (goBack) {
                  const isConfirmed = window.confirm("You have an incomplete form. Are you sure you want to leave?");
                  if (isConfirmed) {
                    setAgentPopup(false);
                    setAgentData("");
                    setGoBack(false)
                    setIsError(false);
                    setSubmitted(false);
                    setValue('referedBy', '')
                    agentReset()
                  }
                }
                else {
                  setAgentPopup(false);
                  setAgentData("");
                  setIsError(false);
                  setSubmitted(false)
                  setValue('referedBy', '')
                  agentReset()
                }
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAgentDataSubmit(onAgentSubmit)}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

      }

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          Field already exists!
        </Alert>
      </Snackbar>

    </>
  )
}

export default StudentDetailsForm
