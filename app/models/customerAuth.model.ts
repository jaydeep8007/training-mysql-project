import Sequelize from 'sequelize';
import sequelize from '../config/sequelize';

const customerAuthModel = sequelize.define('customer_auth', {
    cus_auth_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    cus_id: {
        type: Sequelize.UUID,
        references: {
            model: 'customers',
            key: 'cus_id'
        },
        allowNull: false,
    },
    cus_auth_token: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    cus_refresh_auth_token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    }
});

export default customerAuthModel;