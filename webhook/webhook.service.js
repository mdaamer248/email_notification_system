const Email = require("../email/models/email");

const {
  sendToStatusUpdateQueue,
  consumeStatusUpdateQueue,
} = require("../queue/rabbitmq");

const statusList = {
  accepted: "accepted",
  opened: "opened",
  delivered: "delivered",
  permanent_fail: "failed",
  temporary_fail: "failed",
};

const getEmailStatus = async (data) => {
  try {
    const status = statusList[data.event];
    const responseId = data.message.headers["message-id"];

    sendToStatusUpdateQueue({ status, responseId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

consumeStatusUpdateQueue(async (data, done) => {
  try {
    const { status, responseId } = data;
    const updatedEmail = await Email.findOneAndUpdate(
      { responseId: `<${responseId}>` },
      { status },
      { new: true }
    );
    console.log({ updatedEmail, loc: "webhook" });
    done();
  } catch (error) {
    console.error("Failed to update email status:", error);
    done(error);
  }
});

const getDoc = async (responseId) => {
  const doc = await Email.findOne({ responseId });
  console.log({ doc });
};

module.exports = { getEmailStatus };
