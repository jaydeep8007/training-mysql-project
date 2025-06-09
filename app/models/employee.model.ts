import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const employeeModel = sequelize.define(
  "employee",
  {
    emp_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    emp_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emp_email: {
      type: DataTypes.STRING,
      allowNull: false,
     unique: {
        name: "unique_email",
        msg: "Email address already in use",
      },
    },
    emp_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emp_company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emp_mobile_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "employee",
    timestamps: true,
    collate: "utf8_general_ci",
  }
);


export default employeeModel;
