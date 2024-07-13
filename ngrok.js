const ngrok = require("@ngrok/ngrok");
const express = require("express");
const bodyParser = require("body-parser");
require("./database/db.connection");
const emailController = require("./email/email.controller");
const webhookController = require("./webhook/webhook.controller");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/emails", emailController);
app.use("/webhook", webhookController);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Get your endpoint online
ngrok
  .connect({ addr: 80, authtoken_from_env: true })
  .then((listener) => console.log(`Ingress established at: ${listener.url()}`));
