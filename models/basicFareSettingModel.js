import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BasicFareSetting = sequelize.define('BasicFareSetting', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    base_vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    rounding: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '1 - Cash, 2 - Account / Credit Card'
    },
    level: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '1 - Normal, 2 - Decimal, 3 - Unit'
    },
    direction: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '1 - Nearest, 2 - Upward, 3 - Downward'
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
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
    },
    ip: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    freezeTableName:true,
    tableName: 'basic_fare_settings',
    timestamps: false,
    underscored: true,
});

export default BasicFareSetting