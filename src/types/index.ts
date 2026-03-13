import { BillValidation, OPDValidation } from "@/validations/opd";
import { InferType } from "yup";

export type OPDType = InferType<typeof OPDValidation>;
export type BillType = InferType<typeof BillValidation>;
