import { Request, Response, NextFunction } from "express";
import { ValidationError } from "sequelize";

import jobModel from "../models/job.model";
import { jobCreateSchema } from "../validations/job.validation";

import { resCode } from "../constants/resCode";
import { msg } from "../constants/language/en.constant";
import { responseHandler } from "../services/responseHandler.service";
import commonQuery from "../services/commonQuery.service";

// 🔸 Initialize job-specific query handler
const jobQuery = commonQuery(jobModel);

/* ============================================================================
 * ➕ Create a New Job
 * ============================================================================
 */
const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = await jobCreateSchema.safeParseAsync(req.body);

    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const newJob = await jobQuery.create(parsed.data);

    return responseHandler.success(
      res,
      msg.job.createSuccess,
      newJob,
      resCode.CREATED
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(", "), resCode.BAD_REQUEST);
    }

    return next(error);
  }
};

/* ============================================================================
 * 📥 Get All Jobs
 * ============================================================================
 */
const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await jobQuery.getAll();

    return responseHandler.success(
      res,
      msg.job.fetchSuccess,
      jobs,
      resCode.OK
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(", "), resCode.BAD_REQUEST);
    }

    return next(error);
  }
};

/* ============================================================================
 * 📦 Export Job Controller
 * ============================================================================
 */
export default {
  createJob,
  getAllJobs,
};