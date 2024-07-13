const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const sendEmail = async (emailDetails) => {
  try {
    const { receiverName, receiverAddress, subject, textMessage } =
      emailDetails;

    const data = new FormData();
    data.append("from", process.env.MAILGUN_DOMAIN);
    data.append("to", `${receiverName} ${receiverAddress}`);
    data.append("subject", subject);
    data.append("text", textMessage);

    const config = {
      method: "post",
      url: process.env.MAILGUN_ENDPOINT,
      headers: {
        Authorization: `Basic ${process.env.MAILGUN_API_KEY}`,
        ...data.getHeaders(),
      },
      data: data,
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { sendEmail };
