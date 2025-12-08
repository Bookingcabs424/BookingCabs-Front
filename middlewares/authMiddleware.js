import { verifyToken } from "../utils/jwt.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import { checkUserRole } from "../utils/helpers.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  let ip = req?.ip
 if(req.body) req.body.ip =ip
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return errorResponse(
      res,
      MESSAGES.AUTH.TOKEN_MISSING,
      MESSAGES.AUTH.UNAUTHORIZED,
      STATUS_CODE.UNAUTHORIZED
    );
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    console.log({user:req.user})
    next();
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.AUTH.INVALID_TOKEN,
      err.message,
      STATUS_CODE.UNAUTHORIZED
    );
  }
};

export const hasRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { role } = req.user;
console.log({role})
      if (!role) {
        return errorResponse(
          res,
          MESSAGES.ROLE.ROLE_ID_NOT_PROVIDED,
          MESSAGES.ROLE.ROLE_ID_NOT_PROVIDED,
          STATUS_CODE.UNAUTHORIZED
        );
      }

      const roleKey = await checkUserRole(role);
console.log({roleKey})
      if (!roleKey) {
        return errorResponse(
          res,
          MESSAGES.ROLE.INVALID_ROLE,
          MESSAGES.ROLE.INVALID_ROLE,
          STATUS_CODE.UNAUTHORIZED
        );
      }

      if (!allowedRoles.includes(roleKey)) {
        return errorResponse(
          res,
          MESSAGES.ROLE.ACCESS_DENIED,
          MESSAGES.ROLE.ACCESS_DENIED,
          STATUS_CODE.FORBIDDEN
        );
      }

      next();
    } catch (error) {
      return errorResponse(
        res,
        MESSAGES.AUTH.INVALID_TOKEN,
        err.message,
        STATUS_CODE.UNAUTHORIZED
      );
    }
  };
};
