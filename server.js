const express = require("express");
const bodyParser = require("body-parser");
const emailController = require("./email/email.controller");
const webhookController = require("./webhook/webhook.controller");
require("./database/db.connection");
// const webhookController = require('./webhookController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/emails", emailController);
app.post("/api/webhook", webhookController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
