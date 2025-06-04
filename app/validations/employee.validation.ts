import { z } from "zod";

export const employeeCreateSchema = z.object({
  emp_name: z
    .string()
    .min(2, "Employee name must be at least 2 characters")
    .max(100, "Employee name must be at most 100 characters"),

  emp_email: z
    .string()
    .email("Invalid email address")
,

  emp_password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).+$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),

  emp_company_name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters"),

  emp_mobile_number: z
    .string()
    .min(10, "Mobile number must be equal or greater than 10 digits")
    .max(15, "Mobile number must be at most 15 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
});
