import { NextResponse } from 'next/server';
import crypto from "crypto";
import api from '../../../lib/axios';

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
export async function POST(request) {
  try {
    const rawText = await request.text(); // <-- Get raw body as string
        const params = new URLSearchParams(rawText); // <-- Parse key-value pairs
    const paymentResponse = Object.fromEntries(params.entries());
 
    const decrypted_data = decrypt(paymentResponse.encData);
    let jsonData = JSON.parse(decrypted_data);
 

    // Validate the response
    if (!jsonData) {
      return NextResponse.json(
        { message: 'Invalid payment response' },
        { status: 400 }
      );
    }

    // Verify signature (add your verification logic)
    // const isValid = verifySignature(paymentResponse);
    // if (!isValid) { ... }
    
    // Process payment (save to DB, etc.)
    // await processPayment(paymentResponse);
    const baseUrl = new URL(request.url);  

        const successUrl = new URL('/payment-success',baseUrl); 
        let transactionResponse = await api.post("/payment/Transactionresp",{...jsonData?.payInstrument})
 
    // You can add query parameters if needed
    // successUrl.searchParams.set('transaction_id', jsonData.payInstrument?.payDetails.atomTxnId);
    // Add other relevant data as needed
// window.location.href = `/payment-success?transaction_id=${txnId}`;
 const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Success</title>
        <meta http-equiv="refresh" content="3;url=${successUrl.toString()}" />
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; }
        </style>
      </head>
      <body>
        <h1>Payment Successful</h1>
        <p>Redirecting to your success page...</p>
        <p><a href="${transactionResponse.toString()}">Click here if not redirected</a></p>
      </body>
      </html>
    `;
  return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
    
    // return NextResponse.redirect(successUrl);
    // return NextResponse.json({
    //   success: true,
    //   redirectUrl: `/payment-success`,
    //   paymentData: jsonData
    // });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}