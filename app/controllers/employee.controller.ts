import { NextFunction, Request, Response } from "express";
import employeeModel from "../models/employee.model";
import { employeeCreateSchema } from "../validations/employee.validation";
import { resCode } from "../constants/resCode";
import { responseHandler } from "../services/responseHandler.service";
import { Op, ValidationError } from "sequelize";
import customerModel from "../models/customer.model";
import { msg } from "../constants/language/en.constant";

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

    // 🔎 Check if customer exists
    const customerExists = await customerModel.findByPk(cus_id);
    if (!customerExists) {
      return responseHandler.error(
        res,
        msg.employee.notFound,
        resCode.BAD_REQUEST
      );
    }

    // ✅ Create employee
    const newEmployee = await employeeModel.create(parsed.data);

    return responseHandler.success(
      res,
      msg.employee.createSuccess,
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
      msg.employee.fetchSuccess,
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

const deleteEmployeeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // 🔎 Check if employee exists
    const employee = await employeeModel.findByPk(id);

    if (!employee) {
      return responseHandler.error(
        res,
        msg.employee.notFound,
        resCode.NOT_FOUND
      );
    }

    // 🗑️ Delete employee
    await employee.destroy();

    return responseHandler.success(
      res,
      msg.employee.deleteSuccess,
      null,
      resCode.OK
    );
  } catch (error) {
    return next(error);
  }
};

const updateEmployeeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // ✅ Validate request body
    const parsed = await employeeCreateSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    // 🔎 Check if employee exists
    const employee = await employeeModel.findByPk(id);
    if (!employee) {
      return responseHandler.error(
        res,
        msg.employee.notFound,
        resCode.NOT_FOUND
      );
    }

    const { emp_email, emp_mobile_number, cus_id } = parsed.data;

    // 🔎 Check for duplicate email (if changed)
    const existingEmail = await employeeModel.findOne({
      where: { emp_email, emp_id: { [Op.ne]: id } },
    });
    if (existingEmail) {
      return responseHandler.error(
        res,
        msg.employee.emailAlreadyExists,
        resCode.BAD_REQUEST
      );
    }

    // 🔎 Check for duplicate phone (if changed)
    const existingPhone = await employeeModel.findOne({
      where: { emp_mobile_number, emp_id: { [Op.ne]: id } },
    });
    if (existingPhone) {
      return responseHandler.error(
        res,
        msg.employee.phoneAlreadyExists,
        resCode.BAD_REQUEST
      );
    }

    // 🔎 Verify customer ID exists
    const customer = await customerModel.findByPk(cus_id);
    if (!customer) {
      return responseHandler.error(
        res,
        msg.customer.idNotFound,
        resCode.BAD_REQUEST
      );
    }

    // ✅ Perform update
    await employee.update(parsed.data);

    return responseHandler.success(
      res,
      msg.employee.updateSuccess,
      employee,
      resCode.OK
    );
  } catch (error) {
    return next(error);
  }
};

export default {
  getAllEmployees,
  createEmployee,
  deleteEmployeeById,
  updateEmployeeById,
};
