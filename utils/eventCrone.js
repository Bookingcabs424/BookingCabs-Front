import cron from "node-cron";
// import {
//   sendBookingEmailAhmedabad,
//   sendBookingEmailBangalore,
//   sendTestEmail,
// } from "../controllers/bookingContoller.js";
// import { logger } from "./logger.js";
// import dotenv from "dotenv";
// import { sendDhanterasEmail, sendFestEmail } from "../controllers/emailController.js";
// dotenv.config();

import { disableExpiredFares } from "../controllers/fareManagementController.js";
import { logger } from "./logger.js";
import moment from "moment";
import {
  sendCronEmail,
  sendFestEmail,
} from "../controllers/emailController.js";

// // Env Variables
// // ENABLE_TEST_CRON=false
// // ENABLE_BANGALORE_CRON=false
// // ENABLE_AHMEDABAD_CRON=false

// // Environment variable checks
// const TEST_CRON_ENABLED = process.env.ENABLE_TEST_CRON === 'true';
// const BANGALORE_CRON_ENABLED = process.env.ENABLE_BANGALORE_CRON === 'true';
// const AHMEDABAD_CRON_ENABLED = process.env.ENABLE_AHMEDABAD_CRON === 'true';
// const DHANTERAS_CRON_ENABLED = process.env.DHANTERAS_CRON == 'true';

// if (!global.__cronInitialized) {
//   global.__cronInitialized = true;
//   logger.info("Initializing cron jobs...");

//   // Testing cron - runs every 10 minutes
//   if (TEST_CRON_ENABLED) {
//     cron.schedule("*/10 * * * *", async () => {
//       try {
//         logger.info("Running test cron job (every 10 minutes)");
//         await sendTestEmail();
//       } catch (error) {
//         logger.error("Error in test cron job:", error);
//       }
//     });
//     logger.info("Test cron job enabled");
//   }
// if(DHANTERAS_CRON_ENABLED){

// const cronJob = cron.schedule(
//   "* * * * *",
//   async () => {
//     try {
//       logger.info("⏰ Running Bhai Dooj booking email job...");
//       console.log("⏰ Running Bhai Dooj booking email job...");

//       const today = new Date();
// const targetDate = new Date("2025-10-23T12:00:00+05:30");

//       // Run only once on target date
//       if (today.toDateString() === targetDate.toDateString()) {
//         // await sendFestEmail("Bhai_Dooj_Email","Happy Bhai Dooj!");
//         cronJob.stop(); // stop after sending once
//         console.log("📧 Bhai_Dooj_Email email sent successfully!");
//         logger.info("🛑 Cron job stopped after sending email once.");
//       } else {
//         logger.info("⏭ Not Bhai_Dooj_Email day yet, skipping...");
//       }
//     } catch (error) {
//       logger.error("❌ Error sending Bhai_Dooj_Email booking emails:", error);
//     }
//   },
//   { timezone: "Asia/Kolkata" }
// );
// cronJob.start();

// const cronChath = cron.schedule(
//   "* * * * *",
//   async () => {
//     try {
//       logger.info("⏰ Running chath_pooja_email booking email job...");
//       console.log("⏰ Running chath_pooja_email booking email job...");

//       const today = new Date();
// const targetDate = new Date("2025-10-25T08:00:00+05:30");

//       // Run only once on target date
//       if (today.toDateString() === targetDate.toDateString()) {
//         await sendFestEmail("chath_pooja_email","Happy Chhath Pooja!!!");
//         cronChath.stop(); // stop after sending once
//         console.log("📧 chath_pooja_email email sent successfully!");
//         logger.info("🛑 Cron job stopped after sending email once.");
//       } else {
//         logger.info("⏭ Not chath_pooja_email day yet, skipping...");
//       }
//     } catch (error) {
//       logger.error("❌ Error sending chath_pooja_email booking emails:", error);
//     }
//   },
//   { timezone: "Asia/Kolkata" }
// );

// cronChath.start();

// }

//   // Log which cron jobs are disabled
//   if (!TEST_CRON_ENABLED) logger.info("Test cron job disabled");
//   if (!BANGALORE_CRON_ENABLED) logger.info("Bangalore cron job disabled");
//   if (!AHMEDABAD_CRON_ENABLED) logger.info("Ahmedabad cron jobs disabled");
// }

cron.schedule("0 0 * * *", () => {
  console.log("Daily cron job executed at midnight");
  disableExpiredFares();
  // Place your daily task logic here
});

export function scheduleTask({
  html,
  subject,
  date,
  time,
  frequency,
  show_header_footer,
}) {

  const [hour, minute] = time.split(":").map(Number);
  const startDate = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");

  let cronExpression = "";

  const dayOfMonth = startDate.date();
  const month = startDate.month() + 1;
  const dayOfWeek = startDate.day();

  switch (frequency) {
    case "daily":
      cronExpression = `${minute} ${hour} * * *`;
      break;
    case "weekly":
      cronExpression = `${minute} ${hour} * * ${dayOfWeek}`;
      break;
    case "monthly":
      cronExpression = `${minute} ${hour} ${dayOfMonth} * *`;
      break;
    case "yearly":
      cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} *`;
      break;
    case "once":
      // no cron expression needed
      break;
    default:
      throw new Error("Invalid frequency type");
  }

  if (frequency === "once") {
    const delay = startDate.diff(moment());
    if (delay > 0) {
      console.log(
        `🕐 One-time task "${subject}" scheduled at ${startDate.format()}`
      );
      setTimeout(() => sendCronEmail(html, subject, show_header_footer), delay);
    } else {
      console.log("⚠️ Start time is in the past — skipping schedule.");
    }
    return; // 👈 stop here — do not run cron.schedule()
  }

  // if we reach here, it’s repeating task
  console.log("cronExpression", cronExpression);
  cron.schedule(cronExpression, () =>
    sendCronEmail(html, subject, show_header_footer)
  );
  console.log(`🔁 Now repeating ${frequency} with CRON: ${cronExpression}`);
}

// export const masterCron = async (req, res) => {
//   const {
//     date_time,
//     frequency,
//     subject,
//     template,
//     show_header_footer,
//   } = req.body;
//   console.log(req.body);
//   try {
//     if (!date_time || !frequency || !subject || !template) {
//       return res.status(400).json({ error: "Missing required parameters" });
//     }

//     const dateObj = moment(date_time, "YYYY-MM-DD HH:mm");
//     if (!dateObj.isValid()) {
//       return res.status(400).json({ error: "Invalid date/time format" });
//     }

//     const date = dateObj.format("YYYY-MM-DD");
//     const time = dateObj.format("HH:mm");

//     // if (!global.__cronInitialized) {
//     // global.__cronInitialized = true;
//     console.log("🚀 Initializing masterCron job...");

//     scheduleTask({
//       html: template,
//       subject,
//       date,
//       time,
//       frequency,
//       show_header_footer,
//     });
//     // }
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
// };

export const masterCron = async (req, res) => {
  try {
    let {
      date_time,
      frequency,
      repeat_days,
      subject,
      template,
      show_header_footer,
    } = req.body;


    // default repeat_days to 1
    if (!repeat_days || repeat_days < 1) {
      repeat_days = 1;
    }

    // -------------------------------------------------------
    // CASE 1: MULTIPLE CUSTOM DATES (date_time as array)
    // -------------------------------------------------------
    if (Array.isArray(date_time) && date_time.length > 0) {
      date_time.forEach((dt) => {
        let dateObj = moment(dt, "YYYY-MM-DD HH:mm");
        let date = dateObj.format("YYYY-MM-DD");
        let time = dateObj.format("HH:mm");
        scheduleTask({
          html: template,
          subject,
          date: date,
          time: time,
          frequency: "once",
          // repeat_days: 1, // once means no repeat
          show_header_footer,
        });
      });

      return res.json({
        success: true,
        message: "Scheduled emails for multiple custom dates",
      });
    }

    // -------------------------------------------------------
    // CASE 2: SINGLE DATE TIME (standard scheduling)
    // -------------------------------------------------------
    if (!date_time || !frequency || !subject || !template) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const dateObj = moment(date_time, "YYYY-MM-DD HH:mm");
    if (!dateObj.isValid()) {
      return res.status(400).json({ error: "Invalid date/time format" });
    }

    console.log("🚀 Initializing masterCron job...");

    scheduleTask({
      html: template,
      subject,
      date_time,
      frequency,
      repeat_days,
      show_header_footer,
    });

    return res.json({
      success: true,
      message: "Cron scheduled successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
