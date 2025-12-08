import axios from "axios";

const sendViaValueFirst = async (config, to, message) => {
  const fullMobile = `${process.env.COUNTRY_CODE}${to}`;
// return
  const params = new URLSearchParams();
  params.append("username", config.api_username);
  params.append("password", config.api_password);
  params.append("to", fullMobile);
  params.append("from", config.api_sender_id);
  params.append("text", message);
  params.append("udh", "");
  params.append("dlr-mask", "19");
  params.append("dlr-url", "");
  // params.append("coding", "0");
  // params.append("template_id", config.api_ts_code);
const smsUrl = `${config.api_base_uri}?${params.toString()}`;
  const response = await axios.get(smsUrl, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
   
  });
  return response.data;
};

export default sendViaValueFirst;
