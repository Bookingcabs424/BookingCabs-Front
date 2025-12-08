// models/CardDetails.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

  const CardDetails = sequelize.define('CardDetails', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    card_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique:true,
      validate: {
        len: [12, 20]
      }
    },
    card_holder_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    payment_method: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: [[0, 1]]
      },
      comment: '0-creditcard, 1-DebitCard'
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString()
      }
    },
    user_id:{
          type: DataTypes.INTEGER,
    },
    cvv: {
      type: DataTypes.STRING(4),
      allowNull: false,
      validate: {
        len: [3, 4]
      }
    }
  }, {
    tableName: 'card_details',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Instance methods
  CardDetails.prototype.isExpired = function() {
    return new Date() > this.expiry_date;
  };

  CardDetails.prototype.getCardType = function() {
    return this.payment_method === 0 ? 'Credit Card' : 'Debit Card';
  };

  CardDetails.prototype.maskCardNumber = function() {
    return this.card_number.replace(/(\d{4})/g, (match, p1, offset) => {
      return offset === 0 ? match : 'XXXX';
    }).replace(/\sXXXX$/, '');
  };

  export default CardDetails;

