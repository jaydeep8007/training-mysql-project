import sequelize from '../config/sequelize';

import job from './job.model';
import employee from './employee.model';
import employeeJob from './employee_job.model';

// // One-to-many relation
// employee.hasMany(job, { foreignKey: 'job_id' , as: 'job' });
// job.belongsTo(employee, { foreignKey: 'emp_id' ,as: 'employee' });

// Each Employee belongs to one Job
employee.belongsTo(job, {
  foreignKey: "job_id",
  as: "job",
});

// One Job has many Employees
job.hasMany(employee, {
  foreignKey: "job_id",
  as: "employees",
});


export default  {
  sequelize,
  employee,
  job,
  employeeJob,
};