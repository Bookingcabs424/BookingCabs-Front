import { fr } from "date-fns/locale";
import sequelize from "../config/clientDbManager.js";
import { DataTypes } from "sequelize";

const Client = sequelize.define('Client', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    clientName: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    clientId: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    clientKey: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    clientPrivateKey: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    driver_share: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    partner_share: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    company_share: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ip_address: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
    },
}, {
    freezeTableName: true, // Prevents Sequelize from pluralizing table names
    tableName: 'client', // Adjust table name if needed
    timestamps: false, // Set to true if you have createdAt and updatedAt fields
});

export default Client;