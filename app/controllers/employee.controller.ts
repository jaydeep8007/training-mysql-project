import { NextFunction, Request, Response } from "express";
import employeeModel from "../models/employee.model";
import { employeeCreateSchema } from "../validations/employee.validation";
import { resCode } from "../constants/resCode";
import { responseHandler } from "../services/responseHandler.service";
import { ValidationError } from "sequelize";
import { z } from "zod";
import customerModel from "../models/customer.model";
const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = await employeeCreateSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const { emp_email, emp_mobile_number, cus_id } = parsed.data;

    // 🔎 Check if email exists
    const emailExists = await employeeModel.findOne({ where: { emp_email } });
    if (emailExists) {
      return responseHandler.error(
        res,
        "Email already exists",
        resCode.BAD_REQUEST
      );
    }

    // 🔎 Check if phone exists
    const phoneExists = await employeeModel.findOne({
      where: { emp_mobile_number },
    });
    if (phoneExists) {
      return responseHandler.error(
        res,
        "Mobile number already exists",
        resCode.BAD_REQUEST
      );
    }

    // 🔎 Check if customer exists
    const customerExists = await customerModel.findByPk(cus_id);
    if (!customerExists) {
      return responseHandler.error(
        res,
        "Customer ID not found",
        resCode.BAD_REQUEST
      );
    }

    // ✅ Create employee
    const newEmployee = await employeeModel.create(parsed.data);

    return responseHandler.success(
      res,
      "Employee created successfully",
      newEmployee,
      resCode.CREATED
    );
  } catch (error: any) {
    return next(error);
  }
};


const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employees = await employeeModel.findAll({
      include: [
        {
          model: customerModel,
          as: "customer", // 👈 this must match your association alias
          attributes: ["cus_id", "cus_firstname", "cus_lastname", "cus_email"], // customize as needed
        },
      ],
    });

    return responseHandler.success(
      res,
      "Employees fetched successfully",
      employees,
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

export default {
  getAllEmployees,
  createEmployee,
};
