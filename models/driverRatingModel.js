import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const DriverRating = sequelize.define('DriverRating', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    BookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    DID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    UID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'DriverRatings', 
    timestamps: false,
});

export default DriverRating;