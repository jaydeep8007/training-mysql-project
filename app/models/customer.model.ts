import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

interface CustomerAttributes {
  cus_id: string;
  cus_firstname: string;
  cus_lastname: string;
  cus_email: string;
  cus_phone_number: string;
  cus_password: string;
  cus_confirm_password?: string;
  reset_password_token?: string | null;
  reset_password_expires?: Date | null;
}

type CustomerCreationAttributes = Optional<CustomerAttributes, "cus_id">;

class Customer
  extends Model<CustomerAttributes, CustomerCreationAttributes>
  implements CustomerAttributes
{
  public cus_id!: string;
  public cus_firstname!: string;
  public cus_lastname!: string;
  public cus_email!: string;
  public cus_phone_number!: string;
  public cus_password!: string;
  public cus_confirm_password?: string;
  public reset_password_token?: string | null;
  public reset_password_expires?: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Customer.init(
  {
    cus_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cus_firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: "First name must be between 2 and 30 characters",
        },
      },
    },
    cus_lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: "Last name must be between 2 and 30 characters",
        },
      },
    },
    cus_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_cus_email",
        msg: "This Email Already Exists.",
      },
      validate: {
        isEmail: {
          msg: "Please provide a valid email address",
        },
      },
    },

    cus_phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_cus_phone_number",
        msg: "Phone number already exists",
      },
      validate: {
        isNumeric: {
          msg: "Phone number must contain only numbers",
        },
        len: {
          args: [10, 15],
          msg: "Phone number must be between 10 and 15 digits",
        },
      },
    },
    cus_password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: "Password must be at least 6 characters long",
        },
      },
    },
    cus_confirm_password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Confirm password is required",
        },
      },
    },
    reset_password_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "customers",
    timestamps: true,
  }
);

export default Customer;
