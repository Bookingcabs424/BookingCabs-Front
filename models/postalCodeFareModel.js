import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

// models/PostalCodeFare.js
   const PostalCodeFare = sequelize.define('PostalCodeFare', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        base_vehicle_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pickup_postcode: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        drop_postcode: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modified_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            // Note: Sequelize does not support 'ON UPDATE CURRENT_TIMESTAMP' directly in the model.
            // You should keep that defined at the DB level if needed.
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('0', '1'),
            allowNull: false,
            defaultValue: '1'
        }
    }, {
        freezeTableName:true,
        tableName: 'postalcode_fare',
        timestamps: false, // Disables Sequelize's default createdAt/updatedAt
        underscored: true
    });

    export default PostalCodeFare;
