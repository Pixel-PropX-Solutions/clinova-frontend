import * as Yup from "yup";

export const OPDValidation = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  age: Yup.number()
    .positive("Age must be positive")
    .integer("Age must be an integer")
    .min(1, "Age must be an integer b/w 1 - 100")
    .max(100, "Age must be an integer b/w 1 - 100")
    .required("Age is required"),

  fees: Yup.number()
    .positive("Fees must be positive")
    .required("Fees are required"),
  address: Yup.string().required("Address is required"),
  speciality: Yup.string().required("speciality is required"),
  Dr_Name: Yup.string().required("Dr_Name is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  sex: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Invalid sex")
    .required("Sex is required"),
  createdAt: Yup.date().required("Created At is required"),
  followup: Yup.boolean().required(),
  payment: Yup.string().oneOf(["cash", "online"], "Invalid payment method").required("Payment method is required")
});

export const BillValidation = Yup.object().shape({
  ms: Yup.string().required("Required"),
  billNo: Yup.string().required("Required"),
  dr: Yup.string().required("Required"),
  date: Yup.string().required("Required"),
  items: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().required("Required"),
      batchNo: Yup.string().required("Required"),
      qty: Yup.number().min(1, "Must be at least 1").required("Required"),
      expDate: Yup.string().required("Required"),
    })
  ),
  total: Yup.string().required("Required"),
});
