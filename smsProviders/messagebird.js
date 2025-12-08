import messagebird from "messagebird";

const sendViaMessageBird = async (config, to, message) => {
  const fullMobile = `${process.env.COUNTRY_CODE}${to}`;

  const mbClient = messagebird(config.api_key);

  return new Promise((resolve, reject) => {
    mbClient.messages.create({
      originator: config.api_sender_id,
      recipients: [fullMobile],
      body: message,
    }, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
};

export default sendViaMessageBird;
