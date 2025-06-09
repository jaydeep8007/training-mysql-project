// import sequelize from "../config/sequelize";

// import jobModel from "./job.model";
// import employeeModel from "./employee.model";
// import employeeJobModel from "./employeeJobAssign.model";

// import customerModel from "./customer.model";
// import customerAuthModel from "./customerAuth.model";

// import customerEmployeeModel from "./customerEmployeeAssign.model";

// // One customer has one auth entry
// customerModel.hasOne(customerAuthModel, {
//   foreignKey: "cus_id",
//   as: "auth",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });

// // Auth belongs to a customer
// customerAuthModel.belongsTo(customerModel, {
//   foreignKey: "cus_id",
//   as: "customer",
// });

// // // One-to-many relation
// // employee.hasMany(job, { foreignKey: 'job_id' , as: 'job' });
// // job.belongsTo(employee, { foreignKey: 'emp_id' ,as: 'employee' });

// // Each Employee belongs to one Job
// employeeModel.belongsTo(jobModel, {
//   foreignKey: "job_id",
//   as: "job",
// });

// // One Job has many Employees
// jobModel.hasMany(employeeModel, {
//   foreignKey: "job_id",
//   as: "employees",
// });

// export default {
//   sequelize,
//   employeeModel,
//   jobModel,
//   employeeJobModel,
//   customerModel,
//   customerAuthModel,
//   customerEmployeeModel
// };


import sequelize from "../config/sequelize";

import jobModel from "./job.model";
import employeeModel from "./employee.model";
import employeeJobModel from "./employeeJobAssign.model";

import customerModel from "./customer.model";
import customerAuthModel from "./customerAuth.model";
import customerEmployeeModel from "./customerEmployeeAssign.model";

// Associations:

// Customer and CustomerAuth
customerModel.hasOne(customerAuthModel, {
  foreignKey: "cus_id",
  as: "auth",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
customerAuthModel.belongsTo(customerModel, {
  foreignKey: "cus_id",
  as: "customer",
});

// Employee and Job
employeeModel.belongsTo(jobModel, {
  foreignKey: "job_id",
  as: "job",
});
jobModel.hasMany(employeeModel, {
  foreignKey: "job_id",
  as: "employees",
});

// EmployeeCustomer junction table associations
// Many-to-many: Employee <-> Customer via employeeCustomerModel

employeeModel.belongsToMany(customerModel, {
  through: customerEmployeeModel,
  foreignKey: "emp_id",
  otherKey: "cus_id",
  as: "customers",
});

customerModel.belongsToMany(employeeModel, {
  through: customerEmployeeModel,
  foreignKey: "cus_id",
  otherKey: "emp_id",
  as: "employees",
});

export default {
  sequelize,
  employeeModel,
  jobModel,
  employeeJobModel,
  customerModel,
  customerAuthModel,
  customerEmployeeModel,  
};
