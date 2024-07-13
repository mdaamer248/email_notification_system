const express = require("express");
const emailService = require("./email.service");
const router = express.Router();
router.post("/send", async (req, res) => {
  try {
    const emailId = await emailService.sendEmailToReciever(req.body);
    res
      .status(200)
      .send({ _id: emailId._id, message: "Email queued for sending" });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

router.get("/status/:emailId", async (req, res) => {
  try {
    const emailId = req.params.emailId;
    const status = await emailService.getEmailStatus(emailId);
    res.status(200).send({ emailId, status });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
