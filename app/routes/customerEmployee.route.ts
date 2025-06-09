import express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = express.Router();

import customerEmployeeAssignController from "../controllers/customerEmployeeAssign.controller";

// 📦 Employee CRUD routes
router.post("/", customerEmployeeAssignController.assignEmployeeToCustomer);
router.get("/get-all", customerEmployeeAssignController.getCustomersWithEmployees);
router.get("/:id", customerEmployeeAssignController.getCustomerWithEmployeesById);

export default router;
