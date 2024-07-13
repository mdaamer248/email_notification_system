const express = require("express");
const webhookService = require("./webhook.service");
const verify = require("../utils/validate.webhook_signature");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { timestamp, token, signature } = req.body.signature;
    const isValid = verify(
      process.env.MAILGUN_WEBHOOK_SIGNIN_KEY,
      timestamp,
      token,
      signature
    );

    if (!isValid)
      throw new Error("This webhook did not originated from Mailgun.");

    await webhookService.getEmailStatus(req.body["event-data"]);
    res.status(200).send({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Failed to handle webhook:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
