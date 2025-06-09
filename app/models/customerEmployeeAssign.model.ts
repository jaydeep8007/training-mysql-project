import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const customerEmployeeModel = sequelize.define('employee_customer', {
  emp_cus_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  emp_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employee',
      key: 'emp_id',
    },
  },
  cus_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customer',
      key: 'cus_id',
    },
  },
}, {
  tableName: 'employee_customer',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['emp_id', 'cus_id']  // Prevent duplicate assignments
    }
  ],
});

export default customerEmployeeModel;
