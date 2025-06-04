import { z } from "zod";

const customerCreateSchema = z.object({
    cus_firstname: z.string().max(50, "Maximum 50 characters allowed"), 
    cus_lastname: z.string().max(50, "Maximum 50 characters allowed"), 
    cus_email: z.string().email(), 
    cus_phone_number: z.string().min(10, "Customer phone exactly 10 digits").max(10, "Customer phone exactly 10 digits").regex(/^\d+$/, "User phone must contain only digits"), // Example: Requires exactly 10 digits
    cus_password: z.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/, "Password validation with at least one digit, one lowercase, one uppercase, and one special character"), // Password validation with at least one digit, one lowercase, one uppercase, and one special character
    cus_confirm_password: z.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/, "Password validation with at least one digit, one lowercase, one uppercase, and one special character"), // Password validation with at least one digit, one lowercase, one uppercase, and one special character
});

const customerLoginSchema = z.object({
    cus_email: z.string().email(),
    cus_password: z.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/, "Password validation with at least one digit, one lowercase, one uppercase, and one special character"), // Password validation with at least one digit, one lowercase, one uppercase, and one special character
});

const customerResetPassSchema = z.object({
    cus_password: z.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/, "Password validation with at least one digit, one lowercase, one uppercase, and one special character"), // Password validation with at least one digit, one lowercase, one uppercase, and one special character
});

const customerUpdateSchema = z.object({
});

export const customerValidations = {
    customerCreateSchema,
    customerLoginSchema,
    customerResetPassSchema,
    customerUpdateSchema
}