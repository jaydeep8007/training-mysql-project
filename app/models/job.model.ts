import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const job = sequelize.define(
  "job",
  {
    job_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    job_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    job_sku: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    job_category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "job",
    timestamps: true,
    collate: "utf8_general_ci",
  }
);

export default job;
