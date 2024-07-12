const express = require("express");
const webhookService = require("./webhook.service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await webhookService.getEmailStauts(req.body);
    res.status(200).send({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Failed to handle webhook:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
