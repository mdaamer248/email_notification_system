const express = require("express");
const emailService = require("./email.service");
const router = express.Router();
router.post("/send", async (req, res) => {
  try {
    await emailService.sendEmailToReciever(req.body);
    res.status(200).send({ message: "Email queued for sending" });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
