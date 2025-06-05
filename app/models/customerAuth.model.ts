import sequelize from "../config/sequelize";
import { DataTypes } from "sequelize";

const customerAuthModel = sequelize.define(
  "customer_auth",
  {
    cus_auth_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "customers", // the table name, not the model file name
        key: "cus_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    cus_auth_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cus_refresh_auth_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    collate: "utf8_general_ci",
  }
);

export default customerAuthModel;
