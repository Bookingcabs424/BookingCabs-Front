import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const HelicopterShift = sequelize.define('HelicopterShift', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    vehicle_number:{
        type: DataTypes.STRING,
        allowNull:false
        
    },
    departTime: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    arrivalTime: {
          type: DataTypes.DATEONLY,
        allowNull: false
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departure: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // per_hr_charge: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
   
    currency: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:'Rupee'
    },
    rate: {
        type: DataTypes.TINYINT,
        allowNull: true
    },
    week_days: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '1,2,3,4,5,6,7'
    },
 
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
                defaultValue: 0

    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('0', '1', '2', '3'),
        allowNull: false,
        defaultValue: '1'
    },
    ip: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableNameFreeze:true,
    tableName: 'helicopter_shift',
    timestamps: true,
    underscored: true
});
export default HelicopterShift