import { Request, Response, NextFunction } from "express";
import customerModel from "../models/customer.model";
import { hashPassword } from "../services/password.service";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";
import { Op, ValidationError } from "sequelize"; // <-- Import Op here
// ➕ Add Customer

const addCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cus_password, cus_confirm_password, ...rest } = req.body;

    if (cus_password !== cus_confirm_password) {
      return responseHandler.error(
        res,
        "Password and confirm password do not match",
        resCode.BAD_REQUEST
      );
    }

    const existing = await customerModel.findOne({
      where: {
        [Op.or]: [
          // <-- Use Op.or here
          { cus_email: req.body.cus_email },
          { cus_phone_number: req.body.cus_phone_number },
        ],
      },
    });

    if (existing) {
      return responseHandler.error(
        res,
        "Email or phone already exists",
        resCode.BAD_REQUEST
      );
    }

    const hashedPassword = await hashPassword(cus_password);

    const newCustomer = await customerModel.create({
      ...rest,
      cus_password: hashedPassword,
      cus_confirm_password: hashedPassword,
    });

    return responseHandler.success(
      res,
      "Customer added successfully",
      newCustomer,
      resCode.CREATED
    );
  } catch (error) {
    // ✅ Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(
        res,
        messages.join(", "),
        resCode.BAD_REQUEST
      );
    }

    // 🔁 Forward any other unhandled error to the global error handler
    return next(error);
  }
};

// 📄 Get All Customers
const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await customerModel.findAll();
    return responseHandler.success(
      res,
      "Customers fetched successfully",
      customers,
      resCode.OK
    );
  } catch (error) {
    // ✅ Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(
        res,
        messages.join(", "),
        resCode.BAD_REQUEST
      );
    }

    // 🔁 Forward any other unhandled error to the global error handler
    return next(error);
  }
};

// 🔍 Get Customer by ID
const getCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = await customerModel.findByPk(req.params.id);

    if (!customer) {
      return responseHandler.error(
        res,
        "Customer not found",
        resCode.NOT_FOUND
      );
    }

    return responseHandler.success(res, "Customer found", customer, resCode.OK);
  } catch (error) {
    // ✅ Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(
        res,
        messages.join(", "),
        resCode.BAD_REQUEST
      );
    }

    // 🔁 Forward any other unhandled error to the global error handler
    return next(error);
  }
};

// ✏️ Update Customer by ID
const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await customerModel.update(req.body, {
      where: { cus_id: req.params.id },
    });

    if (updated[0] === 0) {
      return responseHandler.error(
        res,
        "Customer not found",
        resCode.NOT_FOUND
      );
    }

    const customer = await customerModel.findByPk(req.params.id);
    return responseHandler.success(
      res,
      "Customer updated successfully",
      customer,
      resCode.OK
    );
  } catch (error) {
    // ✅ Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(
        res,
        messages.join(", "),
        resCode.BAD_REQUEST
      );
    }

    // 🔁 Forward any other unhandled error to the global error handler
    return next(error);
  }
};

// ❌ Delete Customer by ID
const deleteCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await customerModel.destroy({
      where: { cus_id: req.params.id },
    });

    if (!deleted) {
      return responseHandler.error(
        res,
        "Customer not found",
        resCode.NOT_FOUND
      );
    }

    return responseHandler.success(
      res,
      "Customer deleted successfully",
      null,
      resCode.OK
    );
  } catch (error) {
    // ✅ Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(
        res,
        messages.join(", "),
        resCode.BAD_REQUEST
      );
    }

    // 🔁 Forward any other unhandled error to the global error handler
    return next(error);
  }
};

export default {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomerById,
};
