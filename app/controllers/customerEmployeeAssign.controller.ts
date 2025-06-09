import { Request, Response, NextFunction } from "express";
import employeeCustomerModel from "../models/customerEmployeeAssign.model";
import employeeModel from "../models/employee.model";
import customerModel from "../models/customer.model";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";
import customerEmployeeAssignValidation from "../validations/customerEmployeeAssign.validation";

const assignEmployeeToCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
 const parsed = customerEmployeeAssignValidation.assignEmployeeSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(", ");
      return responseHandler.error(res, errors, resCode.BAD_REQUEST);
    }
    const { emp_id, cus_id } = parsed.data;

    // Validate input presence
    if (!emp_id || !cus_id) {
      return responseHandler.error(
        res,
        "emp_id and cus_id are required",
        resCode.BAD_REQUEST
      );
    }

    // Check if employee exists
    const employeeExists = await employeeModel.findByPk(emp_id);
    if (!employeeExists) {
      return responseHandler.error(
        res,
        "Employee not found",
        resCode.NOT_FOUND
      );
    }

    // Check if customer exists
    const customerExists = await customerModel.findByPk(cus_id);
    if (!customerExists) {
      return responseHandler.error(
        res,
        "Customer not found",
        resCode.NOT_FOUND
      );
    }

    // Check if assignment already exists
    const alreadyAssigned = await employeeCustomerModel.findOne({
      where: { emp_id, cus_id },
    });
    if (alreadyAssigned) {
      return responseHandler.error(
        res,
        "Employee is already assigned to this customer",
        resCode.BAD_REQUEST
      );
    }

    // Create the assignment
    const assignment = await employeeCustomerModel.create({ emp_id, cus_id });

    return responseHandler.success(
      res,
      "Employee assigned to customer successfully",
      assignment,
      resCode.CREATED
    );
  } catch (error) {
    return next(error);
  }
};


const getCustomersWithEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await customerModel.findAll({
      include: [
        {
          model: employeeModel,
          as: "employees",  // Must match association alias in model/index
          through: { attributes: [] }, // exclude join table attributes
        },
      ],
    });

    return responseHandler.success(
      res,
      "Customers with assigned employees fetched successfully",
      customers,
      resCode.OK
    );
  } catch (error) {
    return next(error);
  }
};

const getCustomerWithEmployeesById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
 const parsed = customerEmployeeAssignValidation.customerIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(", ");
      return responseHandler.error(res, errors, resCode.BAD_REQUEST);
    }

    const cus_id = Number(parsed.data.id);

    if (isNaN(cus_id)) {
      return responseHandler.error(
        res,
        "Invalid customer ID",
        resCode.BAD_REQUEST
      );
    }

    // find customer by PK with employees
    const customer = await customerModel.findByPk(cus_id, {
      include: [
        {
          model: employeeModel,
          as: "employees",  // association alias
          through: { attributes: [] },
        },
      ],
    });

    if (!customer) {
      return responseHandler.error(res, "Customer not found", resCode.NOT_FOUND);
    }

    return responseHandler.success(
      res,
      "Customer with assigned employees fetched successfully",
      customer,
      resCode.OK
    );
  } catch (error) {
    return next(error);
  }
};


export default {
  assignEmployeeToCustomer,
  getCustomersWithEmployees,
    getCustomerWithEmployeesById

};
