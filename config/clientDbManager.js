
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
console.log(
process.env.CLIENT_DB_NAME,
  process.env.CLIENT_DB_USER,
  process.env.CLIENT_DB_PASSWORD,
"CREDES"
)

dotenv.config();
const sequelize = new Sequelize(
 process.env.CLIENT_DB_NAME,
  process.env.CLIENT_DB_USER,
  process.env.CLIENT_DB_PASSWORD,
  {
    host: process.env.CLIENT_DB_HOST,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 10000,
    },
  }
);

export default sequelize;


