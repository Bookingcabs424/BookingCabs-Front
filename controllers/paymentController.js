import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import { successResponse, errorResponse } from "../utils/response.js";
import UserTransaction from "../models/userTransactionModel.js";
import sequelize from "../config/clientDbManager.js";
// import unirest from "unirest";
import dotenv from "dotenv";
import dateFormat from "dateformat";
import axios from "axios";
import crypto from "crypto";
import PaymentTransactionResponse from "../models/paymentTransactionModel.js";
import PaymentUpload from "../models/paymentUploadModal.js";
dotenv.config();
const req_enc_key = process.env.REQ_ENC_KEY;
const req_salt = process.env.REQ_SALT;
const res_dec_key = process.env.RES_DEC_KEY;
const res_salt = process.env.RES_SALT;

const algorithm = "aes-256-cbc";
const password = Buffer.from(req_enc_key, "utf8");
const salt = Buffer.from(req_salt, "utf8");
const respassword = Buffer.from(res_dec_key, "utf8");
const ressalt = Buffer.from(res_salt, "utf8");
const iv = Buffer.from(
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  "utf8"
);
const encrypt = (text) => {
  var derivedKey = crypto.pbkdf2Sync(password, salt, 65536, 32, "sha512");
  const cipher = crypto.createCipheriv(algorithm, derivedKey, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${encrypted.toString("hex")}`;
};

const decrypt = (text) => {
  const encryptedText = Buffer.from(text, "hex");
  var derivedKey = crypto.pbkdf2Sync(respassword, ressalt, 65536, 32, "sha512");
  const decipher = crypto.createDecipheriv(algorithm, derivedKey, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
export const userTransaction = async (paramsOrReq, res) => {
  let params;

  if (res) {
    // API call
    params = paramsOrReq.body;
  } else {
    // Internal call
    params = paramsOrReq;
  }

  const {
    user_id,
    amount,
    payment_type_id,
    bank_txn,
    bank_name,
    audit_status,
  } = params;

  // Mandatory fields check (only for API calls)
  if (res && (!user_id || !amount || !payment_type_id || !bank_txn || !bank_name || !audit_status)) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const param2 = {
      user_id,
      amount,
      payment_type_id,
      trans: bank_txn,
      partner_bank: bank_name,
      status: audit_status,
    };

    await paymentUpload(param2);

    const transaction = await UserTransaction.create({
      user_id,
      amount,
      payment_type_id,
      bank_txn,
      bank_name,
      audit_status,
    });

    if (res) {
      return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, { transaction });
    }

    // Internal call: return the transaction
    return transaction;
  } catch (error) {
    if (res) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        error.message,
        STATUS_CODE.BAD_REQUEST
      );
    }
    throw new Error(`User Transaction Failed: ${error.message}`);
  }
};

export const paymentHistory = async (req, res) => {
  const userId = parseInt(req.query.user_id);

  if (!userId) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.INVALID_PARAMS
    );
  }

  const sql = `
      SELECT *, IF(status = 2, 'Approved', 'Not Approved') AS status
      FROM payment_upload
      WHERE driver_id = :userId
    `;

  try {
    const results = await sequelize.query(sql, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};
export const getPaymentGatewayDetails = async (req, res) => {
  const { status, company_id } = req.query;
  console.log({ status, company_id });
  if (!status || !company_id) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      STATUS_CODE.BAD_REQUEST
    );
  }

  const sql = `
      SELECT * FROM master_payment_gateway
      WHERE company_id = :company_id AND status = :status
      ORDER BY id DESC
      LIMIT 1
    `;

  try {
    const result = await sequelize.query(sql, {
      replacements: { company_id, status },
      type: sequelize.QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        data: result,
      });
    } else {
      return errorResponse(res, "No Record Found", STATUS_CODE.NOT_FOUND);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const atomPayment = async (req, res) => {
  try {
    const data = req.body;
    const url = data.cdn_link === "" ? null : data.cdn_link;
    const txnId = data.transid;
    const txnDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    const amount = data.amt;
    const userEmailId = data.paymentData.email;
    const userContactNo = data.paymentData.mobile;

    const merchId = data.login;
    const merchPass = data.pass;
    const prodId = data.prodid;
    const Authurl = data.payment_url;

    const jsondata = JSON.stringify({
      payInstrument: {
        headDetails: {
          version: "OTSv1.1",
          api: "AUTH",
          platform: "FLASH",
        },
        merchDetails: {
          merchId: merchId,
          userId: "",
          password: merchPass,
          merchTxnId: txnId,
          merchTxnDate: txnDate,
        },
        payDetails: {
          amount: 1,
          // amount: amount,
          product: prodId,
          custAccNo: data.custacc,
          txnCurrency: data.txncur,
        },
        custDetails: {
          custEmail: userEmailId,
          custMobile: userContactNo,
        },
        extras: {
          udf1: data.udf1,
          udf2: data.udf2,
          udf3: data.udf3,
          udf4: data.udf4,
          udf5: data.clientcode,
        },
      },
    });
    const encDataR = encrypt(jsondata);
    const apiRes = await axios.post(
      Authurl,
      new URLSearchParams({
        encData: encDataR,
        merchId: merchId,
      }),
      {
        headers: {
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    const responseText = apiRes?.data || "";
    const arr = responseText?.split("&");
    if (arr.length < 2) {
      return errorResponse(
        res,
        "Invalid response from payment gateway",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const arrTwo = arr[1].split("=");
    if (arrTwo.length < 2) {
      return errorResponse(
        res,
        "Invalid response from payment gateway",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const decrypted_data = decrypt(arrTwo[1]);
    const jsonData = JSON.parse(decrypted_data);
    const respArray = Object.keys(jsonData).map((key) => jsonData[key]);

    if (respArray[1]?.txnMessage === "SUCCESS") {
      const resp = {
        url: url,
        status: "success",
        token: respArray[0],
        txnId: txnId,
        merchId: merchId,
        amount: amount,
        custEmail: userEmailId,
        custMobile: userContactNo,
        date: txnDate,
        client_name: data.udf1,
        email: data.udf2,
        phone: data.udf3,
        address: data.udf4,
        cdnLink: data.cdnLink,
        itinerary_id: data?.itinerary_id || "NA",
      };
      return successResponse(res, "Payment processed successfully", resp);
    } else {
      return errorResponse(
        res,
        "Something went wrong!",
        STATUS_CODE.BAD_REQUEST
      );
    }
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      "Payment processing failed",
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};
let webhookLogs = [];

export const atomPaymentResponse = async (req, res) => {
  try {
    console.log("Received POST request on '/api/response' route.");
    const decrypted_data = decrypt(req.body.encData);
    const jsonData = JSON.parse(decrypted_data);
    const respArray = Object.keys(jsonData).map((key) => jsonData[key]);
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      body: respArray,
    };

    webhookLogs.unshift(payload);
    if (webhookLogs.length > 50) webhookLogs.pop();

    console.log("Webhook received:", { respArray });
    // Example: Save transaction response to DB (optional)
    // await UserTransaction.create({
    //   user_id: ...,
    //   amount: ...,
    //   payment_type_id: ...,
    //   bank_txn: respArray[0]?.payModeSpecificData?.bankDetails?.bankTxnId,
    //   bank_name: respArray[0]?.payModeSpecificData?.bankDetails?.bankName,
    //   audit_status: respArray[0]?.responseDetails?.message
    // });

    const resp = {
      status: respArray[0]?.responseDetails?.message,
      message: respArray[0]?.responseDetails?.description,
      data: respArray,
    };
    console.log({ resp });
    return successResponse(res, "Atom payment response processed", resp);
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      "Failed to process Atom payment response",
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};
export const paymentUpload = async (req, res) => {
  const { user_id, payment_type_id, amount } = req.body;
  if (!user_id || !payment_type_id || !amount) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const result = await sequelize.query(
      `INSERT INTO payment_upload (user_id, deposit_date, transaction_mode, amount, status)
       VALUES (:user_id, :deposit_date, :transaction_mode, :amount, :status)`,
      {
        replacements: {
          user_id,
          deposit_date: dateFormat(new Date(), "yyyy-mm-dd"),
          transaction_mode: payment_type_id,
          amount,
          status: 1,
        },
      }
    );

    if (result && result.affectedRows > 0) {
      return { status: "success", data: result };
    } else {
      return errorResponse(res, "No Record Found", STATUS_CODE.NOT_FOUND);
    }
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      "Failed to upload payment",
      err.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};
export const TransactionResponse = async (req, res) => {
  try {
    const {
      merchDetails,
      payDetails,
      payModeSpecificData,
      extras,
      custDetails,
      responseDetails,
      ip,
    } = req.body;
console.log({ merchDetails,
      payDetails,
      payModeSpecificData,
      extras,
      custDetails,
      responseDetails,
      ip,})
    // Defensive checks for nested objects
    const bankDetails = payModeSpecificData?.bankDetails || {};
    const prodDetails = Array.isArray(payDetails?.prodDetails)
      ? payDetails.prodDetails[0] || {}
      : {};
    const subChannel = Array.isArray(payModeSpecificData?.subChannel)
      ? payModeSpecificData.subChannel[0]
      : null;

    const transactionData = {
      user_id: extras?.udf5,
      customer_account_no: payDetails?.custAccNo,
      mmp_txn: payDetails?.atomTxnId,
      mer_txn: merchDetails?.merchTxnId,
      amt: payDetails?.amount,
      prod: prodDetails?.prodName,
      prod_amount: prodDetails?.prodAmount,
      txn_init_date: payDetails?.txnInitDate,
      txn_complete_date: payDetails?.txnCompleteDate,
      txn_currency: payDetails?.txnCurrency,
      total_amount: payDetails?.totalAmount,
      date: merchDetails?.merchTxnDate,
      bank_txn: bankDetails?.bankTxnId,
      f_code: responseDetails?.message,
      status_code: responseDetails?.statusCode,
      description: responseDetails?.description,
      auth_id: bankDetails?.authId,
      bank_name: bankDetails?.otsBankName,
      merchant_id: merchDetails?.merchId,
      udf9: "NA",
      discriminator: subChannel,
      surcharge: payDetails?.surchargeAmount,
      card_type: bankDetails?.cardType,
      CardNumber: bankDetails?.cardMaskNumber,
      scheme: bankDetails?.scheme,
      signature: payDetails?.signature,
      udf1: extras?.udf1,
      udf2: extras?.udf2,
      udf3: extras?.udf3,
      udf4: extras?.udf4,
      udf5: extras?.udf5,
      customer_email: custDetails?.custEmail,
      customer_mobile: custDetails?.custMobile,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      ip: ip || req.ip,
    };

    // Assuming you have a Sequelize model named PaymentTransactionResponse
    // const result = await sequelize.query(
    //   `INSERT INTO payment_transaction_response SET ?`,
    //   {
    //     replacements: [transactionData],
    //     type: sequelize.QueryTypes.INSERT,
    //   }
    // );
const result = await PaymentTransactionResponse.create(transactionData)
    if (result) {
      return successResponse(res, "Data inserted successfully", {
        data: result,
      });
    } else {
      return errorResponse(res, "Data not Inserted", STATUS_CODE.BAD_REQUEST);
    }
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      "Failed to insert transaction response",
      err.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};
export const viewPaymentHookLogs = async (req, res) => {
  let html = `<h1>Webhook Logs</h1>`;
  html += webhookLogs
    .map(
      (log) => `
    <div style="margin-bottom:20px;border-bottom:1px solid #ccc;">
      // <strong>${log?.timestamp}</strong><br/>
      <pre>${JSON.stringify(log.body, null, 2)}</pre>
    </div>
  `
    )
    .join("");

  res.send(html);
};

export const advanceToVendor = async (req, res) => {
  try {
    const {
      depositDate,
      paymentMode,
      partnerBankAccounts,
      amount,
      depositBank,
      depositBranch,
      remark,
      chequeno,
      partnerBank,
      paymentProof,
      user_id,
      checkForm,
      itinerary_id,
      booking_id,
      payment_response_id,
      booking_transaction_no,
      action_type,
      current_balance,
      payment_type_id,
      payment_status,
      created_by,
      transaction_no,
      imgPath
    } = req.body;

    if (
      !depositDate ||
      !paymentMode ||
      !amount ||
      !depositBank ||
      !depositBranch
    ) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.REQUIRED_FIELDS_MISSING,
        "Required fields are missing",
        STATUS_CODE.BAD_REQUEST
      );
    }

    let fileName = null;
    if (paymentProof?.data) {
      const paymentProofDir = path.join(
        process.cwd(),
        "uploads",
        "payment-proof" 
      );
      if (!fs.existsSync(paymentProofDir)) {
        fs.mkdirSync(paymentProofDir, { recursive: true });
      }
      const fileExt = path.extname(paymentProof.fileName) || ".png";
      fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(paymentProofDir, fileName);
      const base64Data = paymentProof.data.replace(
        /^data:\w+\/\w+;base64,/,
        ""
      );
      const fileBuffer = Buffer.from(base64Data, "base64");
      await fs.promises.writeFile(filePath, fileBuffer);
    }
    const transactionNo = `TRANS-${Date.now()}`;
    console.log({transaction_no})
    const paymentUpload = await PaymentUpload.create({
      user_id: user_id || 152,
      payment_ref_no: transactionNo,
      deposit_date: depositDate,
      transaction_mode: paymentMode,
      fileupload:imgPath?imgPath : fileName ? `payment-proof/${fileName}` : null,
      chequeno: chequeno,
      partner_bank: partnerBank || partnerBankAccounts,
      amount: amount,
      deposit_bank: depositBank,
      deposit_branch: depositBranch,
      remark: remark,
      transaction_no:transaction_no,
      status: 1,
      credit_date: new Date().toISOString().split("T")[0],
      credit_amount: amount.toString(),
    });
    const results = {
      transactionId: paymentUpload.id,
      transactionNo: transactionNo,
      depositDate: depositDate,
      paymentMode: paymentMode,
      amount: amount,
      paymentProof: fileName ? `/uploads/payment-proof/${fileName}` : null,
      paymentUploadId: paymentUpload.id,
    };

    if (checkForm == 1) {
      const result = await UserTransaction.create({
        user_id: user_id || 0,
        itinerary_id: itinerary_id,
        booking_id: booking_id || 112,
        payment_upload_id: paymentUpload.id, // Use the newly created paymentUpload.id
        payment_response_id: payment_response_id,
        booking_transaction_no: booking_transaction_no,
        amount: amount,
        action_type: action_type,
        current_balance: current_balance,
        payment_type_id: payment_type_id,
        payment_status: payment_status,
        created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        created_by: user_id || 0,
      });
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, { results });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.INTERNAL_SERVER_ERROR,
      error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};
export const getUploadedPayments= async(req,res)=>{
const {user_id}=req.query
try {
  
  let where={}
  if(user_id) where.user_id=user_id

  const data = await PaymentUpload.findAll({
    where,
    order: [['id', 'DESC']]
  })
  return res.status(200).json({
    data,
    success:true
  })
} catch (error) {
   return errorResponse(
      res,
      MESSAGES.GENERAL.INTERNAL_SERVER_ERROR,
      error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
}

}