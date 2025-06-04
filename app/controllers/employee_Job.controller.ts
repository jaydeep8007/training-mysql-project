import { Request, Response } from "express";
import employeeJob from "../models/employee_job.model";

 const assignJobToEmployee = async (req: Request, res: Response) => {
  try {
    // expect emp_id and job_id in req.body
    const { emp_id, job_id } = req.body;

    if (!emp_id || !job_id) {
       res.status(400).json({ message: "emp_id and job_id required" });
    }

    const assignment = await employeeJob.create({ emp_id, job_id });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Failed to assign job", error });
  }
};

export default {
  assignJobToEmployee,
}
