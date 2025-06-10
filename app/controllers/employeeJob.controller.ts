import { NextFunction, Request, Response } from "express";
import employeeJob from "../models/employeeJobAssign.model";
import employeeJobValidation from "../validations/employeeJob.validation";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";
import { ValidationError } from "sequelize";
import job from "../models/job.model";
import employeeModel from "../models/employee.model";
import { msg } from "../constants/language/en.constant";


const assignJobToEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Validate with Zod
    const parsed = employeeJobValidation.assignJobSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const { emp_id, job_id } = parsed.data;

    // ✅ Create assignment
    const assignment = await employeeJob.create(parsed.data);

    return responseHandler.success(
      res,
      msg.employeeJob.assignSuccess,
      assignment,
      resCode.CREATED
    );
  } catch (error) {
    // ✅ Sequelize validation error
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, messages, resCode.BAD_REQUEST);
    }

    // 🔁 Forward unhandled errors
    return next(error);
  }
};
const assignJobToManyEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Zod validation first
    const parsed = await employeeJobValidation.assignMultipleJobsSchema.safeParseAsync(
      req.body
    );
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const { emp_ids, job_id } = parsed.data;

    // ✅ Check if job exists
    const jobExists = await job.findByPk(job_id);
    if (!jobExists) {
      return responseHandler.error(
        res,
        `Job with ID ${job_id} does not exist`,
        resCode.NOT_FOUND
      );
    }

    // ✅ Check if all employee IDs exist
    const foundEmployees = await employeeModel.findAll({
      where: { emp_id: emp_ids },
    });

    const foundEmpIds = foundEmployees.map((emp) => emp.get("emp_id"));
    const missingEmpIds = emp_ids.filter((id) => !foundEmpIds.includes(id));

    if (missingEmpIds.length > 0) {
      return responseHandler.error(
        res,
        `These employee IDs do not exist: ${missingEmpIds.join(", ")}`,
        resCode.NOT_FOUND
      );
    }

    // ✅ Check if any of these employees already have a job assigned
    const existingAssignments = await employeeJob.findAll({
      where: { emp_id: emp_ids },
    });

    if (existingAssignments.length > 0) {
      const alreadyAssignedEmpIds = existingAssignments.map((ea) =>
        ea.get("emp_id")
      );
      return responseHandler.error(
        res,
        `These employees are already assigned a job: ${alreadyAssignedEmpIds.join(
          ", "
        )}`,
        resCode.BAD_REQUEST
      );
    }

    // ✅ All checks passed — assign job
    const assignments = await Promise.all(
      emp_ids.map((emp_id) => employeeJob.create({ emp_id, job_id }))
    );

    return responseHandler.success(
      res,
      msg.employeeJob.assignSuccess,
      assignments,
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
export default {
  assignJobToEmployee,
  assignJobToManyEmployees,
};
