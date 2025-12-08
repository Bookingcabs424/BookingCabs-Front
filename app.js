import express from "express";
import cors from "cors";
import morgan from "morgan";
import XLSX from "xlsx";
import dotenv from "dotenv";
import fs from "fs";
import _ from "lodash";
import { Op } from "sequelize";
import multer from "multer";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dashboardRouter from "./routes/dashboardRoute.js";
import notificationRouter from "./routes/notificationRoute.js"

// Utils & Middleware
import { logger, stream } from "./utils/logger.js";
import { setupSwagger } from "./swagger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Routes
import addressRouter from "./routes/masterAddressRoute.js";
import airportRailwayRouter from "./routes/masterAirportRailwayRoute.js";
import authRoute from "./routes/authRoute.js";
import bankRoute from "./routes/userBankDetailRoute.js";
import biddingRouter from "./routes/biddingRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import bookingTypeRoute from "./routes/bookingTypeRoute.js";
import campaignMasterRouter from "./routes/campaignMasterRoutes.js";
import cityActivityRouter from "./routes/masterCityActivityRoute.js";
import cityIntroductionRouter from "./routes/masterCityIntroductionRoute.js";
import cityRouter from "./routes/masterCityRoute.js";
import codeRoute from "./routes/codeRoute.js";
import companyRoute from "./routes/companyRotue.js";
import coupanRouter from "./routes/masterCoupanRoute.js";
import creditLimitRoute from "./routes/walletRoute.js";
import documentRouter from "./routes/masterDocumentationRoute.js";
import driverRouter from "./routes/driverRoute.js";
import emailRoute from "./routes/emailRoutes.js";
import emailTemplateRoute from "./routes/emailTemplateRoute.js";
import fareManagementRouter from "./routes/fareManagementRoute.js";
import fareWrapperRouter from "./routes/fareWrapperRoute.js";
import familyDetailRouter from "./routes/friendFamilyRoute.js";
import localPackageRouter from "./routes/localPackageRoute.js";
import locationRouter from "./routes/locationRoute.js";
import masterBookingTypeRoute from "./routes/masterBookingTypeRoute.js";
import masterCancellationRouter from "./routes/masterCancellationPolicyRoute.js";
import masterItineraryRoute from "./routes/masterItinearyDescriptionRoute.js";
import masterLocalPackageRoute from "./routes/masterLocalpackageRoute.js";
import masterPackageRouter from "./routes/masterPackageRoute.js";
import masterPaymentStructureRouter from "./routes/masterPaymentStructureRoute.js";
import masterRefundPolicyRouter from "./routes/masterRefundPolicyRoute.js";
import masterTermsConditionPolicyRouter from "./routes/masterTermsAndConditionPolicyRoute.js";
import masterTourExclusionRoute from "./routes/masterTourExclusionRoute.js";
import masterTourInclusionRoute from "./routes/masterTourInclusionRoute.js";
import masterTourManagementTypeRoute from "./routes/tourManagementTypeRoute.js";
import masterTourTypeRoute from "./routes/masterTourTypeRoute.js";
import newsletterCommentRouter from "./routes/newsletterCommentsRoute.js";
import newsletterRouter from "./routes/newsletterUserRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import paymentTypeRoute from "./routes/paymentTypeRoute.js";
import roleRouter from "./routes/userRoleRoute.js";
import staffRoleRouter from "./routes/roleRoute.js";
import userDutyRoute from "./routes/userDutyPrefRoute.js";
import userRoute from "./routes/userRoute.js";
import userUploadRoute from "./routes/userUploadDocumentRoute.js";
import userVehicleUploadRoute from "./routes/userVehicleUploadDocumentRoute.js";
import vehicleRouter from "./routes/vehicleMasterRoute.js";
import vendorRouter from "./routes/vendorRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import chatRouter from "./routes/chatsRoute.js";
import MasterModuleRouter from "./routes/moduleMaster.js";
import cityPageRouter from "./routes/citypageRoute.js";
import masterLocationRouter from "./routes/masterLocationRoute.js"
import masterAddressRouter from "./routes/masterAdressRoute.js"
import masterTransferRouter from "./routes/masterTransferRoute.js"

// Controllers
import { getCountry, getAllCountries } from "./controllers/masterCountryController.js";
import { getStates, getAllStates } from "./controllers/masterCityController.js";
import { geocodeAddress, getDistance } from "./controllers/distanceController.js";
import { getLanguageList } from "./controllers/languageController.js";
import { getWorkingShiftList } from "./controllers/workingShiftController.js";

// Excel Helper
import { processExcelFile } from "./index.js";
import AirportRailway from "./models/airportRailwayModel.js";
import { sendFestEmail } from "./controllers/emailController.js";
import localpkgrouter from "./routes/localPackageRoute.js";
import locationrouter from "./routes/locationRoute.js";
import NewsletterUser from "./models/newsletteruserModel.js";
import sequelize from "./config/clientDbManager.js";
import contactRouter from "./routes/contactRoute.js";

dotenv.config();

// ------------------------------------------------------
// App Initialization
// ------------------------------------------------------
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ------------------------------------------------------
// Directory Setup
// ------------------------------------------------------
const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "output");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ------------------------------------------------------
// Multer Setup
// ------------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// ------------------------------------------------------
// Core Middleware
// ------------------------------------------------------
app.use("/uploads", express.static(uploadDir));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("combined", { stream }));

app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = process.env.ORIGIN_URL?.split(",") || [];
      if (!origin || allowed.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ------------------------------------------------------
// Swagger
// ------------------------------------------------------
setupSwagger(app);

// ------------------------------------------------------
// Health Check
// ------------------------------------------------------
app.get("/", (req, res) => {
  res.send("🚀 Booking Cabs API is up and running!");
});

// ------------------------------------------------------
// API ROUTES (Clean Organized List)
// ------------------------------------------------------

app.use("/api/address", addressRouter);
app.use("/api/activity", cityActivityRouter);
app.use("/api/airport-railway", airportRailwayRouter);
app.use("/api/auth", authRoute);
app.use("/api/bankDetail", bankRoute);
app.use("/api/bidding", biddingRouter);
app.use("/api/booking", bookingRoute);
app.use("/api/booking-type", bookingTypeRoute);
app.use("/api/campaign-master", campaignMasterRouter);
app.use("/api/chat", chatRouter);
app.use("/api/module-master", MasterModuleRouter);
app.use("/api/city", cityRouter);
app.use("/api/city-introduction", cityIntroductionRouter);
app.use("/api/city-page", cityPageRouter);
app.use("/api/code", codeRoute);
app.use("/api/company", companyRoute);
app.use("/api/coupan", coupanRouter);
app.use("/api/contact", contactRouter);
app.use("/api/creditLimit", creditLimitRoute);
app.use("/api/documentation", documentRouter);
app.use("/api/driver", driverRouter);
app.use("/api/email", emailRoute);
app.use("/api/email-template", emailTemplateRoute);
app.use("/api/family", familyDetailRouter);
app.use("/api/fare", fareWrapperRouter);
app.use("/api/fare_management", fareManagementRouter);
app.use("/api/itinerary-description", masterItineraryRoute);
app.use("/api/lang", getLanguageList);
app.use("/api/local", localPackageRouter);
app.use("/api/local-package", masterLocalPackageRoute);
app.use("/api/location", locationRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/newsletter-comment", newsletterCommentRouter);
app.use("/api/packages", masterPackageRouter);
app.use("/api/payment", paymentRoute);
app.use("/api/paymentType", paymentTypeRoute);
app.use("/api/payment-structure", masterPaymentStructureRouter);
app.use("/api/refund-policy", masterRefundPolicyRouter);
app.use("/api/roles", roleRouter);
app.use("/api/staffRole", staffRoleRouter);
app.use("/api/terms-condition-policy", masterTermsConditionPolicyRouter);
app.use("/api/tour-booking-type", masterTourTypeRoute);
app.use("/api/tour-exclusion", masterTourExclusionRoute);
app.use("/api/tour-inclusion", masterTourInclusionRoute);
app.use("/api/tour-theme", masterTourManagementTypeRoute);
app.use("/api/transfer", masterTransferRouter);

app.use("/api/cancellation-policy", masterCancellationRouter)
app.use("/api/booking-type", masterBookingTypeRoute);
app.use("/api/location", masterLocationRouter);


app.use("/api/user", userRoute);
app.use("/api/userDocument", userUploadRoute);
app.use("/api/userVehicleDocument", userVehicleUploadRoute);
app.use("/api/userDutyPreference", userDutyRoute);
app.use("/api/vendor", vendorRouter);
app.use("/api/vehicle", vehicleRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/adress", masterAddressRouter);

// DIRECT CONTROLLER ROUTES
app.use("/api/driver", driverRouter);

app.use("/api/booking", bookingRoute);
app.use("/api/fare", fareWrapperRouter);
app.use("/api/city", cityRouter);
app.use("/api/local", localpkgrouter);
app.use("/api/location", locationrouter);
app.use("/api/address", addressRouter);

app.use("/api/code",codeRoute)
// app.use("/api/my-inventory", myinventoryRouter);
app.use("/api/documentation", documentRouter);
app.use("/api/cancellation-policy", masterCancellationRouter);
app.use("/api/payment-structure", masterPaymentStructureRouter);
app.use("/api/refund-policy", masterRefundPolicyRouter);
app.use("/api/terms-condition-policy", masterTermsConditionPolicyRouter);
app.use("/api/transfer", airportRailwayRouter);
app.use("/api/booking-type", bookingTypeRoute);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/notifications", notificationRouter);




app.get("/api/distance/geoCode", geocodeAddress);
app.get("/api/distance", getDistance);
app.get("/api/country/get-country", getCountry);
app.get("/api/country/get-all-countries", getAllCountries);
app.get("/api/states", getStates);
app.get("/api/all-states", getAllStates);
app.get("/api/distance", getDistance);
app.get("/api/distance/geoCode", geocodeAddress);
app.get("/api/shift-list", getWorkingShiftList);



// ------------------------------------------------------
// Excel Processor
// ------------------------------------------------------
app.post("/api/process-airport-data", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const input = req.file.path;
    const output = `output/processed-${req.file.originalname}`;

    const data = await processExcelFile(input, output);
    const createdBy = req.body?.user_id || 1;

    const valid = data.filter((r) => r.city_id);
    const BATCH_SIZE = 20;

    const collateUtf8 = (val) =>
      val == null
        ? null
        : sequelize.literal(
            `CAST(${sequelize.escape(val)} AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci`
          );

    for (const chunk of _.chunk(valid, BATCH_SIZE)) {
      await Promise.all(
        chunk.map(async (r) => {
          const name = r["airport_railway_bus_cruise terminal name"];
          if (!name) return;

          const pickupType = r.entry_type || "DEPARTURE";

          const exists = await AirportRailway.findOne({
            where: {
              city_id: r.city_id,
              state_id: r.state_id,
              country_id: r.country_id,
              pickup_type: pickupType,
              airport_railway_name: { [Op.eq]: collateUtf8(name) },
              meeting_point: { [Op.eq]: collateUtf8(name) },
            },
          });

          if (exists) return;

          await AirportRailway.create({
            city_id: r.city_id,
            state_id: r.state_id,
            country_id: r.country_id,
            pickup_type: pickupType,
            airport_railway_name: name,
            meeting_point: name,
            latitude: r.latitude?.toString() || "0.0",
            longitude: r.longitude?.toString() || "0.0",
            zone: r.zone || "Default Zone",
            created_by: createdBy,
            modified_by: 0,
          });
        })
      );
    }

    return res.json({
      message: "Excel processed successfully.",
      downloadUrl: `${req.protocol}://${req.get("host")}/${output}`,
    });
  } catch (err) {
    console.error("Airport Process Error:", err);
    res.status(500).json({ error: "Failed to process Excel data" });
  }
});

const clean = (value) => {
  if (value === undefined || value === null) return null;

  if (typeof value === "number") return value.toString();

  const cleaned = String(value).trim();
  return cleaned === "" ? null : cleaned;
};

app.post("/api/import-newsletter-excel", upload.array("files", 30), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    let totalInserted = 0;
    let totalDuplicates = 0;
    let totalRows = 0;

    const allowedStatus = ["Active", "Inactive", "Subscribed", "Unsubscribed"];

    for (const file of req.files) {

      const workbook = XLSX.readFile(file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      totalRows += rows.length;

      for (const row of rows) {
        const newPin = clean(row["PIN CODE"] || row["PINCODE"] || row["Pin Code"] || row["pin code"]);
        const cityName = (row["CITY "] || row["CITY"] || row["city"] || "").trim();

        const email =
          row["Email 1"]?.trim() ||
          row["Email 2"]?.trim() ||
          row["Email-1"]?.trim() ||
          row["Email-2"]?.trim() ||
          null;

        if (!email) continue;

        // 🔍 Check duplicate
        const exists = await NewsletterUser.findOne({ where: { email } });
        if (exists) {

          // 🔄 Update pin_code if missing
          if (newPin && (!exists.pin_code || exists.pin_code.trim() === "")) {
            await exists.update({
              pin_code: newPin,
              modified_date: new Date(),
            });
          }

          totalDuplicates++;
          continue;
        }

        // 🔍 Get city ID based on city name
        let city_id = null;
        if (cityName) {
          const [cityData] = await sequelize.query(
            "SELECT id FROM master_city WHERE name LIKE :city LIMIT 1",
            { replacements: { city: `%${cityName}%` } }
          );
          city_id = cityData.length ? cityData[0].id : null;
        }

        // 🔐 Clean & validate status
        let status = clean(row["Email Status"])?.trim() || "Active";

        // Enforce allowed or fallback
        if (!allowedStatus.includes(status)) {
          status = "Active";
        }

        // Fallback if status too long or contains numbers
        if (status.length > 20 || /\d/.test(status)) {
          status = "Active";
        }

        // 📝 Create new user
        await NewsletterUser.create({
          first_name: clean(row["First Name"]),
          last_name: clean(row["Last Name"]),
          email: clean(email),
          mobile:
            clean(row["Phone 1  Number"]) ||
            clean(row["Phone-1"]) ||
            clean(row["Phone-2"]) ||
            clean(row["Phone 2 Number"]),

          city_id: city_id || null,
          city_name: clean(cityName),

          address: clean(
            `${clean(row["Address 1"]) || clean(row["Address-1"]) || ""} ${
              clean(row["Address 2"]) || clean(row["Address-2"]) || ""
            }`
          ),

          pin_code: newPin,
          source: "Excel Import",

          email_subscription: "Active",
          mobile_subscription: "Active",

          unsubscribe_reason: clean(row["Remark"]),
          created_date: new Date(),
          created_by: 1,
          modified_date: new Date(),

          status: status, // ✔️ Fully sanitised
          ip: clean(req.ip) || "127.0.0.1",
        });

        totalInserted++;
      }
    }

    return res.status(200).json({
      message: "Multiple file import completed",
      inserted: totalInserted,
      duplicates: totalDuplicates,
      totalRows,
      totalFiles: req.files.length,
    });

  } catch (error) {
    console.error("❌ Import Error:", error);
    return res.status(500).json({ message: "Import failed", error });
  }
});

// ------------------------------------------------------
// Error Handler
// ------------------------------------------------------
app.use(errorHandler);

export default app;
