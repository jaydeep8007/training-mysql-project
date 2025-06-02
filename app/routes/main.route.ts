import express from "express";
const router = express.Router();
// const VERIFY = require('../util/userAuth');
import customerRoutes from "./customer.route";

router.use("/customer", customerRoutes);

export default router;
