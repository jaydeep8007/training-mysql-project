import { z } from "zod";

export const jobCreateSchema = z.object({
  job_name: z
    .string()
    .min(2, "Job name must be at least 2 characters")
    .max(50, "Job name must be at most 50 characters"),

  job_sku: z
    .string()
    .min(1, "Job SKU is required")
    .max(20, "Job SKU must be at most 20 characters"),

  job_category: z
    .string()
    .min(2, "Job category must be at least 2 characters")
    .max(50, "Job category must be at most 50 characters"),
}).refine((data) => {
  if (data.job_category.toLowerCase() === "remote") {
    return data.job_sku !== "";
  }
  return true;
}, {
  message: "Job SKU is required for Remote category",
  path: ["job_sku"],
});



// const indexedArraySchema = z.array(z.string()).refine((arr) => {
//   // For example, index 0 must be "apple"
//   return arr[0] === "apple";
// }, {
//   message: "First fruit must be apple",
//   path: [0], // error will be assigned to index 0
// });


// // Parse a string and convert to uppercase
// const upperSchema = z.string().transform(val => val.toUpperCase());
// console.log(upperSchema.parse("hello")); // "HELLO"

// // Parse a string date and convert to Date object
// const dateSchema = z.string().transform(val => new Date(val));
// console.log(dateSchema.parse("2025-06-04")); // Date object for June 4, 2025