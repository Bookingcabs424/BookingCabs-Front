import twilio from "twilio";

const sendViaTwilio = async (config, to, message) => {
  const fullMobile = `${process.env.COUNTRY_CODE}${to}`;

  const client = twilio(config.api_sid, config.api_token);
  const response = await client.messages.create({
    body: message,
    from: config.api_sender_id, 
    to: fullMobile,
  });

  return response;
};

export default sendViaTwilio;
