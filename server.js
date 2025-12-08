import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";
import app from "./app.js";
import sequelize from "./config/clientDbManager.js";
import "./models/userModel.js";
import "./models/userRoleModel.js";
import "./models/activationModel.js";
import "./models/roleTypeModel.js";
import "./models/smsApiModel.js";
import "./models/smsTemplateModel.js";
import "./models/emailApiModel.js";
import "./models/emailTemplateModel.js";
import "./models/userInfoModel.js";
import "./models/userLoginHistoryModel.js";
import "./models/userBankDetailModel.js";
import "./models/bankAccountLogModel.js";
import "./models/companyDetailModel.js";
import "./models/vehicleMasterModel.js";
import "./models/userUploadDocumentModel.js";
import "./models/userVehicleUploadDocumentModel.js";
import "./models/userDutyPrefrenceModel.js";
import "./models/contactModel.js";
import "./models/userTransactionModel.js";
import "./models/userWalletTransactionModel.js";
import "./models/referalDiscountAmountModel.js";
import "./models/referalSignupHistoryModel.js";
import "./models/walletPointConversionModel.js";
import './models/associateModels.js'; // Register associations after models are loaded
import "./models/newsletteruserModel.js";
import "./models/processAirportData.js";
import { Server } from 'socket.io';
import https from "https";
import User from "./models/userModel.js";
import { verifyToken } from "./utils/jwt.js";
import { userwalletAmount } from "./controllers/walletController.js";
import "./models/emailTemplateModel.js";
import "./models/cityPagesModel.js";
import "./models/Chat/chats.js";
import "./models/Chat/chatMembers.js";
import "./models/Chat/messages.js";
import "./models/usertypeModuleModel.js";
import chatSocket from "./socket/chatSocket.js";
import fs from 'fs'; 

dotenv.config();

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 5000;
    const privateKey = fs.readFileSync('ssl/private.key', 'utf8');
    const certificate = fs.readFileSync('ssl/certificate.crt', 'utf8');
    // Optional: If you have a CA certificate chain, include it here
    // const caBundle = fs.readFileSync('path/to/your/ca_bundle.crt', 'utf8');

    const httpsOptions = {
        key: privateKey,
        cert: certificate,
        // ca: caBundle // Uncomment if you have a CA bundle
    };


if (cluster.isPrimary) {
  logger.info(`👑 Primary process ${process.pid} is running`);

  await import('./utils/eventCrone.js');

  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.warn(`💀 Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const startServer = async () => {
    try {
      await sequelize.authenticate();
            const server = https.createServer(httpsOptions,app);

      const io = new Server(server, {
        cors: {
          origin: process.env.ORIGIN_URL?.split(",") || [],
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });
      io.use(async (socket, next) => {
        try {
          const token = socket.handshake.auth?.token;
          console.log("Received token:", token);

          if (!token) {
            return next(new Error("Token missing"));
          }

          const decoded = verifyToken(token); // reuse same verifyToken
          socket.user = decoded;

          // (Optional) fetch full user if needed
          const user = await User.findByPk(decoded.id)
          if (!user) return next(new Error("User not found"));
          socket.user = user.get({ plain: true })
          next();
        } catch (err) {
          console.error('Socket auth error:', err.message);
          return next(new Error("Unauthorized"));
        }
      });
      io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);
        // ✅ Listen for custom event like 'get_user'
        socket.on('get_user', async () => {
          try {
            const user = await userwalletAmount(socket.user.id, null, true);

            if (!user) {
              return socket.emit('user_data', { error: 'User not found' });
            }

            // ✅ Send user data back to the client
            socket.emit('user_data', user);
          } catch (err) {
            console.error('Error fetching user:', err);
            socket.emit('user_data', { error: 'Internal server error' });
          }
        });

        // Attach Chat Socket Events
        chatSocket(io);
        socket.on('disconnect', () => {
          console.log('Socket disconnected:', socket.id);
        });
      });


      // await sequelize.sync({ alter: true });

      server.listen(PORT, () => {
        logger.warn(`🚀 Worker ${process.pid} running on port ${PORT}`);
      });
    } catch (error) {
      logger.error(`❌ Worker ${process.pid} DB error: ${error.message}`);
      process.exit(1);
    }
  };

  startServer();
}

