// models/userSignatureModel.js
import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserSignature = sequelize.define(
  "UserSignature",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    // Signature specific field
    signature: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      collate: 'latin1_swedish_ci'
    },
    
    
    
    // Audit fields
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(50),
      allowNull: false,
      collate: 'latin1_swedish_ci'
    }
  },
  {
    timestamps: false,
    tableName: "user_signature",
    hooks: {
      beforeUpdate: (userSignature) => {
        userSignature.modified_date = new Date();
      }
    }
  }
);

// Associations
UserSignature.associate = (models) => {
  UserSignature.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

export default UserSignature;