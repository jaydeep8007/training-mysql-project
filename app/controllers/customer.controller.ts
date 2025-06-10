import { Request, Response, NextFunction } from "express";
import { hashPassword } from "../services/password.service";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";
import { Op, ValidationError } from "sequelize";
import { customerValidations } from "../validations/customer.validation";
import { msg } from "../constants/language/en.constant";
import customerModel from "../models/customer.model";
import employeeModel from "../models/employee.model";
import commonQuery from "../services/commonQuery.service";

// 🔸 Initialize customer-specific query
const customerQuery = commonQuery(customerModel);
const employeeQuery = commonQuery(employeeModel);

// ➕ Add Customer
const addCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed =
      await customerValidations.customerCreateSchema.safeParseAsync(req.body);

    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const {
      cus_password,
      cus_confirm_password,
      cus_email,
      cus_phone_number,
      cus_firstname,
      cus_lastname,
      cus_status = "active",
    } = parsed.data as typeof parsed.data & {
      cus_status: "active" | "inactive" | "restricted" | "blocked";
    };

    const hashedPassword = await hashPassword(cus_password);

    const newCustomer = await customerQuery.create({
      cus_firstname,
      cus_lastname,
      cus_email,
      cus_phone_number,
      cus_password: hashedPassword,
      cus_status,
    });

    return responseHandler.success(
      res,
      msg.customer.createSuccess,
      newCustomer,
      resCode.CREATED
    );

  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(
        res,
        messages.join(", "),
        resCode.BAD_REQUEST
      );
    }

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
    const customers = await customerQuery.getAll();
    return responseHandler.success(
      res,
      msg.customer.fetchSuccess,
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
const getCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = await customerModel.findByPk(req.params.id, {
      include: [
        {
          model: employeeModel,
          as: "employees", // match alias in association
          attributes: ["emp_id", "emp_name", "emp_email", "emp_mobile_number"], // customize fields
        },
      ],
    });

    if (!customer) {
      return responseHandler.error(
        res,
        msg.customer.notFound,
        resCode.NOT_FOUND
      );
    }

    return responseHandler.success(
      res,
      msg.customer.fetchSuccess,
      customer,
      resCode.OK
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(
        res,
        messages.join(", "),
        resCode.BAD_REQUEST
      );
    }

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
    // Find customer first
    const customer = await customerModel.findByPk(req.params.id);

    if (!customer) {
      return responseHandler.error(
        res,
        msg.customer.fetchFailed,
        resCode.NOT_FOUND
      );
    }

    // ✅ Validate request body
    const parsed =await customerValidations.customerUpdateSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    // Update in DB using Sequelize's update method
    const [affectedRows] = await customerModel.update(parsed.data, {
      where: { cus_id: req.params.id },
    });
//
    if (affectedRows === 0) {
      return responseHandler.error(
        res,
        msg.customer.updateFailed,
        resCode.BAD_REQUEST
      );
    }

    // Fetch the updated customer again
    const updatedCustomer = await customerModel.findByPk(req.params.id);

    return responseHandler.success(
      res,
      msg.customer.updateSuccess,
      updatedCustomer,
      resCode.OK
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(
        res,
        messages.join(", "),
        resCode.BAD_REQUEST
      );
    }

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
        msg.customer.fetchFailed,
        resCode.NOT_FOUND
      );
    }

    return responseHandler.success(
      res,
      msg.customer.deleteSuccess,
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
