import { DataTypes, literal } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const TravellerDetails = sequelize.define('traveller_details', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    dob: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    age: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    modified_date: {
        type: DataTypes.NOW,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP'),
        onUpdate: literal('CURRENT_TIMESTAMP'),
    },
    ip: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'traveller_details',
});

export default TravellerDetails;