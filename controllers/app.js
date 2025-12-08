import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { setupSwagger } from "./swagger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoute from "../routes/authRoute.js";
import roleRoute from "../routes/userRoleRoute.js";
import bankRoute from "../routes/userBankDetailRoute.js";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter.js";
import companyRoute from "../routes/companyRotue.js";
import userUploadRoute from "../routes/userUploadDocumentRoute.js";
import userVehicleUploadRoute from "../routes/userVehicleUploadDocumentRoute.js";
import userDutyRoute from "../routes/userDutyPrefRoute.js";
import paymentType from "../routes/paymentTypeRoute.js";
import paymentRoute from "../routes/paymentRoute.js";
import { logger, stream } from "./utils/logger.js";
import creditLimitRoute from "../routes/walletRoute.js";
import fareManagementRouter from "./routes/fareManagementRoute.js";
import VendorRouter from "../routes/vendorRoute.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import BiddingRouter from "../routes/biddingRoute.js";
import BookingRouter from "../routes/bookingRoute.js";
import vehicleRouter from "../routes/vehicleMasterRoute.js";
import driverRouter from "../routes/driverRoute.js";import bookingRoute from "./routes/bookingRoute.js";
import fareWrapperRoute from "../routes/fareWrapperRoute.js";
import cityyRouter from "../routes/masterCityRoute.js";
import localpkgrouter from "../routes/localPackageRoute.js";
import locationrouter from "../routes/locationRoute.js";
import { add } from "date-fns";
import addressRouter from "../routes/masterAddressRoute.js";
import { getCountry } from "../controllers/masterCountryController.js";
import vehicle from "./routes/vehicleMasterRoute.js";
import { geocodeAddress, getDistance } from "../controllers/distanceController.js";
dotenv.config();

const app = express();

// 🛑 Handle uncaught exceptions and rejections safely
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.stack}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  console.log(reason);
});
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ORIGIN_URL?.split(",") || [];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Morgan + Winston integration
app.use(morgan("combined", { stream }));

app.use(rateLimiterMiddleware);
setupSwagger(app);

// app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/roles", roleRoute);
app.use("/api/bankDetail", bankRoute);
app.use("/api/company", companyRoute);
app.use("/api/userDocument", userUploadRoute);
app.use("/api/userVehicleDocument", userVehicleUploadRoute);
app.use("/api/Duties", userDutyRoute);
app.use("/api/paymentType", paymentType);
app.use("/api/payment",paymentRoute);
app.use("/api/userDutyPreference", userDutyRoute);
app.use("/api/creditLimit", creditLimitRoute);
// app.use("/api/fare_management", fareManagementRouter);
app.use("/api/vendor", VendorRouter);
app.use("/api/bidding", BiddingRouter);
app.use("/api/booking", BookingRouter);
app.use("/api/vehicle", vehicleRouter);
app.use("/api/driver", driverRouter);

app.use("/api/booking", bookingRoute);
app.use('/api/fare',fareWrapperRoute)
app.use("/api/city",cityyRouter)
app.use("/api/local",localpkgrouter);
app.use("/api/location",locationrouter)
app.use("/api/address",addressRouter); 
app.use("/api/vehicle",vehicle)
app.get('/api/distance/geoCode',geocodeAddress)
app.get("/api/distance",getDistance)
app.get("/api/country/get-country",getCountry)
app.get("/", (req, res) => {
  res.send("🚀 Booking Cabs API is up and running!");
});


app.use(errorHandler);

export default app;
