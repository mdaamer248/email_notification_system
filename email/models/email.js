const mongoose = require("mongoose");
const { Schema } = mongoose;

const emailSchema = new Schema(
  {
    receiverName: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    subject: { type: String, required: true },
    textMessage: { type: String, required: true },
    status: { type: String, default: "pending" },
    responseId: { type: String },
    responseMessage: { type: String },
    sentAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
