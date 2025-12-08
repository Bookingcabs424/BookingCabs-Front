import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserWalletTransaction = sequelize.define('user_wallet_transaction', {
    wallet_trans_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'user_wallet_transaction',
    timestamps: false,
});

export default UserWalletTransaction;