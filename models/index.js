import User from "./userModel.js";
import UserLoginHistory from "./userLoginHistoryModel.js";

const db = {
  User,
  UserLoginHistory,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
