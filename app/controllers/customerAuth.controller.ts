import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import customerModel from "../models/customer.model";
import customerAuthModel from "../models/customerAuth.model";
import { comparePasswords, hashPassword } from "../services/password.service";
import { authToken } from "../services/authToken.service";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";
import crypto from "crypto";
import { generateResetToken } from "../services/password.service";
import { ValidationError } from 'sequelize';

const signupCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      cus_firstname,
      cus_lastname,
      cus_email,
      cus_phone_number,
      cus_password,
      cus_confirm_password,
    } = req.body;

    // Validate required fields
    if (
      !cus_firstname ||
      !cus_lastname ||
      !cus_email ||
      !cus_phone_number ||
      !cus_password ||
      !cus_confirm_password
    ) {
      return responseHandler.error(res, "All fields are required", resCode.BAD_REQUEST);
    }

    if (cus_password !== cus_confirm_password) {
      return responseHandler.error(res, "Passwords do not match", resCode.BAD_REQUEST);
    }

    // Check if email or phone already exists

    // Hash password
    const hashedPassword = await hashPassword(cus_password);

    // Create customer
    const newCustomer = await customerModel.create({
      cus_firstname,
      cus_lastname,
      cus_email,
      cus_phone_number,
      cus_password: hashedPassword,
      cus_confirm_password,
    });

    const customerData = newCustomer.get();

    // Generate tokens
    const token = authToken.generateAuthToken({
      user_id: customerData.cus_id,
      email: customerData.cus_email,
    });

    const refreshToken = authToken.generateRefreshAuthToken({
      user_id: customerData.cus_id,
      email: customerData.cus_email,
    });

    // Store tokens in customer_auth
    await customerAuthModel.create({
      cus_id: customerData.cus_id,
      cus_auth_token: token,
      cus_refresh_auth_token: refreshToken,
    });

    return responseHandler.success(
      res,
      "Signup successful",
      { token, refreshToken, customer: customerData },
      resCode.CREATED
    );
  } catch (error) {
    // ✅ Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(", "), resCode.BAD_REQUEST);
    }

    // For other unhandled errors
    return next(error);
  }
};



const signinCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cus_email, cus_password } = req.body;

    // Validate input
    if (!cus_email || !cus_password) {
      return responseHandler.error(
        res,
        "Email and password are required",
        resCode.BAD_REQUEST
      );
    }

    // Find customer by email
    const customer = await customerModel.findOne({ where: { cus_email } });

    if (!customer) {
      return responseHandler.error(
        res,
        "Customer not found",
        resCode.NOT_FOUND
      );
    }

    const customerData = customer.get();

    // Compare passwords
    const isValid = await comparePasswords(cus_password, customerData.cus_password);

    if (!isValid) {
      return responseHandler.error(
        res,
        "Invalid password",
        resCode.UNAUTHORIZED
      );
    }

    // Generate tokens
    const token = authToken.generateAuthToken({
      user_id: customerData.cus_id,
      email: customerData.cus_email,
    });

    const refreshToken = authToken.generateRefreshAuthToken({
      user_id: customerData.cus_id,
      email: customerData.cus_email,
    });

    // Save auth tokens in customer_auth table
    await customerAuthModel.create({
      cus_id: customerData.cus_id,
      cus_auth_token: token,
      cus_refresh_auth_token: refreshToken,
    });

    return responseHandler.success(
      res,
      "Login successful",
      {
        token,
        refreshToken,
        customer: {
          cus_id: customerData.cus_id,
          cus_firstname: customerData.cus_firstname,
          cus_lastname: customerData.cus_lastname,
          cus_email: customerData.cus_email,
          cus_phone_number: customerData.cus_phone_number,
        }
      },
      resCode.OK
    );

  } catch (error) {
    // ✅ Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(", "), resCode.BAD_REQUEST);
    }

    // For other unhandled errors
    return next(error);
  }
};

// const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { cus_email } = req.body;

//     if (!cus_email) {
//       return responseHandler.error(res, "Email is required", resCode.BAD_REQUEST);
//     }

//     const customer = await customerModel.findOne({ where: { cus_email } });

//     if (!customer) {
//       return responseHandler.error(res, "Customer not found", resCode.NOT_FOUND);
//     }

//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

//     await customer.update({
//       reset_password_token: resetToken,
//       reset_password_expires: resetTokenExpire,
//     });

//     // Send token via email (stubbed)
//     console.log(`Reset password token for ${cus_email}: ${resetToken}`);

//     return responseHandler.success(res, "Reset token sent to email", null, resCode.OK);
//   } catch (error) {
//     return next(error);
//   }
// };


const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cus_email } = req.body;

    if (!cus_email) {
      return responseHandler.error(res, "Email is required", resCode.BAD_REQUEST);
    }

    const customer = await customerModel.findOne({ where: { cus_email } });

    if (!customer) {
      return responseHandler.error(res, "Customer not found", resCode.NOT_FOUND);
    }

    const resetToken = generateResetToken();

    customer.reset_password_token = resetToken;
    customer.reset_password_expires = new Date(Date.now() + 3600000); // 1 hour expiry
    await customer.save();

    // Send token via email (or return for development)
    return responseHandler.success(res, "Reset token generated", { resetToken }, resCode.OK);
  } catch (error) {
    // ✅ Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(", "), resCode.BAD_REQUEST);
    }

    // For other unhandled errors
    return next(error);
  }
};



 const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reset_token, new_password, confirm_password } = req.body;

    if (!reset_token || !new_password || !confirm_password) {
      return responseHandler.error(res, "All fields are required", resCode.BAD_REQUEST);
    }

    if (new_password !== confirm_password) {
      return responseHandler.error(res, "Passwords do not match", resCode.BAD_REQUEST);
    }

    // ✅ Find the customer with valid reset token and not expired
    const customer = await customerModel.findOne({
      where: {
        reset_password_token: reset_token,
        reset_password_expires: { [Op.gt]: new Date() }, // token not expired
      },
    });

    if (!customer) {
      return responseHandler.error(res, "Invalid or expired reset token", resCode.UNAUTHORIZED);
    }

    // ✅ Hash and update password
    const hashedPassword = await hashPassword(new_password);
    customer.cus_password = hashedPassword;
    customer.reset_password_token = null;
    customer.reset_password_expires = null;

    await customer.save();

    return responseHandler.success(res, "Password has been reset successfully", {}, resCode.OK);
  } catch (error) {
    // ✅ Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(", "), resCode.BAD_REQUEST);
    }

    // For other unhandled errors
    return next(error);
  }
};

export default {
  signupCustomer,
  signinCustomer,
  forgotPassword,
  resetPassword
};
