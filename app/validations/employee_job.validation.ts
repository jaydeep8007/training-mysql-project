// validations/employee_job.validation.ts
import { z } from "zod";

 const assignJobSchema = z.object({
  emp_id: z.number({
    required_error: "emp_id is required",
    invalid_type_error: "emp_id must be a number",
  }),
  job_id: z.number({
    required_error: "job_id is required",
    invalid_type_error: "job_id must be a number",
  }),
});

export default {
    assignJobSchema
}