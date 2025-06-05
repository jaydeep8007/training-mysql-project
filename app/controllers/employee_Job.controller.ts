import { NextFunction, Request, Response } from "express";
import employeeJob from "../models/employee_job.model";
import employee_jobValidation from "../validations/employee_job.validation";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";
import { ValidationError } from "sequelize";

const assignJobToEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const parsed = employee_jobValidation.assignJobSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return res.status(400).json({ message: errorMsg });
    }

    const { emp_id, job_id } = parsed.data;

    if (!emp_id || !job_id) {
      res.status(400).json({ message: "emp_id and job_id required" });
    }

    const assignment = await employeeJob.create(parsed.data);
    return responseHandler.success(
      res,
      "Assignment created successfully for ",
      assignment,
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

export default {
  assignJobToEmployee,
};
