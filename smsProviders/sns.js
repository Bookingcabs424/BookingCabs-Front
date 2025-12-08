process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';
import AWS from "aws-sdk";

const sendViaSNS = async (config, to, message) => {
  const fullMobile = `${process.env.COUNTRY_CODE}${to}`;

  AWS.config.update({
    accessKeyId: config.api_key,
    secretAccessKey: config.api_secret,
    region: config.api_region || "us-east-1",
  });

  const sns = new AWS.SNS();

  const params = {
    Message: message,
    PhoneNumber: fullMobile,
  };

  const response = await sns.publish(params).promise();
  return response;
};

export default sendViaSNS;
