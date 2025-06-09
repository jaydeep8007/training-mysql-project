export const msg = {
  common: {
    error: "Something went wrong",
    unauthorized: "Unauthorized",
    invalidToken: "Token is invalid",
    invalidId: "Record not found with specified ID",
    fetchSuccess: "Data fetched successfully",
    insertSuccess: "Data inserted successfully",
    updateSuccess: "Data updated successfully",
    deleteSuccess: "Data deleted successfully",
  },

  customer: {
    addSuccess: "Customer added successfully",
    fechedSuccess: "Customers fetched successfully",
    updateSuccess: "Customer updated successfully",
    updateFailed: "Customer update failed",
    deleteFailed: "Customer deletion failed",
    deleteSuccess: "Customer deleted successfully",
    found: "Customer found successfully",
    notFound: "Customer not found with specified ID",

  },

  auth: {
    loginSuccess: "You've successfully logged in",
    logoutSuccess: "You've been successfully logged out",
    resetPassword: "Success! Your password has been reset",
    emailNotExist: "Email does not exist",
    inactive: "User is not active",
    passwordInvalid: "Invalid password",
    linkSent: "Link and OTP sent to your registered email address",
    linkExpired: "Link is expired",
    invalidOTP: "Invalid OTP",
    passwordMismatch: "Password and confirm password do not match",
    emailAlreadyExist: "Email already exists",
    enterEmail: "Please enter an email",
    enterUsername: "Please enter username",
    usernameNotExist: "Username does not exist",
    usernameAlreadyExist: "Username already exists",
    deletedUser: "User not currently accessible",
  },

  employee: {
    addSuccess: "Employee added successfully",
    updateSuccess: "Employee updated successfully",
    deleteSuccess: "Employee deleted successfully",
    notFound: "Employee not found with specified ID",
    emailAlreadyExist: "Employee email already exists",
    invalidEmail: "Invalid employee email address",
    missingFields: "Required employee fields are missing",
  },

  job: {
    addSuccess: "Job added successfully",
    updateSuccess: "Job updated successfully",
    deleteSuccess: "Job deleted successfully",
    notFound: "Job not found with specified ID",
    skuExists: "Job SKU already exists",
    invalidName: "Job name must be between 2 and 50 characters",
    invalidCategory: "Job category must be between 2 and 50 characters",
    skuRequiredForRemote: "Job SKU is required for Remote category",
  },
};
