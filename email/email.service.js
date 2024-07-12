const Email = require("./models/email");
const { sendEmail } = require("./send.email");
const { sendToEmailQueue, consumeEmailQueue } = require("../queue/rabbitmq");

const sendEmailToReciever = async (emailDetails) => {
  try {
    const email = new Email(emailDetails);
    await email.save();

    console.log({ email });
    sendToEmailQueue({ ...emailDetails, _id: email._id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

consumeEmailQueue(async (emailDetails, done) => {
  try {
    const sentResponse = await sendEmail(emailDetails);
    console.log({ emailDetails });
    const updatedEmail = await Email.findByIdAndUpdate(
      emailDetails._id,
      {
        status: "sent",
        responseId: sentResponse.id,
        responseMessage: sentResponse.message,
        sentAt: new Date(),
      },
      { new: true }
    );

    console.log(updatedEmail);

    done();
  } catch (error) {
    console.error("Failed to send email:", error);
  }
});

module.exports = { sendEmailToReciever };