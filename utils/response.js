import { MESSAGES, STATUS_CODE } from "../constants/const.js";

export const successResponse = (
  res,
  message = "Success",
  data = null,
  statusCode = STATUS_CODE.OK
) => {
  const response = {
    status: "success",
  };

  if (Array.isArray(data)) {
    response.data = data;
  } else if (data && typeof data === "object" && Object.keys(data).length > 0) {
    response.data = data;
    response.message = message;
  } else {
    response.message = message;
  }

  return res.status(statusCode).json({ responseData: { response } });
};

export const errorResponse = (
  res,
  message = "Something went wrong",
  error = {},
  statusCode = STATUS_CODE.SERVER_ERROR
) => {
  return res.status(statusCode).json({
    responseData: {
      response: {
        status: "failed",
        message,
        ...(Object.keys(error).length > 0 && { error }),
      },
    },
  });
};
