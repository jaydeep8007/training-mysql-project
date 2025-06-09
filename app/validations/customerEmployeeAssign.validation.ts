import { z } from "zod";

// Schema for assignEmployeeToCustomer request body validation
 const assignEmployeeSchema = z.object({
  emp_id: z.number({
    required_error: "emp_id is required",
    invalid_type_error: "emp_id must be a number",
  }),
  cus_id: z.number({
    required_error: "cus_id is required",
    invalid_type_error: "cus_id must be a number",
  }),
});

// Schema for validating route param "id"
 const customerIdParamSchema = z.object({
  id: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Invalid customer ID" }),
});
export default {
    assignEmployeeSchema,
    customerIdParamSchema,
}