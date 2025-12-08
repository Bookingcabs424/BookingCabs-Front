import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserTransaction = sequelize.define("user_transaction", {
    booking_trans_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    action_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    booking_transaction_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    current_balance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        allowNull: true,
    },
    itinerary_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    payment_response_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    payment_status: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    payment_type_id: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    payment_upload_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "user_transaction",
    timestamps: false,
});

export default UserTransaction;